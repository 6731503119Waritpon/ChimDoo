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
import { ChevronLeft, Mail, MessageSquare, User, Send } from 'lucide-react-native';
import { useAuth } from '../../../hooks/useAuth';
import { useToast } from '@/components/ToastProvider';

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
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <ChevronLeft size={28} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Contact Us</Text>
                    <View style={{ width: 40 }} />
                </View>

                <View style={styles.banner}>
                    <View style={styles.bannerIconCircle}>
                        <Mail size={36} color="#1D3557" />
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
    banner: {
        alignItems: 'center',
        backgroundColor: '#1D3557',
        paddingBottom: 36,
        paddingHorizontal: 32,
    },
    bannerIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 8,
    },
    bannerTitle: {
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
        gap: 22,
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
    messageRow: {
        alignItems: 'flex-start',
        paddingTop: 12,
        paddingBottom: 12,
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
    messageInput: {
        minHeight: 120,
        paddingVertical: 0,
    },
    charCount: {
        fontSize: 12,
        color: '#aaa',
        textAlign: 'right',
    },
    sendButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginHorizontal: 24,
        marginTop: 36,
        backgroundColor: '#E63946',
        borderRadius: 14,
        padding: 18,
        shadowColor: '#E63946',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    sendButtonDisabled: {
        opacity: 0.6,
    },
    sendButtonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '700',
    },
});
