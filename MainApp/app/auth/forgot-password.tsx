import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/ToastProvider';
import { ArrowLeft, Mail, KeyRound, CheckCircle2, RefreshCcw } from 'lucide-react-native';
import { AppColors } from '@/constants/colors';
import { AppFonts, AppLayout } from '@/constants/theme';
import { AppStrings } from '@/constants/strings';
import { getErrorMessage } from '@/types/firebase';
import { authStyles as s } from '@/constants/authStyles';

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const { resetPassword, loading } = useAuth();
    const toast = useToast();

    const [email, setEmail] = useState('');
    const [emailSent, setEmailSent] = useState(false);

    const handleResetPassword = async () => {
        if (!email) {
            toast.warning(AppStrings.missingEmail, AppStrings.enterEmail);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.warning(AppStrings.invalidEmail, AppStrings.enterValidEmail);
            return;
        }

        try {
            await resetPassword(email);
            setEmailSent(true);
        } catch (err: unknown) {
            toast.error('Error', getErrorMessage(err));
        }
    };

    if (emailSent) {
        return (
            <SafeAreaView style={s.container}>
                <View style={[styles.backgroundAccent, { top: -120, right: -120 }]} />
                <View style={s.content}>
                    <View style={styles.successContainer}>
                        <View style={styles.successIconWrapper}>
                            <CheckCircle2 size={60} color={AppColors.success} />
                        </View>
                        <Text style={styles.successTitle}>Check Your Email</Text>
                        <Text style={styles.successSubtitle}>
                            We've sent a password reset link to{'\n'}
                            <Text style={styles.emailHighlight}>{email}</Text>
                        </Text>
                        
                        <TouchableOpacity
                            style={[s.button, { width: '100%', marginTop: 24 }]}
                            onPress={() => router.back()}
                        >
                            <Text style={s.buttonText}>Back to Login</Text>
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
        <SafeAreaView style={s.container}>
            <View style={styles.backgroundAccent} />
            <View style={{ flex: 1 }}>
                <TouchableOpacity
                    style={s.backButton}
                    onPress={() => router.back()}
                >
                    <ArrowLeft size={22} color={AppColors.navy} />
                </TouchableOpacity>

                <View style={s.content}>
                    <View style={s.header}>
                        <View style={styles.iconCircle}>
                            <KeyRound size={32} color={AppColors.white} />
                        </View>
                        <Text style={s.title}>Forgot Password?</Text>
                        <Text style={[s.subtitle, { textAlign: 'center', paddingHorizontal: 20 }]}>
                            Don't worry! It happens. Please enter the email address associated with your account.
                        </Text>
                    </View>

                    <View style={s.form}>
                        <View style={s.inputContainer}>
                            <Text style={s.label}>Email Address</Text>
                            <View style={styles.inputWrapper}>
                                <Mail size={20} color={AppColors.textMuted} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.inputField}
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
                            style={[s.button, loading && s.buttonDisabled]}
                            onPress={handleResetPassword}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color={AppColors.white} />
                            ) : (
                                <Text style={s.buttonText}>Send Reset Link</Text>
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
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
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
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: AppColors.backgroundMuted,
        borderRadius: AppLayout.radius.md,
        borderWidth: 1,
        borderColor: AppColors.borderSubtle,
        paddingHorizontal: 16,
        height: 60,
    },
    inputIcon: {
        marginRight: 12,
    },
    inputField: {
        fontFamily: AppFonts.regular,
        flex: 1,
        fontSize: 16,
        color: AppColors.textDark,
        height: '100%',
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
    successSubtitle: {
        fontFamily: AppFonts.regular,
        fontSize: 16,
        color: AppColors.textMuted,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 8,
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