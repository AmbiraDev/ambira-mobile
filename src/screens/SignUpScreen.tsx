import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Expo auth session for Google sign-up
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { Platform } from 'react-native';

import { colors } from '@/theme/colors';
import blueOnWhite from '../../public/blue-on-white.png';
import googleIcon from '../../public/google.png';
import { useAuth } from '@/firebase/AuthContext';

type SignUpScreenProps = {
  onLogin?: () => void;
  onBack?: () => void;
  onEmailSignUp?: () => void;
  onAuthComplete?: () => void;
};

export function SignUpScreen({
  onLogin,
  onBack,
  onEmailSignUp,
  onAuthComplete,
}: SignUpScreenProps): React.JSX.Element {
  const { signInWithGoogle } = useAuth();

  WebBrowser.maybeCompleteAuthSession();

  // Load env vars (prefer @env when available)
  let env: any = {};
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    env = require('@env');
  } catch (_e) {
    env = process.env as any;
  }

  const googleClientId =
    env.GOOGLE_CLIENT_ID_EXPO || env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || env.GOOGLE_CLIENT_ID || env.GOOGLE_CLIENT_ID_EXPO;

  const iosClientId = env.GOOGLE_IOS_CLIENT_ID || env.NEXT_PUBLIC_GOOGLE_IOS_CLIENT_ID;
  const androidClientId = env.GOOGLE_ANDROID_CLIENT_ID || env.NEXT_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;

  let isExpoGo = false;
  try {
    // dynamically require to avoid type/bundler issues
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Constants = require('expo-constants');
    isExpoGo = Constants?.appOwnership === 'expo';
  } catch (_e) {}

  const googleConfig: any = {};
  if (googleClientId) googleConfig.clientId = googleClientId;
  if (iosClientId) googleConfig.iosClientId = iosClientId;
  if (androidClientId) googleConfig.androidClientId = androidClientId;

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest(googleConfig);

  const missingIosClientId = Platform.OS === 'ios' && !iosClientId && !isExpoGo;

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Handle Google OAuth response
  React.useEffect(() => {
    if (response?.type === 'success' && response.params) {
      const idToken = response.params.id_token;
      if (!idToken) {
        setError('Google sign up failed (no id token)');
        return;
      }

      (async () => {
        setLoading(true);
        setError(null);
        try {
          await signInWithGoogle(idToken);
          onAuthComplete?.();
        } catch (e: any) {
          setError(e?.message ?? 'Google sign-up failed');
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Image source={blueOnWhite} style={styles.logo} resizeMode="contain" />
      <Text style={styles.heading}>Welcome to Ambira</Text>
      <Text style={styles.subhead}>Study, work, and build with your friends.</Text>

      <View style={styles.loginRow}>
        <Text style={styles.loginPrompt}>Already a Member? </Text>
        <Text style={styles.loginLink} onPress={onLogin ?? onBack}>
          Log in
        </Text>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity
        style={styles.googleButton}
        onPress={() => (promptAsync as any)({ useProxy: isExpoGo })}
        disabled={!request || loading}
      >
        <View style={styles.googleContent}>
          <Image source={googleIcon} style={styles.googleIcon} />
          <Text style={styles.googleLabel}>{loading ? 'Signing up…' : 'Sign Up With Google'}</Text>
        </View>
      </TouchableOpacity>

      {missingIosClientId ? (
        <Text style={styles.errorText}>
          Google Sign-Up on iOS requires an iOS OAuth client ID. Add `GOOGLE_IOS_CLIENT_ID` to your
          `.env` or test using Expo Go (proxy). See README for steps.
        </Text>
      ) : null}

      <TouchableOpacity style={styles.emailButton} onPress={onEmailSignUp}>
        <Text style={styles.emailLabel}>Sign Up With Email</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 10,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 12,
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textDark,
    marginTop: 4,
    fontFamily: 'DM Sans',
  },
  subhead: {
    marginTop: 6,
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
    fontFamily: 'DM Sans',
  },
  loginRow: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  loginPrompt: {
    color: colors.textMuted,
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'DM Sans',
  },
  loginLink: {
    color: colors.brandPrimary,
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'DM Sans',
  },
  googleButton: {
    marginTop: 20,
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    backgroundColor: colors.white,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  googleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  googleIcon: {
    width: 22,
    height: 22,
  },
  googleLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
    fontFamily: 'DM Sans',
  },
  emailButton: {
    marginTop: 14,
    width: '100%',
    borderRadius: 12,
    backgroundColor: colors.brandPrimary,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emailLabel: {
    color: colors.brandOnPrimary,
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'DM Sans',
  },
  errorText: {
    marginTop: 12,
    color: '#D23F44',
    fontSize: 13,
    fontFamily: 'DM Sans',
  },
});
