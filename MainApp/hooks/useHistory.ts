import { useState, useEffect } from 'react';
import { getViewingHistory, addToViewingHistory, clearHistory } from '@/services/history';
import { HistoryItem } from '@/types/home';
import { FoodItem } from '@/types/recipe';

export const useHistory = () => {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    const loadHistory = async () => {
        setLoading(true);
        const data = await getViewingHistory();
        setHistory(data);
        setLoading(false);
    };

    const addHistory = async (food: FoodItem, category: string) => {
        await addToViewingHistory(food, category);
        await loadHistory();
    };

    const clearAllHistory = async () => {
        await clearHistory();
        setHistory([]);
    };

    useEffect(() => {
        loadHistory();
    }, []);

    return {
        history,
        loading,
        addHistory,
        clearAllHistory,
        refreshHistory: loadHistory,
    };
};
