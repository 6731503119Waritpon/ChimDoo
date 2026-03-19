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
    ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '@/components/ToastProvider';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { useGoogleAuth } from '../../hooks/useGoogleAuth';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react-native';
import { AppColors } from '@/constants/colors';

WebBrowser.maybeCompleteAuthSession();

export default function SignupScreen() {
    const router = useRouter();
    const { signUp, loading } = useAuth();
    const toast = useToast();
    const [googleLoading, setGoogleLoading] = useState(false);
    const { signInWithGoogle, loading: nativeGoogleLoading, isNativeAvailable } = useGoogleAuth();

    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

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
        } catch (error: any) {
            toast.error('Google Login Error', error.message);
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
        } catch (error: any) {
            toast.error('Google Login Error', error.message);
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

    const handleSignup = async () => {
        if (!displayName || !email || !password || !confirmPassword) {
            toast.warning('Missing Fields', 'Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Error', 'Passwords do not match');
            return;
        }

        if (password.length < 6) {
            toast.warning('Weak Password', 'Password must be at least 6 characters');
            return;
        }

        try {
            await signUp(email, password, displayName);
            router.replace('/(tabs)');
        } catch (err: any) {
            toast.error('Signup Failed', err.message || 'Please try again');
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.content}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <ArrowLeft size={22} color={AppColors.navy} />
                    </TouchableOpacity>
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
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.passwordRow}>
                                <TextInput
                                    style={styles.passwordInput}
                                    placeholder="Create a password"
                                    placeholderTextColor="#666"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity
                                    style={styles.eyeButton}
                                    onPress={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword
                                        ? <EyeOff size={20} color="#888" />
                                        : <Eye size={20} color="#888" />
                                    }
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Confirm Password</Text>
                            <View style={styles.passwordRow}>
                                <TextInput
                                    style={styles.passwordInput}
                                    placeholder="Confirm your password"
                                    placeholderTextColor="#666"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showConfirm}
                                />
                                <TouchableOpacity
                                    style={styles.eyeButton}
                                    onPress={() => setShowConfirm(!showConfirm)}
                                >
                                    {showConfirm
                                        ? <EyeOff size={20} color="#888" />
                                        : <Eye size={20} color="#888" />
                                    }
                                </TouchableOpacity>
                            </View>
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
                        <Text style={styles.footerText}>Already have an account?</Text>
                        <TouchableOpacity onPress={() => router.push('/auth/login')}>
                            <Text style={styles.loginLink}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
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
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#333',
    },
    passwordRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#333',
        paddingHorizontal: 16,
    },
    passwordInput: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 16,
    },
    eyeButton: {
        padding: 4,
    },
    button: {
        backgroundColor: AppColors.primary,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    footerText: {
        color: '#666',
        fontSize: 14,
    },
    loginLink: {
        color: AppColors.primary,
        fontSize: 14,
        fontWeight: '600',
    },
    backButton: {
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
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 10,
    },
});
