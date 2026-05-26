import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { usePremiumTheme } from '../../../shared/theme/premiumTheme';

const UserProfile = () => {
  const { colors } = usePremiumTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.canvas }]}>
      <Text style={[styles.title, { color: colors.ink }]}>My Profile</Text>
      <Text style={[styles.subtitle, { color: colors.muted }]}>
        Manage your profile and settings
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default UserProfile;
