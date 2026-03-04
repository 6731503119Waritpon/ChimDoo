import { useState, useEffect, useCallback } from 'react';
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    updateDoc,
    deleteDoc,
    doc,
    Timestamp,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from './useAuth';

export type NotificationType = 'friend_request' | 'like' | 'comment' | 'review' | 'chimdoo';

export interface AppNotification {
    id: string;
    type: NotificationType;
    title: string;
    body: string;
    read: boolean;
    createdAt: Timestamp | null;
    fromUserId?: string;
    fromUserName?: string;
    fromAvatar?: string;
    metadata?: Record<string, string>;
}

export function useNotifications() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setNotifications([]);
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, 'notifications', user.uid, 'items'),
            orderBy('createdAt', 'desc')
        );

        const unsub = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map((d) => ({
                id: d.id,
                ...(d.data() as Omit<AppNotification, 'id'>),
            }));
            setNotifications(items);
            setLoading(false);
        });

        return () => unsub();
    }, [user]);

    const markAsRead = useCallback(
        async (notifId: string) => {
            if (!user) return;
            await updateDoc(doc(db, 'notifications', user.uid, 'items', notifId), {
                read: true,
            });
        },
        [user]
    );

    const markAllRead = useCallback(async () => {
        if (!user) return;
        const unread = notifications.filter((n) => !n.read);
        await Promise.all(
            unread.map((n) =>
                updateDoc(doc(db, 'notifications', user.uid, 'items', n.id), { read: true })
            )
        );
    }, [user, notifications]);

    const deleteNotification = useCallback(
        async (notifId: string) => {
            if (!user) return;
            await deleteDoc(doc(db, 'notifications', user.uid, 'items', notifId));
        },
        [user]
    );

    const unreadCount = notifications.filter((n) => !n.read).length;

    return { notifications, unreadCount, loading, markAsRead, markAllRead, deleteNotification };
}
