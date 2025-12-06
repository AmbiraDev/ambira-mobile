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

import { colors } from '@/theme/colors';
import blueOnWhite from '../../public/blue-on-white.png';

type EmailSignUpScreenProps = {
  onBack?: () => void;
  onSubmit?: (email: string, password: string, name?: string) => void;
  loading?: boolean;
  error?: string | null;
};

export function EmailSignUpScreen({
  onBack,
  onSubmit,
  loading = false,
  error,
}: EmailSignUpScreenProps): React.JSX.Element {
  const [fullName, setFullName] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [localError, setLocalError] = React.useState<string | null>(null);

  const handleSubmit = () => {
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }
    setLocalError(null);
    onSubmit?.(email, password, fullName || username);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      bounces={false}
      showsVerticalScrollIndicator={false}
    >
      <Image source={blueOnWhite} style={styles.logo} resizeMode="contain" />
      <Text style={styles.heading}>Create Your Account</Text>
      <Text style={styles.subhead}>Join Ambira and start tracking your productivity</Text>

      <View style={styles.form}>
        <View style={styles.backRow}>
          <TouchableOpacity onPress={onBack} hitSlop={12}>
            <Text style={styles.backArrow}>{'\u2039'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor={colors.placeholder}
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Choose a username"
            placeholderTextColor={colors.placeholder}
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Email address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={colors.placeholder}
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Create a password"
            secureTextEntry
            placeholderTextColor={colors.placeholder}
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm your password"
            secureTextEntry
            placeholderTextColor={colors.placeholder}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        {localError ? <Text style={styles.errorText}>{localError}</Text> : null}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitLabel}>{loading ? 'Creating...' : 'Create account'}</Text>
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
    width: 140,
    height: 140,
    marginBottom: 4,
  },
  heading: {
    marginTop: 12,
    fontSize: 26,
    fontWeight: '800',
    color: colors.textDark,
    fontFamily: 'DM Sans',
  },
  subhead: {
    marginTop: 6,
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
    fontFamily: 'DM Sans',
  },
  form: {
    width: '100%',
    marginTop: 24,
  },
  backRow: {
    marginBottom: 8,
  },
  backArrow: {
    fontSize: 24,
    color: colors.mutedAlt,
    fontFamily: 'DM Sans',
  },
  fieldGroup: {
    marginTop: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.label,
    marginBottom: 6,
    fontFamily: 'DM Sans',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    color: colors.textDark,
    backgroundColor: colors.white,
    fontFamily: 'DM Sans',
  },
  errorText: {
    marginTop: 10,
    color: colors.error,
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'DM Sans',
  },
  submitButton: {
    marginTop: 24,
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.primaryStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.75,
  },
  submitLabel: {
    color: colors.brandOnPrimary,
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'DM Sans',
  },
});
