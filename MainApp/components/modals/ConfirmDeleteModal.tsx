import React from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';

interface ConfirmDeleteModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    foodName: string;
    loading?: boolean;
}

const ConfirmDeleteModal = ({
    visible,
    onClose,
    onConfirm,
    foodName,
    loading,
}: ConfirmDeleteModalProps) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <TouchableOpacity
                    style={styles.modal}
                    activeOpacity={1}
                    onPress={() => { }}
                >
                    <View style={styles.iconWrapper}>
                        <Trash2 size={32} color={AppColors.primary} />
                    </View>

                    <Text style={styles.title}>Delete Review?</Text>
                    <Text style={styles.subtitle}>
                        Are you sure you want to delete the review <Text style={styles.boldText}>{foodName}</Text>? This action cannot be undone.
                    </Text>

                    <View style={styles.buttons}>
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
                            activeOpacity={0.7}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={styles.confirmText}>Delete</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
};

export default ConfirmDeleteModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    modal: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 28,
        width: '100%',
        maxWidth: 360,
        alignItems: 'center',
    },
    iconWrapper: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: 'rgba(230, 57, 70, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    title: {
        fontFamily: AppFonts.bold,
        fontSize: 22,
        color: AppColors.navy,
        marginBottom: 8,
    },
    subtitle: {
        fontFamily: AppFonts.regular,
        fontSize: 15,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 28,
    },
    boldText: {
        fontFamily: AppFonts.bold,
        color: AppColors.navy,
    },
    buttons: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelText: {
        fontFamily: AppFonts.bold,
        fontSize: 15,
        color: '#94A3B8',
    },
    confirmButton: {
        flex: 1.2,
        paddingVertical: 14,
        borderRadius: 14,
        backgroundColor: AppColors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    confirmText: {
        fontFamily: AppFonts.bold,
        fontSize: 15,
        color: '#fff',
    },
});
