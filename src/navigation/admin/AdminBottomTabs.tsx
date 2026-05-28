import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { usePremiumTheme } from '../../shared/theme/premiumTheme';
import AdminDashboard from '../../screens/admin/AdminDashboard';
import AdminBookings from '../../screens/admin/AdminBookings';
import AdminCustomers from '../../screens/admin/AdminCustomers';
import AdminForms from '../../screens/admin/AdminForms';
import AdminMore from '../../screens/admin/AdminMore';

const Tab = createBottomTabNavigator();

const AdminBottomTabs = () => {
  const { colors } = usePremiumTheme();

  const activeColor = colors.primary;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: activeColor,
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
          
          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Bookings') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Customers') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Forms') {
            iconName = focused ? 'document-text' : 'document-text-outline';
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
      <Tab.Screen name="Dashboard" component={AdminDashboard} />
      <Tab.Screen name="Bookings" component={AdminBookings} />
      <Tab.Screen name="Customers" component={AdminCustomers} />
      <Tab.Screen name="Forms" component={AdminForms} />
      <Tab.Screen name="More" component={AdminMore} />
    </Tab.Navigator>
  );
};

export default AdminBottomTabs;
