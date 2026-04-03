import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import KeyboardAwareView from '@/components/ui/KeyboardAwareView';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/ToastProvider';
import { ArrowLeft } from 'lucide-react-native';
import { AppStrings } from '@/constants/strings';
import SecureInput from '@/components/ui/SecureInput';
import { AppColors } from '@/constants/colors';
import { isFirebaseError, getErrorMessage } from '@/types/firebase';
import { useGoogleSignIn } from '@/hooks/auth/useGoogleSignIn';
import { authStyles as styles } from '@/constants/authStyles';

export default function SignupScreen() {
    const router = useRouter();
    const { signUp, loading } = useAuth();
    const toast = useToast();
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const { handleGoogleSignIn, isLoading: isGoogleLoading, isDisabled: isGoogleDisabled } = useGoogleSignIn();

    const handleSignup = async () => {
        if (!displayName || !email || !password || !confirmPassword) {
            toast.warning(AppStrings.missingFields, AppStrings.fillAllFields);
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Error', AppStrings.passwordsNoMatch);
            return;
        }

        if (password.length < 6) {
            toast.warning(AppStrings.weakPassword, AppStrings.passwordMinLength);
            return;
        }

        try {
            await signUp(email, password, displayName);
            router.replace('/(tabs)');
        } catch (err: unknown) {
            let errorMessage = 'Please try again';

            if (isFirebaseError(err) && err.code === 'auth/email-already-in-use') {
                errorMessage = 'This email is already registered. Please sign in instead.';
            } else {
                errorMessage = getErrorMessage(err);
            }

            toast.error('Signup Failed', errorMessage);
        }
    };

    return (
        <KeyboardAwareView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
        >
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
            >
                <ArrowLeft size={22} color={AppColors.navy} />
            </TouchableOpacity>

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Join us today</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Display Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your name"
                            placeholderTextColor="#666"
                            value={displayName}
                            onChangeText={setDisplayName}
                            autoCapitalize="words"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your email"
                            placeholderTextColor="#666"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <SecureInput
                            label="Password"
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Create a password"
                            showStrength={true}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <SecureInput
                            label="Confirm Password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder="Confirm your password"
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleSignup}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Create Account</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.dividerContainer}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>OR</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    <TouchableOpacity
                        style={styles.googleButton}
                        disabled={isGoogleDisabled}
                        onPress={handleGoogleSignIn}
                    >
                        {isGoogleLoading ? (
                            <ActivityIndicator color={AppColors.navy} />
                        ) : (
                            <Text style={styles.googleButtonText}>Sign in with Google</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account?</Text>
                    <TouchableOpacity onPress={() => router.push('/auth/login')}>
                        <Text style={styles.linkText}>Sign In</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAwareView>
    );
}
