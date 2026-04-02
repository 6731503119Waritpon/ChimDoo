import React from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { CircleHelp } from 'lucide-react-native';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';

interface CommunityInfoModalProps {
    visible: boolean;
    onClose: () => void;
}

const CommunityInfoModal = ({
    visible,
    onClose,
}: CommunityInfoModalProps) => {
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
                        <CircleHelp size={36} color={AppColors.navy} />
                    </View>

                    <Text style={styles.title}>Community Guide</Text>
                    <Text style={styles.subtitle}>
                        To share your culinary journey in our Community, start by selecting a dish from the <Text style={styles.boldText}>ChimDoo</Text> menu and submitting a review. Your posts will then automatically appear here!
                    </Text>

                    <TouchableOpacity
                        style={styles.confirmButton}
                        onPress={onClose}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.confirmText}>Understood</Text>
                    </TouchableOpacity>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
};

export default CommunityInfoModal;

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
        maxWidth: 340,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 8,
    },
    iconWrapper: {
        width: 76,
        height: 76,
        borderRadius: 38,
        backgroundColor: 'rgba(29, 53, 87, 0.08)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    title: {
        fontFamily: AppFonts.bold,
        fontSize: 22,
        color: AppColors.navy,
        marginBottom: 12,
    },
    subtitle: {
        fontFamily: AppFonts.regular,
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 28,
    },
    boldText: {
        fontFamily: AppFonts.bold,
        color: AppColors.navy,
    },
    confirmButton: {
        width: '100%',
        paddingVertical: 14,
        backgroundColor: AppColors.navy,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: AppColors.navy,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    confirmText: {
        fontFamily: AppFonts.bold,
        fontSize: 16,
        color: '#fff',
    },
});
