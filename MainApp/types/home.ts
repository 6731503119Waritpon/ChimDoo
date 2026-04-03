import { FoodItem } from './recipe';

export interface GlobeCountry {
  id: string;
  name: string;
  flag: string;
  isoCode: string;
  lon: number;
  lat: number;
}

export interface SphericalTarget {
  phi: number;
  theta: number;
}

export interface HistoryItem {
    id: string;
    name: string;
    image: string;
    category: string;
    timestamp: number;
    foodData: FoodItem;
}

export interface AnimatedControlsProps {
  target: SphericalTarget | null;
  zooming: boolean;
  onRotationDone: () => void;
  onZoomDone: () => void;
}