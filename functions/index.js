const { genkit } = require('genkit');
const { googleAI, gemini3Flash } = require('@genkit-ai/googleai');
const { onCallGenkit } = require('@genkit-ai/firebase/functions');

// 1. Initialize Genkit
const ai = genkit({
  plugins: [
    googleAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY })
  ],
  model: gemini3Flash, 
});

// 2. Define the AI Flow
exports.chatWithGemini = onCallGenkit(
  ai.defineFlow(
    {
      name: 'chatWithGemini',
    },
    async (userInput) => {
      const response = await ai.generate({
        model: gemini3Flash,
        prompt: userInput,
      });

      return response.text;
    }
  )
);