import type React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type WelcomeScreenProps = {
  onSignUp?: () => void;
};

export function WelcomeScreen({ onSignUp }: WelcomeScreenProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../public/blue-on-white.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>
        Make productivity <Text style={styles.highlight}>social.</Text>
      </Text>
      <TouchableOpacity style={styles.ctaButton} onPress={onSignUp}>
        <Text style={styles.ctaLabel}>Sign up free</Text>
      </TouchableOpacity>
      <Text style={styles.loginRow}>
        <Text style={styles.loginPrompt}>Already a member? </Text>
        <Text style={styles.loginLink}>Log in</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    fontFamily: 'DM Sans',
    marginBottom: 24,
  },
  highlight: {
    color: '#305CDE',
    fontFamily: 'DM Sans',
  },
  ctaButton: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#305CDE',
    borderRadius: 4,
    marginBottom: 12,
  },
  ctaLabel: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
    fontFamily: 'DM Sans',
  },
  loginRow: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '500',
    color: '#475569',
    fontFamily: 'DM Sans',
  },
  loginPrompt: {
    color: '#475569',
    fontWeight: '500',
    fontFamily: 'DM Sans',
  },
  loginLink: {
    color: '#305CDE',
    fontWeight: '700',
    fontFamily: 'DM Sans',
  },
});
