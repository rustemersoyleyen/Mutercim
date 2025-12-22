const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listAllModels() {
    try {
        console.log('🔍 API Key ile erişilebilen TÜM modeller listeleniyor...');
        // Note: The SDK doesn't have a direct listModels, we have to use the fetch API or just guess.
        // But we can try to use the 'models' endpoint via a raw fetch if needed.
        // For now, let's try the most likely successful model names.
        
        const models = [
            'gemini-1.5-flash',
            'gemini-1.5-pro',
            'gemini-1.0-pro',
            'gemini-2.0-flash-exp'
        ];

        for (const m of models) {
            try {
                const model = genAI.getGenerativeModel({ model: m });
                const result = await model.generateContent('hi');
                console.log(`✅ ${m} OK`);
            } catch (e) {
                console.log(`❌ ${m}: ${e.message.split('\n')[0]}`);
            }
        }
    } catch (err) {
        console.error('Hata:', err);
    }
}

listAllModels();

