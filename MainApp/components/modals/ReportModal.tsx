import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { AppFonts, AppLayout } from '@/constants/theme';
import { AppColors } from '@/constants/colors';
import { Flag, ShieldAlert } from 'lucide-react-native';

import { ReportModalProps } from '@/types/modals';

const REASONS = [
    'Spam or misleading',
    'Inappropriate content',
    'Hate speech or harassment',
    'Violence or harmful behavior',
    'Intellectual property violation',
    'Other',
];

const ReportModal = ({ visible, onClose, onConfirm, loading = false, type }: ReportModalProps) => {
    const [selectedReason, setSelectedReason] = useState<string | null>(null);

    const handleConfirm = () => {
        if (selectedReason) {
            onConfirm(selectedReason);
        }
    };

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
                        <ShieldAlert size={32} color={AppColors.primary} />
                    </View>
                    <Text style={styles.title}>Report {type === 'review' ? 'Review' : 'User'}</Text>
                    <Text style={styles.message}>
                        Help us understand what's wrong. Your report is anonymous.
                    </Text>

                    <ScrollView style={styles.reasonsList} showsVerticalScrollIndicator={false}>
                        {REASONS.map((reason) => (
                            <TouchableOpacity
                                key={reason}
                                style={[
                                    styles.reasonItem,
                                    selectedReason === reason && styles.selectedReasonItem
                                ]}
                                onPress={() => setSelectedReason(reason)}
                            >
                                <Text style={[
                                    styles.reasonText,
                                    selectedReason === reason && styles.selectedReasonText
                                ]}>{reason}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose} disabled={loading}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.confirmButton, !selectedReason && styles.disabledButton]} 
                            onPress={handleConfirm} 
                            disabled={loading || !selectedReason}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" size="small" />
                            ) : (
                                <Text style={styles.confirmText}>Submit Report</Text>
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
        width: '90%',
        maxHeight: '80%',
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
        marginBottom: 20,
        lineHeight: 20,
    },
    reasonsList: {
        width: '100%',
        marginBottom: 24,
    },
    reasonItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 8,
    },
    selectedReasonItem: {
        borderColor: AppColors.primary,
        backgroundColor: 'rgba(230, 57, 70, 0.05)',
    },
    reasonText: {
        fontFamily: AppFonts.medium,
        fontSize: 14,
        color: AppColors.navy,
    },
    selectedReasonText: {
        color: AppColors.primary,
        fontFamily: AppFonts.bold,
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
    disabledButton: {
        backgroundColor: '#CBD5E1',
    },
    confirmText: {
        fontFamily: AppFonts.bold,
        color: 'white',
        fontSize: 16,
    },
});

export default ReportModal;
