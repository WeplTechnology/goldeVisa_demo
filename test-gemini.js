// Test script para verificar la conexión con Gemini
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

async function testGemini() {
  try {
    console.log('🔧 Testing Gemini API connection...\n');

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error('❌ GEMINI_API_KEY not found in .env.local');
      process.exit(1);
    }

    console.log(`✅ API Key found: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 5)}\n`);

    const genAI = new GoogleGenerativeAI(apiKey);

    // Probar diferentes modelos
    const modelsToTry = [
      'gemini-pro',
      'gemini-1.5-pro',
      'gemini-1.5-flash-latest',
      'gemini-1.0-pro'
    ];

    let workingModel = null;

    for (const modelName of modelsToTry) {
      try {
        console.log(`🤖 Trying model: ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });

        const result = await model.generateContent('Hello! Please respond with "API is working correctly"');
        const response = await result.response;
        const text = response.text();

        console.log(`✅ SUCCESS with ${modelName}!\n`);
        console.log('📝 Response:', text);
        workingModel = modelName;
        break;
      } catch (err) {
        console.log(`❌ ${modelName} not available: ${err.message}\n`);
      }
    }

    if (workingModel) {
      console.log(`\n✨ Use this model in your code: "${workingModel}"`);
    } else {
      throw new Error('No working model found');
    }

  } catch (error) {
    console.error('\n❌ ERROR testing Gemini API:');
    console.error('Message:', error.message);
    console.error('\nFull error:', error);

    if (error.message.includes('API_KEY_INVALID')) {
      console.error('\n💡 Tip: Your API key might be invalid. Get a new one at:');
      console.error('   https://makersuite.google.com/app/apikey');
    }

    process.exit(1);
  }
}

testGemini();
