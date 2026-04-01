import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import KeyboardAwareView from '@/components/KeyboardAwareView';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '@/components/ToastProvider';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { useGoogleAuth } from '../../hooks/useGoogleAuth';
import { ArrowLeft } from 'lucide-react-native';
import { AppFonts } from '@/constants/theme';
import SecureInput from '@/components/SecureInput';
import { AppColors } from '@/constants/colors';
import { getErrorMessage } from '@/types/firebase';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
    const router = useRouter();
    const { signIn, loading, error } = useAuth();
    const toast = useToast();
    const [googleLoading, setGoogleLoading] = useState(false);
    const { signInWithGoogle, loading: nativeGoogleLoading, isNativeAvailable } = useGoogleAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            toast.warning('Missing Fields', 'Please fill in all fields');
            return;
        }

        try {
            await signIn(email, password);
            router.replace('/(tabs)');
        } catch (err: unknown) {
            toast.error('Login Failed', getErrorMessage(err));
        }
    };

    const [request, response, promptAsync] = Google.useAuthRequest({
        webClientId: process.env.EXPO_PUBLIC_WEBCLIENT_ID,
        iosClientId: process.env.EXPO_PUBLIC_IOSCLIENT_ID,
        androidClientId: process.env.EXPO_PUBLIC_WEBCLIENT_ID,
    });

    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token, access_token } = response.params;
            handleWebGoogleSignIn(id_token, access_token);
        }
    }, [response]);

    const handleWebGoogleSignIn = async (idToken?: string, accessToken?: string) => {
        setGoogleLoading(true);
        try {
            const credential = GoogleAuthProvider.credential(idToken || null, accessToken || null);
            await signInWithCredential(auth, credential);
            router.replace('/(tabs)');
        } catch (error: unknown) {
            toast.error('Google Login Error', getErrorMessage(error));
        } finally {
            setGoogleLoading(false);
        }
    };

    const handleNativeGoogleSignIn = async () => {
        try {
            const success = await signInWithGoogle();
            if (success) {
                router.replace('/(tabs)');
            }
        } catch (error: unknown) {
            toast.error('Google Login Error', getErrorMessage(error));
        }
    };

    const handleGooglePress = () => {
        if (Platform.OS === 'web') {
            promptAsync();
        } else {
            handleNativeGoogleSignIn();
        }
    };

    const isGoogleLoading = googleLoading || nativeGoogleLoading;
    const isGoogleDisabled = Platform.OS === 'web' ? (!request || isGoogleLoading) : isGoogleLoading;

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
                    style={styles.forgotPassword}
                    onPress={() => router.push('/auth/forgot-password')}
                >
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
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
                    onPress={handleGooglePress}
                >
                    {isGoogleLoading ? (
                        <ActivityIndicator color="#000" />
                    ) : (
                        <Text style={styles.googleButtonText}>Sign in with Google</Text>
                    )}
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Don't have an account?</Text>
                <TouchableOpacity onPress={() => router.push('/auth/signup')}>
                    <Text style={styles.signupLink}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAwareView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 48,
    },
    title: {
        fontFamily: AppFonts.bold,
        fontSize: 32,
        marginBottom: 8,
    },
    subtitle: {
        fontFamily: AppFonts.regular,
        fontSize: 16,
        color: '#666',
    },
    form: {
        marginBottom: 32,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontFamily: AppFonts.semiBold,
        fontSize: 14,
        marginBottom: 8,
    },
    input: {
        fontFamily: AppFonts.regular,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#333',
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    forgotPasswordText: {
        fontFamily: AppFonts.medium,
        color: AppColors.primary,
        fontSize: 14,
    },
    button: {
        backgroundColor: AppColors.primary,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        fontFamily: AppFonts.bold,
        color: '#fff',
        fontSize: 18,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    footerText: {
        fontFamily: AppFonts.regular,
        color: '#666',
        fontSize: 14,
    },
    signupLink: {
        fontFamily: AppFonts.bold,
        color: AppColors.primary,
        fontSize: 14,
    },
    backButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 60 : 40,
        left: 24,
        zIndex: 10,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F0F2F5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backButtonText: {
        fontSize: 16,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#ddd',
    },
    dividerText: {
        fontFamily: AppFonts.medium,
        marginHorizontal: 10,
        color: '#666',
    },
    googleButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
    },
    googleButtonText: {
        fontFamily: AppFonts.bold,
        color: '#000',
        fontSize: 16,
        marginLeft: 10,
    },
});
