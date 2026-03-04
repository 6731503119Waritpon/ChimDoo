import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Bell } from 'lucide-react-native';
import { useNotifications } from '../hooks/useNotifications';

interface Props {
    onPress: () => void;
    color?: string;
}

export default function NotificationBell({ onPress, color = '#1D3557' }: Props) {
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
        backgroundColor: '#E63946',
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
        color: '#fff',
        fontSize: 10,
        fontWeight: '800',
        lineHeight: 13,
    },
});
