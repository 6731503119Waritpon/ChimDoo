import React, { FC } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AppColors } from '@/constants/colors';
import { LucideIcon } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { AppFonts } from '@/constants/theme';

interface GuestStateProps {
    icon: LucideIcon;
    title: string;
    subtitle: string;
    showAuthButtons?: boolean;
}

const GuestState: FC<GuestStateProps> = ({ 
    icon: Icon, 
    title, 
    subtitle, 
    showAuthButtons = false 
}) => {
    const router = useRouter();

    return (
        <View style={styles.guestContainer}>
            <View style={styles.guestContent}>
                <View style={styles.guestIconWrapper}>
                    <Icon size={48} color={AppColors.primary} />
                </View>
                <Text style={styles.guestTitle}>{title}</Text>
                <Text style={styles.guestSubtitle}>{subtitle}</Text>

                {showAuthButtons && (
                    <View style={styles.guestButtons}>
                        <TouchableOpacity
                            style={styles.primaryButton}
                            onPress={() => router.push('/auth/login')}
                        >
                            <Text style={styles.primaryButtonText}>Log In</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.outlineButton}
                            onPress={() => router.push('/auth/signup')}
                        >
                            <Text style={styles.outlineButtonText}>
                                Create Account
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
};

export default GuestState;

const styles = StyleSheet.create({
    guestContainer: {
        flex: 1,
        backgroundColor: AppColors.backgroundLight || '#fff',
        justifyContent: 'center',
        padding: 32,
    },
    guestContent: {
        alignItems: 'center',
        width: '100%',
    },
    guestIconWrapper: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: 'rgba(230, 57, 70, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    guestTitle: {
        fontFamily: AppFonts.bold,
        fontSize: 28,
        color: AppColors.navy || '#1D3557',
        marginBottom: 12,
        textAlign: 'center',
    },
    guestSubtitle: {
        fontFamily: AppFonts.regular,
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
        paddingHorizontal: 10,
    },
    guestButtons: {
        width: '100%',
        gap: 12,
    },
    primaryButton: {
        backgroundColor: AppColors.primary || '#E63946',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    primaryButtonText: {
        fontFamily: AppFonts.bold,
        color: '#fff',
        fontSize: 16,
    },
    outlineButton: {
        borderWidth: 2,
        borderColor: AppColors.primary || '#E63946',
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: 'center',
    },
    outlineButtonText: {
        fontFamily: AppFonts.bold,
        color: AppColors.primary || '#E63946',
        fontSize: 16,
    },
});
