import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    FlatList,
    Image,
    ActivityIndicator,
    Modal,
    TextInput,
    KeyboardAvoidingView,
} from 'react-native';
import { router, Stack } from 'expo-router';
import {
    ChevronLeft,
    Users,
    UserPlus,
    Inbox,
} from 'lucide-react-native';
import { useFriends } from '@/hooks/useFriends';
import { useToast } from '@/components/ToastProvider';
import { FriendInfo, Friendship } from '@/types/friends';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';
import EmptyState from '@/components/EmptyState';
import FriendCard from '@/components/FriendCard';
import FriendRequestCard from '@/components/FriendRequestCard';
import AddFriendModal from '@/components/AddFriendModal';

type Tab = 'friends' | 'requests';

const MyFriends = () => {
    const toast = useToast();
    const {
        loading,
        friendsList,
        incomingRequests,
        acceptFriendRequest,
        rejectFriendRequest,
        removeFriend,
        sendFriendRequestByEmail,
    } = useFriends();
    const [activeTab, setActiveTab] = useState<Tab>('friends');
    const [showAddModal, setShowAddModal] = useState(false);
    const [emailInput, setEmailInput] = useState('');
    const [sending, setSending] = useState(false);

    const handleAccept = async (friendshipId: string) => {
        try {
            await acceptFriendRequest(friendshipId);
            toast.success('Friend Added!', 'You are now friends');
        } catch {
            toast.error('Error', 'Failed to accept request');
        }
    };

    const handleReject = async (friendshipId: string) => {
        try {
            await rejectFriendRequest(friendshipId);
            toast.info('Declined', 'Friend request declined');
        } catch {
            toast.error('Error', 'Failed to decline request');
        }
    };

    const handleRemove = async (friendshipId: string, friendName: string) => {
        try {
            await removeFriend(friendshipId);
            toast.info('Removed', `${friendName} removed from friends`);
        } catch {
            toast.error('Error', 'Failed to remove friend');
        }
    };

    const handleSendByEmail = async () => {
        const email = emailInput.trim().toLowerCase();
        if (!email) {
            toast.info('Enter Email', 'Please enter your friend\'s email address');
            return;
        }

        setSending(true);
        try {
            const friendName = await sendFriendRequestByEmail(email);
            toast.success('Request Sent!', `Friend request sent to ${friendName}`);
            setEmailInput('');
            setShowAddModal(false);
        } catch (err: any) {
            switch (err.message) {
                case 'SELF':
                    toast.info('Oops', 'You cannot add yourself as a friend!');
                    break;
                case 'NOT_FOUND':
                    toast.error('Not Found', 'No user found with this email. Make sure they have an account on ChimDoo.');
                    break;
                case 'ALREADY_EXISTS':
                    toast.info('Already Sent', 'A friend request already exists with this person');
                    break;
                default:
                    console.error('[MyFriends] Add friend error:', err);
                    toast.error('Error', err?.message || 'Failed to send friend request');
            }
        } finally {
            setSending(false);
        }
    };

    const renderFriendCard = ({ item }: { item: FriendInfo }) => (
        <FriendCard item={item} onRemove={handleRemove} />
    );

    const renderRequestCard = ({ item }: { item: Friendship & { senderInfo: FriendInfo } }) => (
        <FriendRequestCard item={item} onAccept={handleAccept} onReject={handleReject} />
    );

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'My Friends', headerShown: false }} />

            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <ChevronLeft size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Friends</Text>
                <TouchableOpacity
                    style={styles.addFriendHeaderButton}
                    onPress={() => setShowAddModal(true)}
                    activeOpacity={0.7}
                >
                    <UserPlus size={22} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.tabsContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'friends' && styles.tabActive]}
                    onPress={() => setActiveTab('friends')}
                    activeOpacity={0.7}
                >
                    <Users
                        size={16}
                        color={activeTab === 'friends' ? '#fff' : AppColors.navy}
                    />
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === 'friends' && styles.tabTextActive,
                        ]}
                    >
                        Friends ({friendsList.length})
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'requests' && styles.tabActive]}
                    onPress={() => setActiveTab('requests')}
                    activeOpacity={0.7}
                >
                    <Inbox
                        size={16}
                        color={activeTab === 'requests' ? '#fff' : AppColors.navy}
                    />
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === 'requests' && styles.tabTextActive,
                        ]}
                    >
                        Requests ({incomingRequests.length})
                    </Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.centerContent}>
                    <ActivityIndicator size="large" color={AppColors.primary} />
                </View>
            ) : activeTab === 'friends' ? (
                friendsList.length === 0 ? (
                    <EmptyState
                        icon={Users}
                        title="No Friends Yet"
                        subtitle="Tap the + button above and enter your friend's email to send a friend request!"
                    />
                ) : (
                    <FlatList
                        data={friendsList}
                        keyExtractor={(item) => item.friendshipId}
                        renderItem={renderFriendCard}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                )
            ) : incomingRequests.length === 0 ? (
                <EmptyState
                    icon={Inbox}
                    title="No Requests"
                    subtitle="When someone sends you a friend request, it will appear here."
                />
            ) : (
                <FlatList
                    data={incomingRequests}
                    keyExtractor={(item) => item.id}
                    renderItem={renderRequestCard}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}

            <AddFriendModal
                visible={showAddModal}
                onClose={() => setShowAddModal(false)}
                emailInput={emailInput}
                setEmailInput={setEmailInput}
                sending={sending}
                onSend={handleSendByEmail}
            />
        </View>
    );
};

export default MyFriends;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.backgroundLight,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'ios' ? 60 : 48,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    headerTitle: {
        fontFamily: AppFonts.bold,
        fontSize: 20,
        color: AppColors.navy,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: AppColors.navy,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addFriendHeaderButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: AppColors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },

    tabsContainer: {
        flexDirection: 'row',
        marginHorizontal: 20,
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
        marginBottom: 16,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        gap: 6,
    },
    tabActive: {
        backgroundColor: AppColors.navy,
    },
    tabText: {
        fontFamily: AppFonts.semiBold,
        fontSize: 14,
        color: AppColors.navy,
    },
    tabTextActive: {
        color: '#fff',
    },

    centerContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },

    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 100,
        gap: 10,
    },
});
