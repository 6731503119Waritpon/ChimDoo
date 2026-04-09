import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { AppFonts, AppLayout } from '@/constants/theme';
import { AppColors } from '@/constants/colors';
import { ShieldCheck, Info } from 'lucide-react-native';
import { AIConsentModalProps } from '@/types/modals';

const AIConsentModal = ({ visible, onAccept, onDecline }: AIConsentModalProps) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onDecline}
        >
            <View style={styles.overlay}>
                <View style={styles.modalView}>
                    <View style={styles.header}>
                        <View style={styles.iconContainer}>
                            <ShieldCheck size={28} color={AppColors.primary} />
                        </View>
                        <Text style={styles.title}>AI Chatbot Consent</Text>
                    </View>

                    <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
                        <Text style={styles.message}>
                            To provide you with culinary inspiration, ChimDoo uses external AI services (Groq AI) to process your chat messages.
                        </Text>
                        
                        <View style={styles.alertBox}>
                            <Info size={18} color="#0369A1" style={{ marginTop: 2 }} />
                            <Text style={styles.alertText}>
                                Please do not share sensitive personal information (such as serious medical conditions or exact addresses) with the Chef.
                            </Text>
                        </View>
                        
                        <Text style={styles.message}>
                            By proceeding, you agree that your messages will be sent to our AI providers strictly for generating recipes and food recommendations.
                        </Text>
                    </ScrollView>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onDecline} activeOpacity={0.7}>
                            <Text style={styles.cancelText}>Opt-out (Go Back)</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.confirmButton} onPress={onAccept} activeOpacity={0.7}>
                            <Text style={styles.confirmText}>I Understand & Agree</Text>
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalView: {
        backgroundColor: 'white',
        borderTopLeftRadius: AppLayout.radius.xl,
        borderTopRightRadius: AppLayout.radius.xl,
        padding: 24,
        paddingBottom: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
        maxHeight: '80%',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 12,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(249, 115, 22, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontFamily: AppFonts.bold,
        fontSize: 20,
        color: AppColors.navy,
    },
    contentContainer: {
        marginBottom: 24,
    },
    message: {
        fontFamily: AppFonts.regular,
        fontSize: 15,
        color: '#475569',
        lineHeight: 22,
        marginBottom: 12,
    },
    alertBox: {
        flexDirection: 'row',
        backgroundColor: '#F0F9FF',
        borderWidth: 1,
        borderColor: '#BAE6FD',
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
        gap: 10,
        alignItems: 'flex-start',
    },
    alertText: {
        flex: 1,
        fontFamily: AppFonts.medium,
        fontSize: 13,
        color: '#0369A1',
        lineHeight: 18,
    },
    buttonContainer: {
        flexDirection: 'column',
        gap: 12,
        width: '100%',
    },
    cancelButton: {
        paddingVertical: 14,
        backgroundColor: 'transparent',
        borderRadius: AppLayout.radius.lg,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    cancelText: {
        fontFamily: AppFonts.bold,
        color: '#64748B',
        fontSize: 15,
    },
    confirmButton: {
        paddingVertical: 14,
        backgroundColor: AppColors.primary,
        borderRadius: AppLayout.radius.lg,
        alignItems: 'center',
    },
    confirmText: {
        fontFamily: AppFonts.bold,
        color: 'white',
        fontSize: 15,
    },
});

export default AIConsentModal;
