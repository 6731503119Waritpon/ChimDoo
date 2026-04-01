export interface FirebaseAuthError {
    code: string;
    message: string;
}

export function isFirebaseError(error: unknown): error is FirebaseAuthError {
    return (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        'message' in error
    );
}

export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (isFirebaseError(error)) return error.message;
    return 'An unknown error occurred';
}
