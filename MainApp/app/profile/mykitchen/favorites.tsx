import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { router, Stack } from 'expo-router';
import { ChevronLeft, Heart } from 'lucide-react-native';

import ComingSoonModal from '@/components/error/commingsoonModal';

const Favorites = () => {
    const [isModalVisible, setModalVisible] = useState(false);

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'Favorites', headerBackTitle: 'Back' }} />
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <ChevronLeft size={28} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <View style={styles.iconWrapper}>
                    <Heart size={48} color="#E63946" />
                </View>

                <Text style={styles.title}>Your Favorites</Text>
                <Text style={styles.subtitle}>
                    Save your favorite recipes here so you can easily find them later for your next cooking adventure!
                </Text>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => setModalVisible(true)}
                    activeOpacity={0.8}
                >
                    <Text style={styles.buttonText}>Manage Favorites</Text>
                </TouchableOpacity>
            </View>

            <ComingSoonModal
                visible={isModalVisible}
                onClose={() => setModalVisible(false)}
                title="Cooking in Progress!"
                message="The Favorites feature is currently cooking in our kitchen. We'll serve it to you soon!"
            />
        </View>
    );
};

export default Favorites;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    iconWrapper: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: 'rgba(230, 57, 70, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1D3557',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
        paddingHorizontal: 20,
    },
    button: {
        backgroundColor: '#E63946',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'ios' ? 60 : 48,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#1a1a1a',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
    },
});