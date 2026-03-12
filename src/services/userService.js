import { db, storage } from "../firebase/config";
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, limit } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
  },
  uploadProfilePicture: async (uid, file) => {
    try {
      const fileRef = ref(storage, `profiles/${uid}/${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      await updateDoc(doc(db, "users", uid), { photoURL: url });
      return url;
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      throw error;
    }
  },
  searchStudents: async (searchTerm) => {
    try {
      const q = query(collection(db, "users"), where("role", "==", "student"), limit(50));
      const snapshot = await getDocs(q);
      const students = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      if (!searchTerm) return students;

      const lowerSearch = searchTerm.toLowerCase();
      return students.filter(s =>
        s.displayName?.toLowerCase().includes(lowerSearch) ||
        s.email?.toLowerCase().includes(lowerSearch) ||
        s.skills?.some(skill => skill.toLowerCase().includes(lowerSearch))
      );
    } catch (error) {
      console.error("Error searching students:", error);
      throw error;
    }
  }
};