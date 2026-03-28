import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    KeyboardAvoidingView, Platform, FlatList, ActivityIndicator
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { ChevronLeft, Send, Sparkles } from 'lucide-react-native';
import { AppColors } from '@/constants/colors';
import { initOrRestoreChat, sendMessageToGroq, globalUIMessages, Message } from '@/services/groq';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { db } from '@/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export default function ChatbotScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [initializing, setInitializing] = useState(true);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);

    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        const initChat = async () => {
            try {
                if (globalUIMessages.length > 0) {
                    setMessages([...globalUIMessages]);
                    setInitializing(false);
                    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: false }), 50);
                    return;
                }

                const settingsRef = doc(db, 'settings', 'chatbot');
                const aiSettingsSnap = await getDoc(settingsRef);

                let sysInstruction = undefined;
                let initMessageText = 'Loading message...';

                if (aiSettingsSnap.exists()) {
                    const data = aiSettingsSnap.data();
                    if (data.initialMessage) initMessageText = data.initialMessage;
                    if (data.systemInstruction) sysInstruction = data.systemInstruction;
                }

                initOrRestoreChat(sysInstruction, initMessageText);
                setMessages([...globalUIMessages]);
            } catch (error) {
                console.warn("Failed to init chat settings from Firebase", error);
                const defaultInitMsg = 'Loading message...';
                initOrRestoreChat(undefined, defaultInitMsg);
                setMessages([...globalUIMessages]);
            } finally {
                setInitializing(false);
            }
        };

        initChat();
    }, []);

    const sendMessage = async () => {
        const text = inputText.trim();
        if (!text || loading) return;

        const userMsg: Message = { id: Date.now().toString(), text, isUser: true };

        globalUIMessages.push(userMsg);
        setMessages([...globalUIMessages]);

        setInputText('');
        setLoading(true);

        try {
            const responseText = await sendMessageToGroq(text);

            const aiMsg: Message = { id: (Date.now() + 1).toString(), text: responseText, isUser: false };
            globalUIMessages.push(aiMsg);
            setMessages([...globalUIMessages]);
        } catch (error: any) {
            console.error("Groq Error:", error);
            const apiKeyPreview = process.env.EXPO_PUBLIC_GROQ_API_KEY ? `(Key length: ${process.env.EXPO_PUBLIC_GROQ_API_KEY.length})` : '(Key is EMPTY)';
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: `Error: ${error.message} ${apiKeyPreview}`,
                isUser: false,
            };
            globalUIMessages.push(errorMsg);
            setMessages([...globalUIMessages]);
        } finally {
            setLoading(false);
        }
    };

    const renderMessage = ({ item }: { item: Message }) => {
        const isUser = item.isUser;
        return (
            <View style={[styles.messageWrapper, isUser ? styles.messageWrapperUser : styles.messageWrapperAI]}>
                {!isUser && (
                    <View style={styles.aiAvatar}>
                        <Sparkles size={14} color="#fff" />
                    </View>
                )}
                <View style={[styles.messageBubble, isUser ? styles.messageUser : styles.messageAI]}>
                    <Text style={[styles.messageText, isUser ? styles.messageTextUser : styles.messageTextAI]}>
                        {item.text}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <View style={[styles.root, { paddingTop: insets.top }]}>
            <Stack.Screen options={{ headerShown: false }} />
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <ChevronLeft size={28} color={AppColors.navy} />
                    </TouchableOpacity>
                    <View style={styles.headerTitleContainer}>
                        <Sparkles size={20} color={AppColors.primary} />
                        <Text style={styles.headerTitle}>ChimDoo Chef</Text>
                    </View>
                    <View style={{ width: 40 }} />
                </View>

                {initializing ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={AppColors.primary} />
                        <Text style={styles.loadingText}>Loading chatbot...</Text>
                    </View>
                ) : (
                    <>
                        <FlatList
                            ref={flatListRef}
                            data={messages}
                            keyExtractor={item => item.id}
                            renderItem={renderMessage}
                            contentContainerStyle={styles.chatContainer}
                            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
                            onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
                        />

                        {loading && (
                            <View style={styles.typingIndicator}>
                                <ActivityIndicator size="small" color={AppColors.primary} />
                                <Text style={styles.typingText}>Chef is thinking...</Text>
                            </View>
                        )}

                        <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Type what you’re looking for…"
                                    placeholderTextColor="#999"
                                    value={inputText}
                                    onChangeText={setInputText}
                                    multiline
                                    maxLength={500}
                                />
                                <TouchableOpacity
                                    style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
                                    onPress={sendMessage}
                                    disabled={!inputText.trim() || loading}
                                >
                                    <Send size={18} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </>
                )}
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#f8f9fa' },
    keyboardView: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        zIndex: 10,
    },
    backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
    headerTitleContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    headerTitle: { fontSize: 18, fontWeight: '700', color: AppColors.navy },

    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 16, color: '#888', fontSize: 14 },

    chatContainer: { padding: 16, paddingBottom: 20 },

    messageWrapper: { 
        flexDirection: 'row', 
        marginBottom: 16, 
        alignItems: 'flex-end', 
        maxWidth: Platform.OS === 'web' ? '70%' : '88%' 
    },

    messageWrapperUser: { alignSelf: 'flex-end', justifyContent: 'flex-end' },
    messageWrapperAI: { alignSelf: 'flex-start' },

    aiAvatar: {
        width: 28, height: 28, borderRadius: 14,
        backgroundColor: AppColors.primary,
        justifyContent: 'center', alignItems: 'center',
        marginRight: 8,
    },

    messageBubble: { 
        paddingHorizontal: 16, 
        paddingVertical: 12, 
        borderRadius: 20,
        flexShrink: 1,
    },

    messageUser: {
        backgroundColor: AppColors.primary,
        borderBottomRightRadius: 4,
    },
    messageAI: {
        backgroundColor: '#fff',
        borderBottomLeftRadius: 4,
        borderWidth: 1, borderColor: '#eee',
    },

    messageText: { fontSize: 15, lineHeight: 22 },
    messageTextUser: { color: '#fff' },
    messageTextAI: { color: AppColors.textDark },

    typingIndicator: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 24, paddingBottom: 16 },
    typingText: { fontSize: 13, color: '#888', fontStyle: 'italic' },

    inputContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: '#f1f3f5',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 8,
        minHeight: 50,
        maxHeight: 120,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: AppColors.textDark,
        paddingTop: 8,
        paddingBottom: 8,
        marginRight: 10,
    },
    sendBtn: {
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: AppColors.primary,
        justifyContent: 'center', alignItems: 'center',
        marginBottom: 4,
    },
    sendBtnDisabled: { backgroundColor: '#ccc' },
});