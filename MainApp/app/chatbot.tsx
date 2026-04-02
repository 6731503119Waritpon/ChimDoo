import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    KeyboardAvoidingView, Platform, FlatList, ActivityIndicator,
    ScrollView, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import { useRouter, Stack, useFocusEffect } from 'expo-router';
import { ChevronLeft, Send, ChefHat } from 'lucide-react-native';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';
import { initOrRestoreChat, sendMessageToGroq, getUIMessages, Message } from '@/services/groq';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { db } from '@/config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Animated, {
    FadeInLeft,
    FadeInRight,
    withRepeat,
    withSequence,
    withTiming,
    useSharedValue,
    useAnimatedStyle,
    Layout
} from 'react-native-reanimated';

const BouncingDots = () => {
    const dot1 = useSharedValue(0);
    const dot2 = useSharedValue(0);
    const dot3 = useSharedValue(0);

    useEffect(() => {
        const animate = (v: { value: number }, _delay: number) => {
            v.value = withRepeat(
                withSequence(
                    withTiming(-6, { duration: 400 }),
                    withTiming(0, { duration: 400 })
                ),
                -1,
                true
            );
        };
        animate(dot1, 0);
        setTimeout(() => animate(dot2, 0), 200);
        setTimeout(() => animate(dot3, 0), 400);
    }, []);

    const s1 = useAnimatedStyle(() => ({ transform: [{ translateY: dot1.value }] }));
    const s2 = useAnimatedStyle(() => ({ transform: [{ translateY: dot2.value }] }));
    const s3 = useAnimatedStyle(() => ({ transform: [{ translateY: dot3.value }] }));

    return (
        <View style={styles.dotsWrapper}>
            <Animated.View style={[styles.dot, s1]} />
            <Animated.View style={[styles.dot, s2]} />
            <Animated.View style={[styles.dot, s3]} />
        </View>
    );
};

const isLeadingVowel = (char: string) => {
    if (!char) return false;
    const code = char.charCodeAt(0);
    return code >= 0x0E40 && code <= 0x0E44;
};

const isCombiningMark = (char: string) => {
    if (!char) return false;
    const code = char.charCodeAt(0);
    return (code === 0x0E31) || (code >= 0x0E34 && code <= 0x0E3A) || (code >= 0x0E47 && code <= 0x0E4E);
};

const segmentThaiText = (text: string) => {
    const segments: string[] = [];
    let i = 0;
    while (i < text.length) {
        let cluster = text[i];
        i++;
        if (isLeadingVowel(cluster) && i < text.length) {
            cluster += text[i];
            i++;
        }
        while (i < text.length && isCombiningMark(text[i])) {
            cluster += text[i];
            i++;
        }
        segments.push(cluster);
    }
    return segments;
};

const TypewriterText = ({ text, isLatest }: { text: string; isLatest: boolean }) => {
    const [displayedText, setDisplayedText] = useState(isLatest ? '' : text);

    useEffect(() => {
        if (!isLatest || displayedText === text) {
            if (!isLatest && displayedText !== text) {
                setDisplayedText(text);
            }
            return;
        }

        const segments = segmentThaiText(text);
        let index = segmentThaiText(displayedText).length;
        let currentString = displayedText;

        const interval = setInterval(() => {
            if (index < segments.length) {
                currentString += segments[index];
                setDisplayedText(currentString);
                index++;
            } else {
                clearInterval(interval);
            }
        }, 30);

        return () => clearInterval(interval);
    }, [text, isLatest]);

    return <Text style={styles.messageTextAI}>{displayedText}</Text>;
};

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
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>(DEFAULT_SUGGESTIONS);
    const [lastNewMessageId, setLastNewMessageId] = useState<string | null>(null);

    const flatListRef = useRef<FlatList>(null);

    useFocusEffect(
        React.useCallback(() => {
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
                console.warn("Failed to init chat settings from Firebase", error);
                const defaultInitMsg = 'Loading message...';
                initOrRestoreChat(undefined, defaultInitMsg);
                setMessages([...getUIMessages()]);
            } finally {
                setInitializing(false);
            }
        };

        initChat();
    }, []);

    const sendMessage = async (overrideText?: string) => {
        const text = (overrideText || inputText).trim();
        if (!text || loading) return;

        const userMsg: Message = { id: Date.now().toString(), text, isUser: true };

        const uiMessages = getUIMessages();
        uiMessages.push(userMsg);
        setMessages([...uiMessages]);

        setInputText('');
        setLoading(true);

        try {
            const responseText = await sendMessageToGroq(text);

            const aiMsg: Message = { id: (Date.now() + 1).toString(), text: responseText, isUser: false };
            const uiMessages = getUIMessages();
            uiMessages.push(aiMsg);
            setLastNewMessageId(aiMsg.id);
            setMessages([...uiMessages]);
        } catch (error: unknown) {
            console.error("Groq Error:", error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const apiKeyPreview = process.env.EXPO_PUBLIC_GROQ_API_KEY ? `(Key length: ${process.env.EXPO_PUBLIC_GROQ_API_KEY.length})` : '(Key is EMPTY)';
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: `Error: ${errorMessage} ${apiKeyPreview}`,
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

    const renderMessage = ({ item, index }: { item: Message, index: number }) => {
        const isUser = item.isUser;
        const isNew = item.id === lastNewMessageId;
        const isLatestAI = !isUser && isNew;

        return (
            <Animated.View
                entering={isNew ? (isUser ? FadeInRight.springify().damping(18) : FadeInLeft.springify().damping(18)) : undefined}
                style={[styles.messageWrapper, isUser ? styles.messageWrapperUser : styles.messageWrapperAI]}
            >
                {!isUser && (
                    <View style={styles.aiAvatar}>
                        <ChefHat size={14} color="#fff" />
                    </View>
                )}
                <View style={[styles.messageBubble, isUser ? styles.messageUser : styles.messageAI]}>
                    {isUser ? (
                        <Text style={[styles.messageText, styles.messageTextUser]}>
                            {item.text}
                        </Text>
                    ) : (
                        <TypewriterText text={item.text} isLatest={isLatestAI} />
                    )}
                </View>
            </Animated.View>
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
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <FlatList
                                ref={flatListRef}
                                data={messages}
                                keyExtractor={item => item.id}
                                renderItem={renderMessage}
                                contentContainerStyle={styles.chatContainer}
                                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                                onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
                                keyboardDismissMode="on-drag"
                            />
                        </TouchableWithoutFeedback>

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

    messageText: {
        fontFamily: AppFonts.regular,
        fontSize: 15,
        lineHeight: 22
    },
    messageTextUser: { color: '#fff' },
    messageTextAI: {
        fontFamily: AppFonts.regular,
        fontSize: 15,
        lineHeight: 22,
        color: AppColors.navy
    },

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
    dotsWrapper: { flexDirection: 'row', gap: 4, alignItems: 'center' },
    dot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: AppColors.primary },

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