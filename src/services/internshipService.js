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
  // --- Core Internship Management (Careerly Data Model) ---

  /**
   * Create an active Internship engagement mapping Student, Mentor, and Supervisor.
   */
  startInternship: (data) => {
    return addDoc(collection(db, "internships"), {
      studentId: data.studentId,
      mentorId: data.mentorId,
      supervisorId: data.supervisorId,
      orgId: data.orgId,
      startDate: data.startDate || serverTimestamp(),
      endDate: data.endDate || null,
      title: data.title,
      description: data.description,
      status: 'active', // active, completed, terminated
      createdAt: serverTimestamp()
    });
  },

  getInternshipById: async (id) => {
    const docRef = doc(db, "internships", id);
    const snap = await getDoc(docRef);
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  },

  getStudentInternships: async (studentId) => {
    const q = query(collection(db, "internships"), where("studentId", "==", studentId));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // --- Log / Milestone System (Linked to Internships) ---

  /**
   * Submit a daily or milestone log for an internship.
   */
  submitLog: (logData) => {
    return addDoc(collection(db, "logs"), {
      internshipId: logData.internshipId,
      studentId: logData.studentId, // Denormalized for query performance
      date: logData.date || serverTimestamp(),
      description: logData.description,
      skillsMatched: logData.skillsMatched || [],
      status: 'pending', // pending, approved
      submittedAt: serverTimestamp()
    });
  },

  /**
   * Approve a log (Supervisor/Mentor Action)
   */
  approveLog: (logId, approverId) => {
    return updateDoc(doc(db, "logs", logId), {
      status: 'approved',
      approvedBy: approverId,
      approvedAt: serverTimestamp()
    });
  },

  getInternshipLogs: async (internshipId) => {
    const q = query(collection(db, "logs"), where("internshipId", "==", internshipId));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // --- Legacy / UI Support ---
  getAllInternships: async () => {
    const querySnapshot = await getDocs(collection(db, "internships"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  getCompanyInternships: async (orgId) => {
    const q = query(collection(db, "internships"), where("orgId", "==", orgId));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  updateInternship: (id, data) => updateDoc(doc(db, "internships", id), data),

  deleteInternship: (id) => deleteDoc(doc(db, "internships", id)),

  // --- Hub Application System ---
  applyToInternship: (studentId, internshipId, data) => {
    return addDoc(collection(db, "applications"), {
      studentId,
      internshipId,
      orgId: data.orgId || data.companyId, // Handle both for safety
      title: data.title || data.internshipTitle,
      status: "pending",
      appliedAt: serverTimestamp(),
    });
  },

  getStudentApplications: async (studentId) => {
    const q = query(collection(db, "applications"), where("studentId", "==", studentId));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Bookmark System
  toggleBookmark: async (userId, internshipId, isBookmarked) => {
    const bookmarkRef = doc(db, "users", userId, "bookmarks", internshipId);
    if (isBookmarked) {
      await deleteDoc(bookmarkRef);
    } else {
      await setDoc(bookmarkRef, { bookmarkedAt: serverTimestamp() });
    }
  }
};