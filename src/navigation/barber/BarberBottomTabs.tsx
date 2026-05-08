
import React from 'react';
import { View, Text, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { usePremiumTheme } from '../../shared/theme/premiumTheme';

import BarberDashboard from '../../screens/barber/dashboard/BarberDashboard';
import Bookings from '../../screens/barber/bookings/Bookings';
import Services from '../../screens/barber/services/Services';
import Setting from '../../screens/barber/setting/Setting';
import Profile from '../../screens/barber/profile/Profile';

const Tab = createMaterialTopTabNavigator();


const renderIcon = (icon: string, label: string, focused: boolean, colors: ReturnType<typeof usePremiumTheme>['colors']) => (
  <View style={{
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: focused ? 'rgba(1, 114, 203, 0.2)' : 'transparent', // Matches a dark translucent blue capsule
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 2,
    minWidth: 70,
  }}>
    <Icon
      name={icon}
      size={22}
      color={focused ? colors.primary : "#FFFFFF"}
    />
    <Text
      style={{
        fontSize: 11,
        marginTop: 4,
        color: focused ? colors.primary : "#D8D7DD",
        fontWeight: focused ? "700" : "500",
        textAlign: "center",
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
      tabBarPosition="bottom"
      screenOptions={{
        swipeEnabled: true,
        animationEnabled: true,
        tabBarShowLabel: false,
        tabBarIndicatorStyle: { backgroundColor: 'transparent', height: 0 },
        tabBarStyle: {
          height: 64, // Increased height to fit the capsule
          marginHorizontal: 16,
          marginBottom: 12,
          bottom: 0,
          left: 0,
          right: 0,
          paddingBottom: 0,
          justifyContent: 'center',
          borderRadius: 32,
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
