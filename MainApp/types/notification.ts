import { Timestamp } from 'firebase/firestore';

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

export type NotificationSettings = Record<NotificationType, boolean>;