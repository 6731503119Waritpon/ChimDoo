import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { AppVersion } from '@/types/appContent';
import { Collections } from '@/constants/collections';

export type { AppVersion } from '@/types/appContent';

export function useAppVersion() {
    const [versions, setVersions] = useState<AppVersion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVersions = async () => {
            try {
                const q = query(
                    collection(db, Collections.appVersions),
                    orderBy('releaseDate', 'desc')
                );
                const snapshot = await getDocs(q);
                const data: AppVersion[] = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...(doc.data() as Omit<AppVersion, 'id'>),
                }));
                setVersions(data);
            } catch (err: any) {
                console.error('[useAppVersion]', err);
                setError(err.message || 'Failed to load version info');
            } finally {
                setLoading(false);
            }
        };

        fetchVersions();
    }, []);

    const latestVersion = versions.find((v) => v.isLatest) ?? versions[0] ?? null;

    return { versions, latestVersion, loading, error };
}
