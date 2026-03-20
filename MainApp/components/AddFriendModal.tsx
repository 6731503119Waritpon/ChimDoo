import React from 'react';
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
} from 'react-native';
import { X, Mail, Send } from 'lucide-react-native';
import { AppColors } from '@/constants/colors';

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
    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                style={styles.modalOverlay}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <TouchableOpacity
                    style={{ flex: 1 }}
                    activeOpacity={1}
                    onPress={onClose}
                />
                <View style={styles.modalContent}>
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
                            placeholder="friend@example.com"
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
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
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
        fontSize: 22,
        fontWeight: '700',
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
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
});
