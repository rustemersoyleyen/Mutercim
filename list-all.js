const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listAvailable() {
    try {
        // We need to use the generative AI's listModels if it exists
        // Actually, the SDK doesn't expose listModels directly easily in the main class.
        // Let's use the fetch API to call the Google API directly.
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.models) {
            console.log('Erişilebilir Modeller:');
            data.models.forEach(m => {
                console.log(`- ${m.name} (${m.displayName})`);
            });
        } else {
            console.log('Model listesi alınamadı:', data);
        }
    } catch (e) {
        console.error('Hata:', e);
    }
}

listAvailable();

