import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Pressable, ActivityIndicator } from 'react-native';
import { UserMinus } from 'lucide-react-native';
import { AppFonts, AppLayout } from '@/constants/theme';
import { AppColors } from '@/constants/colors';
import { DeleteFriendModalProps } from '@/types/modals';

export default function DeleteFriendModal({ visible, onClose, onConfirm, friendName, loading }: DeleteFriendModalProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <Pressable style={styles.backdrop} onPress={onClose} />
                <View style={styles.modalView}>
                    <View style={styles.iconContainer}>
                        <UserMinus size={32} color={AppColors.primary} />
                    </View>
                    
                    <Text style={styles.title}>Remove Friend</Text>
                    
                    <Text style={styles.message}>
                        Are you sure you want to remove <Text style={styles.boldText}>{friendName}</Text> from your friends list?
                        {"\n"}This action cannot be undone.
                    </Text>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity 
                            style={styles.cancelButton} 
                            onPress={onClose}
                            disabled={loading}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.confirmButton} 
                            onPress={onConfirm}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={styles.confirmText}>Remove</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    modalView: {
        width: '100%',
        maxWidth: 340,
        backgroundColor: 'white',
        borderRadius: AppLayout.radius.xl,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(230, 57, 70, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontFamily: AppFonts.bold,
        fontSize: 20,
        color: AppColors.navy,
        marginBottom: 8,
    },
    message: {
        fontFamily: AppFonts.regular,
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    boldText: {
        fontFamily: AppFonts.bold,
        color: AppColors.navy,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 14,
        backgroundColor: '#F1F5F9',
        borderRadius: AppLayout.radius.lg,
        alignItems: 'center',
    },
    cancelText: {
        fontFamily: AppFonts.bold,
        color: AppColors.navy,
        fontSize: 16,
    },
    confirmButton: {
        flex: 1,
        paddingVertical: 14,
        backgroundColor: AppColors.primary,
        borderRadius: AppLayout.radius.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    confirmText: {
        fontFamily: AppFonts.bold,
        color: 'white',
        fontSize: 16,
    },
});
