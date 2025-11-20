import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';

import { EmailSignUpScreen } from '@/screens/EmailSignUpScreen';
import { LogInScreen } from '@/screens/LogInScreen';
import { SignUpScreen } from '@/screens/SignUpScreen';
import { WelcomeScreen } from '@/screens/WelcomeScreen';

/**
 * Root component that wires up global providers before rendering the first screen.
 */
export default function App(): React.JSX.Element {
  const [screen, setScreen] = React.useState<'welcome' | 'signup' | 'email' | 'login'>('welcome');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor="#FFFFFF" />
      {screen === 'welcome' ? (
        <WelcomeScreen onSignUp={() => setScreen('signup')} onLogin={() => setScreen('login')} />
      ) : screen === 'signup' ? (
        <SignUpScreen
          onLogin={() => setScreen('login')}
          onBack={() => setScreen('welcome')}
          onEmailSignUp={() => setScreen('email')}
        />
      ) : screen === 'email' ? (
        <EmailSignUpScreen onBack={() => setScreen('signup')} />
      ) : (
        <LogInScreen onBack={() => setScreen('welcome')} />
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
