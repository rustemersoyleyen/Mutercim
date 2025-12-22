// =====================================================
// MÜTERCİM - OSMANLI METİN ÇEVİRMENİ
// =====================================================
const express = require('express');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// API Key Kontrol
const apiKey = process.env.GEMINI_API_KEY;
if (apiKey) {
    console.log(`🔑 API Key yüklendi: ${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 5)}`);
} else {
    console.log('❌ HATA: GEMINI_API_KEY .env dosyasında bulunamadı!');
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Multer Ayarları
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }
});

// Statik Dosyalar
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// API Uç Noktası
app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        if (!genAI) throw new Error('API_KEY_MISSING');
        if (!req.file) throw new Error('FILE_MISSING');

        console.log('📷 İşlem başlıyor:', req.file.originalname);

        // Çalıştığı teyit edilen model: gemini-2.5-flash
        const modelName = 'gemini-2.5-flash';
        console.log(`🤖 Model kullanılıyor: ${modelName}...`);
        
        const model = genAI.getGenerativeModel({ model: modelName });

        const imageData = {
            inlineData: {
                data: req.file.buffer.toString('base64'),
                mimeType: req.file.mimetype
            }
        };

        const prompt = `Görevin: Bu resimdeki içeriği analiz et.
        
        ADIM 1: Resimde Osmanlı Türkçesi (Arap harfleriyle Türkçe) metin var mı kontrol et.
        ADIM 2: Eğer Osmanlı Türkçesi metin VARSA, transkripsiyon yap ve Türkçeye/İngilizceye çevir.
        ADIM 3: Eğer Osmanlı Türkçesi metin YOKSA (örneğin sadece bir nesne, elma, manzara vb. varsa), bunu 'error' kısmında belirt.
        
        Yanıtı SADECE bu JSON formatında ver, başka hiçbir açıklama ekleme:
        {
            "transcription": "Latin harfli okunuş (varsa)",
            "translation": "Modern Türkçe çeviri (varsa)",
            "english": "English translation (if any)",
            "error": "Osmanlı Türkçesi metin bulunamadıysa buraya açıklama yaz, aksi halde boş bırak"
        }`;

        const result = await model.generateContent([prompt, imageData]);
        const response = await result.response;
        const text = response.text();

        // JSON Temizleme
        let jsonText = text.replace(/```json|```/g, '').trim();
        const data = JSON.parse(jsonText);

        console.log(`✅ İşlem başarılı!`);
        return res.json({ success: true, data });

    } catch (error) {
        console.error('❌ Hata:', error.message);
        let message = 'Bir sorun oluştu. Lütfen tekrar deneyin.';
        
        if (error.message.includes('429')) {
            message = 'API kotası doldu. Lütfen 1 dakika bekleyip tekrar deneyin.';
        } else if (error.message.includes('404')) {
            message = 'Model bulunamadı. Lütfen yöneticiye bildirin.';
        } else {
            message = 'Hata: ' + error.message;
        }
        
        res.status(500).json({ success: false, error: message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Sunucu: http://localhost:${PORT}`);
});

module.exports = app;
