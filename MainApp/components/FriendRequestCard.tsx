import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { UserCheck, UserX } from 'lucide-react-native';
import { Friendship, FriendInfo } from '@/types/friends';
import { AppColors } from '@/constants/colors';

interface FriendRequestCardProps {
    item: Friendship & { senderInfo: FriendInfo };
    onAccept: (id: string) => void;
    onReject: (id: string) => void;
}

export default function FriendRequestCard({ item, onAccept, onReject }: FriendRequestCardProps) {
    const avatarLetter = (item.senderInfo.displayName || '?').charAt(0).toUpperCase();

    return (
        <View style={styles.card}>
            <View style={styles.cardLeft}>
                {item.senderInfo.photoURL ? (
                    <Image
                        source={{ uri: item.senderInfo.photoURL }}
                        style={styles.avatar}
                    />
                ) : (
                    <View style={[styles.avatar, styles.avatarPlaceholder]}>
                        <Text style={styles.avatarText}>{avatarLetter}</Text>
                    </View>
                )}
                <Text style={styles.cardName} numberOfLines={1}>
                    {item.senderInfo.displayName}
                </Text>
            </View>
            <View style={styles.requestActions}>
                <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={() => onAccept(item.id)}
                    activeOpacity={0.6}
                >
                    <UserCheck size={18} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.rejectButton}
                    onPress={() => onReject(item.id)}
                    activeOpacity={0.6}
                >
                    <UserX size={18} color="#ef4444" />
                </TouchableOpacity>
            </View>
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
    requestActions: {
        flexDirection: 'row',
        gap: 8,
    },
    acceptButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#22c55e',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rejectButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
