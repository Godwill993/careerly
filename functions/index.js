import { onCallGenkit } from "firebase-functions/https";
import { genkit, z } from "genkit";
import { googleAI, gemini15Flash } from "@genkit-ai/googleai";

// For local testing, ensure you have a .env file with GEMINI_API_KEY
// but onCallGenkit expects the flow to be defined.
const ai = genkit({
  plugins: [googleAI({ apiKey: process.env.GEMINI_API_KEY })], 
  model: gemini15Flash,
});

export const careerAssistant = onCallGenkit(
  { 
    cors: process.env.FUNCTIONS_EMULATOR ? true : ["https://careerly-app.web.app", "http://localhost:5173"], // Adjust domains as needed
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
        prompt: `You are a helpful and professional career mentor. Respond to the user's query: "${sanitizedInput}"`,
      });
      return response.text();
    }
  )
);