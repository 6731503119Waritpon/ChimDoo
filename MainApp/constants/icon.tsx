 import { House , CookingPot , UsersRound , UserRound } from "lucide-react-native"


 export const icon = {
    index: (props: any) => <House size={24} {...props} />,
    recipes: (props: any) => <CookingPot size={24} {...props} />,
    community: (props: any) => <UsersRound size={24} {...props} />,
    profile: (props: any) => <UserRound size={24} {...props} />,
  }