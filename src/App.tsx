import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';

import { EmailSignUpScreen } from '@/screens/EmailSignUpScreen';
import { SignUpScreen } from '@/screens/SignUpScreen';
import { WelcomeScreen } from '@/screens/WelcomeScreen';

/**
 * Root component that wires up global providers before rendering the first screen.
 */
export default function App(): React.JSX.Element {
  const [screen, setScreen] = React.useState<'welcome' | 'signup' | 'email'>('welcome');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor="#FFFFFF" />
      {screen === 'welcome' ? (
        <WelcomeScreen onSignUp={() => setScreen('signup')} />
      ) : screen === 'signup' ? (
        <SignUpScreen
          onLogin={() => setScreen('welcome')}
          onBack={() => setScreen('welcome')}
          onEmailSignUp={() => setScreen('email')}
        />
      ) : (
        <EmailSignUpScreen onBack={() => setScreen('signup')} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
