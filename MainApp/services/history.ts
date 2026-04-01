import AsyncStorage from '@react-native-async-storage/async-storage';
import { FoodItem } from '@/types/recipe';

const HISTORY_KEY = 'chimdoo_viewing_history';
const MAX_HISTORY_ITEMS = 20;

export interface HistoryItem {
    id: string;
    name: string;
    image: string;
    category: string;
    timestamp: number;
    foodData: FoodItem;
}

export const getViewingHistory = async (): Promise<HistoryItem[]> => {
    try {
        const jsonValue = await AsyncStorage.getItem(HISTORY_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.error('Error fetching history:', e);
        return [];
    }
};

export const addToViewingHistory = async (food: FoodItem, category: string): Promise<void> => {
    if (!food || !food.name) return;

    try {
        const currentHistory = await getViewingHistory();
        
        const filteredHistory = currentHistory.filter(item => item.name !== food.name);
        
        const newItem: HistoryItem = {
            id: (food as any).id || food.name,
            name: food.name,
            image: food.image,
            category: category,
            timestamp: Date.now(),
            foodData: food,
        };

        const updatedHistory = [newItem, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS);
        
        await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (e) {
        console.error('Error adding to history:', e);
    }
};

export const clearHistory = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem(HISTORY_KEY);
    } catch (e) {
        console.error('Error clearing history:', e);
    }
};
