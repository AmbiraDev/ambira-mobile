import type React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
      <Image
        source={require('../../public/blue-on-white.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.heading}>Welcome to Ambira</Text>
      <Text style={styles.subhead}>Study, work, and build with your friends.</Text>

      <View style={styles.loginRow}>
        <Text style={styles.loginPrompt}>Already a Member? </Text>
        <Text style={styles.loginLink} onPress={onLogin ?? onBack}>
          Log In
        </Text>
      </View>

      <TouchableOpacity style={styles.googleButton}>
        <View style={styles.googleContent}>
          <View style={styles.googleIcon}>
            <Text style={styles.googleLetter}>G</Text>
          </View>
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
    backgroundColor: '#FFFFFF',
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
    color: '#0F172A',
    marginTop: 4,
    fontFamily: 'DM Sans',
  },
  subhead: {
    marginTop: 6,
    fontSize: 16,
    color: '#475569',
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
    color: '#475569',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'DM Sans',
  },
  loginLink: {
    color: '#305CDE',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'DM Sans',
  },
  googleButton: {
    marginTop: 20,
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
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
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleLetter: {
    fontWeight: '900',
    color: '#DB4437',
    fontSize: 14,
    fontFamily: 'DM Sans',
  },
  googleLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    fontFamily: 'DM Sans',
  },
  emailButton: {
    marginTop: 14,
    width: '100%',
    borderRadius: 12,
    backgroundColor: '#305CDE',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emailLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'DM Sans',
  },
});
