import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

export function HomeScreen(): JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Ambira Mobile</Text>
      <Text style={styles.body}>
        Start building the productivity experience by replacing this placeholder screen.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  body: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 22,
  },
});
