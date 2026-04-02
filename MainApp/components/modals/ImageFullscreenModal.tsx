import React from 'react';
import { 
    Modal, 
    View, 
    StyleSheet, 
    Dimensions, 
    TouchableOpacity, 
    Image,
    Platform
} from 'react-native';
import { BlurView } from 'expo-blur';
import { X } from 'lucide-react-native';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ImageFullscreenModalProps {
    visible: boolean;
    imageUri: string | null;
    onClose: () => void;
}

const ImageFullscreenModal = ({ visible, imageUri, onClose }: ImageFullscreenModalProps) => {
    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const savedTranslateX = useSharedValue(0);
    const savedTranslateY = useSharedValue(0);

    React.useEffect(() => {
        if (!visible) {
            scale.value = 1;
            savedScale.value = 1;
            translateX.value = 0;
            translateY.value = 0;
            savedTranslateX.value = 0;
            savedTranslateY.value = 0;
        }
    }, [visible]);

    const pinchGesture = Gesture.Pinch()
        .onUpdate((e) => {
            scale.value = savedScale.value * e.scale;
        })
        .onEnd(() => {
            if (scale.value < 1) {
                scale.value = withSpring(1);
                translateX.value = withSpring(0);
                translateY.value = withSpring(0);
            }
            savedScale.value = scale.value;
        });

    const panGesture = Gesture.Pan()
        .onUpdate((e) => {
            if (scale.value > 1) {
                translateX.value = savedTranslateX.value + e.translationX;
                translateY.value = savedTranslateY.value + e.translationY;
            }
        })
        .onEnd(() => {
            if (scale.value <= 1) {
                translateX.value = withSpring(0);
                translateY.value = withSpring(0);
            }
            savedTranslateX.value = translateX.value;
            savedTranslateY.value = translateY.value;
        });

    const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

    const animatedImageStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: scale.value },
            { translateX: translateX.value },
            { translateY: translateY.value },
        ],
    }));

    if (!imageUri) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <GestureHandlerRootView style={styles.container}>
                <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill}>
                    <TouchableOpacity 
                        style={StyleSheet.absoluteFill} 
                        activeOpacity={1} 
                        onPress={onClose} 
                    />
                </BlurView>

                <View style={styles.cardContainer}>
                    <View style={styles.cardHeader}>
                        <TouchableOpacity 
                            style={styles.closeIcon} 
                            onPress={onClose}
                            activeOpacity={0.7}
                        >
                            <X size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.imageCard}>
                        <GestureDetector gesture={composedGesture}>
                            <Animated.View style={[styles.imageWrapper, animatedImageStyle]}>
                                <Image 
                                    source={{ uri: imageUri }} 
                                    style={styles.fullImage} 
                                    resizeMode="cover" 
                                />
                            </Animated.View>
                        </GestureDetector>
                    </View>
                </View>
            </GestureHandlerRootView>
        </Modal>
    );
};

export default ImageFullscreenModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardContainer: {
        width: SCREEN_WIDTH * 0.9,
        backgroundColor: '#fff',
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 15,
    },
    cardHeader: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    closeIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageCard: {
        aspectRatio: 1,
        backgroundColor: '#f8f8f8',
        overflow: 'hidden',
    },
    imageWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullImage: {
        width: '100%',
        height: '100%',
    },
});
