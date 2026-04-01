import { addDoc, collection, serverTimestamp, getDoc, doc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { NotificationType, NotificationSettings } from '@/types/notification';
import { Collections } from '@/constants/collections';

interface CreateNotifOptions {
    targetUserId: string;
    type: NotificationType;
    title: string;
    body: string;
    fromUserId?: string;
    fromUserName?: string;
    fromAvatar?: string;
    metadata?: Record<string, string>;
}

export async function createNotification(opts: CreateNotifOptions): Promise<void> {
    try {
        const settingsRef = doc(db, Collections.notificationSettings, opts.targetUserId);
        const settingsSnap = await getDoc(settingsRef);

        if (settingsSnap.exists()) {
            const settings = settingsSnap.data() as NotificationSettings;
            if (settings[opts.type] === false) {
                return;
            }
        }

        await addDoc(collection(db, Collections.notifications, opts.targetUserId, 'items'), {
            type: opts.type,
            title: opts.title,
            body: opts.body,
            read: false,
            createdAt: serverTimestamp(),
            fromUserId: opts.fromUserId ?? null,
            fromUserName: opts.fromUserName ?? null,
            fromAvatar: opts.fromAvatar ?? null,
            metadata: opts.metadata ?? {},
        });
    } catch (err) {
        console.warn('[createNotification] Failed:', err);
    }
}
