import React from 'react';
import { View, StyleSheet, ScrollView, Switch, Alert, TouchableOpacity, Text } from 'react-native';
import { Typography } from '../../../shared/components/Typography';
import { Header } from '../../../shared/components/Header';
import { Icon } from '../../../shared/components/Icon';
import { MenuItem } from '../components/MenuItem';
import { usePremiumTheme, premiumSpacing, premiumShadow } from '../../../shared/theme/premiumTheme';
import { useNavigation } from '@react-navigation/native';

const UserProfile = () => {
  const { colors, mode, setMode } = usePremiumTheme();
  const navigation = useNavigation<any>();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout of your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => navigation.navigate('LoginScreen') }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.canvas }]}>
      <Header
        rightElement={<Icon name="settings-outline" size={24} color="ink" />}
        transparent
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {/* Placeholder for avatar */}
            <View style={[styles.avatar, { backgroundColor: colors.softPrimary }]}>
              <Icon name="person" size={48} color="primary" />
            </View>
            <View style={[styles.editBadge, { backgroundColor: colors.surface }]}>
              <Icon name="camera-outline" size={16} color="ink" />
            </View>
          </View>
          <Typography variant="h2" weight="bold" style={styles.name}>Rahul Sharma</Typography>
          <View style={styles.contactRow}>
            <Icon name="call-outline" size={16} color="muted" />
            <Typography variant="body" color="muted" style={styles.contactText}>9876543210</Typography>
          </View>
          <View style={styles.contactRow}>
            <Icon name="mail-outline" size={16} color="muted" />
            <Typography variant="body" color="muted" style={styles.contactText}>rahul.sharma@gmail.com</Typography>
          </View>
        </View>

        {/* Menu Items */}
        <View style={[styles.menuContainer, { backgroundColor: colors.surface }, premiumShadow]}>
          <MenuItem
            title="Personal Information"
            iconName="person-outline"
            onPress={() => navigation.navigate('PersonalDetails')}
          />
          <MenuItem
            title="My Bookings"
            iconName="calendar-outline"
            onPress={() => navigation.navigate('MyBookingsHistory')}
          />
          <MenuItem
            title="Payment Methods"
            iconName="card-outline"
            onPress={() => Alert.alert('Payment Methods', 'Manage your cards and digital payment options.')}
          />
          <MenuItem
            title="My Coupons"
            iconName="ticket-outline"
            onPress={() => navigation.navigate('MyCoupons')}
          />
          <MenuItem
            title="Notification Settings"
            iconName="notifications-outline"
            onPress={() => navigation.navigate('NotificationSettings')}
          />
          
          {/* Custom Appearance Row */}
          <View style={[styles.appearanceRow, { borderBottomColor: colors.line }]}>
            <View style={styles.appearanceLeft}>
              <Icon name="color-palette-outline" size={24} color="primary" />
              <Typography variant="body" style={styles.appearanceTitle}>Appearance</Typography>
            </View>
            <View style={[styles.segmented, { backgroundColor: colors.canvas, borderColor: colors.line }]}>
              {([
                { label: 'Light', value: 'light', icon: 'sunny-outline' },
                { label: 'Dark', value: 'dark', icon: 'moon-outline' },
                { label: 'System', value: 'system', icon: 'laptop-outline' },
              ] as const).map(item => {
                const active = mode === item.value;
                return (
                  <TouchableOpacity
                    key={item.value}
                    style={[
                      styles.segment,
                      active && { backgroundColor: colors.primary }
                    ]}
                    onPress={() => setMode(item.value)}
                  >
                    <Icon name={item.icon} size={15} color={active ? 'surface' : 'muted'} />
                    <Text style={[
                      styles.segmentText,
                      active ? { color: colors.surface, fontWeight: 'bold' } : { color: colors.muted }
                    ]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <MenuItem
            title="Help & Support"
            iconName="help-circle-outline"
            onPress={() => navigation.navigate('HelpSupport')}
          />
          <MenuItem
            title="Logout"
            iconName="log-out-outline"
            isDestructive
            onPress={handleLogout}
          />
        </View>

        {/* Loyalty Banner */}
        <View style={[styles.loyaltyBanner, { backgroundColor: colors.ink }]}>
          <View style={styles.loyaltyContent}>
            <Typography variant="body" color="muted">Loyalty Points</Typography>
            <Typography variant="h1" color="surface" weight="bold">250</Typography>
            <Typography variant="caption" color="muted">Book more to earn more points!</Typography>
          </View>
          <Icon name="star" size={48} color="primary" />
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 100 },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  name: { marginBottom: 8 },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  contactText: { marginLeft: 8 },
  menuContainer: {
    borderRadius: premiumSpacing.cardRadius,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  appearanceRow: {
    flexDirection: 'column',
    paddingVertical: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  appearanceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appearanceTitle: {
    marginLeft: 16,
    fontWeight: '700',
  },
  segmented: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 11,
    paddingVertical: 8,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '600',
  },
  loyaltyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    borderRadius: premiumSpacing.radius,
  },
  loyaltyContent: { flex: 1 },
});

export default UserProfile;
