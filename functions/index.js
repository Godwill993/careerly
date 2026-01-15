import { onCallGenkit } from "firebase-functions/https";
import { defineSecret } from "firebase-functions/params";
import { genkit, z } from "genkit";
import { googleAI, gemini15Flash } from "@genkit-ai/googleai";

const apiKey = defineSecret("GOOGLE_GENAI_API_KEY");

const ai = genkit({
  plugins: [googleAI()],
  model: gemini15Flash,
});

export const careerAssistant = onCallGenkit(
  { 
    secrets: [apiKey],
    cors: true,       // FIXED: Resolves the CORS policy block in your console
    invoker: 'public' // FIXED: Allows your frontend to call the function
  },
  ai.defineFlow(
    {
      name: "careerAssistant",
      inputSchema: z.string(),
      outputSchema: z.string(),
    },
    async (userInput) => {
      const response = await ai.generate({
        prompt: `You are a career mentor for the BlueGold app. Help this student: ${userInput}`,
      });
      return response.text();
    }
  )
);