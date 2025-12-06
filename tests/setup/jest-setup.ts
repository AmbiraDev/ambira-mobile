import React from 'react';
import '@testing-library/jest-native/extend-expect';

jest.mock('react-native/Libraries/TurboModule/TurboModuleRegistry', () => ({
  getEnforcing: () => ({}),
  get: () => ({}),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('react-native/Libraries/Utilities/NativeDeviceInfo', () => ({
  getConstants: () => ({
    Dimensions: {
      windowPhysicalPixels: { width: 0, height: 0, scale: 1, fontScale: 1 },
    },
  }),
}));

jest.mock('react-native/Libraries/Utilities/NativePlatformConstantsIOS', () => ({
  getConstants: () => ({}),
}));

jest.mock('react-native/Libraries/ReactNative/I18nManager', () => ({
  getConstants: () => ({ doLeftAndRightSwapInRTL: false }),
  isRTL: false,
  allowRTL: jest.fn(),
  forceRTL: jest.fn(),
  swapLeftAndRightInRTL: jest.fn(),
}));

jest.mock('react-native/Libraries/Components/StatusBar/NativeStatusBarManagerIOS', () => ({
  getConstants: () => ({}),
  setStyle: jest.fn(),
  setHidden: jest.fn(),
  setNetworkActivityIndicatorVisible: jest.fn(),
  setBackgroundColor: jest.fn(),
}));

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter', () => {
  const EventEmitter = function () {};
  EventEmitter.prototype.addListener = jest.fn();
  EventEmitter.prototype.removeAllListeners = jest.fn();
  EventEmitter.prototype.removeListener = jest.fn();
  EventEmitter.prototype.emit = jest.fn();
  return EventEmitter;
});

jest.mock('lucide-react-native', () => {
  const MockIcon = () => null;
  return {
    __esModule: true,
    Home: MockIcon,
    Timer: MockIcon,
    UserRound: MockIcon,
    Bell: MockIcon,
    Circle: MockIcon,
    Flame: MockIcon,
    BookOpen: MockIcon,
    Dumbbell: MockIcon,
    Hammer: MockIcon,
    Palette: MockIcon,
    Heart: MockIcon,
    MessageCircle: MockIcon,
    Share2: MockIcon,
  };
});

const { NativeModules } = require('react-native');
if (!NativeModules.DeviceInfo) {
  NativeModules.DeviceInfo = {
    getConstants: () => ({
      Dimensions: {
        windowPhysicalPixels: { width: 0, height: 0, scale: 1, fontScale: 1 },
      },
    }),
  };
}

if (!global.setImmediate) {
  global.setImmediate = (fn: (...args: unknown[]) => void, ...args: unknown[]) =>
    setTimeout(fn, 0, ...args);
}

if (!global.clearImmediate) {
  global.clearImmediate = (id: NodeJS.Timeout) => clearTimeout(id);
}

jest.mock('expo-web-browser', () => ({
  maybeCompleteAuthSession: jest.fn(),
}));

jest.mock('expo-status-bar', () => ({
  StatusBar: () => null,
}));

jest.mock('expo-auth-session', () => ({
  makeRedirectUri: jest.fn(() => 'https://example.com/redirect'),
}));

jest.mock('expo-auth-session/providers/google', () => ({
  useIdTokenAuthRequest: jest.fn(() => [null, null, jest.fn()]),
}));
