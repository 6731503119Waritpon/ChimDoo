import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    updateProfile,
    onAuthStateChanged,
    User,
} from 'firebase/auth';
import { auth } from '../firebaseConfig';

// Sign up with email and password
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

// Sign in with email and password
export const signIn = async (email: string, password: string): Promise<User> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
};

// Sign out
export const logOut = async (): Promise<void> => {
    await signOut(auth);
};

// Send password reset email
export const resetPassword = async (email: string): Promise<void> => {
    await sendPasswordResetEmail(auth, email);
};

// Subscribe to auth state changes
export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
};

// Get current user
export const getCurrentUser = (): User | null => {
    return auth.currentUser;
};
