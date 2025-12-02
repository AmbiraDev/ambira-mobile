import 'dotenv/config';
import { type ConfigContext, type ExpoConfig } from 'expo/config';

const reverseClientId = (iosClientId?: string) => {
  if (!iosClientId) return undefined;
  const parts = iosClientId.split('.');
  // Expect format: <client>.apps.googleusercontent.com -> com.googleusercontent.apps.<client>
  if (parts.length >= 4 && parts.slice(-3).join('.') === 'googleusercontent.com') {
    const client = parts.slice(0, -3).join('.');
    return `com.googleusercontent.apps.${client}`;
  }
  return undefined;
};

export default ({ config }: ConfigContext): ExpoConfig => {
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
  const androidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
  const expoClientId = process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID;
  const reversedClientId = reverseClientId(iosClientId);

  return {
    ...config,
    name: 'mobile',
    slug: 'mobile',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './public/icon.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    splash: {
      image: './public/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
      infoPlist: reversedClientId
        ? {
            CFBundleURLTypes: [
              {
                CFBundleURLSchemes: [reversedClientId],
              },
            ],
          }
        : undefined,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './public/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    web: {
      favicon: './assets/favicon.png',
    },
    extra: {
      ...config.extra,
      firebase: {
        apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
        measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
      },
      google: {
        iosClientId,
        androidClientId,
        expoClientId,
        reversedClientId,
      },
    },
  };
};
