import { useState, useEffect, useCallback, useMemo } from 'react';
import {
    collection,
    query,
    where,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    serverTimestamp,
    setDoc,
} from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { useAuth } from './useAuth';
import { Friendship, FriendInfo } from '@/types/friends';
import { createNotification } from '@/utils/notificationHelpers';
import { Collections } from '@/constants/collections';
import { AppStrings } from '@/constants/strings';

export const useFriends = () => {
    const { user } = useAuth();
    const [friendships, setFriendships] = useState<Friendship[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const userRef = doc(db, Collections.users, user.uid);
        setDoc(userRef, {
            uid: user.uid,
            email: (user.email || '').toLowerCase(),
            displayName: user.displayName || AppStrings.anonymous,
            photoURL: user.photoURL || '',
            updatedAt: serverTimestamp(),
        }, { merge: true }).catch((err) => {
            console.error('[useFriends] Failed to save user profile:', err);
        });
    }, [user]);

    useEffect(() => {
        if (!user) {
            setFriendships([]);
            setLoading(false);
            return;
        }

        const friendshipMap = new Map<string, Friendship>();
        let q1Done = false;
        let q2Done = false;

        const updateState = () => {
            if (q1Done && q2Done) {
                setFriendships(Array.from(friendshipMap.values()));
                setLoading(false);
            }
        };

        const q1 = query(
            collection(db, Collections.friendships),
            where('requesterId', '==', user.uid)
        );

        const q2 = query(
            collection(db, Collections.friendships),
            where('requesteeId', '==', user.uid)
        );

        const unsub1 = onSnapshot(q1, (snapshot) => {
            snapshot.docs.forEach((d) => {
                friendshipMap.set(d.id, { id: d.id, ...d.data() } as Friendship);
            });
            const q1Ids = new Set(snapshot.docs.map((d) => d.id));
            friendshipMap.forEach((_, key) => {
                const f = friendshipMap.get(key);
                if (f && f.requesterId === user.uid && !q1Ids.has(key)) {
                    friendshipMap.delete(key);
                }
            });
            q1Done = true;
            updateState();
        });

        const unsub2 = onSnapshot(q2, (snapshot) => {
            snapshot.docs.forEach((d) => {
                friendshipMap.set(d.id, { id: d.id, ...d.data() } as Friendship);
            });
            const q2Ids = new Set(snapshot.docs.map((d) => d.id));
            friendshipMap.forEach((_, key) => {
                const f = friendshipMap.get(key);
                if (f && f.requesteeId === user.uid && f.requesterId !== user.uid && !q2Ids.has(key)) {
                    friendshipMap.delete(key);
                }
            });
            q2Done = true;
            updateState();
        });

        return () => {
            unsub1();
            unsub2();
        };
    }, [user]);

    const friendsList = useMemo((): FriendInfo[] => {
        if (!user) return [];
        return friendships
            .filter((f) => f.status === 'accepted')
            .map((f) => {
                const isRequester = f.requesterId === user.uid;
                return {
                    uid: isRequester ? f.requesteeId : f.requesterId,
                    displayName: isRequester ? f.requesteeName : f.requesterName,
                    photoURL: isRequester ? f.requesteeAvatar : f.requesterAvatar,
                    friendshipId: f.id,
                };
            });
    }, [user, friendships]);

    const friendUserIds = useMemo((): string[] => {
        return friendsList.map((f) => f.uid);
    }, [friendsList]);

    const incomingRequests = useMemo((): (Friendship & { senderInfo: FriendInfo })[] => {
        if (!user) return [];
        return friendships
            .filter((f) => f.requesteeId === user.uid && f.status === 'pending')
            .map((f) => ({
                ...f,
                senderInfo: {
                    uid: f.requesterId,
                    displayName: f.requesterName,
                    photoURL: f.requesterAvatar,
                    friendshipId: f.id,
                },
            }));
    }, [user, friendships]);

    const outgoingRequests = useMemo((): Friendship[] => {
        if (!user) return [];
        return friendships.filter(
            (f) => f.requesterId === user.uid && f.status === 'pending'
        );
    }, [user, friendships]);

    const getFriendStatus = useCallback(
        (targetUserId: string): 'none' | 'pending_sent' | 'pending_received' | 'accepted' => {
            if (!user || targetUserId === user.uid) return 'none';

            const friendship = friendships.find(
                (f) =>
                    (f.requesterId === user.uid && f.requesteeId === targetUserId) ||
                    (f.requesteeId === user.uid && f.requesterId === targetUserId)
            );

            if (!friendship) return 'none';
            if (friendship.status === 'accepted') return 'accepted';
            if (friendship.status === 'pending') {
                return friendship.requesterId === user.uid
                    ? 'pending_sent'
                    : 'pending_received';
            }
            return 'none';
        },
        [user, friendships]
    );

    const sendFriendRequest = useCallback(
        async (targetUserId: string, targetName: string, targetAvatar: string) => {
            if (!user) return;
            const existing = friendships.find(
                (f) =>
                    ((f.requesterId === user.uid && f.requesteeId === targetUserId) ||
                        (f.requesteeId === user.uid && f.requesterId === targetUserId)) &&
                    f.status !== 'rejected'
            );

            if (existing) {
                throw new Error('Friend request already exists');
            }

            await addDoc(collection(db, Collections.friendships), {
                requesterId: user.uid,
                requesteeId: targetUserId,
                requesterName: user.displayName || AppStrings.anonymous,
                requesterAvatar: user.photoURL || '',
                requesteeName: targetName,
                requesteeAvatar: targetAvatar,
                status: 'pending',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            createNotification({
                targetUserId,
                type: 'friend_request',
                title: 'New Friend Request',
                body: `${user.displayName ?? AppStrings.someone} sent you a friend request`,
                fromUserId: user.uid,
                fromUserName: user.displayName ?? AppStrings.someone,
                fromAvatar: user.photoURL ?? '',
            });
        },
        [user, friendships]
    );

    const sendFriendRequestByEmail = useCallback(
        async (email: string) => {
            if (!user) throw new Error('Not logged in');

            if (email.toLowerCase() === user.email?.toLowerCase()) {
                throw new Error('SELF');
            }

            const q = query(
                collection(db, Collections.users),
                where('email', '==', email.toLowerCase())
            );
            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                throw new Error('NOT_FOUND');
            }

            const targetDoc = snapshot.docs[0];
            const targetData = targetDoc.data();

            const existing = friendships.find(
                (f) =>
                    ((f.requesterId === user.uid && f.requesteeId === targetData.uid) ||
                        (f.requesteeId === user.uid && f.requesterId === targetData.uid)) &&
                    f.status !== 'rejected'
            );

            if (existing) {
                throw new Error('ALREADY_EXISTS');
            }

            await addDoc(collection(db, Collections.friendships), {
                requesterId: user.uid,
                requesteeId: targetData.uid,
                requesterName: user.displayName || AppStrings.anonymous,
                requesterAvatar: user.photoURL || '',
                requesteeName: targetData.displayName || AppStrings.anonymous,
                requesteeAvatar: targetData.photoURL || '',
                status: 'pending',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            return targetData.displayName || email;
        },
        [user, friendships]
    );

    const acceptFriendRequest = useCallback(
        async (friendshipId: string) => {
            if (!user) return;
            const docRef = doc(db, Collections.friendships, friendshipId);
            await updateDoc(docRef, {
                status: 'accepted',
                updatedAt: serverTimestamp(),
            });
        },
        [user]
    );

    const rejectFriendRequest = useCallback(
        async (friendshipId: string) => {
            if (!user) return;
            const docRef = doc(db, Collections.friendships, friendshipId);
            await deleteDoc(docRef);
        },
        [user]
    );

    const removeFriend = useCallback(
        async (friendshipId: string) => {
            if (!user) return;
            const docRef = doc(db, Collections.friendships, friendshipId);
            await deleteDoc(docRef);
        },
        [user]
    );

    const cancelFriendRequest = useCallback(
        async (friendshipId: string) => {
            if (!user) return;
            const docRef = doc(db, Collections.friendships, friendshipId);
            await deleteDoc(docRef);
        },
        [user]
    );

    return {
        loading,
        friendsList,
        friendUserIds,
        incomingRequests,
        outgoingRequests,
        getFriendStatus,
        sendFriendRequest,
        sendFriendRequestByEmail,
        acceptFriendRequest,
        rejectFriendRequest,
        removeFriend,
        cancelFriendRequest,
    };
};

export default useFriends;