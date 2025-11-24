// Test simple con el modelo correcto
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

async function test() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('API Key:', apiKey.substring(0, 10) + '...');

    const genAI = new GoogleGenerativeAI(apiKey);

    console.log('\n🤖 Probando gemini-2.5-flash...');
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const result = await model.generateContent('Say "Hello World" in Spanish');
    const response = await result.response;
    const text = response.text();

    console.log('✅ SUCCESS!');
    console.log('Response:', text);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full:', error);
  }
}

test();
