import { House, CookingPot, UsersRound, UserRound, LucideProps } from "lucide-react-native"
import React from "react"

export const icon = {
  index: (props: LucideProps) => <House size={24} {...props} />,
  recipes: (props: LucideProps) => <CookingPot size={24} {...props} />,
  community: (props: LucideProps) => <UsersRound size={24} {...props} />,
  profile: (props: LucideProps) => <UserRound size={24} {...props} />,
}