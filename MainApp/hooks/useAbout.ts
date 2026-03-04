import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export interface AboutFeature {
    iconName: string;
    color: string;
    title: string;
    desc: string;
}

export interface AboutData {
    tagline: string;
    description: string;
    features: AboutFeature[];
    credits: string;
}

export function useAbout() {
    const [data, setData] = useState<AboutData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const snap = await getDoc(doc(db, 'appContent', 'about'));
                if (snap.exists()) {
                    setData(snap.data() as AboutData);
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
