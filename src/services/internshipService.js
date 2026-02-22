import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,      /* Added missing import */
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp
} from "firebase/firestore";

/* Note: removed getDoc from the list above as it was unused */

export const internshipService = {
  // --- CRUD Operations ---
  createInternship: (data) => {
    return addDoc(collection(db, "internships"), {
      ...data,
      createdAt: serverTimestamp(),
      status: 'active'
    });
  },

  getAllInternships: async () => {
    const querySnapshot = await getDocs(collection(db, "internships"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  getCompanyInternships: async (companyId) => {
    const q = query(collection(db, "internships"), where("companyId", "==", companyId));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  updateInternship: (id, data) => updateDoc(doc(db, "internships", id), data),

  deleteInternship: (id) => deleteDoc(doc(db, "internships", id)),

  // --- Application System ---
  applyToInternship: (studentId, internshipId, studentData) => {
    return addDoc(collection(db, "applications"), {
      studentId,
      internshipId,
      ...studentData,
      status: "pending", // pending, reviewed, accepted, rejected
      appliedAt: serverTimestamp(),
    });
  },

  getStudentApplications: async (studentId) => {
    const q = query(collection(db, "applications"), where("studentId", "==", studentId));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // --- Bookmark System ---
  toggleBookmark: async (userId, internshipId, isBookmarked) => {
    // Logic: If already bookmarked, delete the doc. If not, create it.
    const bookmarkRef = doc(db, "users", userId, "bookmarks", internshipId);

    if (isBookmarked) {
      await deleteDoc(bookmarkRef);
    } else {
      // setDoc is used here to create a document with a specific ID (internshipId)
      await setDoc(bookmarkRef, { bookmarkedAt: serverTimestamp() });
    }
  }
};