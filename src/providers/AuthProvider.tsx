import React from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from 'firebase/auth';

import { auth, isFirebaseInitialized } from '@/lib/firebase';

WebBrowser.maybeCompleteAuthSession();

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle?: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const hasGoogleIds =
    Boolean(process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID) ||
    Boolean(process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID) ||
    Boolean(process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID);

  const redirectUri =
    process.env.EXPO_PUBLIC_GOOGLE_REDIRECT_URI ||
    AuthSession.makeRedirectUri({ useProxy: true, projectNameForProxy: 'mobile' });

  React.useEffect(() => {
    if (!redirectUri.startsWith('https://auth.expo.io/')) {
      console.warn('[Auth] Using non-Expo redirect URI for Google:', redirectUri);
    } else {
      console.log('[Auth] Google redirect URI:', redirectUri);
    }
  }, [redirectUri]);

  const [googleRequest, googleResponse, promptGoogle] = Google.useIdTokenAuthRequest(
    hasGoogleIds
      ? {
          clientId:
            process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID ??
            process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ??
            process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
          redirectUri,
          useProxy: true,
          expoClientId: process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID,
          androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
          iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
        }
      : {},
  );

  React.useEffect(() => {
    if (!isFirebaseInitialized) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (nextUser: User | null) => {
      setUser(nextUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithEmail = React.useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email.trim(), password);
  }, []);

  const signUpWithEmail = React.useCallback(
    async (email: string, password: string, displayName?: string) => {
      const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      if (displayName) {
        await updateProfile(credential.user, { displayName });
      }
    },
    [],
  );

  const signOut = React.useCallback(async () => {
    await firebaseSignOut(auth);
  }, []);

  React.useEffect(() => {
    if (googleResponse?.type === 'success' && googleResponse.params?.id_token) {
      const credential = GoogleAuthProvider.credential(googleResponse.params.id_token);
      signInWithCredential(auth, credential).catch(() => {});
    }
  }, [googleResponse]);

  const googleEnabled = React.useMemo(
    () => Boolean(hasGoogleIds && googleRequest),
    [googleRequest, hasGoogleIds],
  );

  const signInWithGoogle = React.useCallback(async () => {
    if (!googleRequest) {
      throw new Error('Google Sign-In is not configured.');
    }
    await promptGoogle({ useProxy: true, redirectUri });
  }, [googleRequest, promptGoogle, redirectUri]);

  const value: AuthContextValue = {
    user,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    signInWithGoogle: googleEnabled ? signInWithGoogle : undefined,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
