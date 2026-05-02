
import React from 'react';
import { View, Text, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import BarberDashboard from '../../screens/barber/dashboard/BarberDashboard';
import Bookings from '../../screens/barber/bookings/Bookings';
import Services from '../../screens/barber/services/Services';
import Setting from '../../screens/barber/setting/Setting';
import Profile from '../../screens/barber/profile/Profile';

const Tab = createBottomTabNavigator();


const renderIcon = (icon: string, label: string, focused: boolean) => (
  <View style={{ alignItems: "center", marginTop: 10 }}>
    {focused && (
      <View
        style={{
          marginTop: -6,
          height: 4,
          width: 50,
          backgroundColor: "#D96D05",
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
          zIndex: 2,
          ...Platform.select({
            android: {
              elevation: 2,
            },
            ios: {
              shadowColor: "#ef7d12e0",
              shadowOffset: { width: 1, height: 4 },
              shadowOpacity: 1,
              shadowRadius: 4,
            },
          }),
        }}
      />
    )}
    <Icon
      name={icon}
      size={24}
      color={focused ? "#000" : "#B0B0B0"}
    />
    <Text
      style={{
        fontSize: 12,
        marginTop: 4,
        color: focused ? "#000" : "#B0B0B0",
        fontWeight: focused ? "600" : "400",
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
          height: 70,
          backgroundColor: '#fff',
          elevation: 15,
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
