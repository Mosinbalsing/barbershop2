
import React from 'react';
import { View, Text, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { premiumColors } from '../../shared/theme/premiumTheme';

import BarberDashboard from '../../screens/barber/dashboard/BarberDashboard';
import Bookings from '../../screens/barber/bookings/Bookings';
import Services from '../../screens/barber/services/Services';
import Setting from '../../screens/barber/setting/Setting';
import Profile from '../../screens/barber/profile/Profile';

const Tab = createBottomTabNavigator();


const renderIcon = (icon: string, label: string, focused: boolean) => (
  <View style={{ alignItems: "center", marginTop: 8 }}>
    {focused && (
      <View
        style={{
          width: 38,
          height: 32,
          borderRadius: 16,
          backgroundColor: premiumColors.softPrimary,
          position: 'absolute',
          top: -3,
          zIndex: 2,
          ...Platform.select({
            android: {
              elevation: 2,
            },
            ios: {
              shadowColor: premiumColors.primary,
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
      size={21}
      color={focused ? premiumColors.primary : "#FFFFFF"}
      style={{ zIndex: 3 }}
    />
    <Text
      style={{
        fontSize: 11,
        marginTop: 8,
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
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 76,
          marginHorizontal: 16,
          marginBottom: 12,
          borderRadius: 28,
          position: 'absolute',
          backgroundColor: premiumColors.nav,
          borderTopWidth: 0,
          elevation: 18,
          shadowColor: '#20232A',
          shadowOpacity: 0.16,
          shadowRadius: 24,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={BarberDashboard}
        options={{
          tabBarIcon: ({ focused }) =>
            renderIcon('home', 'Home', focused),
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={Bookings}
        options={{
          tabBarIcon: ({ focused }) =>
            renderIcon('calendar', 'Bookings', focused),
        }}
      />
      <Tab.Screen
        name="Services"
        component={Services}
        options={{
          tabBarIcon: ({ focused }) =>
            renderIcon('briefcase', 'Services', focused),
        }}
      />
      <Tab.Screen
        name="Setting"
        component={Setting}
        options={{
          tabBarIcon: ({ focused }) =>
            renderIcon('cog', 'Setting', focused),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) =>
            renderIcon('user', 'Profile', focused),
        }}
      />
    </Tab.Navigator>
  );
};

export default BarberBottomTabs;
