import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';

import { HomeScreen } from '@/screens/HomeScreen';
import { colors } from '@/theme/colors';

/**
 * Root component that wires up global providers before rendering the first screen.
 */
export default function App(): JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <HomeScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
