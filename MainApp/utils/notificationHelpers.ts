import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { NotificationType } from '../hooks/useNotifications';

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
        await addDoc(collection(db, 'notifications', opts.targetUserId, 'items'), {
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
