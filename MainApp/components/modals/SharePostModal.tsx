import React, { useRef, useState } from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    Alert,
    Platform
} from 'react-native';
import { BlurView } from 'expo-blur';
import { X, Download, Share2, Check } from 'lucide-react-native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { CommunityPost } from '@/types/community';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';
import ShareCardView from '@/components/ui/ShareCardView';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SharePostModalProps {
    visible: boolean;
    onClose: () => void;
    item: CommunityPost | null;
}

const SharePostModal = ({ visible, onClose, item }: SharePostModalProps) => {
    const viewRef = useRef<View>(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const HEADER_HEIGHT = Platform.OS === 'ios' ? 100 : 80;
    const FOOTER_HEIGHT = 140;
    const availableHeight = SCREEN_HEIGHT - HEADER_HEIGHT - FOOTER_HEIGHT;
    const cardAspectRatio = 1.42;
    const finalCardWidth = Math.min(SCREEN_WIDTH * 0.88, (availableHeight / cardAspectRatio));
    const finalCardHeight = finalCardWidth * cardAspectRatio;

    if (!item) return null;

    const handleSave = async () => {
        try {
            setIsCapturing(true);
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Required', 'We need gallery permissions to save the image.');
                setIsCapturing(false);
                return;
            }

            const uri = await captureRef(viewRef, {
                format: 'png',
                quality: 1,
            });

            await MediaLibrary.saveToLibraryAsync(uri);
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 3000);
        } catch (error) {
            console.error('Save failed:', error);
            Alert.alert('Error', 'Failed to save image.');
        } finally {
            setIsCapturing(false);
        }
    };

    const handleShare = async () => {
        try {
            setIsCapturing(true);
            const uri = await captureRef(viewRef, {
                format: 'png',
                quality: 1,
            });

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri);
            } else {
                Alert.alert('Error', 'Sharing is not available on this device.');
            }
        } catch (error) {
            console.error('Share failed:', error);
            Alert.alert('Error', 'Failed to share image.');
        } finally {
            setIsCapturing(false);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill}>
                <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />

                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <View style={{ width: 44 }} />
                        <Text style={styles.title}>Share Your Dish</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.previewContainer}>
                        <View style={[styles.shadowWrapper, { width: finalCardWidth, height: finalCardHeight }]}>
                            <View ref={viewRef} collapsable={false} style={{ width: finalCardWidth, height: finalCardHeight }}>
                                <ShareCardView
                                    item={item}
                                    width={finalCardWidth}
                                    height={finalCardHeight}
                                />
                            </View>
                        </View>
                    </View>

                    <View style={styles.actionsBar}>
                        <TouchableOpacity
                            style={[styles.actionBtn, styles.saveBtn]}
                            onPress={handleSave}
                            disabled={isCapturing}
                        >
                            {isSaved ? <Check size={20} color="#fff" /> : <Download size={20} color="#fff" />}
                            <Text style={styles.actionBtnText}>{isSaved ? 'Saved!' : 'Save Photo'}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionBtn, styles.shareBtn]}
                            onPress={handleShare}
                            disabled={isCapturing}
                        >
                            <Share2 size={20} color={AppColors.primary} />
                            <Text style={[styles.actionBtnText, { color: AppColors.primary }]}>Share to...</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {isCapturing && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color="#fff" />
                        <Text style={styles.loadingText}>Generating Image...</Text>
                    </View>
                )}
            </BlurView>
        </Modal>
    );
};

export default SharePostModal;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        height: 60,
    },
    closeButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    footerBranding: {
        marginTop: 15,
        marginBottom: 10,
        alignItems: 'center',
    },
    footerTagline: {
        fontFamily: AppFonts.bold,
        fontSize: 10,
        color: 'rgba(0,0,0,0.3)',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    title: {
        fontFamily: AppFonts.bold,
        fontSize: 18,
        color: '#fff',
        textShadowColor: 'rgba(0,0,0,0.4)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    previewContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
    },
    shadowWrapper: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 15,
        borderRadius: 24,
        overflow: 'hidden',
    },
    actionsBar: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
        gap: 12,
    },
    actionBtn: {
        flex: 1,
        height: 56,
        borderRadius: 28,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    saveBtn: {
        backgroundColor: AppColors.navy,
    },
    shareBtn: {
        backgroundColor: '#fff',
    },
    actionBtnText: {
        fontFamily: AppFonts.bold,
        fontSize: 15,
        color: '#fff',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.6)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
    },
    loadingText: {
        color: '#fff',
        fontFamily: AppFonts.semiBold,
        marginTop: 15,
    },
});
