import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    updateProfile,
    onAuthStateChanged,
    User,
    deleteUser
} from 'firebase/auth';
import { db, auth } from '@/config/firebase';
import { clearChatHistory } from '@/services/groq';
import { doc, deleteDoc, collection, query, where, getDocs, writeBatch } from 'firebase/firestore';
import { Collections } from '@/constants/collections';

export const signUp = async (
    email: string,
    password: string,
    displayName?: string
): Promise<User> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    if (displayName) {
        await updateProfile(userCredential.user, { displayName });
    }

    return userCredential.user;
};

export const signIn = async (email: string, password: string): Promise<User> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
};

export const logOut = async (): Promise<void> => {
    clearChatHistory();
    await signOut(auth);
};

export const resetPassword = async (email: string): Promise<void> => {
    await sendPasswordResetEmail(auth, email);
};

export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
};

export const getCurrentUser = (): User | null => {
    return auth.currentUser;
};

export const deleteUserAccount = async (): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error("No user is currently signed in.");
    
    const uid = user.uid;
    
    try {
        const batch = writeBatch(db);
        batch.delete(doc(db, Collections.users, uid));
        
        const reviewsQuery = query(collection(db, Collections.reviews), where('userId', '==', uid));
        const reviewsSnap = await getDocs(reviewsQuery);
        reviewsSnap.forEach(docSnap => batch.delete(docSnap.ref));
        
        await batch.commit();
        
        clearChatHistory();
        await deleteUser(user);
    } catch (err: any) {
        if (err.code === 'auth/requires-recent-login') {
            throw new Error("For security, please log out and log back in before deleting your account.");
        }
        throw err;
    }
};
