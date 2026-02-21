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