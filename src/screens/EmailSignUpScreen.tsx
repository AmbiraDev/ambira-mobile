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

type EmailSignUpScreenProps = {
  onBack?: () => void;
};

export function EmailSignUpScreen({ onBack }: EmailSignUpScreenProps): React.JSX.Element {
  return (
    <ScrollView contentContainerStyle={styles.container} bounces={false} showsVerticalScrollIndicator={false}>
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
          <TextInput style={styles.input} placeholder="Enter your full name" placeholderTextColor="#A8B2C3" />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Username</Text>
          <TextInput style={styles.input} placeholder="Choose a username" placeholderTextColor="#A8B2C3" />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Email address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#A8B2C3"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Create a password"
            secureTextEntry
            placeholderTextColor="#A8B2C3"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm your password"
            secureTextEntry
            placeholderTextColor="#A8B2C3"
          />
        </View>

        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitLabel}>Create account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  logo: {
    width: 140,
    height: 140,
  },
  heading: {
    marginTop: 12,
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    fontFamily: 'DM Sans',
  },
  subhead: {
    marginTop: 6,
    fontSize: 16,
    color: '#475569',
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
    color: '#94A3B8',
    fontFamily: 'DM Sans',
  },
  fieldGroup: {
    marginTop: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
    fontFamily: 'DM Sans',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
    fontFamily: 'DM Sans',
  },
  submitButton: {
    marginTop: 24,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#005CC8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'DM Sans',
  },
});
