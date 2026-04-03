import { Timestamp } from 'firebase/firestore';

export interface FoodItem {
    name: string;
    image: string;
    description: string;
    ingredients?: string[];
    instructions?: string[];
    taste?: Taste[]; 
    servings?: ServingSize;
    prepTime?: PrepTime;
}

export enum Taste {
    SWEET = "Sweet",
    SALTY = "Salty",
    SPICY = "Spicy",
    SOUR = "Sour", //เปรี้ยว
    BLAND = "Bland", // จืด
    SAVORY = "Savory" // กลมกล่อม/อูมามิ
}

export enum ServingSize {
    SINGLE = "1 Serving",
    COUPLE = "2 Servings",
    FAMILY = "4+ Servings"
}

export enum PrepTime {
    VERY_SHORT = "15 min",
    SHORT = "30 min",
    MEDIUM = "1 hour",
    LONG = "2+ hours"
}

export interface RecipeFilterBarProps {
    search: string;
    setSearch: (text: string) => void;
    sortMode: string;
    handleSortPress: () => void;
    viewMode: 'grid' | 'list';
    changeViewMode: (mode: 'grid' | 'list') => void;
    categories: string[];
    activeCategory: string;
    setActiveCategory: (cat: string) => void;
    isCategoriesExpanded: boolean;
    setIsCategoriesExpanded: (expanded: boolean) => void;
}

export interface ChimDooItem extends FoodItem {
    id: string;
    category: string;
    chimDooAt: Timestamp;
}