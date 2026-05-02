
import React from 'react';
import { View, Text, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AdminDashboard from '../../screens/admin/AdminDashboard';
import BarbersAdmin from '../../screens/admin/BarbersAdmin';
import UsersAdmin from '../../screens/admin/UsersAdmin';
import AdminProfile from '../../screens/admin/AdminProfile';

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

const AdminBottomTabs = () => {
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
        component={AdminDashboard}
        options={{
          tabBarIcon: ({ focused }) =>
            renderIcon('home', 'Home', focused),
        }}
      />
      <Tab.Screen
        name="Barber"
        component={BarbersAdmin}
        options={{
          tabBarIcon: ({ focused }) =>
            renderIcon('scissors', 'Barber', focused),
        }}
      />
      <Tab.Screen
        name="User"
        component={UsersAdmin}
        options={{
          tabBarIcon: ({ focused }) =>
            renderIcon('users', 'User', focused),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={AdminProfile}
        options={{
          tabBarIcon: ({ focused }) =>
            renderIcon('user', 'Adminprofile', focused),
        }}
      />
    </Tab.Navigator>
  );
};

export default AdminBottomTabs;
