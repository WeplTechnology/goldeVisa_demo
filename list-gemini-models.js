// Script para listar modelos disponibles de Gemini
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

async function listModels() {
  try {
    console.log('🔧 Listing available Gemini models...\n');

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error('❌ GEMINI_API_KEY not found in .env.local');
      process.exit(1);
    }

    console.log(`✅ API Key found: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 5)}\n`);

    const genAI = new GoogleGenerativeAI(apiKey);

    console.log('📋 Fetching list of available models...\n');

    // Intentar listar modelos
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + apiKey);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();

    console.log('✅ Available models:\n');

    if (data.models && data.models.length > 0) {
      data.models.forEach((model, index) => {
        console.log(`${index + 1}. ${model.name}`);
        console.log(`   Display Name: ${model.displayName}`);
        console.log(`   Supported Methods: ${model.supportedGenerationMethods?.join(', ')}`);
        console.log('');
      });

      console.log('\n✨ Use the model name (without "models/" prefix) in your code');
    } else {
      console.log('❌ No models found. Your API key might not have access to any models.');
      console.log('\n💡 Tips:');
      console.log('   1. Make sure you created the API key at https://aistudio.google.com/apikey');
      console.log('   2. Check if the API key has the correct permissions');
      console.log('   3. Verify that the Generative Language API is enabled in your Google Cloud project');
    }

  } catch (error) {
    console.error('\n❌ ERROR listing models:');
    console.error('Message:', error.message);

    if (error.message.includes('403')) {
      console.error('\n💡 API key might be restricted. Check:');
      console.error('   https://console.cloud.google.com/apis/credentials');
    }

    if (error.message.includes('400') || error.message.includes('401')) {
      console.error('\n💡 API key might be invalid. Get a new one at:');
      console.error('   https://aistudio.google.com/apikey');
    }

    console.error('\nFull error:', error);
    process.exit(1);
  }
}

listModels();
