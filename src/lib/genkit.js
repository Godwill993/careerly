import { genkit } from 'genkit';
import { googleAI, gemini15Flash } from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [
    googleAI({ apiKey: import.meta.env.VITE_AI_API_KEY }),
  ],
  model: gemini15Flash,
});