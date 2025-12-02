// =====================================================
// MÜTERCİM - OSMANLI METİN ÇEVİRMENİ
// TÜBİTAK Öğrenci Projesi
// =====================================================
// Bu dosya sunucu tarafını (backend) yönetir.
// Express.js ile API oluşturur ve Gemini AI ile iletişim kurar.
// =====================================================

// Gerekli kütüphaneleri içe aktarıyoruz
const express = require('express');           // Web sunucusu oluşturmak için
const multer = require('multer');             // Dosya yüklemek için
const { GoogleGenerativeAI } = require('@google/generative-ai'); // Gemini AI
const path = require('path');                 // Dosya yollarını yönetmek için
require('dotenv').config();                   // .env dosyasındaki gizli bilgileri okumak için

// Express uygulamasını başlatıyoruz
const app = express();
const PORT = process.env.PORT || 3000;        // Sunucu portu (varsayılan: 3000)

// =====================================================
// MULTER AYARLARI (Dosya Yükleme)
// =====================================================
// Yüklenen dosyaları bellekte (memory) tutuyoruz
// Böylece diske yazmadan doğrudan Gemini'ye gönderebiliriz
const storage = multer.memoryStorage();

// Sadece resim dosyalarını kabul ediyoruz
const fileFilter = (req, file, cb) => {
    // İzin verilen dosya türleri
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);  // Dosya kabul edildi
    } else {
        cb(new Error('Sadece resim dosyaları yüklenebilir (JPEG, PNG, WEBP)'), false);
    }
};

// Multer'ı yapılandırıyoruz
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024  // Maksimum 10 MB dosya boyutu
    }
});

// =====================================================
// GEMINI AI AYARLARI
// =====================================================
// API anahtarını kontrol ediyoruz
let genAI = null;

if (process.env.GEMINI_API_KEY) {
    // Gemini AI istemcisini oluşturuyoruz
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
} else {
    console.error('⚠️  UYARI: GEMINI_API_KEY bulunamadı!');
    console.error('📝 Lütfen ortam değişkenlerine API anahtarınızı ekleyin.');
}

// =====================================================
// MIDDLEWARE (Ara Yazılımlar)
// =====================================================
// public klasöründeki statik dosyaları sunuyoruz (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// JSON verilerini işleyebilmek için
app.use(express.json());

// =====================================================
// API ENDPOINT'LERİ (Uç Noktalar)
// =====================================================

// Ana sayfa
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// =====================================================
// /upload - Resim Yükleme ve Çeviri Endpoint'i
// =====================================================
// Bu endpoint, kullanıcıdan resim alır ve Gemini'ye gönderir
app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        // API anahtarı var mı kontrol ediyoruz
        if (!genAI) {
            return res.status(500).json({
                success: false,
                error: 'API anahtarı yapılandırılmamış. Lütfen yöneticiyle iletişime geçin.'
            });
        }

        // Dosya yüklenmiş mi kontrol ediyoruz
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'Lütfen bir resim dosyası yükleyin.'
            });
        }

        console.log('📷 Resim alındı:', req.file.originalname);
        console.log('📊 Boyut:', (req.file.size / 1024).toFixed(2), 'KB');

        // =====================================================
        // GEMİNİ AI İLE İLETİŞİM
        // =====================================================
        
        // Gemini-2.5-pro modelini kullanıyoruz (daha güçlü ve doğru)
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

        // Resmi base64 formatına çeviriyoruz
        // Gemini API, resimleri bu formatta bekliyor
        const imageData = {
            inlineData: {
                data: req.file.buffer.toString('base64'),
                mimeType: req.file.mimetype
            }
        };

        // =====================================================
        // PROMPT MÜHENDİSLİĞİ
        // =====================================================
        // Modele ne yapması gerektiğini açık ve net bir şekilde söylüyoruz
        const prompt = `Sen uzman bir Osmanlı tarihçisi ve dil bilimcisin. 
        
Bu resimdeki Osmanlıca (Arap harfli Türkçe) metni dikkatli bir şekilde analiz et.

ÖNEMLİ KURALLAR:
1. Metni satır satır oku, hiçbir kelimeyi atlama
2. Transkripsiyon yaparken Osmanlıca harflerin Latin karşılıklarını doğru kullan
3. Türkçe çeviride günümüz Türkçesinin dil kurallarına uy
4. İngilizce çeviriyi de ekle
5. Eğer resimde metin yoksa veya okunamıyorsa, bunu belirt

Cevabını SADECE aşağıdaki JSON formatında ver, başka hiçbir açıklama ekleme:

{
    "transcription": "Metnin Latin harfleriyle okunuşu buraya gelecek",
    "translation": "Metnin günümüz modern Türkçesine çevirisi buraya gelecek",
    "english": "English translation of the text goes here"
}

Eğer metin okunamıyorsa veya Osmanlıca değilse:
{
    "transcription": "",
    "translation": "",
    "english": "",
    "error": "Açıklama mesajı"
}`;

        console.log('🤖 Gemini AI\'ya istek gönderiliyor...');

        // Gemini'ye resmi ve prompt'u gönderiyoruz
        const result = await model.generateContent([prompt, imageData]);
        const response = await result.response;
        const text = response.text();

        console.log('✅ Gemini\'den yanıt alındı');

        // =====================================================
        // YANITI İŞLEME
        // =====================================================
        // Gemini'nin döndürdüğü metinden JSON'u çıkarıyoruz
        let parsedResponse;
        
        try {
            // JSON bloğunu bulmaya çalışıyoruz
            // Bazen Gemini yanıtı ```json ... ``` içinde verebiliyor
            let jsonText = text;
            
            // Markdown kod bloğu varsa temizliyoruz
            const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
            if (jsonMatch) {
                jsonText = jsonMatch[1];
            } else {
                // Sadece {...} kısmını almaya çalışıyoruz
                const braceMatch = text.match(/\{[\s\S]*\}/);
                if (braceMatch) {
                    jsonText = braceMatch[0];
                }
            }
            
            parsedResponse = JSON.parse(jsonText);
            
        } catch (parseError) {
            console.error('⚠️ JSON ayrıştırma hatası:', parseError.message);
            console.log('📝 Ham yanıt:', text);
            
            // JSON ayrıştırılamazsa ham metni dönüyoruz
            return res.json({
                success: true,
                data: {
                    transcription: 'JSON formatı okunamadı',
                    translation: text,
                    rawResponse: text
                }
            });
        }

        // Başarılı yanıtı gönderiyoruz
        res.json({
            success: true,
            data: {
                transcription: parsedResponse.transcription || '',
                translation: parsedResponse.translation || '',
                english: parsedResponse.english || '',
                error: parsedResponse.error || null
            }
        });

    } catch (error) {
        // Hata durumunda kullanıcıya bilgi veriyoruz
        console.error('❌ Hata oluştu:', error.message);
        
        // Farklı hata türlerine göre mesaj belirliyoruz
        let errorMessage = 'Bir hata oluştu. Lütfen tekrar deneyin.';
        
        if (error.message.includes('API key')) {
            errorMessage = 'API anahtarı geçersiz. Lütfen yöneticiyle iletişime geçin.';
        } else if (error.message.includes('quota')) {
            errorMessage = 'API kotası aşıldı. Lütfen daha sonra tekrar deneyin.';
        } else if (error.message.includes('SAFETY')) {
            errorMessage = 'Resim güvenlik filtresine takıldı. Lütfen farklı bir resim deneyin.';
        }
        
        res.status(500).json({
            success: false,
            error: errorMessage
        });
    }
});

// =====================================================
// HATA YÖNETİMİ
// =====================================================
// Multer dosya boyutu hatası
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                error: 'Dosya boyutu çok büyük. Maksimum 10 MB yükleyebilirsiniz.'
            });
        }
    }
    
    if (error.message.includes('resim dosyaları')) {
        return res.status(400).json({
            success: false,
            error: error.message
        });
    }
    
    next(error);
});

// =====================================================
// SUNUCUYU BAŞLAT
// =====================================================
// Vercel'de değilsek normal sunucu olarak çalıştır
if (process.env.VERCEL !== '1') {
    app.listen(PORT, () => {
        console.log('');
        console.log('╔═══════════════════════════════════════════════════╗');
        console.log('║                                                   ║');
        console.log('║   🏛️  MÜTERCİM - Osmanlıca Çeviri Uygulaması      ║');
        console.log('║       TÜBİTAK Öğrenci Projesi                     ║');
        console.log('║                                                   ║');
        console.log('╠═══════════════════════════════════════════════════╣');
        console.log(`║   🌐 Sunucu çalışıyor: http://localhost:${PORT}       ║`);
        console.log('║   📝 Çıkmak için: Ctrl + C                        ║');
        console.log('╚═══════════════════════════════════════════════════╝');
        console.log('');
    });
}

// Vercel için export ediyoruz
module.exports = app;

