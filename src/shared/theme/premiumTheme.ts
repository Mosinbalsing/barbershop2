import { useSyncExternalStore } from 'react';
import { MMKV } from 'react-native-mmkv';

export type PremiumThemeMode = 'light' | 'dark';

const THEME_KEY = 'app_theme_mode';
const themeStorage = new MMKV();

const lightColors = {
  primary: '#9167F2',
  secondary: '#66D8B6',
  ink: '#20232A',
  muted: '#858994',
  line: '#ECECF3',
  surface: '#FFFFFF',
  canvas: '#F6F7FB',
  softPrimary: '#F1ECFF',
  softSecondary: '#EAFBF6',
  nav: '#55545C',
};

const darkColors = {
  primary: '#B99BFF',
  secondary: '#6BE2C0',
  ink: '#F6F7FB',
  muted: '#A9ADBA',
  line: '#2C303A',
  surface: '#171A22',
  canvas: '#0E1117',
  softPrimary: '#2B2142',
  softSecondary: '#17352F',
  nav: '#171A22',
};

const savedMode = themeStorage.getString(THEME_KEY) as PremiumThemeMode | undefined;
let currentMode: PremiumThemeMode = savedMode === 'dark' ? 'dark' : 'light';
const listeners = new Set<() => void>();

export const premiumColors = { ...(currentMode === 'dark' ? darkColors : lightColors) };

export const setPremiumThemeMode = (mode: PremiumThemeMode) => {
  currentMode = mode;
  themeStorage.set(THEME_KEY, mode);
  Object.assign(premiumColors, mode === 'dark' ? darkColors : lightColors);
  listeners.forEach(listener => listener());
};

export const getPremiumThemeMode = () => currentMode;

export const usePremiumTheme = () => {
  const mode = useSyncExternalStore(
    listener => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => currentMode,
    () => currentMode,
  );

  return {
    mode,
    colors: mode === 'dark' ? darkColors : lightColors,
    setMode: setPremiumThemeMode,
  };
};

export const premiumShadow = {
  shadowColor: '#20232A',
  shadowOffset: { width: 0, height: 12 },
  shadowOpacity: 0.08,
  shadowRadius: 24,
  elevation: 4,
};

export const premiumSpacing = {
  screen: 18,
  radius: 18,
  cardRadius: 16,
};

// Shared z-index / elevation tokens to keep overlays and modals
// consistently above navigation elements (bottom tabs, headers).
export const zIndices = {
  bottomNav: 20, // matches bottom nav elevation/style
  modalOverlay: 100000,
  modalSheet: 100001,
  modalCloseIcon: 100002,
  dropdown: 100000,
};
