
import React from 'react';
import { View, Text, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { usePremiumTheme } from '../../shared/theme/premiumTheme';
import AdminDashboard from '../../screens/admin/AdminDashboard';
import BarbersAdmin from '../../screens/admin/BarbersAdmin';
import UsersAdmin from '../../screens/admin/UsersAdmin';
import AdminProfile from '../../screens/admin/AdminProfile';

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

const AdminBottomTabs = () => {
  const { colors } = usePremiumTheme();

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
        component={AdminDashboard}
        options={{
          tabBarIcon: ({ focused }) =>
            renderIcon('home', 'Home', focused, colors),
        }}
      />
      <Tab.Screen
        name="Barber"
        component={BarbersAdmin}
        options={{
          tabBarIcon: ({ focused }) =>
            renderIcon('scissors', 'Barber', focused, colors),
        }}
      />
      <Tab.Screen
        name="User"
        component={UsersAdmin}
        options={{
          tabBarIcon: ({ focused }) =>
            renderIcon('users', 'User', focused, colors),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={AdminProfile}
        options={{
          tabBarIcon: ({ focused }) =>
            renderIcon('user', 'Profile', focused, colors),
        }}
      />
    </Tab.Navigator>
  );
};

export default AdminBottomTabs;
