import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getApp,
  getApps,
  initializeApp,
  type FirebaseApp,
  type FirebaseOptions,
} from 'firebase/app';
import { getAuth, initializeAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getReactNativePersistence }: { getReactNativePersistence: (storage: any) => any } =
  require('@firebase/auth/dist/rn/index.js');

const isFirebaseConfigured = Boolean(
  process.env.EXPO_PUBLIC_FIREBASE_API_KEY &&
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN &&
    process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET &&
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID &&
    process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
);

const createUnavailableProxy = <T extends object>(serviceName: string) =>
  new Proxy({} as T, {
    get() {
      throw new Error(
        `[Firebase] Attempted to access ${serviceName} before Firebase was configured. Ensure EXPO_PUBLIC_FIREBASE_* env vars are set.`,
      );
    },
  });

let appInstance: FirebaseApp | undefined;
let authInstance: Auth;
let dbInstance: Firestore;
let storageInstance: FirebaseStorage;

if (isFirebaseConfigured) {
  const firebaseConfig: FirebaseOptions = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };

  appInstance = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

  try {
    authInstance = initializeAuth(appInstance, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (_error) {
    // initializeAuth throws if auth has already been created; fall back to the existing instance.
    authInstance = getAuth(appInstance);
  }

  dbInstance = getFirestore(appInstance);
  storageInstance = getStorage(appInstance);
} else {
  authInstance = createUnavailableProxy<Auth>('auth');
  dbInstance = createUnavailableProxy<Firestore>('firestore');
  storageInstance = createUnavailableProxy<FirebaseStorage>('storage');
}

export const auth = authInstance;
export const db = dbInstance;
export const storage = storageInstance;
export const isFirebaseInitialized = isFirebaseConfigured;

export default appInstance ?? ({} as FirebaseApp);
