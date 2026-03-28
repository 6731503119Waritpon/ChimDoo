import React, { useState } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '@/components/ToastProvider';
import { ArrowLeft, Mail, KeyRound, CheckCircle2, RefreshCcw } from 'lucide-react-native';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const { resetPassword, loading } = useAuth();
    const toast = useToast();

    const [email, setEmail] = useState('');
    const [emailSent, setEmailSent] = useState(false);

    const handleResetPassword = async () => {
        if (!email) {
            toast.warning('Missing Email', 'Please enter your email address');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.warning('Invalid Email', 'Please enter a valid email address');
            return;
        }

        try {
            await resetPassword(email);
            setEmailSent(true);
        } catch (err: any) {
            toast.error('Error', err.message || 'Failed to send reset email');
        }
    };

    if (emailSent) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={[styles.backgroundAccent, { top: -120, right: -120 }]} />
                <View style={styles.content}>
                    <View style={styles.successContainer}>
                        <View style={styles.successIconWrapper}>
                            <CheckCircle2 size={60} color={AppColors.success} />
                        </View>
                        <Text style={styles.successTitle}>Check Your Email</Text>
                        <Text style={styles.successText}>
                            We've sent a password reset link to{'\n'}
                            <Text style={styles.emailHighlight}>{email}</Text>
                        </Text>
                        
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => router.back()}
                        >
                            <Text style={styles.buttonText}>Back to Login</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.resendButton}
                            onPress={() => setEmailSent(false)}
                        >
                            <RefreshCcw size={16} color={AppColors.textMuted} />
                            <Text style={styles.resendButtonText}>Didn't receive the email? Try again</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.backgroundAccent} />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <ArrowLeft size={22} color={AppColors.navy} />
                </TouchableOpacity>

                <View style={styles.content}>
                    <View style={styles.header}>
                        <View style={styles.iconCircle}>
                            <KeyRound size={32} color={AppColors.white} />
                        </View>
                        <Text style={styles.title}>Forgot Password?</Text>
                        <Text style={styles.subtitle}>
                            Don't worry! It happens. Please enter the email address associated with your account.
                        </Text>
                    </View>

                    <View style={styles.formContainer}>
                        <View style={styles.inputWrapper}>
                            <Text style={styles.label}>Email Address</Text>
                            <View style={styles.inputContainer}>
                                <Mail size={20} color={AppColors.textMuted} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your email"
                                    placeholderTextColor={AppColors.textPlaceholder}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.button, loading && { opacity: 0.6 }]}
                            onPress={handleResetPassword}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color={AppColors.white} />
                            ) : (
                                <Text style={styles.buttonText}>Send Reset Link</Text>
                            )}
                        </TouchableOpacity>

                        <View style={styles.infoBox}>
                            <Text style={styles.infoText}>
                                <Text style={{ fontFamily: AppFonts.bold }}>Note: </Text>
                                This system is currently in development. Password recovery may not be fully functional yet.
                            </Text>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.white,
    },
    backgroundAccent: {
        position: 'absolute',
        top: -100,
        right: -100,
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: AppColors.primary,
        opacity: 0.05,
        zIndex: 0,
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 10,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F0F2F5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: AppColors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: AppColors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    title: {
        fontFamily: AppFonts.bold,
        fontSize: 32,
        color: AppColors.navy,
        marginBottom: 12,
    },
    subtitle: {
        fontFamily: AppFonts.regular,
        fontSize: 16,
        color: AppColors.textMuted,
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 20,
    },
    formContainer: {
        width: '100%',
    },
    inputWrapper: {
        marginBottom: 32,
    },
    label: {
        fontFamily: AppFonts.bold,
        fontSize: 14,
        color: AppColors.navy,
        marginBottom: 8,
        marginLeft: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: AppColors.borderLight,
        paddingHorizontal: 16,
        height: 60,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        fontFamily: AppFonts.regular,
        flex: 1,
        fontSize: 16,
        color: AppColors.textDark,
        height: '100%',
    },
    button: {
        backgroundColor: AppColors.primary,
        borderRadius: 16,
        height: 60,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: AppColors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonText: {
        fontFamily: AppFonts.bold,
        color: AppColors.white,
        fontSize: 18,
    },
    infoBox: {
        marginTop: 40,
        padding: 16,
        backgroundColor: '#FFF5F5',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FED7D7',
    },
    infoText: {
        fontFamily: AppFonts.regular,
        fontSize: 13,
        color: '#C53030',
        textAlign: 'center',
        lineHeight: 18,
    },
    successContainer: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    successIconWrapper: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#DCFCE7',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
    },
    successTitle: {
        fontFamily: AppFonts.bold,
        fontSize: 28,
        color: AppColors.navy,
        marginBottom: 16,
    },
    successText: {
        fontFamily: AppFonts.regular,
        fontSize: 16,
        color: AppColors.textMuted,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 40,
    },
    emailHighlight: {
        fontFamily: AppFonts.bold,
        color: AppColors.navy,
    },
    resendButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 24,
        padding: 10,
    },
    resendButtonText: {
        fontFamily: AppFonts.medium,
        fontSize: 14,
        color: AppColors.textMuted,
        marginLeft: 8,
    },
});