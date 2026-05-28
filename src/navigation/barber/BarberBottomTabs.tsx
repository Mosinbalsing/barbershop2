
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { usePremiumTheme } from '../../shared/theme/premiumTheme';

import BarberDashboard from '../../screens/barber/dashboard/BarberDashboard';
import Bookings from '../../screens/barber/bookings/Bookings';
import Services from '../../screens/barber/services/Services';
import Setting from '../../screens/barber/setting/Setting';
import BarberMore from '../../screens/barber/more/BarberMore';

const Tab = createBottomTabNavigator();

const BarberBottomTabs = () => {
  const { colors, mode } = usePremiumTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.line,
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 24 : 10,
          paddingTop: 10,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'ellipse'; // default fallback
          
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Bookings') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Services') {
            iconName = focused ? 'cut' : 'cut-outline';
          } else if (route.name === 'Setting') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else if (route.name === 'More') {
            iconName = focused ? 'menu' : 'menu-outline';
          }

          return (
            <View>
              <Ionicons name={iconName} size={24} color={color} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={BarberDashboard} />
      <Tab.Screen name="Bookings" component={Bookings} />
      <Tab.Screen name="Services" component={Services} />
      <Tab.Screen name="Setting" component={Setting} />
      <Tab.Screen name="More" component={BarberMore} />
    </Tab.Navigator>
  );
};

export default BarberBottomTabs;
