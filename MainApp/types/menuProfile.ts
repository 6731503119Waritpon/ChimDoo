import { LucideIcon } from 'lucide-react-native';

export type ProfileMenuAction = 'coming_soon' | 'contact' | 'about' | 'version';

export type ProfileMenuItem = {
  label: string;
  icon: LucideIcon;
  iconColor: string;
  href?: string; 
  action?: ProfileMenuAction;
};

export type ProfileMenuSection = {
  section: string;
  items: ProfileMenuItem[];
};