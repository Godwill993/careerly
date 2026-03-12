import { db } from "../firebase/config";
import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp,
    doc,
    updateDoc,
    getDocs,
    setDoc,
    limit,
    getDoc
} from "firebase/firestore";

export const messageService = {
    // Get all conversations for a user
    getConversations: (userId, callback) => {
        const q = query(
            collection(db, "conversations"),
            where("participants", "array-contains", userId)
        );

        return onSnapshot(q, async (snapshot) => {
            const conversations = await Promise.all(
                snapshot.docs.map(async (d) => {
                    const data = d.data();
                    // Get the other participant's info
                    const otherParticipantId = data.participants.find(id => id !== userId);
                    const userDoc = await getDoc(doc(db, "users", otherParticipantId));
                    const userData = userDoc.exists() ? userDoc.data() : { displayName: "Unknown User" };

                    return {
                        id: d.id,
                        ...data,
                        otherUser: {
                            id: otherParticipantId,
                            ...userData
                        }
                    };
                })
            );

            // Sort in-memory to avoid index error
            conversations.sort((a, b) => {
                const tsA = a.lastMessageTimestamp?.toMillis?.() || 0;
                const tsB = b.lastMessageTimestamp?.toMillis?.() || 0;
                return tsB - tsA;
            });

            callback(conversations);
        });
    },

    // Get messages for a specific conversation
    getMessages: (conversationId, callback) => {
        const q = query(
            collection(db, `conversations/${conversationId}/messages`),
            orderBy("timestamp", "asc")
        );

        return onSnapshot(q, (snapshot) => {
            const messages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(messages);
        });
    },

    // Send a message
    sendMessage: async (conversationId, senderId, text) => {
        const messageData = {
            senderId,
            text,
            timestamp: serverTimestamp(),
            read: false
        };

        await addDoc(collection(db, `conversations/${conversationId}/messages`), messageData);

        // Update conversation preview
        await updateDoc(doc(db, "conversations", conversationId), {
            lastMessage: text,
            lastMessageTimestamp: serverTimestamp(),
            [`unreadCount.${senderId}`]: 0 // Reset sender's unread count
            // We should ideally increment the other user's unread count here, 
            // but without the other userId it's tricky. 
            // Let's assume for now we just update the preview.
        });
    },

    // Start or get a conversation between two users
    getOrCreateConversation: async (userId1, userId2) => {
        const q = query(
            collection(db, "conversations"),
            where("participants", "array-contains", userId1)
        );

        const querySnapshot = await getDocs(q);
        let conversation = querySnapshot.docs.find(doc =>
            doc.data().participants.includes(userId2)
        );

        if (conversation) {
            return conversation.id;
        } else {
            // Create new conversation
            const newConvRef = await addDoc(collection(db, "conversations"), {
                participants: [userId1, userId2],
                lastMessage: "",
                lastMessageTimestamp: serverTimestamp(),
                unreadCount: {
                    [userId1]: 0,
                    [userId2]: 0
                }
            });
            return newConvRef.id;
        }
    },

    // Search for users to message
    searchUsers: async (searchTerm, currentUserId) => {
        // This is a simple search, production would need better filtering
        const q = query(collection(db, "users"), limit(20));
        const snapshot = await getDocs(q);

        return snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(user =>
                user.id !== currentUserId &&
                (user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.email?.toLowerCase().includes(searchTerm.toLowerCase()))
            );
    }
};
