import { Image, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

export function HomeScreen(): TSX.Element {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Ambira</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: -30,
  },
  title: {
    color: colors.brandOnPrimary,
    fontSize: 54,
    fontFamily: 'Satoshi-Black',
    fontWeight: '900',
  },
});
