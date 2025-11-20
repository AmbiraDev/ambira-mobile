import type React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '@/theme/colors';
import blueOnWhite from '../../public/blue-on-white.png';
import googleIcon from '../../public/google.png';

type SignUpScreenProps = {
  onLogin?: () => void;
  onBack?: () => void;
  onEmailSignUp?: () => void;
};

export function SignUpScreen({
  onLogin,
  onBack,
  onEmailSignUp,
}: SignUpScreenProps): React.JSX.Element {
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

      <TouchableOpacity style={styles.googleButton}>
        <View style={styles.googleContent}>
          <Image source={googleIcon} style={styles.googleIcon} />
          <Text style={styles.googleLabel}>Sign Up With Google</Text>
        </View>
      </TouchableOpacity>

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
});
