import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { AboutData } from '@/types/appContent';
import { Collections } from '@/constants/collections';
import { getErrorMessage } from '@/types/firebase';

export type { AboutFeature, AboutData } from '@/types/appContent';

export function useAbout() {
    const [data, setData] = useState<AboutData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const snap = await getDoc(doc(db, Collections.appContent, 'about'));
                if (snap.exists()) {
                    setData(snap.data() as AboutData);
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
