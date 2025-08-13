# Firebase Setup Instructions

## 🔥 Firebase Configuration Setup

You now have a complete Firebase setup for your CribnConnect app! Here's how to complete the configuration:

## 1. Firebase Console Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing project
3. Add a web app to your project
4. Copy the configuration object

## 2. Replace Configuration

In `config/firebase.js`, replace this configuration:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project-id.firebaseapp.com", 
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id" // Optional
};
```

With your actual Firebase configuration from the console.

## 3. Enable Firebase Services

In your Firebase console, enable these services:

### Authentication
- Go to Authentication > Sign-in method
- Enable Email/Password authentication
- Optionally enable Google, Facebook, etc.

### Firestore Database
- Go to Firestore Database
- Create database in production mode (or test mode for development)
- Set up security rules as needed

### Storage
- Go to Storage
- Get started with default rules
- Configure for image uploads

## 4. Wrap Your App with AuthProvider

Update your main app file (likely `app/_layout.jsx` or `App.jsx`):

```jsx
import { AuthProvider } from '@/contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      {/* Your existing app content */}
    </AuthProvider>
  );
}
```

## 5. Use Firebase in Components

### Authentication Example:
```jsx
import { useAuth } from '@/contexts/AuthContext';
import { loginUser, registerUser } from '@/services/authService';

function LoginScreen() {
  const { user, isAuthenticated } = useAuth();
  
  const handleLogin = async (email, password) => {
    const result = await loginUser(email, password);
    if (result.error) {
      // Handle error
    }
  };
}
```

### Firestore Example:
```jsx
import { createApartment, getApartments } from '@/services/firestoreService';

// Create apartment
const apartmentData = {
  title: "Modern Studio",
  price: 1200,
  location: "Downtown",
  // ... other fields
};
const result = await createApartment(apartmentData);

// Get apartments
const apartments = await getApartments();
```

## 6. Update ProfilePopup

The ProfilePopup component is ready for Firebase integration. To activate:

1. Uncomment the Firebase imports in `components/ProfilePopup.jsx`:
```jsx
import { useAuth } from '@/contexts/AuthContext';
import { logoutUser } from '@/services/authService';
```

2. Uncomment the auth usage:
```jsx
const { user: authUser, isAuthenticated } = useAuth();
const currentUser = authUser || user;
```

3. Uncomment logout functionality

## 7. Data Structure Examples

### User Document (Firestore):
```javascript
{
  uid: "user123",
  email: "user@example.com",
  name: "John Doe",
  age: 25,
  bio: "Software developer...",
  interests: ["tech", "coffee"],
  profileImage: "https://...",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
}
```

### Apartment Document:
```javascript
{
  title: "Modern Studio Downtown",
  price: 1200,
  location: "Downtown Manhattan",
  type: "Studio",
  apartmentType: "full",
  amenities: ["Gym", "Rooftop"],
  imageUri: "https://...",
  hostId: "user123",
  createdAt: "2024-01-01T00:00:00.000Z"
}
```

## 8. Security Rules Examples

### Firestore Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Anyone can read apartments/events/linkups
    match /apartments/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /events/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 9. Environment Variables (Optional)

For better security, you can use environment variables:

Create `.env`:
```
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
```

Then update `firebase.js`:
```javascript
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  // ... etc
};
```

## 🎉 You're Ready!

Your Firebase setup includes:
- ✅ Authentication with email/password
- ✅ Firestore database operations
- ✅ Storage for images
- ✅ Auth context for state management
- ✅ Service functions for common operations
- ✅ TypeScript support
- ✅ React Native persistence

Just replace the configuration and you're good to go!
