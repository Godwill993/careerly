import { db } from "../firebase/config";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export const userService = {
  getUserProfile: async (uid) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },
  createUserProfile: async (uid, data) => {
    try {
      await setDoc(doc(db, "users", uid), { ...data, createdAt: new Date() });
    } catch (error) {
      console.error("Error creating user profile:", error);
      throw error;
    }
  },
  updateProfile: async (uid, data) => {
    try {
      await updateDoc(doc(db, "users", uid), data);
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  }
};