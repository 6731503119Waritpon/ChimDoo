import React from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Dimensions,
} from 'react-native';
import { Camera, Image as ImageIcon, Trash2, X } from 'lucide-react-native';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';

interface PhotoActionModalProps {
    visible: boolean;
    onClose: () => void;
    onTakePhoto: () => void;
    onChooseFromGallery: () => void;
    onRemovePhoto?: () => void;
    hasPhoto: boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const PhotoActionModal = ({
    visible,
    onClose,
    onTakePhoto,
    onChooseFromGallery,
    onRemovePhoto,
    hasPhoto,
}: PhotoActionModalProps) => {
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
                    <View style={styles.header}>
                        <Text style={styles.title}>Update Profile Photo</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <X size={20} color="#94A3B8" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.options}>
                        {Platform.OS !== 'web' && (
                            <TouchableOpacity 
                                style={styles.option} 
                                onPress={() => { onTakePhoto(); onClose(); }}
                            >
                                <View style={[styles.iconWrapper, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
                                    <Camera size={22} color="#3B82F6" />
                                </View>
                                <Text style={styles.optionText}>Take Photo</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity 
                            style={styles.option} 
                            onPress={() => { onChooseFromGallery(); onClose(); }}
                        >
                            <View style={[styles.iconWrapper, { backgroundColor: 'rgba(34, 197, 94, 0.1)' }]}>
                                <ImageIcon size={22} color="#22C55E" />
                            </View>
                            <Text style={styles.optionText}>Choose from Gallery</Text>
                        </TouchableOpacity>

                        {hasPhoto && onRemovePhoto && (
                            <TouchableOpacity 
                                style={styles.option} 
                                onPress={() => { onRemovePhoto(); onClose(); }}
                            >
                                <View style={[styles.iconWrapper, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
                                    <Trash2 size={22} color="#EF4444" />
                                </View>
                                <Text style={[styles.optionText, { color: '#EF4444' }]}>Remove Photo</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                        <Text style={styles.cancelBtnText}>Cancel</Text>
                    </TouchableOpacity>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
};

export default PhotoActionModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modal: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        width: Platform.OS === 'web' ? 360 : '100%',
        maxWidth: 400,
        padding: 24,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontFamily: AppFonts.bold,
        fontSize: 18,
        color: AppColors.navy,
    },
    closeBtn: {
        padding: 4,
    },
    options: {
        gap: 12,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 16,
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    iconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    optionText: {
        fontFamily: AppFonts.bold,
        fontSize: 15,
        color: AppColors.navy,
    },
    cancelBtn: {
        marginTop: 20,
        paddingVertical: 14,
        alignItems: 'center',
    },
    cancelBtnText: {
        fontFamily: AppFonts.bold,
        fontSize: 15,
        color: '#94A3B8',
    },
});
