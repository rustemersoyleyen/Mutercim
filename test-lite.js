const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testLite() {
    try {
        console.log('Testing gemini-2.0-flash-lite...');
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
        const result = await model.generateContent('hi');
        const response = await result.response;
        console.log('✅ gemini-2.0-flash-lite ÇALIŞTI!');
        console.log('Yanıt:', response.text());
    } catch (e) {
        console.log('❌ Hata:', e.message);
    }
}

testLite();

