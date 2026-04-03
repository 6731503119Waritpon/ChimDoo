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

import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Collections } from '@/constants/collections';

import { UserProfile, AuthState, UseAuthReturn } from '@/types/auth';

export const useAuth = (): UseAuthReturn => {
    const [state, setState] = useState<AuthState>({
        user: getCurrentUser(),
        profile: null,
        loading: true,
        error: null,
    });

    useEffect(() => {
        let unsubscribeProfile: (() => void) | undefined;

        const unsubscribeAuth = subscribeToAuthChanges((user) => {
            if (unsubscribeProfile) {
                unsubscribeProfile();
                unsubscribeProfile = undefined;
            }

            if (user) {
                unsubscribeProfile = onSnapshot(doc(db, Collections.users, user.uid), (docSnap) => {
                    if (docSnap.exists()) {
                        setState((prev) => ({
                            ...prev,
                            user,
                            profile: docSnap.data() as UserProfile,
                            loading: false,
                        }));
                    } else {
                        setState((prev) => ({
                            ...prev,
                            user,
                            profile: null,
                            loading: false,
                        }));
                    }
                });
            } else {
                setState((prev) => ({
                    ...prev,
                    user: null,
                    profile: null,
                    loading: false,
                }));
            }
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeProfile) unsubscribeProfile();
        };
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
