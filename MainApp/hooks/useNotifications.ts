import { useState, useEffect, useCallback } from 'react';
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    updateDoc,
    deleteDoc,
    doc,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from './useAuth';
import { AppNotification } from '@/types/notification';
import { Collections } from '@/constants/collections';
export type { NotificationType, AppNotification } from '@/types/notification';

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
            collection(db, Collections.notifications, user.uid, 'items'),
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
            await updateDoc(doc(db, Collections.notifications, user.uid, 'items', notifId), {
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
                updateDoc(doc(db, Collections.notifications, user.uid, 'items', n.id), { read: true })
            )
        );
    }, [user, notifications]);

    const deleteNotification = useCallback(
        async (notifId: string) => {
            if (!user) return;
            await deleteDoc(doc(db, Collections.notifications, user.uid, 'items', notifId));
        },
        [user]
    );

    const unreadCount = notifications.filter((n) => !n.read).length;

    return { 
        notifications, 
        unreadCount, 
        loading, 
        markAsRead, 
        markAllRead, 
        deleteNotification 
    };
}
