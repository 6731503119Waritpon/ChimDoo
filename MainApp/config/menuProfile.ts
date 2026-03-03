import {
  UserPen,
  KeyRound,
  Globe,
  Heart,
  HelpCircle,
  Mail,
  Info,
  Smartphone,
  MessageCircleMore,
  Bell,
  FileText,
  Users,
} from 'lucide-react-native';
import { ProfileMenuSection } from '../types/menuProfile';

export const profileMenuConfig: ProfileMenuSection[] = [
  {
    section: 'My Kitchen',
    items: [
      { label: 'Favorites', icon: Heart, iconColor: '#E63946', href: '/profile/mykitchen/favorites' },
      { label: 'My Reviews', icon: MessageCircleMore, iconColor: '#E63946', href: '/profile/mykitchen/my-reviews' },
      { label: 'My Friends', icon: Users, iconColor: '#E63946', href: '/profile/mykitchen/my-friends' },
    ],
  },
  {
    section: 'Account',
    items: [
      { label: 'Edit Profile', icon: UserPen, iconColor: '#1D3557', href: '/profile/account/edit-profile' },
      { label: 'Change Password', icon: KeyRound, iconColor: '#1D3557'},
      { label: 'Notifications', icon: Bell, iconColor: '#1D3557'},
      { label: 'Language', icon: Globe, iconColor: '#1D3557', href: '/profile/account/language-settings' },
    ],
  },
  {
    section: 'Support',
    items: [
      { label: 'FAQ', icon: HelpCircle, iconColor: '#3b82f6', href: '/profile/support/faq' },
      { label: 'Contact Us', icon: Mail, iconColor: '#3b82f6'},
    ],
  },
  {
    section: 'General',
    items: [
      { label: 'Privacy Policy & Terms of Service', icon: FileText, iconColor: '#8b5cf6'},
      { label: 'About ChimDoo', icon: Info, iconColor: '#8b5cf6'},
      { label: 'App Version', icon: Smartphone, iconColor: '#8b5cf6'},
    ],
  },
];