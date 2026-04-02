import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    updateProfile,
    onAuthStateChanged,
    User,
} from 'firebase/auth';
import { auth } from '@/config/firebase';
import { clearChatHistory } from '@/services/groq';

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
