import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Alert,
    Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, UserX, ShieldCheck, Search, ShieldAlert } from 'lucide-react-native';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/ToastProvider';
import { getBlockedUserIds, fetchBlockedUserProfiles, unblockUser } from '@/services/reportService';

import { BlockedUser } from '@/types/report';
import UnblockConfirmationModal from '@/components/modals/UnblockConfirmationModal';

export default function BlockedUsersScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const toast = useToast();

    const [loading, setLoading] = useState(true);
    const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [unblockModalVisible, setUnblockModalVisible] = useState(false);
    const [userToUnblock, setUserToUnblock] = useState<BlockedUser | null>(null);
    const [isUnblocking, setIsUnblocking] = useState(false);

    useEffect(() => {
        loadBlockedUsers();
    }, [user]);

    const loadBlockedUsers = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const ids = await getBlockedUserIds(user.uid);
            if (ids.length > 0) {
                const profiles = await fetchBlockedUserProfiles(ids);
                setBlockedUsers(profiles);
            } else {
                setBlockedUsers([]);
            }
        } catch (error) {
            console.error('[BlockedUsers] Error loading:', error);
            toast.error('Error', 'Failed to load blocked users.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleUnblock = (targetUser: BlockedUser) => {
        setUserToUnblock(targetUser);
        setUnblockModalVisible(true);
    };

    const confirmUnblock = async () => {
        if (!user || !userToUnblock) return;
        setIsUnblocking(true);
        try {
            await unblockUser(user.uid, userToUnblock.id);
            toast.success('User Unblocked', `${userToUnblock.displayName} has been unblocked.`);
            setBlockedUsers(prev => prev.filter(u => u.id !== userToUnblock.id));
            setUnblockModalVisible(false);
        } catch (error) {
            console.error('[BlockedUsers] Error unblocking:', error);
            toast.error('Error', 'Failed to unblock user.');
        } finally {
            setIsUnblocking(false);
        }
    };

    const renderUserItem = ({ item }: { item: BlockedUser }) => {
        const avatarSource = item.photoBase64 ? { uri: item.photoBase64 } : (item.photoURL ? { uri: item.photoURL } : null);

        return (
            <View style={styles.userCard}>
                <View style={styles.userInfo}>
                    {avatarSource ? (
                        <Image source={avatarSource} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarInitial}>
                                {item.displayName.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                    )}
                    <View style={styles.textContainer}>
                        <Text style={styles.userName}>{item.displayName}</Text>
                        <Text style={styles.userStatus}>Blocked</Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.unblockButton}
                    onPress={() => handleUnblock(item)}
                >
                    <Text style={styles.unblockButtonText}>Unblock</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
                <ShieldCheck size={40} color={AppColors.navy} opacity={0.5} />
            </View>
            <Text style={styles.emptyTitle}>No Blocked Users</Text>
            <Text style={styles.emptySub}>
                Users you have blocked will appear here. You haven't blocked anyone yet.
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <ChevronLeft size={26} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Blocked Accounts</Text>
                <View style={{ width: 40 }} />
            </View>

            {loading && !refreshing ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={AppColors.primary} />
                </View>
            ) : (
                <FlatList
                    data={blockedUsers}
                    keyExtractor={(item) => item.id}
                    renderItem={renderUserItem}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={renderEmptyState}
                    onRefresh={() => {
                        setRefreshing(true);
                        loadBlockedUsers();
                    }}
                    refreshing={refreshing}
                />
            )}

            <UnblockConfirmationModal
                visible={unblockModalVisible}
                onClose={() => setUnblockModalVisible(false)}
                onConfirm={confirmUnblock}
                userName={userToUnblock?.displayName || ''}
                loading={isUnblocking}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'ios' ? 60 : 48,
        paddingHorizontal: 16,
        paddingBottom: 20,
        backgroundColor: '#FFFFFF',
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
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 20,
        paddingBottom: 40,
        flexGrow: 1,
    },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#F1F5F9',
    },
    avatarPlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: AppColors.navy,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarInitial: {
        fontFamily: AppFonts.bold,
        color: '#FFFFFF',
        fontSize: 20,
    },
    textContainer: {
        marginLeft: 12,
        flex: 1,
    },
    userName: {
        fontFamily: AppFonts.bold,
        fontSize: 16,
        color: AppColors.navy,
    },
    userStatus: {
        fontFamily: AppFonts.medium,
        fontSize: 12,
        color: '#EF4444',
    },
    unblockButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        backgroundColor: '#F1F5F9',
    },
    unblockButtonText: {
        fontFamily: AppFonts.bold,
        fontSize: 14,
        color: AppColors.navy,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 60,
    },
    emptyIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        borderWidth: 1.5,
        borderColor: '#F1F5F9',
    },
    emptyTitle: {
        fontFamily: AppFonts.bold,
        fontSize: 18,
        color: AppColors.navy,
        marginBottom: 8,
    },
    emptySub: {
        fontFamily: AppFonts.regular,
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        paddingHorizontal: 40,
        lineHeight: 20,
    },
});
