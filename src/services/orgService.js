import { db } from "../firebase/config";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    query,
    where,
    setDoc,
    serverTimestamp
} from "firebase/firestore";

export const orgService = {
    /**
     * Create a new Organization (Academic or Industry)
     * As per Careerly Data Model PK: orgId
     */
    createOrganization: async (data) => {
        try {
            const docRef = await addDoc(collection(db, "organizations"), {
                name: data.name,
                type: data.type, // 'academic' or 'industry'
                email: data.email,
                createdAt: serverTimestamp()
            });
            return { id: docRef.id, ...data };
        } catch (error) {
            console.error("Error creating organization:", error);
            throw error;
        }
    },

    /**
     * Fetch all organizations of a specific type
     */
    getOrganizationsByType: async (type) => {
        try {
            const q = query(collection(db, "organizations"), where("type", "==", type));
            const snap = await getDocs(q);
            return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error fetching organizations:", error);
            return [];
        }
    },

    getOrgById: async (orgId) => {
        try {
            const docRef = doc(db, "organizations", orgId);
            const snap = await getDoc(docRef);
            return snap.exists() ? { id: snap.id, ...snap.data() } : null;
        } catch (error) {
            console.error("Error fetching org:", error);
            return null;
        }
    }
};
