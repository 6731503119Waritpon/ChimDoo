import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';

interface ConfirmCommentDeleteModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    loading?: boolean;
}

const ConfirmCommentDeleteModal = ({
    visible,
    onClose,
    onConfirm,
    loading,
}: ConfirmCommentDeleteModalProps) => {
    if (!visible) return null;

    return (
        <View style={styles.overlay}>
            <TouchableOpacity
                style={styles.backdrop}
                activeOpacity={1}
                onPress={onClose}
            />
            <View style={styles.modal}>
                <View style={styles.iconWrapper}>
                    <Trash2 size={32} color={AppColors.primary} />
                </View>

                <Text style={styles.title}>Delete Comment?</Text>
                <Text style={styles.subtitle}>
                    Are you sure you want to delete this comment? This action cannot be undone.
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
            </View>
        </View>
    );
};

export default ConfirmCommentDeleteModal;

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
        zIndex: 999,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modal: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 28,
        width: '100%',
        maxWidth: 340,
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 15,
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
