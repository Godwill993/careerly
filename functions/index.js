import { onCallGenkit } from "firebase-functions/https";
import { genkit, z } from "genkit";
import { googleAI } from "@genkit-ai/googleai";

// For local testing, ensure you have a .env file with GEMINI_API_KEY
// but onCallGenkit expects the flow to be defined.
const ai = genkit({
  plugins: [googleAI({ apiKey: process.env.GEMINI_API_KEY })],
});

export const careerAssistant = onCallGenkit(
  {
    cors: true, // Allow all origins during development
  },
  ai.defineFlow(
    {
      name: "careerAssistant",
      inputSchema: z.string(),
      outputSchema: z.string(),
    },
    async (userInput) => {
      // Basic sanitization to prevent simple injection
      const sanitizedInput = userInput.replace(/[{}]/g, "");
      const response = await ai.generate({
        model: 'googleai/gemini-1.5-flash',
        prompt: `You are a helpful and professional career mentor. Respond to the user's query: "${sanitizedInput}"`,
      });
      return response.text();
    }
  )
);