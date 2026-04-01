import SecureInput from '@/components/SecureInput';
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, ShieldCheck, AlertCircle } from 'lucide-react-native';
import {
    reauthenticateWithCredential,
    EmailAuthProvider,
    updatePassword,
} from 'firebase/auth';
import { useAuth } from '../../../hooks/useAuth';
import { useToast } from '@/components/ToastProvider';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';
import { isFirebaseError, getErrorMessage } from '@/types/firebase';

export default function ChangePasswordScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const toast = useToast();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [saving, setSaving] = useState(false);

    const getStrength = (pw: string): { level: number; label: string; color: string } => {
        if (pw.length === 0) return { level: 0, label: '', color: '#ddd' };
        let score = 0;
        if (pw.length >= 8) score++;
        if (/[A-Z]/.test(pw)) score++;
        if (/[0-9]/.test(pw)) score++;
        if (/[^A-Za-z0-9]/.test(pw)) score++;
        const map = [
            { level: 1, label: 'Weak', color: '#ef4444' },
            { level: 2, label: 'Fair', color: '#f97316' },
            { level: 3, label: 'Good', color: '#eab308' },
            { level: 4, label: 'Strong', color: '#22c55e' },
        ];
        return map[score - 1] ?? { level: 0, label: '', color: '#ddd' };
    };

    const isGoogleOnlyUser =
        (user?.providerData ?? []).length > 0 &&
        (user?.providerData ?? []).every((p) => p.providerId === 'google.com');

    if (isGoogleOnlyUser) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <ChevronLeft size={26} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Change Password</Text>
                    <View style={{ width: 40 }} />
                </View>
                <View style={styles.googleInfoContainer}>
                    <View style={styles.googleInfoIcon}>
                        <AlertCircle size={40} color={AppColors.navy} />
                    </View>
                    <Text style={styles.googleInfoTitle}>Not Available</Text>
                    <Text style={styles.googleInfoText}>
                        Your account is linked to Google Sign-In. Password management is handled by Google.
                    </Text>
                    <TouchableOpacity
                        style={styles.googleInfoButton}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.googleInfoButtonText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const handleChangePassword = async () => {
        if (!user || !user.email) {
            toast.error('Error', 'No authenticated user found');
            return;
        }

        if (!currentPassword) {
            toast.warning('Missing', 'Please enter your current password');
            return;
        }
        if (newPassword.length < 8) {
            toast.warning('Too short', 'New password must be at least 8 characters');
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.warning('Mismatch', 'New passwords do not match');
            return;
        }
        if (currentPassword === newPassword) {
            toast.warning('Same password', 'New password must be different from current');
            return;
        }

        setSaving(true);
        try {
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);

            toast.success('Done!', 'Password changed successfully');
            setTimeout(() => router.back(), 1200);
        } catch (error: unknown) {
            const code = isFirebaseError(error) ? error.code : '';
            if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
                toast.error('Wrong password', 'Current password is incorrect');
            } else if (code === 'auth/too-many-requests') {
                toast.error('Too many attempts', 'Please try again later');
            } else if (code === 'auth/requires-recent-login') {
                toast.error('Session expired', 'Please log out and log back in, then try again');
            } else {
                toast.error('Error', getErrorMessage(error));
            }
        } finally {
            setSaving(false);
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
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <ChevronLeft size={26} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Change Password</Text>
                    <View style={{ width: 40 }} />
                </View>

                <View style={styles.iconBanner}>
                    <View style={styles.iconCircle}>
                        <ShieldCheck size={36} color={AppColors.navy} />
                    </View>
                    <Text style={styles.bannerText}>Security</Text>
                    <Text style={styles.bannerSub}>
                        Enter your current password, then choose a strong new one.
                    </Text>
                </View>

                <View style={styles.form}>
                    <SecureInput
                        label="Current Password"
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                        placeholder="Enter current password"
                    />

                    <SecureInput
                        label="New Password"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholder="At least 8 characters"
                        showStrength={true}
                        helperText="Use uppercase letters, numbers, and symbols for a stronger password."
                    />

                    <SecureInput
                        label="Confirm New Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Repeat new password"
                        errorText={
                            confirmPassword.length > 0 && confirmPassword !== newPassword
                                ? 'Passwords do not match'
                                : undefined
                        }
                    />
                </View>

                <TouchableOpacity style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                    onPress={handleChangePassword}
                    disabled={saving}
                    activeOpacity={0.8}
                >
                    {saving ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.saveButtonText}>Update Password</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.backgroundLight,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 60,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'ios' ? 60 : 48,
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: AppColors.navy,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontFamily: AppFonts.bold,
        fontSize: 22,
        color: AppColors.navy,
    },
    googleInfoContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 36,
        paddingBottom: 60,
    },
    googleInfoIcon: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: '#F8FAFC',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        borderWidth: 1.5,
        borderColor: '#F1F5F9',
    },
    googleInfoTitle: {
        fontFamily: AppFonts.bold,
        fontSize: 22,
        color: AppColors.navy,
        marginBottom: 12,
    },
    googleInfoText: {
        fontFamily: AppFonts.medium,
        fontSize: 15,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
    },
    googleInfoButton: {
        backgroundColor: AppColors.navy,
        borderRadius: 20,
        paddingVertical: 16,
        paddingHorizontal: 48,
        alignItems: 'center',
    },
    googleInfoButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: AppFonts.bold,
        letterSpacing: 0.5,
    },
    iconBanner: {
        alignItems: 'center',
        paddingBottom: 28,
        paddingHorizontal: 32,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        borderWidth: 1.5,
        borderColor: '#F1F5F9',
    },
    bannerText: {
        fontFamily: AppFonts.bold,
        fontSize: 24,
        color: AppColors.navy,
        marginBottom: 8,
    },
    bannerSub: {
        fontFamily: AppFonts.regular,
        fontSize: 15,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 22,
    },
    form: {
        paddingHorizontal: 24,
        paddingTop: 16,
        gap: 32,
    },
    saveButton: {
        marginHorizontal: 24,
        marginTop: 48,
        backgroundColor: AppColors.navy,
        borderRadius: 20,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonDisabled: {
        opacity: 0.6,
    },
    saveButtonText: {
        fontFamily: AppFonts.bold,
        color: '#fff',
        fontSize: 17,
        letterSpacing: 1,
    },
});
