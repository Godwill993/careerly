import { db } from "../firebase/config";
import { collection, doc, getDocs, getDoc, setDoc, updateDoc, addDoc, query, where, arrayUnion } from "firebase/firestore";

export const schoolService = {
    // Fetch all schools for registration drop-down
    getAllSchools: async () => {
        try {
            const q = query(collection(db, "users"), where("role", "==", "school"));
            const snap = await getDocs(q);
            return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error fetching schools:", error);
            return [];
        }
    },

    // Get departments for a specific school
    getDepartments: async (schoolId) => {
        try {
            const q = query(collection(db, "departments"), where("schoolId", "==", schoolId));
            const snap = await getDocs(q);
            const deps = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Return defaults if none exist yet for the school
            if (deps.length === 0) {
                return [
                    { id: 'cs', name: 'Computer Science' },
                    { id: 'cv', name: 'Civil Engineering' },
                    { id: 'ee', name: 'Electrical Engineering' },
                    { id: 'ba', name: 'Business Administration' }
                ];
            }
            return deps;
        } catch (error) {
            console.error("Error fetching departments:", error);
            return [];
        }
    },

    // Add a new department to a school
    addDepartment: async (schoolId, departmentName) => {
        try {
            const docRef = await addDoc(collection(db, "departments"), {
                schoolId,
                name: departmentName,
                createdAt: new Date()
            });
            return { id: docRef.id, name: departmentName, schoolId };
        } catch (error) {
            console.error("Error adding department:", error);
            throw error;
        }
    },

    // Assign a course to a student
    assignCourse: async (studentId, course) => {
        try {
            // We will add it to a 'courses' sub-collection or array inside the user's doc
            // Simplest is appending to an array inside the student's profile
            const userRef = doc(db, "users", studentId);
            await updateDoc(userRef, {
                courses: arrayUnion(course)
            });
        } catch (error) {
            console.error("Error assigning course:", error);
            throw error;
        }
    }
};
