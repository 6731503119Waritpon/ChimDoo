import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { PrivacyPolicyData } from '@/types/appContent';
import { Collections } from '@/constants/collections';
import { getErrorMessage } from '@/types/firebase';

export type { PolicySection, PrivacyPolicyData } from '@/types/appContent';

export function usePrivacyPolicy() {
    const [data, setData] = useState<PrivacyPolicyData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const snap = await getDoc(doc(db, Collections.appContent, 'privacyPolicy'));
                if (snap.exists()) {
                    setData(snap.data() as PrivacyPolicyData);
                } else {
                    setError('Content not found');
                }
            } catch (err: unknown) {
                setError(getErrorMessage(err));
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return { data, loading, error };
}
