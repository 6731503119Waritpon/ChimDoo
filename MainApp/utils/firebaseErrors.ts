const firebaseErrorMap: Record<string, string> = {
    'auth/invalid-email': 'Invalid email address.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/email-already-in-use': 'This email is already registered. Please sign in instead.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/operation-not-allowed': 'This sign-in method is not enabled.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/network-request-failed': 'Network connection failed. Please check your internet.',
    'auth/requires-recent-login': 'Please log in again before performing this action.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/internal-error': 'Internal server error. Please try again later.',
    
    'permission-denied': 'You do not have permission to perform this action.',
    'unavailable': 'Service is currently unavailable. Please check your connection.',
    'not-found': 'The requested information was not found.',
    'already-exists': 'This item already exists.',
    'resource-exhausted': 'Quota exceeded. Please try again later.',
    'deadline-exceeded': 'Connection timed out. Please try again.',
};

export const translateFirebaseError = (code: string): string | undefined => {
    return firebaseErrorMap[code];
};
