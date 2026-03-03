# ChimDoo Mobile App

ChimDoo is a comprehensive mobile application that allows users to explore, review, and share their experiences with various food items from different countries. With features like community reviews, user profiles, recipe management, and a full-fledged friend system, ChimDoo connects food lovers worldwide.

## ��� Project Structure

```text
ChimDoo/
├── MainApp/                # React Native Expo project
│   ├── app/                # Application routes and screens
│   │   ├── (tabs)/         # Bottom navigation tabs (Home, Recipes, Community, Profile)
│   │   ├── auth/           # Authentication screens (Login, Signup, Forgot Password)
│   │   ├── recipe/         # Screen specific to recipe details
│   │   ├── country/        # Screen for country-specific content
│   │   ├── _layout.tsx     # Root layout setup
│   │   └── +not-found.tsx  # Unhandled route fallback
│   ├── assets/             # Images, fonts, and static assets
│   ├── components/         # Reusable UI components
│   ├── constants/          # Application theme, fonts, icons, etc.
│   ├── hooks/              # Custom React Hooks
│   ├── config/             # Configuration objects and data options
│   ├── types/              # TypeScript interface definitions
│   ├── services/           # External API interactions and backend logic
│   ├── .env                # Environment variable setup
│   ├── firebaseConfig.ts   # Configuration for Firebase connection
│   └── package.json        # Dependencies and build settings
└── README.md               # You are reading this right now
```

## ��� Features

- **Authentication:** Secure sign-up and sign-in functionality utilizing Firebase Auth, including Google Sign-In and persistent login.
- **Community Feed:** Browse posts, reviews, and food experiences shared by others. Toggle between a global feed and a personalized 'My Friends' feed.
- **Friend System:** Connect with other users by sending friend requests via email. Accept, reject, or manage your friends with seamless real-time updates.
- **Recipes & Reviews:** Manage your own culinary reviews, track favorite recipes, and leave comments on other users' posts.
- **Profile Management:** Keep your user profile up to date, review your activity, and enjoy an intuitive, modern interface customized to your needs.
- **Multi-Platform Support:** Works efficiently across both Android and iOS environments with responsive web support built in via Expo.

## ��� Technology Stack

- **Framework:** React Native and Expo Router.
- **Backend/Database:** Firebase Authentication and Firestore Database.
- **Styling:** React Native Stylesheets and custom components offering a sleek, modern UI.
- **Animations:** React Native Reanimated.
- **Icons:** Lucide React Native.

## ��� Setup Instructions

1. Ensure you have Node.js and npm installed.
2. Clone the repository and navigate to the project directory:
   ```bash
   cd MainApp
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Configure Firebase: Set up your Firebase configuration values in your `.env` file based on your project settings.
5. Start the application:
   ```bash
   npm start
   ```

Enjoy connecting and Chim-ming with the community!
