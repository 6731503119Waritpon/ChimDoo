/**
 * Commonly repeated strings used throughout the app.
 */

export const AppStrings = {
  /** Fallback display name when the user has none set */
  anonymous: 'Anonymous',

  /** Fallback when someone's identity is unknown */
  someone: 'Someone',

  /** Version label shown in the profile footer */
  appVersion: 'ChimDoo v1.0.0',

  /** Auth gate messages */
  loginRequired: 'Login Required',
  loginToLike: 'Please log in to like posts!',
  loginToComment: 'Please log in to comment!',
  loginToAddFriend: 'Please log in to add friends!',
  loginToSaveRecipe: 'Please log in to save recipes!',
  loginToReview: 'Please log in to post a review!',
  loginToShare: 'Please log in to share!',

  /** Common form messages */
  missingFields: 'Missing Fields',
  fillAllFields: 'Please fill in all fields',
  passwordsNoMatch: 'Passwords do not match',
  weakPassword: 'Weak Password',
  passwordMinLength: 'Password must be at least 6 characters',
  missingEmail: 'Missing Email',
  enterEmail: 'Please enter your email address',
  invalidEmail: 'Invalid Email',
  enterValidEmail: 'Please enter a valid email address',

  /** Greetings based on time of day */
  greetings: {
    morning: "Good Morning! Let's find breakfast",
    afternoon: "Good Afternoon! Time for lunch",
    evening: "Good Evening! What's for dinner?",
    night: "Late Night Cravings? Find a snack",
    fallback: "Choose your place to Chim",
  },
} as const;
