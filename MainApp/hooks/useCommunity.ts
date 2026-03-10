import { useState, useEffect, useCallback } from 'react';
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    arrayUnion,
    arrayRemove,
    increment,
    serverTimestamp,
    where,
    getDocs,
    Timestamp,
} from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { useAuth } from './useAuth';
import { CommunityPost, Comment } from '@/types/community';
import { createNotification } from '@/utils/notificationHelpers';

const REVIEWS_COLLECTION = 'reviews';

export const useCommunity = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState<CommunityPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(
            collection(db, REVIEWS_COLLECTION),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as CommunityPost[];
            setPosts(items);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const addReview = useCallback(
        async (foodName: string, imageDataUri: string, description: string, country: string = '') => {
            if (!user) return;

            await addDoc(collection(db, REVIEWS_COLLECTION), {
                userId: user.uid,
                userName: user.displayName || 'Anonymous',
                userAvatar: user.photoURL || '',
                foodName,
                image: imageDataUri,
                description,
                likes: 0,
                likedBy: [],
                commentsCount: 0,
                createdAt: serverTimestamp(),
                country,
            });

            createNotification({
                targetUserId: user.uid,
                type: 'review',
                title: 'New Review Posted',
                body: `You reviewed "${foodName}" — nice one!`,
                fromUserId: user.uid,
                fromUserName: user.displayName ?? 'You',
                fromAvatar: user.photoURL ?? '',
                metadata: { foodName },
            });
        },
        [user]
    );

    const toggleLike = useCallback(
        async (reviewId: string) => {
            if (!user) return;

            const docRef = doc(db, REVIEWS_COLLECTION, reviewId);
            const post = posts.find((p) => p.id === reviewId);
            if (!post) return;

            const isLiked = post.likedBy?.includes(user.uid);

            await updateDoc(docRef, {
                likedBy: isLiked ? arrayRemove(user.uid) : arrayUnion(user.uid),
                likes: increment(isLiked ? -1 : 1),
            });

            if (!isLiked && post.userId !== user.uid) {
                createNotification({
                    targetUserId: post.userId,
                    type: 'like',
                    title: 'Someone liked your review!',
                    body: `${user.displayName ?? 'Someone'} liked your review of "${post.foodName}"`,
                    fromUserId: user.uid,
                    fromUserName: user.displayName ?? 'Someone',
                    fromAvatar: user.photoURL ?? '',
                    metadata: { reviewId, foodName: post.foodName },
                });
            }
        },
        [user, posts]
    );

    const addComment = useCallback(
        async (reviewId: string, text: string) => {
            if (!user) return;
            const post = posts.find((p) => p.id === reviewId);
            const commentsRef = collection(
                db,
                REVIEWS_COLLECTION,
                reviewId,
                'comments'
            );
            await addDoc(commentsRef, {
                userId: user.uid,
                userName: user.displayName || 'Anonymous',
                userAvatar: user.photoURL || '',
                text,
                createdAt: serverTimestamp(),
            });

            const docRef = doc(db, REVIEWS_COLLECTION, reviewId);
            await updateDoc(docRef, {
                commentsCount: increment(1),
            });

            if (post && post.userId !== user.uid) {
                createNotification({
                    targetUserId: post.userId,
                    type: 'comment',
                    title: 'New comment on your review!',
                    body: `${user.displayName ?? 'Someone'} commented: "${text.slice(0, 60)}${text.length > 60 ? '...' : ''}"`,
                    fromUserId: user.uid,
                    fromUserName: user.displayName ?? 'Someone',
                    fromAvatar: user.photoURL ?? '',
                    metadata: { reviewId, foodName: post.foodName },
                });
            }
        },
        [user, posts]
    );

    const subscribeToComments = useCallback(
        (reviewId: string, callback: (comments: Comment[]) => void) => {
            const q = query(
                collection(db, REVIEWS_COLLECTION, reviewId, 'comments'),
                orderBy('createdAt', 'asc')
            );

            return onSnapshot(q, (snapshot) => {
                const comments = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Comment[];
                callback(comments);
            });
        },
        []
    );

    const getUserReviews = useCallback((): CommunityPost[] => {
        if (!user) return [];
        return posts.filter((p) => p.userId === user.uid);
    }, [user, posts]);

    const getUserFavorites = useCallback((): CommunityPost[] => {
        if (!user) return [];
        return posts.filter((p) => p.likedBy?.includes(user.uid));
    }, [user, posts]);

    const hasReviewed = useCallback((foodName: string): CommunityPost | null => {
        if (!user) return null;
        return posts.find((p) => p.userId === user.uid && p.foodName === foodName) || null;
    }, [user, posts]);

    const deleteReview = useCallback(
        async (reviewId: string) => {
            if (!user) return;
            const commentsRef = collection(db, REVIEWS_COLLECTION, reviewId, 'comments');
            const commentsSnapshot = await getDocs(commentsRef);
            const deletePromises = commentsSnapshot.docs.map((commentDoc) =>
                deleteDoc(commentDoc.ref)
            );
            await Promise.all(deletePromises);

            await deleteDoc(doc(db, REVIEWS_COLLECTION, reviewId));
        },
        [user]
    );

    return {
        posts,
        loading,
        addReview,
        toggleLike,
        addComment,
        subscribeToComments,
        getUserReviews,
        getUserFavorites,
        hasReviewed,
        deleteReview,
        isLoggedIn: !!user,
        currentUserId: user?.uid,
    };
};

export default useCommunity;
