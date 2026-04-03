import { User } from 'firebase/auth';

export interface UserProfile {
    photoBase64?: string | null;
}

export interface AuthState {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    error: string | null;
}

export interface UseAuthReturn extends AuthState {
    signUp: (email: string, password: string, displayName?: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    logOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    clearError: () => void;
}
