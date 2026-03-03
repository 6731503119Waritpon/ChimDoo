import React from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { AlertTriangle, X } from 'lucide-react-native';

interface Props {
    visible: boolean;
    onClose: () => void;
}

const ChimDooRequiredModal: React.FC<Props> = ({ visible, onClose }) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                        <X size={20} color="#999" />
                    </TouchableOpacity>

                    <View style={styles.iconWrapper}>
                        <AlertTriangle size={48} color="#F59E0B" />
                    </View>

                    <Text style={styles.title}>Taste First!</Text>
                    <Text style={styles.message}>
                        You need to tap "Chim Doo" and taste this recipe before you can write a review. Come back after you've tried it!
                    </Text>

                    <TouchableOpacity style={styles.okButton} onPress={onClose}>
                        <Text style={styles.okButtonText}>Got It</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default ChimDooRequiredModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modal: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 28,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 24,
        elevation: 10,
    },
    closeBtn: {
        position: 'absolute',
        top: 16,
        right: 16,
        padding: 4,
    },
    iconWrapper: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1D3557',
        marginBottom: 12,
    },
    message: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    okButton: {
        backgroundColor: '#F59E0B',
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 40,
        width: '100%',
        alignItems: 'center',
    },
    okButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});
