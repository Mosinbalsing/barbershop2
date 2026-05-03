
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import AppNavigation from  './src/navigation/common/AppNavigation'
import { usePremiumTheme } from './src/shared/theme/premiumTheme';

const App = () => {
  const { colors, mode } = usePremiumTheme();
  const navigationTheme = {
    ...(mode === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(mode === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.canvas,
      card: colors.surface,
      text: colors.ink,
      border: colors.line,
      primary: colors.primary,
    },
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.canvas }}>
    <NavigationContainer theme={navigationTheme}>
      <AppNavigation/>
    </NavigationContainer>
    </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default App
