import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    Modal,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Animated,
    Dimensions,
} from 'react-native';
import { X, Mail, Send } from 'lucide-react-native';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface AddFriendModalProps {
    visible: boolean;
    onClose: () => void;
    emailInput: string;
    setEmailInput: (text: string) => void;
    sending: boolean;
    onSend: () => void;
}

export default function AddFriendModal({
    visible,
    onClose,
    emailInput,
    setEmailInput,
    sending,
    onSend,
}: AddFriendModalProps) {
    const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const backdropOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(backdropOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    useNativeDriver: true,
                    bounciness: 0,
                    speed: 12,
                })
            ]).start();
        } else {
            backdropOpacity.setValue(0);
            slideAnim.setValue(SCREEN_HEIGHT);
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            animationType="none"
            transparent={true}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                style={styles.root}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <Animated.View style={[styles.overlay, { opacity: backdropOpacity }]}>
                    <TouchableOpacity
                        style={StyleSheet.absoluteFill}
                        activeOpacity={1}
                        onPress={onClose}
                    />
                </Animated.View>

                <Animated.View 
                    style={[
                        styles.modalContent,
                        { transform: [{ translateY: slideAnim }] }
                    ]}
                >
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Add Friend</Text>
                        <TouchableOpacity
                            style={styles.modalCloseButton}
                            onPress={onClose}
                            activeOpacity={0.6}
                        >
                            <X size={22} color="#444" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.modalSubtitle}>
                        Enter your friend's email address to send them a friend request
                    </Text>

                    <View style={styles.emailInputContainer}>
                        <Mail size={20} color="#888" />
                        <TextInput
                            style={styles.emailInput}
                            placeholder="your friend's email"
                            placeholderTextColor="#aaa"
                            value={emailInput}
                            onChangeText={setEmailInput}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            editable={!sending}
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.sendButton, sending && styles.sendButtonDisabled]}
                        onPress={onSend}
                        disabled={sending}
                        activeOpacity={0.7}
                    >
                        {sending ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <>
                                <Send size={18} color="#fff" />
                                <Text style={styles.sendButtonText}>Send Request</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </Animated.View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: AppColors.backgroundLight,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 24,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 20,
        paddingBottom: 4,
    },
    modalTitle: {
        fontFamily: AppFonts.bold,
        fontSize: 22,
        color: AppColors.navy,
    },
    modalCloseButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.06)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalSubtitle: {
        fontFamily: AppFonts.regular,
        fontSize: 14,
        color: '#888',
        marginBottom: 20,
        lineHeight: 20,
    },
    emailInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 4,
        gap: 12,
        borderWidth: 1.5,
        borderColor: '#ddd',
        marginBottom: 16,
    },
    emailInput: {
        fontFamily: AppFonts.regular,
        flex: 1,
        fontSize: 16,
        paddingVertical: 14,
        color: AppColors.navy,
    },
    sendButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: AppColors.primary,
        paddingVertical: 16,
        borderRadius: 14,
        marginBottom: 8,
    },
    sendButtonDisabled: {
        opacity: 0.6,
    },
    sendButtonText: {
        fontFamily: AppFonts.bold,
        fontSize: 16,
        color: '#fff',
    },
});
