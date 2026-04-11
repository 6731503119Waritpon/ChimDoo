export interface FirestoreDocument {
    id: string;
    [key: string]: unknown;
}

export interface FirebaseAuthError {
    code: string;
    message: string;
}

import { translateFirebaseError } from '@/utils/firebaseErrors';

export function isFirebaseError(error: unknown): error is FirebaseAuthError {
    return (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        'message' in error
    );
}

export function getErrorMessage(error: unknown): string {
    if (isFirebaseError(error)) {
        return translateFirebaseError(error.code) || error.message;
    }
    if (error instanceof Error) return error.message;
    return 'An unknown error occurred';
}
