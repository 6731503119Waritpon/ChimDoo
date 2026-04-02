import { useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import {
    signUp,
    signIn,
    logOut,
    resetPassword,
    subscribeToAuthChanges,
    getCurrentUser,
} from '../services/auth';
import { getErrorMessage } from '@/types/firebase';

interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}

interface UseAuthReturn extends AuthState {
    signUp: (email: string, password: string, displayName?: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    logOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    clearError: () => void;
}

export const useAuth = (): UseAuthReturn => {
    const [state, setState] = useState<AuthState>({
        user: getCurrentUser(),
        loading: true,
        error: null,
    });

    useEffect(() => {
        const unsubscribe = subscribeToAuthChanges((user) => {
            setState((prev) => ({
                ...prev,
                user,
                loading: false,
            }));
        });

        return () => unsubscribe();
    }, []);

    const handleSignUp = useCallback(
        async (email: string, password: string, displayName?: string) => {
            try {
                setState((prev) => ({ ...prev, loading: true, error: null }));
                await signUp(email, password, displayName);
            } catch (error: unknown) {
                setState((prev) => ({
                    ...prev,
                    loading: false,
                    error: getErrorMessage(error),
                }));
                throw error;
            }
        },
        []
    );

    const handleSignIn = useCallback(async (email: string, password: string) => {
        try {
            setState((prev) => ({ ...prev, loading: true, error: null }));
            await signIn(email, password);
        } catch (error: unknown) {
            setState((prev) => ({
                ...prev,
                loading: false,
                error: getErrorMessage(error),
            }));
            throw error;
        }
    }, []);

    const handleLogOut = useCallback(async () => {
        try {
            setState((prev) => ({ ...prev, loading: true, error: null }));
            await logOut();
        } catch (error: unknown) {
            setState((prev) => ({
                ...prev,
                loading: false,
                error: getErrorMessage(error),
            }));
            throw error;
        }
    }, []);

    const handleResetPassword = useCallback(async (email: string) => {
        try {
            setState((prev) => ({ ...prev, loading: true, error: null }));
            await resetPassword(email);
            setState((prev) => ({ ...prev, loading: false }));
        } catch (error: unknown) {
            setState((prev) => ({
                ...prev,
                loading: false,
                error: getErrorMessage(error),
            }));
            throw error;
        }
    }, []);

    const clearError = useCallback(() => {
        setState((prev) => ({ ...prev, error: null }));
    }, []);

    return {
        ...state,
        signUp: handleSignUp,
        signIn: handleSignIn,
        logOut: handleLogOut,
        resetPassword: handleResetPassword,
        clearError,
    };
};
