import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";
import { app } from "../firebase/config";

const functions = getFunctions(app, "us-central1");

// FIXED: Automatically connects to your local machine if you're developing locally
if (window.location.hostname === "localhost") {
  connectFunctionsEmulator(functions, "localhost", 5001);
}

export const aiService = {
  generateResponse: async (userInput) => {
    try {
      const careerAssistant = httpsCallable(functions, "careerAssistant");
      const result = await careerAssistant(userInput);
      return result.data;
    } catch (error) {
      if (typeof console !== 'undefined') console.error("Emulator Error:", error);
      return "Make sure you ran 'firebase emulators:start' in your terminal!";
    }
  },
};