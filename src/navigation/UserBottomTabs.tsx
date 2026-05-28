import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { usePremiumTheme } from '../shared/theme/premiumTheme';

import UserHome from '../screens/user/home/UserHome';
import UserBookings from '../screens/user/bookings/UserBookings';
import UserProfile from '../screens/user/profile/UserProfile';

// Simple placeholder for Notifications
const UserNotifications = () => <View style={{ flex: 1, backgroundColor: '#F6F7FB' }} />;

const Tab = createBottomTabNavigator();

const UserBottomTabs = () => {
  const { colors } = usePremiumTheme();

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
          } else if (route.name === 'Notifications') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return (
            <View>
              <Ionicons name={iconName} size={24} color={color} />
              {route.name === 'Notifications' && (
                <View style={[styles.badge, { borderColor: colors.surface }]} />
              )}
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={UserHome} />
      <Tab.Screen name="Bookings" component={UserBookings} />
      <Tab.Screen name="Notifications" component={UserNotifications} />
      <Tab.Screen name="Profile" component={UserProfile} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF4B4B',
    borderWidth: 1.5,
  },
});

export default UserBottomTabs;
