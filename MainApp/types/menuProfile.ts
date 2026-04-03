import { LucideIcon } from 'lucide-react-native';

export type ProfileMenuItem = {
  label: string;
  icon: LucideIcon;
  iconColor: string;
  href?: string; 
};

export type ProfileMenuSection = {
  section: string;
  items: ProfileMenuItem[];
};

export interface GridCardProps {
    label: string;
    value: string;
    icon: LucideIcon;
    color: string;
    onPress: () => void;
    delay?: number;
}