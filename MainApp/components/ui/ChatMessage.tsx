import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Animated, { FadeInLeft, FadeInRight } from 'react-native-reanimated';
import { ChefHat } from 'lucide-react-native';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';
import { UIMessage } from '@/types/common';
import { TypewriterText } from './TypewriterText';
import { ChatMessageProps } from '@/types/chatbot';

export const ChatMessage = ({ item, isNew, isLatestAI }: ChatMessageProps) => {
    const isUser = item.isUser;

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

const styles = StyleSheet.create({
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
});
