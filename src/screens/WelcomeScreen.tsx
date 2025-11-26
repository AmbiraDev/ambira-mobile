import type React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '@/theme/colors';
import blueOnWhite from '../../public/blue-on-white.png';

type WelcomeScreenProps = {
  onSignUp?: () => void;
  onLogin?: () => void;
};

export function WelcomeScreen({ onSignUp, onLogin }: WelcomeScreenProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image source={blueOnWhite} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>
          Make productivity <Text style={styles.highlight}>social.</Text>
        </Text>
        <TouchableOpacity style={styles.ctaButton} onPress={onSignUp}>
          <Text style={styles.ctaLabel}>Sign up free</Text>
        </TouchableOpacity>
        <Text style={styles.loginRow}>
          <Text style={styles.loginPrompt}>Already a member? </Text>
          <Text style={styles.loginLink} onPress={onLogin}>
            Sign in
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    transform: [{ translateY: -32 }],
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textDark,
    fontFamily: 'DM Sans',
    marginTop: 2,
    marginBottom: 16,
  },
  highlight: {
    color: colors.brandPrimary,
    fontFamily: 'DM Sans',
  },
  ctaButton: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: colors.brandPrimary,
    borderRadius: 4,
    marginBottom: 12,
  },
  ctaLabel: {
    color: colors.brandOnPrimary,
    fontWeight: '800',
    fontSize: 14,
    fontFamily: 'DM Sans',
  },
  loginRow: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '500',
    color: colors.textMuted,
    fontFamily: 'DM Sans',
  },
  loginPrompt: {
    color: colors.textMuted,
    fontWeight: '500',
    fontFamily: 'DM Sans',
  },
  loginLink: {
    color: colors.brandPrimary,
    fontWeight: '700',
    fontFamily: 'DM Sans',
  },
});
