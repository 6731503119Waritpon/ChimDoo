import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { UserX } from 'lucide-react-native';
import { FriendInfo } from '@/types/friends';
import { AppColors } from '@/constants/colors';

interface FriendCardProps {
    item: FriendInfo;
    onRemove: (friendshipId: string, friendName: string) => void;
}

export default function FriendCard({ item, onRemove }: FriendCardProps) {
    const avatarLetter = (item.displayName || '?').charAt(0).toUpperCase();

    return (
        <View style={styles.card}>
            <View style={styles.cardLeft}>
                {item.photoURL ? (
                    <Image source={{ uri: item.photoURL }} style={styles.avatar} />
                ) : (
                    <View style={[styles.avatar, styles.avatarPlaceholder]}>
                        <Text style={styles.avatarText}>{avatarLetter}</Text>
                    </View>
                )}
                <Text style={styles.cardName} numberOfLines={1}>
                    {item.displayName}
                </Text>
            </View>
            <TouchableOpacity
                style={styles.removeButton}
                onPress={() => onRemove(item.friendshipId, item.displayName)}
                activeOpacity={0.6}
            >
                <UserX size={18} color="#ef4444" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    cardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    cardName: {
        fontSize: 16,
        fontWeight: '600',
        color: AppColors.navy,
        flex: 1,
    },
    avatar: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: '#f0f0f0',
        borderWidth: 2,
        borderColor: AppColors.primary,
    },
    avatarPlaceholder: {
        backgroundColor: AppColors.navy,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    removeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(239, 68, 68, 0.08)',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
