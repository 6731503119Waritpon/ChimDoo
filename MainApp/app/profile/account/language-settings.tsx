import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { router, Stack } from 'expo-router';
import { ChevronLeft, Globe } from 'lucide-react-native';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';

const LanguageSettings = () => {
    const [isModalVisible, setModalVisible] = useState(false);

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'Language', headerBackTitle: 'Back' }} />

            <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <ChevronLeft size={28} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Language</Text>
                    <View style={{ width: 40 }} />
                </View>
            <View style={styles.content}>
                <View style={styles.iconWrapper}>
                    <Globe size={48} color={AppColors.navy} />
                </View>
                
                <Text style={styles.title}>Language Settings</Text>
                <Text style={styles.subtitle}>
                    Currently, ChimDoo is only available in English. We are working on adding more languages!
                </Text>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => setModalVisible(true)}
                    activeOpacity={0.8}
                >
                    <Text style={styles.buttonText}>Select Language</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default LanguageSettings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.backgroundLight,
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
        backgroundColor: 'rgba(29, 53, 87, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    title: {
        fontFamily: AppFonts.bold,
        fontSize: 24,
        color: AppColors.navy,
        marginBottom: 12,
    },
    subtitle: {
        fontFamily: AppFonts.regular,
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
        paddingHorizontal: 20,
    },
    button: {
        backgroundColor: AppColors.primary,
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 14,
        shadowColor: AppColors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: AppFonts.bold,
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
            backgroundColor: AppColors.navy,
            alignItems: 'center',
            justifyContent: 'center',
        },
        headerTitle: {
            fontFamily: AppFonts.bold,
            fontSize: 20,
            color: AppColors.navy,
        },
});