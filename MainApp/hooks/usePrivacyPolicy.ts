import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export interface PolicySection {
    title: string;
    content: string;
}

export interface PrivacyPolicyData {
    lastUpdated: string;
    sections: PolicySection[];
}

export function usePrivacyPolicy() {
    const [data, setData] = useState<PrivacyPolicyData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const snap = await getDoc(doc(db, 'appContent', 'privacyPolicy'));
                if (snap.exists()) {
                    setData(snap.data() as PrivacyPolicyData);
                } else {
                    setError('Content not found');
                }
            } catch (err: any) {
                setError(err.message || 'Failed to load');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return { data, loading, error };
}
