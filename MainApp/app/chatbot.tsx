import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    KeyboardAvoidingView, Platform, FlatList, ActivityIndicator,
    ScrollView, Pressable, Keyboard
} from 'react-native';
import { useRouter, Stack, useFocusEffect } from 'expo-router';
import { ChevronLeft, Send, ChefHat } from 'lucide-react-native';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';
import { initOrRestoreChat, sendMessageToGroq, getUIMessages } from '@/services/groq';
import { UIMessage } from '@/types/common';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { db } from '@/config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { z } from 'zod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AIConsentModal from '@/components/modals/AIConsentModal';
import { BouncingDots } from '@/components/ui/BouncingDots';
import { ChatMessage } from '@/components/ui/ChatMessage';
import Animated, {
    FadeInLeft,
    FadeInRight,
} from 'react-native-reanimated';

const DEFAULT_SUGGESTIONS = [
    "What's good to eat today? \nวันนี้กินอะไรดี",
    "What can I ask you? \nฉันสามารถถามเรื่องอะไรได้บ้าง",
    "Recommend popular dishes this week \nแนะนำเมนูยอดฮิตประจำสัปดาห์",
    "Help design a breakfast menu \nช่วยออกแบบเมนูอาหารเช้าหน่อย"
];

export default function ChatbotScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [initializing, setInitializing] = useState(true);
    const [messages, setMessages] = useState<UIMessage[]>([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>(DEFAULT_SUGGESTIONS);
    const [lastNewMessageId, setLastNewMessageId] = useState<string | null>(null);
    const [consentVisible, setConsentVisible] = useState(false);

    const flatListRef = useRef<FlatList>(null);

    useFocusEffect(
        useCallback(() => {
            return () => {
                setLastNewMessageId(null);
            };
        }, [])
    );
    useEffect(() => {
        const initChat = async () => {
            try {
                const uiMessages = getUIMessages();

                if (uiMessages.length > 0) {
                    setMessages([...uiMessages]);
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
                    if (Array.isArray(data.suggestions)) setSuggestedPrompts(data.suggestions);
                }

                initOrRestoreChat(sysInstruction, initMessageText);
                setMessages([...getUIMessages()]);
            } catch (error) {
                const defaultInitMsg = 'Loading message...';
                initOrRestoreChat(undefined, defaultInitMsg);
                setMessages([...getUIMessages()]);
            } finally {
                setInitializing(false);
            }
        };

        const checkConsent = async () => {
            try {
                const hasConsented = await AsyncStorage.getItem('ai_consent');
                if (hasConsented !== 'true') {
                    setConsentVisible(true);
                } else {
                    initChat();
                }
            } catch (err) {
                setConsentVisible(true);
            }
        };

        checkConsent();
    }, []);

    const handleAcceptConsent = async () => {
        await AsyncStorage.setItem('ai_consent', 'true');
        setConsentVisible(false);
        router.replace('/chatbot');
    };

    const handleDeclineConsent = () => {
        setConsentVisible(false);
        router.back();
    };

    const ChatInputSchema = z.string().min(1).max(500);

    const sendMessage = async (overrideText?: string) => {
        const textToValidate = (overrideText || inputText).trim();
        const validation = ChatInputSchema.safeParse(textToValidate);

        if (!validation.success || loading) return;
        const validText = validation.data;

        const userMsg: UIMessage = { id: Date.now().toString(), text: validText, isUser: true };

        const uiMessages = getUIMessages();
        uiMessages.push(userMsg);
        setMessages([...uiMessages]);

        setInputText('');
        setLoading(true);

        try {
            const responseText = await sendMessageToGroq(validText);

            const aiMsg: UIMessage = { id: (Date.now() + 1).toString(), text: responseText, isUser: false };
            const uiMessages = getUIMessages();
            uiMessages.push(aiMsg);
            setLastNewMessageId(aiMsg.id);
            setMessages([...uiMessages]);
        } catch (error: unknown) {
            if (__DEV__) {
                console.log("[DEV_ONLY] Chatbot API error:", error instanceof Error ? error.message : error);
            }
            const errorMsg: UIMessage = {
                id: (Date.now() + 1).toString(),
                text: `I'm having trouble connecting to the kitchen right now. Please try again!`,
                isUser: false,
            };
            const uiMessages = getUIMessages();
            uiMessages.push(errorMsg);
            setMessages([...uiMessages]);
        } finally {
            setLoading(false);
        }
    };

    const handleSuggestion = (prompt: string) => {
        sendMessage(prompt);
    };

    const renderMessage = ({ item }: { item: UIMessage }) => {
        const isNew = item.id === lastNewMessageId;
        const isLatestAI = !item.isUser && isNew;

        return (
            <ChatMessage
                item={item}
                isNew={isNew}
                isLatestAI={isLatestAI}
            />
        );
    };

    const showSuggestions = messages.length <= 1 && !loading;

    return (
        <View style={styles.root}>
            <Stack.Screen options={{ headerShown: false }} />
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <ChevronLeft size={28} color={AppColors.navy} />
                    </TouchableOpacity>
                    <View style={styles.headerTitleContainer}>
                        <ChefHat size={22} color={AppColors.primary} />
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
                            onContentSizeChange={() => {
                                flatListRef.current?.scrollToEnd({ animated: true });
                            }}
                            onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
                            keyboardDismissMode="on-drag"
                            keyboardShouldPersistTaps="handled"
                            removeClippedSubviews={Platform.OS === 'android'}
                            initialNumToRender={15}
                            maxToRenderPerBatch={10}
                            windowSize={10}
                        />

                        {loading && (
                            <View style={styles.typingIndicatorWrapper}>
                                <View style={styles.aiAvatarSmall}>
                                    <ChefHat size={10} color="#fff" />
                                </View>
                                <BouncingDots />
                                <Text style={styles.typingText}>Chef is cooking your answer...</Text>
                            </View>
                        )}

                        {showSuggestions && (
                            <View style={styles.suggestionsWrapper}>
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={styles.suggestionsScrollContent}
                                >
                                    {suggestedPrompts.map((prompt, idx) => (
                                        <TouchableOpacity
                                            key={idx}
                                            style={styles.suggestionChip}
                                            onPress={() => handleSuggestion(prompt)}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={styles.suggestionText}>{prompt}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
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
                                    onPress={() => sendMessage()}
                                    disabled={!inputText.trim() || loading}
                                >
                                    <Send size={18} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </>
                )}
            </KeyboardAvoidingView>

            <AIConsentModal
                visible={consentVisible}
                onAccept={handleAcceptConsent}
                onDecline={handleDeclineConsent}
            />
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
        paddingBottom: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        zIndex: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 3,
    },
    backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
    headerTitleContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    headerTitle: { fontFamily: AppFonts.bold, fontSize: 18, color: AppColors.navy },

    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: {
        fontFamily: AppFonts.regular,
        marginTop: 16,
        color: '#64748B',
        fontSize: 15
    },

    chatContainer: { padding: 16, paddingBottom: 24 },

    typingIndicatorWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 24,
        paddingBottom: 16
    },
    aiAvatarSmall: {
        width: 20, height: 20, borderRadius: 10,
        backgroundColor: AppColors.navy,
        justifyContent: 'center', alignItems: 'center'
    },
    typingText: {
        fontFamily: AppFonts.medium,
        fontSize: 13,
        color: '#64748B',
        marginLeft: 4
    },

    suggestionsWrapper: { paddingVertical: 12 },
    suggestionsScrollContent: { paddingHorizontal: 16, gap: 10 },
    suggestionChip: {
        backgroundColor: '#fff',
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: '#F1F1F1',
    },
    suggestionText: {
        fontFamily: AppFonts.bold,
        fontSize: 13,
        color: AppColors.primary,
        letterSpacing: 0.3,
    },

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
        backgroundColor: '#f8f9fa',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 6,
        minHeight: 50,
        maxHeight: 120,
        borderWidth: 1,
        borderColor: '#eee',
    },
    input: {
        fontFamily: AppFonts.regular,
        flex: 1,
        fontSize: 15,
        color: AppColors.navy,
        paddingTop: 8,
        paddingBottom: 8,
        marginRight: 10,
    },
    sendBtn: {
        width: 38, height: 38, borderRadius: 19,
        backgroundColor: AppColors.primary,
        justifyContent: 'center', alignItems: 'center',
        marginBottom: 4,
    },
    sendBtnDisabled: { backgroundColor: '#eee' },
});