const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function test25() {
    const key = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(key);
    const mName = 'gemini-2.5-flash'; // Listede gördüğümüz model
    
    try {
        console.log(`Testing ${mName}...`);
        const model = genAI.getGenerativeModel({ model: mName });
        const result = await model.generateContent('hi');
        console.log(`✅ SUCCESS: ${result.response.text()}`);
    } catch (e) {
        console.log(`❌ FAILED: ${e.message}`);
    }
}

test25();
