import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "../firebase/config";

const functions = getFunctions(app);

export const aiService = {
  getRecommendations: async (studentData) => {
    // This calls the "recommendInternships" function you will deploy to Firebase
    const recommendFn = httpsCallable(functions, "recommendInternships");
    const result = await recommendFn(studentData);
    return result.data; // This will be the AI's response
  }
};