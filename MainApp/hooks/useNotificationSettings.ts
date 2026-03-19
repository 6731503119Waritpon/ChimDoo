import { useState, useEffect, useCallback } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { useAuth } from './useAuth';
import { NotificationType, NotificationSettings } from '@/types/notification';
import { Collections } from '@/constants/collections';

export type { NotificationSettings } from '@/types/notification';

const DEFAULT_SETTINGS: NotificationSettings = {
    friend_request: true,
    like: true,
    comment: true,
    review: true,
    chimdoo: true,
};

export function useNotificationSettings() {
    const { user } = useAuth();
    const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setSettings(DEFAULT_SETTINGS);
            setLoading(false);
            return;
        }

        const ref = doc(db, Collections.notificationSettings, user.uid);
        const unsub = onSnapshot(ref, (snap) => {
            if (snap.exists()) {
                setSettings({ ...DEFAULT_SETTINGS, ...(snap.data() as NotificationSettings) });
            } else {
                setDoc(ref, DEFAULT_SETTINGS, { merge: true });
                setSettings(DEFAULT_SETTINGS);
            }
            setLoading(false);
        });

        return () => unsub();
    }, [user]);

    const updateSetting = useCallback(
        async (type: NotificationType, value: boolean) => {
            if (!user) return;
            const ref = doc(db, Collections.notificationSettings, user.uid);
            await setDoc(ref, { [type]: value }, { merge: true });
        },
        [user]
    );

    return { settings, loading, updateSetting };
}
