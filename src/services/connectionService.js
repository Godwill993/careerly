import { db } from "../firebase/config";
import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    updateDoc,
    doc,
    getDoc,
    serverTimestamp,
    onSnapshot
} from "firebase/firestore";

export const connectionService = {
    /**
     * Send a connection request to another student
     */
    sendConnectionRequest: async (senderId, receiverId) => {
        try {
            // Check if already connected or pending
            const q = query(
                collection(db, "connections"),
                where("participants", "array-contains", senderId)
            );
            const snapshot = await getDocs(q);
            const existing = snapshot.docs.find(doc => doc.data().participants.includes(receiverId));

            if (existing) {
                return { status: 'exists', data: existing.data() };
            }

            await addDoc(collection(db, "connections"), {
                participants: [senderId, receiverId],
                requesterId: senderId,
                receiverId: receiverId,
                status: 'pending',
                timestamp: serverTimestamp()
            });
            return { status: 'sent' };
        } catch (error) {
            console.error("Error sending connection request:", error);
            throw error;
        }
    },

    /**
     * Accept a connection request
     */
    acceptConnection: async (connectionId) => {
        try {
            const docRef = doc(db, "connections", connectionId);
            await updateDoc(docRef, {
                status: 'accepted',
                acceptedAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error accepting connection:", error);
            throw error;
        }
    },

    /**
     * Get all connections (accepted or pending) for a user
     */
    getConnections: (userId, callback) => {
        const q = query(
            collection(db, "connections"),
            where("participants", "array-contains", userId)
        );

        return onSnapshot(q, async (snapshot) => {
            const connections = await Promise.all(
                snapshot.docs.map(async (d) => {
                    const data = d.data();
                    const otherId = data.participants.find(id => id !== userId);
                    const userSnap = await getDoc(doc(db, "users", otherId));
                    const userData = userSnap.exists() ? userSnap.data() : { displayName: "Unknown User" };

                    return {
                        id: d.id,
                        ...data,
                        otherUser: {
                            id: otherId,
                            ...userData
                        }
                    };
                })
            );
            callback(connections);
        });
    }
};
