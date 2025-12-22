const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testProLatest() {
    try {
        console.log('Testing gemini-pro-latest...');
        const model = genAI.getGenerativeModel({ model: 'gemini-pro-latest' });
        const result = await model.generateContent('hi');
        const response = await result.response;
        console.log('✅ gemini-pro-latest ÇALIŞTI!');
        console.log('Yanıt:', response.text());
    } catch (e) {
        console.log('❌ Hata:', e.message);
    }
}

testProLatest();

