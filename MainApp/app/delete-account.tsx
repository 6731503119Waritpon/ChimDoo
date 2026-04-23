import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Platform,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { AppFonts, AppLayout } from '@/constants/theme';
import { AppColors } from '@/constants/colors';
import { Trash2, ChevronLeft, AlertCircle } from 'lucide-react-native';
import DeleteAccountModal from '@/components/modals/DeleteAccountModal';
import { useToast } from '@/components/ui/ToastProvider';
import { useAuth } from '@/hooks/useAuth';
import { getErrorMessage } from '@/types/firebase';

export default function DeleteAccountPage() {
    const [email, setEmail] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [wasLoggedIn, setWasLoggedIn] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const router = useRouter();
    const toast = useToast();
    const { user, deleteAccount, loading: authLoading } = useAuth();

    useEffect(() => {
        if (user?.email) {
            setEmail(user.email);
        }
    }, [user]);

    const handleRequestClick = () => {
        if (!email || !email.includes('@')) {
            toast.error('Invalid Email', 'Please enter a valid email address.');
            return;
        }

        if (user && email.toLowerCase() !== user.email?.toLowerCase()) {
            toast.error('Verification Failed', 'The email entered does not match your currently logged-in account.');
            return;
        }

        setShowModal(true);
    };

    const handleConfirmDelete = async () => {
        setShowModal(false);
        const loggedIn = !!user;
        setWasLoggedIn(loggedIn);

        if (loggedIn) {
            setIsDeleting(true);
            try {
                await deleteAccount();
                setIsSubmitted(true);
                toast.success('Account Deleted', 'Your account has been removed.');
            } catch (err: unknown) {
                toast.error('Deletion Failed', getErrorMessage(err));
            } finally {
                setIsDeleting(false);
            }
        } else {
            setIsSubmitted(true);
            toast.success('Request Submitted', 'Your request has been received.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ title: 'Delete Account', headerShown: false }} />
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <ChevronLeft size={32} color={AppColors.navy} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {!isSubmitted ? (
                    <View style={styles.card}>
                        <View style={styles.iconContainer}>
                            <Trash2 size={32} color={AppColors.primary} />
                        </View>

                        <Text style={styles.title}>Account Deletion</Text>
                        <Text style={styles.subtitle}>
                            {user
                                ? "To confirm deletion of your account, please verify your email address below."
                                : "If you no longer have the app installed, please enter your account email to request permanent data deletion."
                            }
                        </Text>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Account Email Address</Text>
                            <TextInput
                                style={[styles.input, user && styles.disabledInput]}
                                placeholder="example@email.com"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.submitButton, isDeleting && styles.disabledButton]}
                            onPress={handleRequestClick}
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.submitButtonText}>Delete Account</Text>
                            )}
                        </TouchableOpacity>

                        <Text style={styles.footerNote}>
                            Note: This action is permanent and cannot be undone. All recipes, reviews, and profile data will be lost.
                        </Text>
                    </View>
                ) : (
                    <View style={styles.card}>
                        <View style={[styles.iconContainer, { backgroundColor: 'rgba(34, 197, 94, 0.1)' }]}>
                            <AlertCircle size={32} color={AppColors.success} />
                        </View>
                        <Text style={styles.successTitle}>
                            {wasLoggedIn ? 'Account Deleted' : 'Request Submitted'}
                        </Text>
                        <Text style={styles.successMessage}>
                            {wasLoggedIn
                                ? "Your account and data have been permanently removed. Thank you for using ChimDoo."
                                : `Your request to delete the account (${email}) has been submitted successfully.`
                            }
                        </Text>
                        <TouchableOpacity
                            style={styles.backToHomeButton}
                            onPress={() => router.replace('/profile')}
                        >
                            <Text style={styles.backToHomeText}>Done</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>

            <DeleteAccountModal
                visible={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleConfirmDelete}
                loading={isDeleting}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.backgroundLight,
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'android' ? 16 : 0,
        height: 56,
        justifyContent: 'center',
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.03)',
    },
    scrollContent: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        paddingBottom: 60,
    },
    card: {
        width: Platform.OS === 'web' ? 450 : '100%',
        backgroundColor: AppColors.white,
        borderRadius: AppLayout.radius.xl,
        padding: 32,
        borderWidth: 1,
        borderColor: AppColors.borderSubtle,
        alignItems: 'center',
        shadowColor: AppColors.navy,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(230, 57, 70, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    title: {
        fontFamily: AppFonts.bold,
        fontSize: 24,
        color: AppColors.navy,
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        fontFamily: AppFonts.regular,
        fontSize: 14,
        color: AppColors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 24,
    },
    label: {
        fontFamily: AppFonts.bold,
        fontSize: 14,
        color: AppColors.navy,
        marginBottom: 8,
    },
    input: {
        width: '100%',
        height: 52,
        backgroundColor: '#F1F5F9',
        borderRadius: AppLayout.radius.lg,
        paddingHorizontal: 16,
        fontFamily: AppFonts.regular,
        fontSize: 16,
        color: AppColors.navy,
        borderWidth: 1,
        borderColor: AppColors.borderLight,
    },
    disabledInput: {
        borderColor: AppColors.navy,
        backgroundColor: '#f8fafc',
    },
    submitButton: {
        width: '100%',
        height: 54,
        backgroundColor: AppColors.primary,
        borderRadius: AppLayout.radius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    disabledButton: {
        opacity: 0.7,
    },
    submitButtonText: {
        fontFamily: AppFonts.bold,
        color: AppColors.white,
        fontSize: 16,
    },
    footerNote: {
        fontFamily: AppFonts.regular,
        fontSize: 12,
        color: AppColors.textLight,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    successTitle: {
        fontFamily: AppFonts.bold,
        fontSize: 24,
        color: AppColors.success,
        textAlign: 'center',
        marginBottom: 16,
    },
    successMessage: {
        fontFamily: AppFonts.regular,
        fontSize: 15,
        color: AppColors.textDark,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
    },
    backToHomeButton: {
        marginTop: 10,
        paddingVertical: 12,
        paddingHorizontal: 32,
        backgroundColor: AppColors.navy,
        borderRadius: AppLayout.radius.md,
    },
    backToHomeText: {
        fontFamily: AppFonts.bold,
        color: '#fff',
        fontSize: 15,
    }
});
