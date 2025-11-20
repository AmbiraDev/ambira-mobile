import type React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { colors } from '@/theme/colors';
import blueOnWhite from '../../public/blue-on-white.png';
import googleIcon from '../../public/google.png';

type LogInScreenProps = {
  onBack?: () => void;
};

export function LogInScreen({ onBack }: LogInScreenProps): React.JSX.Element {
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

        <TouchableOpacity style={styles.googleButton}>
          <View style={styles.googleContent}>
            <Image source={googleIcon} style={styles.googleIcon} />
            <Text style={styles.googleLabel}>Continue with Google</Text>
          </View>
        </TouchableOpacity>

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
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#A8B2C3"
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitLabel}>Sign In</Text>
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
});
