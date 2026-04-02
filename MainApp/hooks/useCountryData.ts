import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { CountryDetail } from '@/types/country';
import { Collections } from '@/constants/collections';

export const useCountryData = (countryId: string) => {
    const [data, setData] = useState<CountryDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCountry = async () => {
            if (!countryId) return;
            
            try {
                setLoading(true);
                const docRef = doc(db, Collections.countries, countryId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setData(docSnap.data() as CountryDetail);
                } else {
                    setError('Country not found');
                }
            } catch (err) {
                console.error("Error fetching document: ", err);
                setError('Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        fetchCountry();
    }, [countryId]);

    return { data, loading, error };
};