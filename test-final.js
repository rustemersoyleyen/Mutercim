const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testAllModels() {
    const key = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(key);
    
    const models = [
        'gemini-1.5-flash',
        'gemini-1.5-flash-latest',
        'gemini-2.0-flash',
        'gemini-pro-vision'
    ];
    
    for (const m of models) {
        try {
            console.log(`--- Testing: ${m} ---`);
            const model = genAI.getGenerativeModel({ model: m });
            const result = await model.generateContent('hi');
            console.log(`✅ ${m} works! Response: ${result.response.text().substring(0, 10)}`);
            return; // Stop at first success
        } catch (e) {
            console.log(`❌ ${m} failed: ${e.message.split('\n')[0]}`);
        }
    }
}

testAllModels();

