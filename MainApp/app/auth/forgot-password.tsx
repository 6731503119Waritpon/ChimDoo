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
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '@/components/ToastProvider';
import { ArrowLeft } from 'lucide-react-native';
import { AppColors } from '@/constants/colors';

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

        try {
            await resetPassword(email);
            setEmailSent(true);
        } catch (err: any) {
            toast.error('Error', err.message || 'Failed to send reset email');
        }
    };

    if (emailSent) {
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.successContainer}>
                        <Text style={styles.successTitle}>Check Your Email</Text>
                        <Text style={styles.successText}>
                            We've sent a password reset link to {email}
                        </Text>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => router.push('/auth/login')}
                        >
                            <Text style={styles.buttonText}>Back to Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.content}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <ArrowLeft size={22} color={AppColors.navy} />
                </TouchableOpacity>

                <View style={styles.header}>
                    <Text style={styles.title}>Forgot Password?</Text>
                    <Text style={styles.subtitle}>
                        Enter your email and we'll send you a reset link
                    </Text>
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

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleResetPassword}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Send Reset Link</Text>
                        )}
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.warningText}>Warning: This system is still under development, so a password recovery feature is not yet available.</Text>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.backgroundLight,
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
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
    header: {
        alignItems: 'center',
        marginBottom: 48,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    form: {
        marginBottom: 32,
    },
    inputContainer: {
        marginBottom: 24,
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
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    successContainer: {
        alignItems: 'center',
    },
    successIcon: {
        fontSize: 80,
        marginBottom: 24,
    },
    successTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    successText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 32,
        paddingHorizontal: 20,
    },
    warningText: {
        fontSize: 12,
        color: '#ff0000ff',
        textAlign: 'center',
        marginTop: 32,
        paddingHorizontal: 20,
    },
});