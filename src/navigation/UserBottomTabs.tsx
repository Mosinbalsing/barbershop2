import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { usePremiumTheme } from '../shared/theme/premiumTheme';

import UserHome from '../screens/user/home/UserHome';
import UserBookings from '../screens/user/bookings/UserBookings';
import UserProfile from '../screens/user/profile/UserProfile';

const Tab = createMaterialTopTabNavigator();

type TabPalette = {
  navBackground: string;
  navBorder: string;
  navTopLine: string;
  inactiveText: string;
  inactiveIcon: string;
  activeIconBubble: string;
  activeIcon: string;
  activeText: string;
};

const getTabPalette = (
  mode: ReturnType<typeof usePremiumTheme>['mode'],
  colors: ReturnType<typeof usePremiumTheme>['colors'],
): TabPalette => {
  if (mode === 'dark') {
    return {
      navBackground: '#2A2255',
      navBorder: 'rgba(255,255,255,0.08)',
      navTopLine: 'rgba(255,255,255,0.18)',
      inactiveText: '#AEA8CF',
      inactiveIcon: '#B9B4D7',
      activeIconBubble: 'rgba(255,255,255,0.2)',
      activeIcon: '#FFFFFF',
      activeText: '#FFFFFF',
    };
  }

  return {
    navBackground: '#6D4CF3',
    navBorder: 'rgba(106,83,214,0.35)',
    navTopLine: 'rgba(255,255,255,0.25)',
    inactiveText: '#CFC6FF',
    inactiveIcon: '#E7E0FF',
    activeIconBubble: 'rgba(255,255,255,0.24)',
    activeIcon: '#FFFFFF',
    activeText: '#FFFFFF',
  };
};

const renderIcon = (icon: string, label: string, focused: boolean, palette: TabPalette) => (
  <View style={styles.tabItemWrap}>
    <View
      style={[
        styles.iconBubble,
        { backgroundColor: focused ? palette.activeIconBubble : 'transparent' },
      ]}
    >
      <Icon
        name={icon}
        size={17}
        color={focused ? palette.activeIcon : palette.inactiveIcon}
      />
    </View>
    <Text
      style={[
        styles.tabLabel,
        {
          color: focused ? palette.activeText : palette.inactiveText,
          fontWeight: focused ? '800' : '600',
        },
      ]}
      numberOfLines={1}
    >
      {label}
    </Text>
  </View>
);

const UserBottomTabs = () => {
  const { colors, mode } = usePremiumTheme();
  const darkMode = mode === 'dark';
  const palette = getTabPalette(mode, colors);

  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      screenOptions={{
        swipeEnabled: true,
        animationEnabled: true,
        tabBarShowLabel: false,
        tabBarIndicatorStyle: { backgroundColor: 'transparent', height: 0 },
        tabBarStyle: {
          height: 78,
          marginHorizontal: 16,
          marginBottom: Platform.select({ ios: 18, android: 10 }),
          bottom: 0,
          left: 0,
          right: 0,
          paddingBottom: 8,
          paddingTop: 4,
          justifyContent: 'center',
          borderRadius: 26,
          position: 'absolute',
          backgroundColor: palette.navBackground,
          borderWidth: 1,
          borderColor: palette.navBorder,
          borderTopColor: palette.navTopLine,
          elevation: 20,
          shadowColor: darkMode ? '#120F1E' : '#5A3DD6',
          shadowOpacity: darkMode ? 0.45 : 0.35,
          shadowRadius: darkMode ? 20 : 24,
          shadowOffset: { width: 0, height: 12 },
        },
        tabBarPressColor: 'transparent',
        tabBarItemStyle: {
          paddingHorizontal: 0,
          marginTop: 1,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={UserHome}
        options={{
          tabBarIcon: ({ focused }) =>
            renderIcon('home', 'Home', focused, palette),
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={UserBookings}
        options={{
          tabBarIcon: ({ focused }) =>
            renderIcon('calendar', 'Bookings', focused, palette),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={UserProfile}
        options={{
          tabBarIcon: ({ focused }) =>
            renderIcon('user', 'Profile', focused, palette),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabItemWrap: {
    minWidth: 66,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  iconBubble: {
    width: 30,
    height: 30,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 3,
    textAlign: 'center',
    letterSpacing: 0.15,
  },
});

export default UserBottomTabs;
