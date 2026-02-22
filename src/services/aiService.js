import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";
import { app } from "../firebase/config";

const functions = getFunctions(app, "us-central1");

// Connect to local emulator only if explicitly enabled
if (import.meta.env.VITE_USE_EMULATORS === 'true') {
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);
}

export const aiService = {
  generateResponse: async (userInput) => {
    try {
      const careerAssist = httpsCallable(functions, "careerAssist");
      const result = await careerAssist({ text: userInput });
      return result.data.response;
    } catch (error) {
      if (typeof console !== 'undefined') console.error("Emulator Error:", error);
      return "Make sure you ran 'firebase emulators:start' in your terminal!";
    }
  },
};