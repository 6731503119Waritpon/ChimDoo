import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';

export default function AIFab() {
    const router = useRouter();

    return (
        <Animated.View
            entering={FadeInUp.duration(400).springify()}
            exiting={FadeOutDown.duration(300)}
            style={styles.container}
        >
            <TouchableOpacity
                onPress={() => router.push('/chatbot' as any)}
                activeOpacity={0.8}
                style={styles.shadow}
            >
                <LinearGradient
                    colors={['#E63946', '#f43f5e']}
                    style={styles.button}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Sparkles size={24} color="#FFF" />
                </LinearGradient>
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 120,  // Stays above the tab bar
        right: 20,
        zIndex: 999,
        elevation: 10,
    },
    shadow: {
        shadowColor: '#E63946',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 8,
        borderRadius: 28,
        backgroundColor: 'transparent',
    },
    button: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
});
