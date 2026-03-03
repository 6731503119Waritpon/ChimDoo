import { useState } from 'react';
import { Platform } from 'react-native';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../firebaseConfig';

let GoogleSignin: any = null;
if (Platform.OS !== 'web') {
    try {
        const googleSignIn = require('@react-native-google-signin/google-signin');
        GoogleSignin = googleSignIn.GoogleSignin;
        GoogleSignin.configure({
            webClientId: process.env.EXPO_PUBLIC_WEBCLIENT_ID,
        });
    } catch (e) {
        console.log('Native Google Sign-In not available (Expo Go)');
    }
}

export function useGoogleAuth() {
    const [loading, setLoading] = useState(false);

    const signInWithGoogle = async (): Promise<boolean> => {
        if (Platform.OS === 'web') {
            return false;
        }

        if (!GoogleSignin) {
            throw new Error('Google Sign-In is not available. Please use the Development Build');
        }

        setLoading(true);
        try {
            await GoogleSignin.hasPlayServices();
            const response = await GoogleSignin.signIn();

            const idToken = response.data?.idToken;
            if (!idToken) {
                throw new Error('Unable to receive a token from Google');
            }

            const credential = GoogleAuthProvider.credential(idToken);
            await signInWithCredential(auth, credential);
            return true;
        } catch (error: any) {
            if (error.code === 'SIGN_IN_CANCELLED') {
                return false;
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const isNativeAvailable = Platform.OS !== 'web' && GoogleSignin !== null;

    return { signInWithGoogle, loading, isNativeAvailable };
}
