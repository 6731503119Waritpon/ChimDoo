import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Check, X, User } from 'lucide-react-native';
import { Friendship, FriendInfo } from '@/types/friends';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';

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
                <View style={styles.avatarContainer}>
                    {item.senderInfo.photoURL ? (
                        <Image source={{ uri: item.senderInfo.photoURL }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <User size={20} color="#DDD" />
                        </View>
                    )}
                </View>
                <View style={styles.infoWrapper}>
                    <Text style={styles.cardName} numberOfLines={1}>
                        {item.senderInfo.displayName}
                    </Text>
                    <Text style={styles.cardStatus}>Wants to be your friend</Text>
                </View>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity
                    style={[styles.actionBtn, styles.rejectBtn]}
                    onPress={() => onReject(item.id)}
                    activeOpacity={0.7}
                >
                    <X size={16} color="#999" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionBtn, styles.acceptBtn]}
                    onPress={() => onAccept(item.id)}
                    activeOpacity={0.7}
                >
                    <Check size={16} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderWidth: 1.5,
        borderColor: '#F1F5F9',
    },
    cardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        flex: 1,
    },
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#F8F9FA',
        borderWidth: 1,
        borderColor: '#F1F5F9',
        padding: 2,
        overflow: 'hidden',
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: 23,
    },
    avatarPlaceholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoWrapper: {
        flex: 1,
    },
    cardName: {
        fontFamily: AppFonts.bold,
        fontSize: 16,
        color: AppColors.navy,
    },
    cardStatus: {
        fontFamily: AppFonts.medium,
        fontSize: 11,
        color: AppColors.primary,
        marginTop: 2,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    actions: {
        flexDirection: 'row',
        gap: 10,
    },
    actionBtn: {
        width: 38,
        height: 38,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    acceptBtn: {
        backgroundColor: AppColors.primary,
        borderColor: AppColors.primary,
    },
    rejectBtn: {
        backgroundColor: '#F8F9FA',
        borderColor: '#F1F5F9',
    },
});
