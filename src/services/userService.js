import { db } from "../firebase/config";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export const userService = {
  getUserProfile: async (uid) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  },
  createUserProfile: (uid, data) => setDoc(doc(db, "users", uid), { ...data, createdAt: new Date() }),
  updateProfile: (uid, data) => updateDoc(doc(db, "users", uid), data)
};