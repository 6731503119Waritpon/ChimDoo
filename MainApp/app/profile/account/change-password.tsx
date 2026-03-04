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
import { ChevronLeft, Eye, EyeOff, Lock, ShieldCheck, AlertCircle } from 'lucide-react-native';
import {
    reauthenticateWithCredential,
    EmailAuthProvider,
    updatePassword,
} from 'firebase/auth';
import { useAuth } from '../../../hooks/useAuth';
import { useToast } from '@/components/ToastProvider';

export default function ChangePasswordScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const toast = useToast();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [saving, setSaving] = useState(false);

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

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

    const strength = getStrength(newPassword);
    const isGoogleOnlyUser =
        (user?.providerData ?? []).length > 0 &&
        (user?.providerData ?? []).every((p) => p.providerId === 'google.com');

    if (isGoogleOnlyUser) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <ChevronLeft size={28} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Change Password</Text>
                    <View style={{ width: 40 }} />
                </View>
                <View style={styles.googleInfoContainer}>
                    <View style={styles.googleInfoIcon}>
                        <AlertCircle size={40} color="#E63946" />
                    </View>
                    <Text style={styles.googleInfoTitle}>Not Available</Text>
                    <Text style={styles.googleInfoText}>
                        Your account is linked to Google Sign-In. Password management is handled by Google
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
        } catch (error: any) {
            const code = error?.code || '';
            if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
                toast.error('Wrong password', 'Current password is incorrect');
            } else if (code === 'auth/too-many-requests') {
                toast.error('Too many attempts', 'Please try again later');
            } else if (code === 'auth/requires-recent-login') {
                toast.error('Session expired', 'Please log out and log back in, then try again');
            } else {
                toast.error('Error', error.message || 'Failed to change password');
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
                        <ChevronLeft size={28} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Change Password</Text>
                    <View style={{ width: 40 }} />
                </View>

                <View style={styles.iconBanner}>
                    <View style={styles.iconCircle}>
                        <ShieldCheck size={36} color="#1D3557" />
                    </View>
                    <Text style={styles.bannerText}>Keep your account secure</Text>
                    <Text style={styles.bannerSub}>
                        Enter your current password, then choose a strong new one.
                    </Text>
                </View>

                <View style={styles.form}>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Current Password</Text>
                        <View style={styles.inputRow}>
                            <Lock size={18} color="#999" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter current password"
                                placeholderTextColor="#aaa"
                                value={currentPassword}
                                onChangeText={setCurrentPassword}
                                secureTextEntry={!showCurrent}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
                                {showCurrent
                                    ? <EyeOff size={20} color="#888" />
                                    : <Eye size={20} color="#888" />
                                }
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>New Password</Text>
                        <View style={styles.inputRow}>
                            <Lock size={18} color="#999" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="At least 8 characters"
                                placeholderTextColor="#aaa"
                                value={newPassword}
                                onChangeText={setNewPassword}
                                secureTextEntry={!showNew}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                                {showNew
                                    ? <EyeOff size={20} color="#888" />
                                    : <Eye size={20} color="#888" />
                                }
                            </TouchableOpacity>
                        </View>

                        {newPassword.length > 0 && (
                            <View style={styles.strengthWrapper}>
                                <View style={styles.strengthBars}>
                                    {[1, 2, 3, 4].map((n) => (
                                        <View
                                            key={n}
                                            style={[
                                                styles.strengthBar,
                                                { backgroundColor: n <= strength.level ? strength.color : '#e5e7eb' },
                                            ]}
                                        />
                                    ))}
                                </View>
                                <Text style={[styles.strengthLabel, { color: strength.color }]}>
                                    {strength.label}
                                </Text>
                            </View>
                        )}

                        <Text style={styles.helperText}>
                            Use uppercase letters, numbers, and symbols for a stronger password.
                        </Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Confirm New Password</Text>
                        <View style={[
                            styles.inputRow,
                            confirmPassword.length > 0 && confirmPassword !== newPassword
                                ? styles.inputRowError
                                : null,
                        ]}>
                            <Lock size={18} color="#999" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Repeat new password"
                                placeholderTextColor="#aaa"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showConfirm}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                                {showConfirm
                                    ? <EyeOff size={20} color="#888" />
                                    : <Eye size={20} color="#888" />
                                }
                            </TouchableOpacity>
                        </View>
                        {confirmPassword.length > 0 && confirmPassword !== newPassword && (
                            <Text style={styles.errorText}>Passwords do not match</Text>
                        )}
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.saveButton, saving && styles.saveButtonDisabled]}
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
        backgroundColor: '#F8F9FA',
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
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: '#1D3557',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
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
        backgroundColor: 'rgba(230, 57, 70, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    googleInfoTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1D3557',
        marginBottom: 12,
    },
    googleInfoText: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
    },
    googleInfoLink: {
        color: '#1D3557',
        fontWeight: '600',
    },
    googleInfoButton: {
        backgroundColor: '#1D3557',
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 40,
        alignItems: 'center',
    },
    googleInfoButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    iconBanner: {
        alignItems: 'center',
        backgroundColor: '#1D3557',
        paddingBottom: 36,
        paddingHorizontal: 32,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        shadowColor: '#1D3557',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 8,
    },
    bannerText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 6,
    },
    bannerSub: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.65)',
        textAlign: 'center',
        lineHeight: 20,
    },

    form: {
        paddingHorizontal: 24,
        paddingTop: 32,
        gap: 24,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 13,
        fontWeight: '700',
        color: '#555',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(29, 53, 87, 0.12)',
        paddingHorizontal: 14,
        paddingVertical: 4,
        shadowColor: '#1D3557',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 3,
    },
    inputRowError: {
        borderColor: '#E63946',
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 14,
        color: '#1a1a1a',
    },

    strengthWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 6,
    },
    strengthBars: {
        flexDirection: 'row',
        gap: 4,
        flex: 1,
    },
    strengthBar: {
        flex: 1,
        height: 4,
        borderRadius: 2,
    },
    strengthLabel: {
        fontSize: 12,
        fontWeight: '700',
        width: 48,
        textAlign: 'right',
    },
    helperText: {
        fontSize: 12,
        color: '#888',
        lineHeight: 18,
    },
    errorText: {
        fontSize: 12,
        color: '#E63946',
        fontWeight: '500',
    },
    saveButton: {
        marginHorizontal: 24,
        marginTop: 40,
        backgroundColor: '#E63946',
        borderRadius: 14,
        padding: 18,
        alignItems: 'center',
        shadowColor: '#E63946',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    saveButtonDisabled: {
        opacity: 0.6,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '700',
    },
});
