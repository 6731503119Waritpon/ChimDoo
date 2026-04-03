import React, { useState, useEffect, useRef, FC } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Image,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Animated,
    Dimensions,
} from 'react-native';
import { Camera, ImageIcon, X, Send } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Props {
    visible: boolean;
    foodName: string;
    onClose: () => void;
    onSubmit: (imageUri: string, description: string) => Promise<void>;
}

const ReviewModal: FC<Props> = ({ visible, foodName, onClose, onSubmit }) => {
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const backdropOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(backdropOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    useNativeDriver: true,
                    bounciness: 0,
                    speed: 12,
                })
            ]).start();
        } else {
            backdropOpacity.setValue(0);
            slideAnim.setValue(SCREEN_HEIGHT);
        }
    }, [visible]);

    const pickImage = async (useCamera: boolean) => {
        const permissionResult = useCamera
            ? await ImagePicker.requestCameraPermissionsAsync()
            : await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) return;

        const result = useCamera
            ? await ImagePicker.launchCameraAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.4,
                base64: true,
            })
            : await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.4,
                base64: true,
            });

        if (!result.canceled && result.assets[0]) {
            setImageUri(result.assets[0].uri);
            setImageBase64(result.assets[0].base64 || null);
        }
    };

    const handleSubmit = async () => {
        if (!imageBase64 || !description.trim()) return;

        setSubmitting(true);
        try {
            const dataUri = `data:image/jpeg;base64,${imageBase64}`;
            await onSubmit(dataUri, description.trim());
            setImageUri(null);
            setImageBase64(null);
            setDescription('');
            onClose();
        } catch (err) {
            console.error('Submit review error:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        if (submitting) return;
        setImageUri(null);
        setImageBase64(null);
        setDescription('');
        onClose();
    };

    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                style={styles.root}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <Animated.View style={[styles.overlay, { opacity: backdropOpacity }]}>
                    <TouchableOpacity
                        style={StyleSheet.absoluteFill}
                        activeOpacity={1}
                        onPress={handleClose}
                    />
                </Animated.View>

                <Animated.View
                    style={[
                        styles.modal,
                        { transform: [{ translateY: slideAnim }] }
                    ]}
                >
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Write a Review</Text>
                        <TouchableOpacity onPress={handleClose} disabled={submitting}>
                            <X size={24} color="#999" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.foodBadge}>
                            <Text style={styles.foodBadgeText}>{foodName}</Text>
                        </View>

                        {imageUri ? (
                            <View style={styles.imagePreviewContainer}>
                                <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                                <TouchableOpacity
                                    style={styles.removeImageBtn}
                                    onPress={() => { setImageUri(null); setImageBase64(null); }}
                                >
                                    <X size={16} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={styles.imagePickerRow}>
                                <TouchableOpacity
                                    style={styles.imagePickerBtn}
                                    onPress={() => pickImage(true)}
                                >
                                    <Camera size={28} color={AppColors.primary} />
                                    <Text style={styles.imagePickerText}>Camera</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.imagePickerBtn}
                                    onPress={() => pickImage(false)}
                                >
                                    <ImageIcon size={28} color={AppColors.navy} />
                                    <Text style={styles.imagePickerText}>Gallery</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        <Text style={styles.label}>Your Review</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Share your experience with this dish..."
                            placeholderTextColor="#aaa"
                            multiline
                            textAlignVertical="top"
                            value={description}
                            onChangeText={setDescription}
                            maxLength={500}
                        />
                        <Text style={styles.charCount}>
                            {description.length}/500
                        </Text>
                    </ScrollView>

                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            (!imageUri || !description.trim()) && styles.submitButtonDisabled,
                        ]}
                        onPress={handleSubmit}
                        disabled={!imageUri || !description.trim() || submitting}
                        activeOpacity={0.7}
                    >
                        {submitting ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <>
                                <Send size={18} color="#fff" />
                                <Text style={styles.submitText}>Post Review</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </Animated.View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default ReviewModal;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modal: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
        maxHeight: '90%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerTitle: {
        fontFamily: AppFonts.bold,
        fontSize: 22,
        color: AppColors.navy,
    },
    foodBadge: {
        backgroundColor: '#F0F4F8',
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 16,
        alignSelf: 'flex-start',
        marginBottom: 20,
    },
    foodBadgeText: {
        fontFamily: AppFonts.semiBold,
        fontSize: 15,
        color: AppColors.navy,
    },
    imagePickerRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    imagePickerBtn: {
        flex: 1,
        height: 120,
        backgroundColor: AppColors.backgroundLight,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#E8E8E8',
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    imagePickerText: {
        fontFamily: AppFonts.semiBold,
        fontSize: 13,
        color: '#666',
    },
    imagePreviewContainer: {
        position: 'relative',
        marginBottom: 20,
        borderRadius: 16,
        overflow: 'hidden',
    },
    imagePreview: {
        width: '100%',
        height: 200,
        borderRadius: 16,
    },
    removeImageBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(0,0,0,0.6)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontFamily: AppFonts.bold,
        fontSize: 15,
        color: AppColors.navy,
        marginBottom: 8,
    },
    textInput: {
        fontFamily: AppFonts.regular,
        backgroundColor: AppColors.backgroundLight,
        borderRadius: 14,
        padding: 16,
        fontSize: 15,
        color: '#333',
        minHeight: 100,
        borderWidth: 1,
        borderColor: '#E8E8E8',
    },
    charCount: {
        fontFamily: AppFonts.regular,
        fontSize: 12,
        color: '#aaa',
        textAlign: 'right',
        marginTop: 6,
        marginBottom: 16,
    },
    submitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: AppColors.primary,
        borderRadius: 16,
        paddingVertical: 16,
        marginTop: 8,
    },
    submitButtonDisabled: {
        backgroundColor: '#ccc',
    },
    submitText: {
        fontFamily: AppFonts.bold,
        color: '#fff',
        fontSize: 16,
    },
});
