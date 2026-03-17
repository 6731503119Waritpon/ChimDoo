import { useState, useEffect, useCallback } from 'react';
import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    deleteDoc,
    onSnapshot,
    serverTimestamp,
    Timestamp,
} from 'firebase/firestore';
import { db } from '@/services/firestore';
import { useAuth } from './useAuth';
import { FoodItem } from '@/types/recipe';
import { createNotification } from '@/utils/notificationHelpers';

export interface ChimDooItem extends FoodItem {
    id: string;
    category: string;
    chimDooAt: Timestamp;
}

export const useChimDoo = (foodName?: string) => {
    const { user } = useAuth();
    const [chimDooList, setChimDooList] = useState<ChimDooItem[]>([]);
    const [isChimDoo, setIsChimDoo] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setChimDooList([]);
            setIsChimDoo(false);
            setLoading(false);
            return;
        }

        const colRef = collection(db, 'users', user.uid, 'chimDoo');
        const unsubscribe = onSnapshot(colRef, (snapshot) => {
            const items = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as ChimDooItem[];

            setChimDooList(items);

            if (foodName) {
                setIsChimDoo(
                    items.some(
                        (item) =>
                            item.name.toLowerCase() === foodName.toLowerCase()
                    )
                );
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, [user, foodName]);

    const toggleChimDoo = useCallback(
        async (food: FoodItem, category?: string) => {
            if (!user) return false;

            const colRef = collection(db, 'users', user.uid, 'chimDoo');

            const q = query(colRef, where('name', '==', food.name));
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                const deletePromises = snapshot.docs.map((doc) =>
                    deleteDoc(doc.ref)
                );
                await Promise.all(deletePromises);
                return false;
            } else {
                await addDoc(colRef, {
                    name: food.name,
                    image: food.image,
                    description: food.description,
                    category: category || '',
                    taste: food.taste || [],
                    servings: food.servings || '',
                    prepTime: food.prepTime || '',
                    ingredients: food.ingredients || [],
                    instructions: food.instructions || [],
                    chimDooAt: serverTimestamp(),
                });
                
                await createNotification({
                    targetUserId: user.uid,
                    type: 'chimdoo',
                    title: `Chim ${food.name} Successfully`,
                    body: `You've tasted ${food.name}! Check back anytime to review it`,
                });
                
                return true;
            }
        },
        [user]
    );

    return {
        chimDooList,
        isChimDoo,
        loading,
        toggleChimDoo,
        isLoggedIn: !!user,
    };
};

export default useChimDoo;
