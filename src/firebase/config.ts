// This file is the firebase config
// It references the .env variables for the Firebase data

import { initializeApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth';
// Attempt to resolve the react-native persistence helper at runtime.
// We avoid a static `require('firebase/auth/react-native')` so Metro
// doesn't fail bundling when the path is not present for a given SDK.
let getReactNativePersistence: any | undefined = undefined;
try {
  // Use an indirect require to avoid static analysis by Metro.
  // eslint-disable-next-line no-eval, @typescript-eslint/no-implied-eval
  const req: typeof require = eval('require');
  const rnAuth = req('firebase/auth/react-native');
  getReactNativePersistence = rnAuth?.getReactNativePersistence;
} catch (_e) {
  // Not available in this environment / firebase version — we'll fall back.
}
import { getFirestore } from 'firebase/firestore';

// Load environment variables. Prefer `@env` (react-native-dotenv) when available,
// otherwise fall back to `process.env` so this file remains flexible during dev.
let env: any = {};
try {
  env = require('@env');
} catch (_e) {
  // Fallback to Node-style env (useful for web, tests, or when env is injected by bundler)
  env = process.env as any;
}

const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY || env.FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain:
    env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || env.FIREBASE_AUTH_DOMAIN || 'YOUR_PROJECT.firebaseapp.com',
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || env.FIREBASE_PROJECT_ID || 'YOUR_PROJECT_ID',
  storageBucket:
    env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || env.FIREBASE_STORAGE_BUCKET || 'YOUR_PROJECT.appspot.com',
  messagingSenderId:
    env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || env.FIREBASE_MESSAGING_SENDER_ID || 'YOUR_SENDER_ID',
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID || env.FIREBASE_APP_ID || 'YOUR_APP_ID',
};

let firebaseApp: any;
let auth: any;

if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  // reuse existing app
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  firebaseApp = require('firebase/app').getApp();
}

// Try to enable persistent auth using React Native AsyncStorage when available.
// If AsyncStorage or the firebase/react-native helper isn't available, fall back to default getAuth().
try {
  // Dynamically require to avoid breaking web builds
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  if (getReactNativePersistence) {
    auth = initializeAuth(firebaseApp, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } else {
    // If getReactNativePersistence isn't present in this firebase build, use in-memory auth
    // (still better than failing to bundle).
    auth = getAuth(firebaseApp);
  }
} catch (e) {
  // AsyncStorage not available; use default in-memory auth
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  auth = getAuth(firebaseApp);
}
export { auth };
export const db = getFirestore();

// Note: do not export firebaseConfig as default — consumers import `auth` and `db`.