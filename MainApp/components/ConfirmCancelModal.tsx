import React from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { UserMinus } from 'lucide-react-native';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';

interface ConfirmCancelModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    userName: string;
    loading?: boolean;
}

const ConfirmCancelModal = ({
    visible,
    onClose,
    onConfirm,
    userName,
    loading,
}: ConfirmCancelModalProps) => {
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
                        <UserMinus size={32} color={AppColors.warning} />
                    </View>

                    <Text style={styles.title}>Cancel Request?</Text>
                    <Text style={styles.subtitle}>
                        Are you sure you want to cancel your friend request to <Text style={styles.boldText}>{userName}</Text>?
                    </Text>

                    <View style={styles.buttons}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={onClose}
                            disabled={loading}
                        >
                            <Text style={styles.cancelText}>Keep Request</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.confirmButton, { backgroundColor: AppColors.warning }]}
                            onPress={onConfirm}
                            disabled={loading}
                            activeOpacity={0.7}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={styles.confirmText}>Yes, Cancel</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
};

export default ConfirmCancelModal;

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
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
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
        color: '#666',
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
        borderWidth: 2,
        borderColor: '#f0f0f0',
        alignItems: 'center',
    },
    cancelText: {
        fontFamily: AppFonts.bold,
        fontSize: 14,
        color: '#888',
    },
    confirmButton: {
        flex: 1.2,
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    confirmText: {
        fontFamily: AppFonts.bold,
        fontSize: 14,
        color: '#fff',
    },
});
