const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testWithPrefix() {
    const models = [
        'models/gemini-1.5-flash',
        'models/gemini-1.5-pro',
        'models/gemini-1.5-flash-8b',
        'models/gemini-2.0-flash'
    ];

    for (const m of models) {
        try {
            console.log(`Testing ${m}...`);
            const model = genAI.getGenerativeModel({ model: m });
            const result = await model.generateContent('hi');
            console.log(`✅ ${m} ÇALIŞTI!`);
            return m;
        } catch (e) {
            console.log(`❌ ${m}: ${e.message.split('\n')[0]}`);
        }
    }
}

testWithPrefix();

