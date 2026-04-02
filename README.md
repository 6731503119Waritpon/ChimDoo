# ChimDoo Mobile App

ChimDoo is a comprehensive mobile application that allows users to explore, review, and share their experiences with various food items from different countries. With features like community reviews, user profiles, recipe management, and a full-fledged friend system, ChimDoo connects food lovers worldwide.

## 📦 Project Structure

```text
ChimDoo/
  ├── MainApp/                # React Native Expo Project
  │   ├── app/                # Application Routes and Screens
  │   ├── assets/             # Static Assets (Images, 3D Models)
  │   ├── components/         # Reusable UI Components (including WebSplashScreen)
  │   ├── modules/            # Feature-based Modules (Recipes, Community)
  │   ├── hooks/              # Custom React Hooks
  │   ├── services/           # External API (Firebase, Groq)
  │   └── config/             # App Configurations (Firebase, Home)
```

## 🛠 Features

- **Authentication:** Secure sign-up and sign-in functionality utilizing Firebase Auth, password recovery, and direct in-app password changes.
- **AI Assistant:** Instant culinary support with cross-screen persistence. (Groq Cloud)
- **Interactive 3D Globe:** Explore recipes globally using an interactive 3D earth model built with React Three Fiber.
- **In-App Notifications:** Real-time push-like notification system for friend requests, likes, comments, and system updates (built on Firestore).
- **Community Feed:** Browse posts, reviews, and food experiences shared by others. Toggle between a global feed and a personalized 'My Friends' feed.
- **Friend System:** Connect with other users by sending friend requests via email. Accept, reject, or manage your friends with seamless real-time updates.
- **Recipes & Reviews:** Manage your own culinary reviews, track favorite recipes, and leave comments on other users' posts.
- **Profile & Settings Management:** Keep your user profile up to date, customize notification settings, change passwords, and manage account preferences natively.
- **Support & FAQ:** Integrated Support/Contact page and real-time FAQ system powered by Firestore.
- **Multi-Platform Support:** Works efficiently across Android, iOS, and Web with a specialized web splash experience.

## 💻 Technology Stack

- **Framework:** React Native and Expo Router.
- **AI Engine:** Groq Cloud (Llama 3-70b/8b).
- **Backend/Database:** Firebase Authentication and Firestore Database.
- **Styling:** React Native Stylesheets and custom components offering a sleek, modern UI.
- **Animations:** React Native Reanimated.
- **Icons:** Lucide React Native.

## 🚀 Setup Instructions

1. Ensure you have Node.js and pnpm installed.
2. Clone the repository and navigate to the project directory:
   ```bash
   cd MainApp
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Configure Firebase: Set up your Firebase configuration values in your `.env` file based on your project settings.
5. Start the application:
   ```bash
   pnpm dev
   ```

Enjoy connecting and Chim-ming with the community!
