import { onCallGenkit } from "firebase-functions/https";
import { genkit, z } from "genkit";
import { googleAI, gemini15Flash } from "@genkit-ai/googleai";

// For local testing, you can use a hardcoded key or a .env file
// but onCallGenkit expects the flow to be defined.
const ai = genkit({
  plugins: [googleAI({ apiKey: "YOUR_GEMINI_API_KEY" })], 
  model: gemini15Flash,
});

export const careerAssistant = onCallGenkit(
  { cors: true }, 
  ai.defineFlow(
    {
      name: "careerAssistant",
      inputSchema: z.string(),
      outputSchema: z.string(),
    },
    async (userInput) => {
      const response = await ai.generate(`You are a career mentor. User says: ${userInput}`);
      return response.text();
    }
  )
);