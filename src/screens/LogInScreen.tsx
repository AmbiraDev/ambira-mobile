import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// Expo auth session for Google sign-in
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { Platform } from 'react-native';

import { colors } from '@/theme/colors';
import blueOnWhite from '../../public/blue-on-white.png';
import googleIcon from '../../public/google.png';
import { useAuth } from '@/firebase/AuthContext';

type LogInScreenProps = {
  onBack?: () => void;
  onAuthComplete?: () => void;
};

export function LogInScreen({ onBack, onAuthComplete }: LogInScreenProps): React.JSX.Element {
  const { signIn, signInWithGoogle } = useAuth();

  // Complete any pending web-browser auth session (required by expo-auth-session)
  WebBrowser.maybeCompleteAuthSession();

  // // Load env vars (prefer @env if configured)
  // let env: any = {};
  // try {
  //   // eslint-disable-next-line @typescript-eslint/no-var-requires
  //   env = require('@env');
  // } catch (_e) {
  //   env = process.env as any;
  // }

  // const googleClientId =
  //   env.GOOGLE_CLIENT_ID_EXPO || env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || env.GOOGLE_CLIENT_ID || env.GOOGLE_CLIENT_ID_EXPO;

  // const iosClientId = env.GOOGLE_IOS_CLIENT_ID || env.NEXT_PUBLIC_GOOGLE_IOS_CLIENT_ID;

  // const androidClientId = env.GOOGLE_ANDROID_CLIENT_ID || env.NEXT_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;

  // let isExpoGo = false;
  // try {
  //   // dynamically require to avoid type/bundler issues if not present
  //   // eslint-disable-next-line @typescript-eslint/no-var-requires
  //   const Constants = require('expo-constants');
  //   isExpoGo = Constants?.appOwnership === 'expo';
  // } catch (_e) {}
  // const runningOnIos = Platform.OS === 'ios';

  // const googleConfig: any = {};
  // if (googleClientId) googleConfig.clientId = googleClientId;
  // if (iosClientId) googleConfig.iosClientId = iosClientId;
  // if (androidClientId) googleConfig.androidClientId = androidClientId;

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: '374690007345-sbet4hhombjp4c0t0vv6j76sc0qhnejo.apps.googleusercontent.com',
    webClientId: '374690007345-sbet4hhombjp4c0t0vv6j76sc0qhnejo.apps.googleusercontent.com',
    iosClientId: '374690007345-hpt1jnnhtn7db2osfp27g84f5l9ioh5v.apps.googleusercontent.com',
  });


  // const missingIosClientId = runningOnIos && !iosClientId && !isExpoGo;

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSignIn = async () => {
    setError(null);
    if (!email.trim() || !password) {
      setError('Please enter email and password');
      return;
    }
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      onAuthComplete?.();
    } catch (e: any) {
      setError(e?.message ?? 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle response from Google OAuth flow
  React.useEffect(() => {
    if (response?.type === 'success' && response.params) {
      const idToken = response.params.id_token;
      if (!idToken) {
        setError('Google sign in failed (no id token)');
        return;
      }

      (async () => {
        setLoading(true);
        setError(null);
        try {
          await signInWithGoogle(idToken);
          onAuthComplete?.();
        } catch (e: any) {
          setError(e?.message ?? 'Google sign-in failed');
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [response]);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      bounces={false}
      showsVerticalScrollIndicator={false}
    >
      <Image source={blueOnWhite} style={styles.logo} resizeMode="contain" />
      <Text style={styles.heading}>Welcome Back</Text>
      <Text style={styles.subhead}>Sign in to your account</Text>

      <View style={styles.form}>
        <View style={styles.backRow}>
          <TouchableOpacity onPress={onBack} hitSlop={12}>
            <Text style={styles.backArrow}>{'\u2039'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.googleButton}
          onPress={() => {
              // start Google OAuth flow. In Expo Go we use the proxy for easier testing.
              // Use a cast to allow the Expo proxy option in Expo Go
              // (some typings for promptAsync are conservative about options)
              (promptAsync as any)({ useProxy: isExpoGo });
          }}
          disabled={!request || loading}
        >
          <View style={styles.googleContent}>
            <Image source={googleIcon} style={styles.googleIcon} />
            <Text style={styles.googleLabel}>Continue with Google</Text>
          </View>
        </TouchableOpacity>

        {missingIosClientId ? (
          <Text style={styles.errorText}>
            Google Sign-In on iOS requires an iOS OAuth client ID. Add `GOOGLE_IOS_CLIENT_ID` to your
            `.env` or test using Expo Go (proxy). See README for steps.
          </Text>
        ) : null}

        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Email address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#A8B2C3"
            keyboardType='email-address'
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#A8B2C3"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.submitButton, { opacity: loading ? 0.6 : 1 }]}
          onPress={handleSignIn}
          disabled={loading}
        >
          <Text style={styles.submitLabel}>{loading ? 'Signing in…' : 'Sign In'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.card,
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  logo: {
    width: 180,
    height: 180,
  },
  heading: {
    marginTop: 12,
    fontSize: 26,
    fontWeight: '800',
    fontFamily: 'DM Sans',
    color: colors.textDark,
  },
  subhead: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'DM Sans',
    color: colors.textMuted,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    marginTop: 24,
  },
  backRow: {
    marginBottom: 12,
  },
  backArrow: {
    fontSize: 24,
    color: colors.mutedAlt,
    fontFamily: 'DM Sans',
  },
  googleButton: {
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
    fontFamily: 'DM Sans',
    color: colors.textDark,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 4,
    gap: 10,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.cardBorder,
  },
  dividerText: {
    color: colors.mutedAlt,
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'DM Sans',
  },
  fieldGroup: {
    marginTop: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'DM Sans',
    color: colors.label,
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    fontFamily: 'DM Sans',
    color: colors.textDark,
    backgroundColor: colors.white,
  },
  submitButton: {
    marginTop: 24,
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.primaryStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitLabel: {
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
