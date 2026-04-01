import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Platform,
} from 'react-native';
import KeyboardAwareView from '@/components/KeyboardAwareView';
import { useRouter } from 'expo-router';
import { ChevronLeft, Mail, MessageSquare, User, Send } from 'lucide-react-native';
import { useAuth } from '../../../hooks/useAuth';
import { useToast } from '@/components/ToastProvider';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';

const SCRIPT_URL = process.env.EXPO_PUBLIC_CONTACT_SCRIPT_URL ?? '';

export default function ContactUsScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const toast = useToast();

    const [name, setName] = useState(user?.displayName ?? '');
    const [email, setEmail] = useState(user?.email ?? '');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);

    const handleSend = async () => {
        if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
            toast.warning('Missing Fields', 'Please fill in all fields');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.warning('Invalid Email', 'Please enter a valid email address');
            return;
        }

        setSending(true);
        try {
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name.trim(), email: email.trim(), subject: subject.trim(), message: message.trim() }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Message Sent!', "We'll get back to you as soon as possible.");
                setSubject('');
                setMessage('');
                setTimeout(() => router.back(), 1500);
            } else {
                throw new Error('Script returned error');
            }
        } catch (error: any) {
            toast.error('Failed to Send', 'Please try again or contact us directly by email.');
        } finally {
            setSending(false);
        }
    };

    return (
        <KeyboardAwareView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
        >
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <ChevronLeft size={26} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Contact Us</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.banner}>
                <View style={styles.bannerIconCircle}>
                    <Mail size={36} color={AppColors.navy} />
                </View>
                <Text style={styles.bannerTitle}>Get in Touch</Text>
                <Text style={styles.bannerSub}>
                    Have a question, feedback, or issue? We'd love to hear from you!
                </Text>
            </View>

            <View style={styles.form}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Your Name</Text>
                    <View style={styles.inputRow}>
                        <User size={18} color="#999" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your name"
                            placeholderTextColor="#aaa"
                            value={name}
                            onChangeText={setName}
                            autoCapitalize="words"
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Your Email</Text>
                    <View style={styles.inputRow}>
                        <Mail size={18} color="#999" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your email"
                            placeholderTextColor="#aaa"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Subject</Text>
                    <View style={styles.inputRow}>
                        <MessageSquare size={18} color="#999" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="What is this about?"
                            placeholderTextColor="#aaa"
                            value={subject}
                            onChangeText={setSubject}
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Message</Text>
                    <View style={[styles.inputRow, styles.messageRow]}>
                        <TextInput
                            style={[styles.input, styles.messageInput]}
                            placeholder="Write your message here..."
                            placeholderTextColor="#aaa"
                            value={message}
                            onChangeText={setMessage}
                            multiline
                            numberOfLines={5}
                            textAlignVertical="top"
                        />
                    </View>
                    <Text style={styles.charCount}>{message.length} characters</Text>
                </View>
            </View>

            <TouchableOpacity
                style={[styles.sendButton, sending && styles.sendButtonDisabled]}
                onPress={handleSend}
                disabled={sending}
                activeOpacity={0.8}
            >
                {sending ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <>
                        <Send size={18} color="#fff" />
                        <Text style={styles.sendButtonText}>Send Message</Text>
                    </>
                )}
            </TouchableOpacity>
        </KeyboardAwareView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
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
    banner: {
        alignItems: 'center',
        paddingBottom: 28,
        paddingHorizontal: 32,
    },
    bannerIconCircle: {
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
    bannerTitle: {
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
    inputGroup: {
        gap: 10,
    },
    label: {
        fontFamily: AppFonts.bold,
        fontSize: 10.5,
        color: '#64748B',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginLeft: 4,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: '#F1F5F9',
        paddingHorizontal: 16,
    },
    messageRow: {
        alignItems: 'flex-start',
        paddingTop: 4,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        fontFamily: AppFonts.bold,
        flex: 1,
        fontSize: 16,
        paddingVertical: 16,
        color: AppColors.navy,
    },
    messageInput: {
        minHeight: 150,
        textAlignVertical: 'top',
        paddingTop: 16,
    },
    charCount: {
        fontFamily: AppFonts.medium,
        fontSize: 12,
        color: '#94A3B8',
        textAlign: 'right',
        marginTop: 6,
        marginRight: 4,
    },
    sendButton: {
        marginHorizontal: 24,
        marginTop: 48,
        backgroundColor: AppColors.navy,
        borderRadius: 20,
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    sendButtonDisabled: {
        opacity: 0.6,
    },
    sendButtonText: {
        fontFamily: AppFonts.bold,
        color: '#fff',
        fontSize: 17,
        letterSpacing: 1,
    },
});
