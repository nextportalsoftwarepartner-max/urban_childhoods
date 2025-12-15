# URBAN CHILDHOOD - Parental Guidance System

A mobile application designed to support parents at every stage of their child's development by helping them understand their child's growth, behavior, and developmental stages through clear guidance and practical advice.

## Project Overview

This is a demo mobile application built with React Native and Expo. The app aims to address parents' anxieties and concerns about their children by providing guidance and support.

## Features

### Login Page (Current Implementation)
- **Email/Password Login**: Traditional email and password authentication
- **Google SSO Login**: Single Sign-On with Google accounts
- **Microsoft SSO Login**: Single Sign-On with Microsoft accounts
- **Forgot Password**: Password recovery functionality
- **Create New Account**: Registration option for new users

## Tech Stack

- **React Native**: Mobile app framework
- **Expo**: Development platform and toolchain
- **React Navigation**: Navigation library
- **Expo Auth Session**: OAuth authentication

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (installed globally or via npx)

### Installation

1. Navigate to the Source_Code directory:
```bash
cd Source_Code
```

2. Install dependencies:
```bash
npm install
```

3. Start the Expo development server:
```bash
npm start
```

4. Run on your device:
   - **iOS**: Press `i` in the terminal or scan the QR code with the Camera app
   - **Android**: Press `a` in the terminal or scan the QR code with the Expo Go app
   - **Web**: Press `w` in the terminal

### OAuth Configuration

To enable Google and Microsoft SSO login, you need to configure OAuth credentials:

1. **Google OAuth Setup**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Replace `YOUR_GOOGLE_CLIENT_ID` in `screens/LoginScreen.js` with your Client ID

2. **Microsoft OAuth Setup**:
   - Go to [Azure Portal](https://portal.azure.com/)
   - Register a new application
   - Configure redirect URIs
   - Replace `YOUR_MICROSOFT_CLIENT_ID` in `screens/LoginScreen.js` with your App (Client) ID

## Project Structure

```
Source_Code/
├── screens/
│   └── LoginScreen.js      # Login page component
├── App.js                   # Main app component with navigation
├── package.json             # Dependencies and scripts
├── app.json                 # Expo configuration
├── babel.config.js          # Babel configuration
└── README.md                # Project documentation
```

## Demo Notes

This is a demo application. Authentication flows are set up but may require actual OAuth credentials for full functionality. The login buttons will show success alerts in demo mode.

## Future Development

Additional screens and features to be added:
- Home/Dashboard screen
- Child profile management
- Developmental milestone tracking
- Guidance and advice sections
- Progress tracking and analytics

## License

This is a demo project for development purposes.

