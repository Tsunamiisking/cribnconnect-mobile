# Crib & Connect Mobile App

A React Native mobile application built with Expo Router and NativeWind for discovering apartments, attending events, and creating social connections.

## 🏗️ Project Structure

```
cribnconnect/
├── app/                          # Main app directory (Expo Router)
│   ├── _layout.jsx              # Root layout with navigation setup
│   ├── index.jsx                # Welcome/landing screen
│   ├── +not-found.jsx          # 404 error screen
│   │
│   ├── (auth)/                  # Authentication flow
│   │   ├── _layout.jsx          # Auth stack navigation
│   │   ├── login.jsx            # Login screen
│   │   └── register.jsx         # Registration screen
│   │
│   ├── (tabs)/                  # Main tab navigation
│   │   ├── _layout.jsx          # Tab bar configuration
│   │   ├── index.jsx            # Apartments tab (main)
│   │   ├── events.jsx           # Events tab
│   │   ├── linkups.jsx          # Linkups tab
│   │   ├── messages.jsx         # Messages tab
│   │   └── bookmarks.jsx        # Bookmarks tab
│   │
│   ├── (hosting)/               # Content creation flows
│   │   ├── _layout.jsx          # Hosting stack navigation
│   │   ├── add-apartment.jsx    # Add apartment form (5 steps)
│   │   ├── add-event.jsx        # Add event form (5 steps)
│   │   └── add-linkup.jsx       # Add linkup form (4 steps)
│   │
│   ├── (screens)/               # Detail and utility screens
│   │   ├── _layout.jsx          # Screens stack navigation
│   │   ├── apartment-details/
│   │   │   └── [id].jsx         # Apartment detail screen
│   │   ├── event-details/
│   │   │   └── [id].jsx         # Event detail screen
│   │   ├── linkup-details/
│   │   │   └── [id].jsx         # Linkup detail screen
│   │   ├── profile/
│   │   │   └── [id].jsx         # User profile screen
│   │   ├── chat/
│   │   │   └── [id].jsx         # Chat/messaging screen
│   │   ├── auth/                # Auth screens (legacy)
│   │   └── settings/            # Settings screens
│   │
│   └── (modal)/                 # Modal presentations
│       ├── _layout.jsx          # Modal stack configuration
│       ├── search.jsx           # Global search modal
│       ├── filters.jsx          # Filter options modal
│       ├── map.jsx              # Map view modal
│       └── notifications.jsx    # Notifications modal
│
├── components/                   # Reusable UI components
│   ├── Collapsible.tsx          # Collapsible content component
│   ├── ExternalLink.tsx         # External link handler
│   ├── HapticTab.tsx            # Tab with haptic feedback
│   ├── HelloWave.tsx            # Animated wave component
│   ├── ParallaxScrollView.tsx   # Parallax scroll container
│   ├── ThemedText.tsx           # Themed text component
│   ├── ThemedView.tsx           # Themed view component
│   └── ui/                      # Platform-specific UI components
│       ├── IconSymbol.tsx       # Cross-platform icons
│       ├── IconSymbol.ios.tsx   # iOS-specific icons
│       ├── TabBarBackground.tsx # Tab bar styling
│       └── TabBarBackground.ios.tsx
│
├── constants/                    # App constants
│   └── Colors.ts                # Color definitions
│
├── hooks/                        # Custom React hooks
│   ├── useColorScheme.ts        # Color scheme detection
│   ├── useColorScheme.web.ts    # Web-specific color scheme
│   └── useThemeColor.ts         # Theme color utilities
│
├── assets/                       # Static assets
│   ├── fonts/                   # Custom fonts
│   └── images/                  # App images and icons
│
├── scripts/                      # Utility scripts
│   └── reset-project.js         # Project reset script
│
├── app.json                     # Expo configuration
├── babel.config.js              # Babel configuration
├── eslint.config.js             # ESLint rules
├── global.css                   # Global CSS (NativeWind)
├── metro.config.js              # Metro bundler config
├── package.json                 # Dependencies and scripts
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── README.md                    # This file
```

## 🎯 Key Features

### Authentication Flow
- **Welcome Screen**: App introduction with navigation to auth or guest mode
- **Login/Register**: Form-based authentication with social login placeholders
- **Guest Access**: Explore app without registration

### Main Tabs (Core Features)
1. **Apartments** (`/tabs/index`): Browse apartment listings with search and filters
2. **Events** (`/tabs/events`): Discover and RSVP to social events
3. **Linkups** (`/tabs/linkups`): Find and join social groups and activities
4. **Messages** (`/tabs/messages`): Chat with hosts, organizers, and group members
5. **Bookmarks** (`/tabs/bookmarks`): Saved apartments, events, and linkups

### Content Creation (Hosting)
- **Add Apartment**: 5-step form (Basic Info → Location → Details → Amenities → Contact)
- **Add Event**: 5-step form (Event Info → Date/Time → Location → Details → Organizer)
- **Add Linkup**: 4-step form (Info → Preferences → Interests → Contact)

### Detail Screens
- **Apartment Details**: Full listing with photos, amenities, contact info
- **Event Details**: Event info, RSVP, attendee count, requirements
- **Linkup Details**: Group details, interests, member info, join requests
- **User Profiles**: Stats, bio, interests, activity history
- **Chat**: Real-time messaging with delivery status

### Modal Screens
- **Search**: Global search with filters and suggestions
- **Filters**: Advanced filtering options for all content types
- **Map View**: Geographic view of apartments and events
- **Notifications**: Activity and message notifications

## 🛠️ Technology Stack

- **Framework**: React Native with Expo Router
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Navigation**: File-based routing with Expo Router
- **Language**: JSX (as requested)
- **State Management**: React hooks and context (ready for Redux/Zustand)
- **Styling Approach**: Utility-first with NativeWind + StyleSheet for complex components

## 🎨 Design Patterns

### Route Groups
- `(auth)`: Authentication screens with stack navigation
- `(tabs)`: Main app tabs with bottom tab navigation
- `(hosting)`: Content creation flows with stack navigation
- `(screens)`: Detail and utility screens with stack navigation
- `(modal)`: Modal presentations with modal stack

### File Naming Convention
- All files use `.jsx` extension as requested
- Dynamic routes: `[id].jsx` for parameterized screens
- Layout files: `_layout.jsx` for navigation configuration
- Index files: `index.jsx` for default routes

### Component Architecture
- **Screen Components**: Full-screen components with navigation
- **Reusable Components**: Shared UI elements in `/components`
- **Themed Components**: Dark/light mode support
- **Platform-specific**: iOS/Android specific implementations

## 🔄 Navigation Flow

```
Welcome Screen (index.jsx)
├── Auth Flow
│   ├── Login → Main Tabs
│   └── Register → Main Tabs
├── Guest Access → Main Tabs
└── Main Tabs
    ├── Apartments → Apartment Details → Chat
    ├── Events → Event Details → Chat/RSVP
    ├── Linkups → Linkup Details → Chat/Join
    ├── Messages → Chat
    └── Bookmarks → Details
```

## 📱 Screen Breakdown

### Multi-step Forms
Each hosting flow includes:
- Progress indicators
- Form validation placeholders
- Step navigation (Back/Next/Submit)
- Field-specific input types
- Cancel functionality

### Detail Screens
Each detail screen includes:
- Full content display
- Interactive elements (bookmark, share, contact)
- Related actions (RSVP, join, message)
- API integration comments

### Chat System
- Real-time messaging UI
- Message status indicators
- Image/file attachment placeholders
- Keyboard handling
- Auto-scroll functionality

## 🔧 API Integration Points

Every screen includes TODO comments indicating where API calls should be integrated:

```jsx
// Example API integration points
// TODO: Fetch data from API
// TODO: Submit form to API
// TODO: Update bookmark status via API
// TODO: Send message via API
```

## 🎯 Next Steps

1. **API Integration**: Replace mock data with real API calls
2. **State Management**: Implement Redux Toolkit or Zustand
3. **Real-time Features**: Add WebSocket for chat and notifications
4. **Image Handling**: Implement image upload and optimization
5. **Push Notifications**: Add notification system
6. **Offline Support**: Implement offline data caching
7. **Testing**: Add unit and integration tests
8. **Performance**: Optimize list rendering and image loading

## 🚀 Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npx expo start
   ```

3. Run on device/simulator:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app

## 📋 Development Notes

- All components include comprehensive TypeScript-ready props
- Responsive design with NativeWind utilities
- Accessibility considerations in component structure
- Platform-specific handling where needed
- Mock data for development and testing
- Consistent styling patterns throughout the app
- Navigation patterns follow Expo Router best practices

This structure provides a solid foundation for a complete social discovery mobile app with room for future enhancements and scalability.
