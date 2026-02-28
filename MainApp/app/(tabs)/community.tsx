import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Image,
    Platform,
} from 'react-native';
import { Heart, MessageCircle, PlusCircle, Share2 } from 'lucide-react-native';
import { CommunityPost } from '@/types/community';
import { mockPosts } from '@/config/community';
import { useToast } from '@/components/ToastProvider';

const PostCard = ({ item, comingSoon }: { item: CommunityPost; comingSoon: () => void }) => (
    <View style={styles.postCard}>
        <View style={styles.postHeader}>
            <Image source={{ uri: item.userAvatar }} style={styles.postAvatar} />
            <View style={styles.postUserInfo}>
                <Text style={styles.postUserName}>{item.userName}</Text>
                <View style={styles.postMeta}>
                    <Text style={styles.postCountry}>{item.country}</Text>
                    <Text style={styles.postDot}>·</Text>
                    <Text style={styles.postTime}>{item.timeAgo}</Text>
                </View>
            </View>
        </View>

        <Image source={{ uri: item.image }} style={styles.postImage} />

        <View style={styles.postActions}>
            <TouchableOpacity
                style={styles.actionButton}
                onPress={comingSoon}
                activeOpacity={0.6}
            >
                <Heart size={22} color="#E63946" />
                <Text style={styles.actionText}>{item.likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.actionButton}
                onPress={comingSoon}
                activeOpacity={0.6}
            >
                <MessageCircle size={22} color="#1D3557" />
                <Text style={styles.actionText}>{item.comments}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.actionButton}
                onPress={comingSoon}
                activeOpacity={0.6}
            >
                <Share2 size={20} color="#777" />
            </TouchableOpacity>
        </View>

        <View style={styles.captionContainer}>
            <Text style={styles.captionUser}>{item.userName}</Text>
            <Text style={styles.captionText}>{item.caption}</Text>
        </View>
    </View>
);

const Page = () => {
    const toast = useToast();
    const comingSoon = () => toast.info('Coming Soon', 'This feature will be available soon!');
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Community</Text>
                    <Text style={styles.headerSubtitle}>
                        See what others are cooking
                    </Text>
                </View>
                <TouchableOpacity
                    style={styles.newPostButton}
                    onPress={comingSoon}
                    activeOpacity={0.7}
                >
                    <PlusCircle size={20} color="#fff" />
                    <Text style={styles.newPostText}>Post</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={mockPosts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <PostCard item={item} comingSoon={comingSoon} />}
                contentContainerStyle={styles.feedContent}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </View>
    );
};

export default Page;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },

    header: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'ios' ? 64 : 48,
        paddingHorizontal: 24,
        paddingBottom: 12,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: '#1D3557',
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#888',
        marginTop: 2,
    },
    newPostButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#E63946',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        shadowColor: '#E63946',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    newPostText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
    },

    feedContent: {
        paddingTop: 8,
        paddingBottom: 120,
    },
    separator: {
        height: 10,
    },

    postCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 5,
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        paddingBottom: 10,
        gap: 12,
    },
    postAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#f0f0f0',
        borderWidth: 2,
        borderColor: '#E63946',
    },
    postUserInfo: {
        flex: 1,
    },
    postUserName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1D3557',
    },
    postMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 2,
    },
    postCountry: {
        fontSize: 12,
        color: '#888',
        fontWeight: '500',
    },
    postDot: {
        fontSize: 12,
        color: '#ccc',
    },
    postTime: {
        fontSize: 12,
        color: '#aaa',
    },

    postImage: {
        width: '100%',
        height: 240,
        backgroundColor: '#f0f0f0',
    },

    postActions: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 20,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    actionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#444',
    },

    captionContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        paddingTop: 0,
    },
    captionUser: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1D3557',
        marginBottom: 4,
    },
    captionText: {
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
    },
});