
import React from 'react';
import { View, Text, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { usePremiumTheme } from '../../shared/theme/premiumTheme';

import BarberDashboard from '../../screens/barber/dashboard/BarberDashboard';
import Bookings from '../../screens/barber/bookings/Bookings';
import Services from '../../screens/barber/services/Services';
import Setting from '../../screens/barber/setting/Setting';
import Profile from '../../screens/barber/profile/Profile';

const Tab = createBottomTabNavigator();


const renderIcon = (icon: string, label: string, focused: boolean, colors: ReturnType<typeof usePremiumTheme>['colors']) => (
  <View style={{ alignItems: "center", marginTop: 5 }}>
    {focused && (
      <View
        style={{
          width: 34,
          height: 28,
          borderBottomRightRadius: 14,
          borderBottomLeftRadius: 14,
          backgroundColor: colors.softPrimary,
          position: 'absolute',
          top: -2,
          zIndex: 2,
          ...Platform.select({
            android: {
              elevation: 2,
            },
            ios: {
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.18,
              shadowRadius: 12,
            },
          }),
        }}
      />
    )}
    <Icon
      name={icon}
      size={19}
      color={focused ? colors.primary : "#FFFFFF"}
      style={{ zIndex: 3 }}
    />
    <Text
      style={{
        fontSize: 11,
        marginTop: 6,
        color: focused ? "#FFFFFF" : "#D8D7DD",
        fontWeight: focused ? "800" : "600",
        textAlign: "center",
        width: 100,
      }}
      numberOfLines={1}
    >
      {label}
    </Text>
  </View>
);

const BarberBottomTabs = () => {
  const { colors, mode } = usePremiumTheme();
  const darkMode = mode === 'dark';

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 50,
          marginHorizontal: 16,
          marginBottom: 8,
          borderRadius: 24,
          position: 'absolute',
          backgroundColor: colors.nav,
          borderTopWidth: darkMode ? 1 : 0,
          borderLeftWidth: darkMode ? 1 : 0,
          borderRightWidth: darkMode ? 1 : 0,
          borderBottomWidth: darkMode ? 1 : 0,
          borderColor: darkMode ? 'rgba(255,255,255,0.42)' : 'transparent',
          elevation: 18,
          shadowColor: darkMode ? '#FFFFFF' : '#20232A',
          shadowOpacity: darkMode ? 0.18 : 0.16,
          shadowRadius: darkMode ? 18 : 24,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={BarberDashboard}
        options={{
          tabBarIcon: ({ focused }) =>
            renderIcon('home', 'Home', focused, colors),
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={Bookings}
        options={{
          tabBarIcon: ({ focused }) =>
            renderIcon('calendar', 'Bookings', focused, colors),
        }}
      />
      <Tab.Screen
        name="Services"
        component={Services}
        options={{
          tabBarIcon: ({ focused }) =>
            renderIcon('briefcase', 'Services', focused, colors),
        }}
      />
      <Tab.Screen
        name="Setting"
        component={Setting}
        options={{
          tabBarIcon: ({ focused }) =>
            renderIcon('cog', 'Setting', focused, colors),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) =>
            renderIcon('user', 'Profile', focused, colors),
        }}
      />
    </Tab.Navigator>
  );
};

export default BarberBottomTabs;
