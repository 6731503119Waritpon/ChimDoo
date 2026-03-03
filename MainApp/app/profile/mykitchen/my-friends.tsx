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
    UserCheck,
    UserX,
    Inbox,
    X,
    Mail,
    Send,
} from 'lucide-react-native';
import { useFriends } from '@/hooks/useFriends';
import { useToast } from '@/components/ToastProvider';
import { FriendInfo } from '@/types/friends';
import { Friendship } from '@/types/friends';

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

    const renderFriendCard = ({ item }: { item: FriendInfo }) => {
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
                    onPress={() => handleRemove(item.friendshipId, item.displayName)}
                    activeOpacity={0.6}
                >
                    <UserX size={18} color="#ef4444" />
                </TouchableOpacity>
            </View>
        );
    };

    const renderRequestCard = ({
        item,
    }: {
        item: Friendship & { senderInfo: FriendInfo };
    }) => {
        const avatarLetter = (item.senderInfo.displayName || '?')
            .charAt(0)
            .toUpperCase();
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
                        onPress={() => handleAccept(item.id)}
                        activeOpacity={0.6}
                    >
                        <UserCheck size={18} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.rejectButton}
                        onPress={() => handleReject(item.id)}
                        activeOpacity={0.6}
                    >
                        <UserX size={18} color="#ef4444" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

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
                        color={activeTab === 'friends' ? '#fff' : '#1D3557'}
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
                        color={activeTab === 'requests' ? '#fff' : '#1D3557'}
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
                    <ActivityIndicator size="large" color="#E63946" />
                </View>
            ) : activeTab === 'friends' ? (
                friendsList.length === 0 ? (
                    <View style={styles.centerContent}>
                        <View style={styles.iconWrapper}>
                            <Users size={48} color="#E63946" />
                        </View>
                        <Text style={styles.emptyTitle}>No Friends Yet</Text>
                        <Text style={styles.emptySubtitle}>
                            Tap the + button above and enter your friend's email to send a friend request!
                        </Text>
                    </View>
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
                <View style={styles.centerContent}>
                    <View style={styles.iconWrapper}>
                        <Inbox size={48} color="#E63946" />
                    </View>
                    <Text style={styles.emptyTitle}>No Requests</Text>
                    <Text style={styles.emptySubtitle}>
                        When someone sends you a friend request, it will appear here.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={incomingRequests}
                    keyExtractor={(item) => item.id}
                    renderItem={renderRequestCard}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}

            <Modal
                visible={showAddModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowAddModal(false)}
            >
                <KeyboardAvoidingView
                    style={styles.modalOverlay}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <TouchableOpacity
                        style={{ flex: 1 }}
                        activeOpacity={1}
                        onPress={() => setShowAddModal(false)}
                    />
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Add Friend</Text>
                            <TouchableOpacity
                                style={styles.modalCloseButton}
                                onPress={() => setShowAddModal(false)}
                                activeOpacity={0.6}
                            >
                                <X size={22} color="#444" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.modalSubtitle}>
                            Enter your friend's email address to send them a friend request
                        </Text>

                        <View style={styles.emailInputContainer}>
                            <Mail size={20} color="#888" />
                            <TextInput
                                style={styles.emailInput}
                                placeholder="friend@example.com"
                                placeholderTextColor="#aaa"
                                value={emailInput}
                                onChangeText={setEmailInput}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                editable={!sending}
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.sendButton, sending && styles.sendButtonDisabled]}
                            onPress={handleSendByEmail}
                            disabled={sending}
                            activeOpacity={0.7}
                        >
                            {sending ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <>
                                    <Send size={18} color="#fff" />
                                    <Text style={styles.sendButtonText}>Send Request</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
};

export default MyFriends;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
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
        fontSize: 20,
        fontWeight: '700',
        color: '#1D3557',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#1D3557',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addFriendHeaderButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E63946',
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
        backgroundColor: '#1D3557',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1D3557',
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
    iconWrapper: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: 'rgba(230, 57, 70, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1D3557',
        marginBottom: 12,
    },
    emptySubtitle: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 20,
    },

    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 100,
        gap: 10,
    },

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
        color: '#1D3557',
        flex: 1,
    },
    avatar: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: '#f0f0f0',
        borderWidth: 2,
        borderColor: '#E63946',
    },
    avatarPlaceholder: {
        backgroundColor: '#1D3557',
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
    removeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(239, 68, 68, 0.08)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#F8F9FA',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 24,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 20,
        paddingBottom: 4,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1D3557',
    },
    modalCloseButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.06)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#888',
        marginBottom: 20,
        lineHeight: 20,
    },
    emailInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 4,
        gap: 12,
        borderWidth: 1.5,
        borderColor: '#ddd',
        marginBottom: 16,
    },
    emailInput: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 14,
        color: '#1D3557',
    },
    sendButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#E63946',
        paddingVertical: 16,
        borderRadius: 14,
        marginBottom: 8,
    },
    sendButtonDisabled: {
        opacity: 0.6,
    },
    sendButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
});
