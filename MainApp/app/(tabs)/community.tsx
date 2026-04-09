import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Platform,
    RefreshControl,
} from 'react-native';
import { UsersRound, CircleHelp } from 'lucide-react-native';
import { CommunityPost } from '@/types/community';
import { useCommunity } from '@/hooks/useCommunity';
import { useFriends } from '@/hooks/useFriends';
import { useCommunityUI } from '@/hooks/useCommunityUI';
import { useToast } from '@/components/ui/ToastProvider';
import CommentModal from '@/components/modals/CommentModal';
import GuestState from '@/components/ui/GuestState';
import PostCard from '@/components/cards/PostCard';
import Pagination from '@/components/ui/Pagination';
import SkeletonPostCard from '@/components/ui/SkeletonPostCard';
import ConfirmCancelModal from '@/components/modals/ConfirmCancelModal';
import CommunityInfoModal from '@/components/modals/CommunityInfoModal';
import SharePostModal from '@/components/modals/SharePostModal';
import ImageFullscreenModal from '@/components/modals/ImageFullscreenModal';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';

import { FeedTabBar } from '@/modules/community/components/FeedTabBar';
import { EmptyFeedState } from '@/modules/community/components/EmptyFeedState';

type FeedTab = 'global' | 'friends';

const Page = () => {
    const { loading, isLoggedIn, currentUserId } = useCommunity();
    const { getFriendStatus } = useFriends();

    const {
        feedTab, setFeedTab,
        commentReviewId, setCommentReviewId,
        cancelModalVisible, setCancelModalVisible,
        infoModalVisible, setInfoModalVisible,
        pendingCancelInfo, isCanceling,
        sharingPost, setSharingPost,
        selectedFullImage, setSelectedFullImage,
        currentPage, setCurrentPage,
        refreshing, onRefresh,
        paginatedPosts, totalItems, ITEMS_PER_PAGE,
        displayPosts,
        handleLike, handleComment, handleShare, handleImagePress,
        handleAddFriend, handleCancelPress, handleConfirmCancel
    } = useCommunityUI();

    if (!isLoggedIn) {
        return (
            <GuestState
                icon={UsersRound}
                title="Community"
                subtitle="Sign in to see reviews, share your food experiences, and connect with other food lovers!"
            />
        );
    }

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <Text style={styles.headerTitle}>Community</Text>
                            <CircleHelp size={28} color={AppColors.navy} />
                        </View>
                        <Text style={styles.headerSubtitle}>
                            See what others are cooking
                        </Text>
                    </View>
                </View>
                <FeedTabBar feedTab={feedTab} setFeedTab={setFeedTab} />
                <FlatList
                    data={[1, 2, 3]}
                    keyExtractor={(i) => i.toString()}
                    renderItem={() => <SkeletonPostCard />}
                    contentContainerStyle={styles.feedContent}
                />
            </View>
        );
    }

    return (
        <>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <Text style={styles.headerTitle}>Community</Text>
                            <TouchableOpacity
                                onPress={() => setInfoModalVisible(true)}
                                activeOpacity={0.6}
                                style={{ paddingTop: 6 }}
                            >
                                <CircleHelp size={28} color={AppColors.navy} />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.headerSubtitle}>
                            See what others are cooking
                        </Text>
                    </View>
                </View>

                <FeedTabBar feedTab={feedTab} setFeedTab={setFeedTab} />

                {displayPosts.length === 0 ? (
                    <EmptyFeedState feedTab={feedTab} />
                ) : (
                    <FlatList
                        data={paginatedPosts}
                        refreshControl={
                            <RefreshControl 
                                refreshing={refreshing} 
                                onRefresh={onRefresh} 
                                colors={[AppColors.primary]} 
                                tintColor={AppColors.primary} 
                            />
                        }
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <PostCard
                                item={item}
                                onLike={handleLike}
                                onComment={handleComment}
                                onShare={handleShare}
                                onImagePress={handleImagePress}
                                isLiked={!!(currentUserId && item.likedBy?.includes(currentUserId))}
                                onAddFriend={handleAddFriend}
                                friendStatus={getFriendStatus(item.userId)}
                                onCancelFriend={handleCancelPress}
                                isOwnPost={item.userId === currentUserId}
                            />
                        )}
                        contentContainerStyle={styles.feedContent}
                        showsVerticalScrollIndicator={false}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                        ListFooterComponent={
                            totalItems > 0 ? (
                                <View style={styles.paginationWrapper}>
                                    <Pagination
                                        currentPage={currentPage}
                                        totalItems={totalItems}
                                        itemsPerPage={ITEMS_PER_PAGE}
                                        onPageChange={(page) => setCurrentPage(page)}
                                    />
                                </View>
                            ) : null
                        }
                    />
                )}

                <CommentModal
                    visible={!!commentReviewId}
                    reviewId={commentReviewId || ''}
                    onClose={() => setCommentReviewId(null)}
                />

                <ConfirmCancelModal
                    visible={cancelModalVisible}
                    onClose={() => setCancelModalVisible(false)}
                    onConfirm={handleConfirmCancel}
                    userName={pendingCancelInfo?.name || ''}
                    loading={isCanceling}
                />

                <CommunityInfoModal
                    visible={infoModalVisible}
                    onClose={() => setInfoModalVisible(false)}
                />

                <SharePostModal
                    visible={!!sharingPost}
                    item={sharingPost}
                    onClose={() => setSharingPost(null)}
                />

                <ImageFullscreenModal
                    visible={!!selectedFullImage}
                    imageUri={selectedFullImage}
                    onClose={() => setSelectedFullImage(null)}
                />
            </View>
        </>
    );
};

export default Page;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.backgroundLight,
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
        fontFamily: AppFonts.bold,
        fontSize: 32,
        color: AppColors.navy,
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontFamily: AppFonts.regular,
        fontSize: 14,
        color: AppColors.textLight,
        marginTop: 2,
    },

    feedContent: {
        paddingTop: 8,
        paddingBottom: 160,
    },
    separator: {
        height: 10,
    },
    paginationWrapper: {
        marginTop: 6,
        marginBottom: 40,
        paddingHorizontal: 20,
    },
});