import React from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import { Sparkles } from 'lucide-react-native';

interface ComingSoonModalProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
}

const ComingSoonModal: React.FC<ComingSoonModalProps> = ({
    visible,
    onClose,
    title = 'Coming Soon!',
    message = 'We are working hard to bring this feature to you. Stay tuned!',
}) => {
    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContainer}>
                            <View style={styles.iconContainer}>
                                <Sparkles size={32} color="#E63946" />
                            </View>
                            
                            <Text style={styles.title}>{title}</Text>
                            <Text style={styles.message}>{message}</Text>
                            
                            <TouchableOpacity
                                style={styles.button}
                                onPress={onClose}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.buttonText}>Got it!</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default ComingSoonModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        width: '85%',
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 10,
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
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1D3557',
        marginBottom: 8,
        textAlign: 'center',
    },
    message: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    button: {
        width: '100%',
        backgroundColor: '#E63946',
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});