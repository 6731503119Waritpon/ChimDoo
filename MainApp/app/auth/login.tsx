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
import { getErrorMessage } from '@/types/firebase';
import { useGoogleSignIn } from '@/hooks/auth/useGoogleSignIn';
import { authStyles as styles } from '@/constants/authStyles';

export default function LoginScreen() {
    const router = useRouter();
    const { signIn, loading } = useAuth();
    const toast = useToast();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { handleGoogleSignIn, isLoading: isGoogleLoading, isDisabled: isGoogleDisabled } = useGoogleSignIn();

    const handleLogin = async () => {
        if (!email || !password) {
            toast.warning(AppStrings.missingFields, AppStrings.fillAllFields);
            return;
        }

        try {
            await signIn(email, password);
            router.replace('/(tabs)');
        } catch (err: unknown) {
            toast.error('Login Failed', getErrorMessage(err));
        }
    };

    return (
        <KeyboardAwareView
            style={styles.container}
            contentContainerStyle={styles.content}
        >
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
            >
                <ArrowLeft size={22} color={AppColors.navy} />
            </TouchableOpacity>

            <View style={styles.header}>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Sign in to continue</Text>
            </View>

            <View style={styles.form}>
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
                        placeholder="Enter your password"
                    />
                </View>

                <TouchableOpacity
                    style={{ alignSelf: 'flex-end', marginBottom: 24 }}
                    onPress={() => router.push('/auth/forgot-password')}
                >
                    <Text style={styles.linkText}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Sign In</Text>
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
                <Text style={styles.footerText}>Don't have an account?</Text>
                <TouchableOpacity onPress={() => router.push('/auth/signup')}>
                    <Text style={styles.linkText}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAwareView>
    );
}
