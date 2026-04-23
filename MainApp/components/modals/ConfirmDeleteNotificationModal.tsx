import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AppFonts, AppLayout } from '@/constants/theme';
import { AppColors } from '@/constants/colors';
import { Trash2 } from 'lucide-react-native';
import { ConfirmDeleteNotificationModalProps } from '@/types/modals';

const ConfirmDeleteNotificationModal = ({ 
    visible, 
    onClose, 
    onConfirm, 
    loading = false 
}: ConfirmDeleteNotificationModalProps) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalView}>
                    <View style={styles.iconContainer}>
                        <Trash2 size={32} color={AppColors.primary} />
                    </View>
                    <Text style={styles.title}>Delete Notification?</Text>
                    <Text style={styles.message}>
                        Are you sure you want to remove this notification? This action cannot be undone.
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
                                <ActivityIndicator color="#fff" size="small" />
                            ) : (
                                <Text style={styles.confirmText}>Delete</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        width: '85%',
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
        lineHeight: 20,
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

export default ConfirmDeleteNotificationModal;
