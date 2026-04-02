import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { auth } from '@/config/firebase';
import { useGoogleAuth } from '../useGoogleAuth';
import { useToast } from '@/components/ui/ToastProvider';
import { getErrorMessage } from '@/types/firebase';

export const useGoogleSignIn = () => {
    const router = useRouter();
    const toast = useToast();
    const [webLoading, setWebLoading] = useState(false);
    const { signInWithGoogle: nativeSignIn, loading: nativeLoading, isNativeAvailable } = useGoogleAuth();

    const [request, response, promptAsync] = Google.useAuthRequest({
        webClientId: process.env.EXPO_PUBLIC_WEBCLIENT_ID,
        iosClientId: process.env.EXPO_PUBLIC_IOSCLIENT_ID,
        androidClientId: process.env.EXPO_PUBLIC_WEBCLIENT_ID,
    });

    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token, access_token } = response.params;
            handleWebGoogleSignIn(id_token, access_token);
        } else if (response?.type === 'error') {
            toast.error('Google Auth Error', 'Failed to authenticate with Google');
        }
    }, [response]);

    const handleWebGoogleSignIn = async (idToken?: string, accessToken?: string) => {
        setWebLoading(true);
        try {
            const credential = GoogleAuthProvider.credential(idToken || null, accessToken || null);
            await signInWithCredential(auth, credential);
            router.replace('/(tabs)');
        } catch (err: unknown) {
            toast.error('Google Login Failed', getErrorMessage(err));
        } finally {
            setWebLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        if (Platform.OS === 'web') {
            promptAsync();
        } else if (isNativeAvailable) {
            try {
                const success = await nativeSignIn();
                if (success) {
                    router.replace('/(tabs)');
                }
            } catch (err: unknown) {
                toast.error('Google Sign-In Error', getErrorMessage(err));
            }
        } else {
            promptAsync();
        }
    };

    const isLoading = webLoading || nativeLoading;
    const isDisabled = Platform.OS === 'web' ? (!request || isLoading) : isLoading;

    return {
        handleGoogleSignIn,
        isLoading,
        isDisabled,
    };
};
