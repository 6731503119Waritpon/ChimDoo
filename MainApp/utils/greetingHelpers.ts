import { Sun, CloudSun, SunMoon, Moon, LucideIcon } from 'lucide-react-native';
import { AppStrings } from '../constants/strings';

/**
 * Utility function to get the current greeting and icon based on the time of day.
 */
export function getGreetingConfig(): { message: string; icon: LucideIcon } {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 11) {
    return {
      message: AppStrings.greetings.morning,
      icon: Sun,
    };
  } else if (hour >= 11 && hour < 16) {
    return {
      message: AppStrings.greetings.afternoon,
      icon: CloudSun,
    };
  } else if (hour >= 16 && hour < 22) {
    return {
      message: AppStrings.greetings.evening,
      icon: SunMoon,
    };
  } else {
    return {
      message: AppStrings.greetings.night,
      icon: Moon,
    };
  }
}
