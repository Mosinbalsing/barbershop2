
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigation from  './src/navigation/common/AppNavigation'

const App = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView  style={{ flex: 1 }}>
    <NavigationContainer>
      <AppNavigation/>
    </NavigationContainer>
    </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default App
