import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "../firebase/config";

// Force the region to match your console log (us-central1)
const functions = getFunctions(app, "us-central1");

export const aiService = {
  generateResponse: async (userInput) => {
    try {
      const careerAssistant = httpsCallable(functions, "careerAssistant");
      const result = await careerAssistant(userInput);
      return result.data;
    } catch (error) {
      console.error("Genkit Error:", error);
      // Detailed error logging to help you see if it's a permission issue
      return "I'm having trouble connecting. Check your internet or Firebase console.";
    }
  },
};