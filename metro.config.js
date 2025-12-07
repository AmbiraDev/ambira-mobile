// Metro configuration for Expo/React Native
// Forces Firebase Auth to resolve to the React Native bundle so the auth component registers correctly.
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

const resolver = config.resolver ?? {};
resolver.extraNodeModules = {
  ...(resolver.extraNodeModules ?? {}),
  'firebase/auth': path.join(
    path.dirname(require.resolve('@firebase/auth/package.json')),
    'dist',
    'rn',
    'index.js',
  ),
};
resolver.sourceExts = [...(resolver.sourceExts ?? []), 'cjs'];

module.exports = {
  ...config,
  resolver,
};
