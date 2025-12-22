const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function quickTest() {
    const key = process.env.GEMINI_API_KEY;
    console.log('Testing Key:', key.substring(0, 5) + '...' + key.substring(key.length - 5));
    const genAI = new GoogleGenerativeAI(key);
    
    // Model listesinden en garantisini seçelim
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    try {
        console.log('Sending "test" to gemini-1.5-flash...');
        const result = await model.generateContent('test');
        console.log('Response:', result.response.text());
        console.log('✅ SUCCESS!');
    } catch (e) {
        console.error('❌ FAILED:', e.message);
        if (e.response) {
            console.error('Status:', e.status);
        }
    }
}

quickTest();

