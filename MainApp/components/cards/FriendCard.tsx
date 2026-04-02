import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { UserX, User } from 'lucide-react-native';
import { FriendInfo } from '@/types/friends';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';

interface FriendCardProps {
    item: FriendInfo;
    onRemove: (friendshipId: string, friendName: string) => void;
}

export default function FriendCard({ item, onRemove }: FriendCardProps) {
    const avatarLetter = (item.displayName || '?').charAt(0).toUpperCase();

    return (
        <View style={styles.card}>
            <View style={styles.cardLeft}>
                <View style={styles.avatarContainer}>
                    {item.photoURL ? (
                        <Image source={{ uri: item.photoURL }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <User size={20} color="#DDD" />
                        </View>
                    )}
                </View>
                <View style={styles.infoWrapper}>
                    <Text style={styles.cardName} numberOfLines={1}>
                        {item.displayName}
                    </Text>
                    <Text style={styles.cardStatus}>Active Friend</Text>
                </View>
            </View>
            <TouchableOpacity
                style={styles.removeButton}
                onPress={() => onRemove(item.friendshipId, item.displayName)}
                activeOpacity={0.6}
            >
                <UserX size={16} color="#999" />
            </TouchableOpacity>
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
        color: '#BBB',
        marginTop: 2,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    removeButton: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: '#F8F9FA',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
});
