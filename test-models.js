// Kullanılabilir modelleri listele
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
    console.log('🔍 Kullanılabilir modeller kontrol ediliyor...\n');
    console.log('API Key:', process.env.GEMINI_API_KEY?.substring(0, 15) + '...\n');
    
    // Denenecek modeller
    const modelsToTest = [
        'gemini-pro',
        'gemini-pro-vision', 
        'gemini-1.0-pro',
        'gemini-1.0-pro-vision',
        'gemini-1.5-pro',
        'gemini-1.5-flash',
        'gemini-1.5-flash-8b',
        'gemini-1.5-flash-latest',
        'gemini-2.0-flash',
        'gemini-2.0-flash-exp',
        'models/gemini-pro',
        'models/gemini-1.5-flash'
    ];
    
    for (const modelName of modelsToTest) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent('Merhaba, sadece "ÇALIŞIYOR" yaz.');
            const response = await result.response;
            console.log(`✅ ${modelName}: ÇALIŞIYOR`);
            console.log(`   Yanıt: ${response.text().substring(0, 50)}...\n`);
            return modelName; // İlk çalışan modeli döndür
        } catch (error) {
            const errMsg = error.message || '';
            if (errMsg.includes('404') || errMsg.includes('not found')) {
                console.log(`❌ ${modelName}: Model bulunamadı`);
            } else if (errMsg.includes('quota') || errMsg.includes('429')) {
                console.log(`⚠️ ${modelName}: Kota aşıldı (ama model mevcut)`);
                return modelName;
            } else if (errMsg.includes('API key')) {
                console.log(`🔑 ${modelName}: API key hatası`);
            } else {
                console.log(`❓ ${modelName}: ${errMsg.substring(0, 60)}`);
            }
        }
    }
    return null;
}

listModels().then(workingModel => {
    if (workingModel) {
        console.log(`\n✅ ÇALIŞAN MODEL: ${workingModel}`);
        console.log('Bu modeli server.js dosyasında kullanın!');
    } else {
        console.log('\n❌ HİÇBİR MODEL ÇALIŞMIYOR');
        console.log('API key\'inizi kontrol edin veya yeni bir key alın.');
    }
});

