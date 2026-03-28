import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Bell } from 'lucide-react-native';
import { useNotifications } from '../hooks/useNotifications';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';

interface Props {
    onPress: () => void;
    color?: string;
}

export default function NotificationBell({ onPress, color = AppColors.navy }: Props) {
    const { unreadCount } = useNotifications();

    return (
        <TouchableOpacity onPress={onPress} style={styles.wrapper} activeOpacity={0.7}>
            <Bell size={24} color={color} />
            {unreadCount > 0 && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badge: {
        position: 'absolute',
        top: 2,
        right: 2,
        backgroundColor: AppColors.primary,
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 3,
        borderWidth: 1.5,
        borderColor: '#fff',
    },
    badgeText: {
        fontFamily: AppFonts.bold,
        color: '#fff',
        fontSize: 10,
        lineHeight: 13,
    },
});
