import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions, Alert, Image, Platform } from 'react-native';
import { Typography } from '../../../shared/components/Typography';
import { Icon } from '../../../shared/components/Icon';
import { usePremiumTheme, premiumSpacing, premiumShadow } from '../../../shared/theme/premiumTheme';
import { ServiceItem } from '../components/ServiceItem';
import { Header } from '../../../shared/components/Header';
import { Button } from '../../../shared/components/Button';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const UserHome = () => {
  const { colors } = usePremiumTheme();
  const navigation = useNavigation<any>();

  // Custom Animated Side Menu Drawer State
  const [drawerOpen, setDrawerOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-280)).current;

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
    Animated.timing(slideAnim, {
      toValue: open ? 0 : -280,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleLogout = () => {
    toggleDrawer(false);
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => navigation.navigate('LoginScreen') }
      ]
    );
  };

  // Mock services mapped from mockup
  const services = [
    { id: '1', title: 'Haircut', duration: '30 mins', price: '₹299', iconName: 'cut-outline' },
    { id: '2', title: 'Beard Trim', duration: '20 mins', price: '₹199', iconName: 'person-outline' },
    { id: '3', title: 'Shave', duration: '15 mins', price: '₹149', iconName: 'water-outline' },
    { id: '4', title: 'Hair Spa', duration: '45 mins', price: '₹499', iconName: 'color-wand-outline' },
    { id: '5', title: 'Hair Color', duration: '60 mins', price: '₹999', iconName: 'color-palette-outline' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.canvas }]}>
      {/* Home Header */}
      <Header
        leftElement={
          <TouchableOpacity onPress={() => toggleDrawer(true)} style={styles.headerBtn}>
            <Icon name="menu" size={28} color="ink" />
          </TouchableOpacity>
        }
        rightElement={
          <TouchableOpacity onPress={() => navigation.navigate('NotificationsList')} style={styles.headerBtn}>
            <Icon name="notifications-outline" size={24} color="ink" />
            <View style={styles.badge} />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Greeting Section */}
        <View style={styles.greetingContainer}>
          <Typography variant="h2" weight="bold">Hi, Rahul 👋</Typography>
          <Typography variant="body" color="muted">Look good, feel confident!</Typography>
        </View>

        {/* LOOK YOUR BEST - Promotional Banner */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate('SpecialOffer')}
          style={[styles.banner, { backgroundColor: colors.ink }]}
        >
          <View style={styles.bannerContent}>
            <Typography variant="h2" color="surface" weight="bold">LOOK</Typography>
            <Typography variant="h2" color="surface" weight="bold">YOUR BEST</Typography>
            <Typography variant="caption" color="muted" style={styles.bannerSubtitle}>
              Book your appointment with our professional barber
            </Typography>
            <Button
              title="Book Now"
              size="small"
              onPress={() => navigation.navigate('SpecialOffer')}
              style={styles.bannerBtn}
            />
          </View>
        </TouchableOpacity>

        {/* Our Services Section */}
        <View style={styles.sectionHeader}>
          <Typography variant="h4" weight="bold">Our Services</Typography>
          <TouchableOpacity onPress={() => navigation.navigate('AllServices')}>
            <Typography variant="caption" color="primary" weight="600">View All</Typography>
          </TouchableOpacity>
        </View>
        
        {/* Services Grid (Horizontal Grid cards matching mockup) */}
        <View style={styles.servicesGrid}>
          {services.slice(0, 5).map((service) => (
            <TouchableOpacity
              key={service.id}
              onPress={() => navigation.navigate('ServiceDetails', { service })}
              style={[styles.gridServiceCard, { backgroundColor: colors.surface }, premiumShadow]}
            >
              <View style={[styles.gridIconBg, { backgroundColor: colors.softPrimary }]}>
                <Icon name={service.iconName} size={26} color="primary" />
              </View>
              <Typography variant="caption" weight="bold" style={styles.serviceGridTitle}>
                {service.title}
              </Typography>
              <Typography variant="label" color="primary" weight="bold">
                {service.price}
              </Typography>
            </TouchableOpacity>
          ))}
        </View>

        {/* Upcoming Appointment Section */}
        <View style={styles.sectionHeader}>
          <Typography variant="h4" weight="bold">Upcoming Appointment</Typography>
        </View>
        
        <TouchableOpacity
          onPress={() => navigation.navigate('AppointmentDetails')}
          style={[styles.appointmentCard, { backgroundColor: colors.surface }, premiumShadow]}
        >
          <View style={[styles.dateBox, { backgroundColor: colors.softPrimary }]}>
            <Typography variant="h3" color="primary" weight="bold">20</Typography>
            <Typography variant="caption" color="primary" weight="bold">MAY</Typography>
            <Typography variant="label" color="primary" style={styles.dayText}>TUE</Typography>
          </View>
          <View style={styles.appointmentInfo}>
            <Typography variant="body" weight="bold">Haircut & Beard Trim</Typography>
            <View style={styles.infoRow}>
              <Icon name="calendar-outline" size={14} color="muted" />
              <Typography variant="caption" color="muted" style={styles.infoText}>20 May 2025, 05:00 PM</Typography>
            </View>
            <View style={styles.infoRow}>
              <Icon name="location-outline" size={14} color="muted" />
              <Typography variant="caption" color="muted" style={styles.infoText}>Barobar Shop</Typography>
            </View>
          </View>
          <View style={styles.badgeConfirmed}>
            <Typography variant="label" weight="bold" style={{ color: '#10B981' }}>Confirmed</Typography>
          </View>
        </TouchableOpacity>

        {/* Why Choose Us Section */}
        <View style={styles.sectionHeader}>
          <Typography variant="h4" weight="bold">Why Choose Us?</Typography>
        </View>

        <View style={styles.highlightsContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('WhyChooseUs')}
            style={[styles.highlightItemCard, { backgroundColor: colors.surface }, premiumShadow]}
          >
            <Icon name="shield-checkmark-outline" size={24} color="primary" />
            <Typography variant="label" weight="bold" style={styles.highlightTitle}>Hygienic Tools</Typography>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('WhyChooseUs')}
            style={[styles.highlightItemCard, { backgroundColor: colors.surface }, premiumShadow]}
          >
            <Icon name="sparkles-outline" size={24} color="primary" />
            <Typography variant="label" weight="bold" style={styles.highlightTitle}>Quality Products</Typography>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('WhyChooseUs')}
            style={[styles.highlightItemCard, { backgroundColor: colors.surface }, premiumShadow]}
          >
            <Icon name="ribbon-outline" size={24} color="primary" />
            <Typography variant="label" weight="bold" style={styles.highlightTitle}>Expert Service</Typography>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('WhyChooseUs')}
            style={[styles.highlightItemCard, { backgroundColor: colors.surface }, premiumShadow]}
          >
            <Icon name="alarm-outline" size={24} color="primary" />
            <Typography variant="label" weight="bold" style={styles.highlightTitle}>On-time Service</Typography>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* CUSTOM DRAWER OVERLAY PANEL */}
      {drawerOpen && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => toggleDrawer(false)}
          style={styles.drawerBackdropScrim}
        >
          <Animated.View
            style={[
              styles.drawerPanel,
              {
                backgroundColor: colors.surface,
                borderRightColor: colors.line,
                transform: [{ translateX: slideAnim }],
              },
            ]}
          >
            {/* Drawer Header Profile */}
            <View style={[styles.drawerHeader, { borderBottomColor: colors.line }]}>
              <View style={[styles.drawerAvatar, { backgroundColor: colors.softPrimary }]}>
                <Icon name="person" size={32} color="primary" />
              </View>
              <View style={styles.drawerProfileInfo}>
                <Typography variant="body" weight="bold">Rahul Sharma</Typography>
                <Typography variant="caption" color="muted">9876543210</Typography>
              </View>
            </View>

            {/* Drawer List Menu Items */}
            <ScrollView contentContainerStyle={styles.drawerList}>
              <TouchableOpacity
                onPress={() => toggleDrawer(false)}
                style={[styles.drawerListItem, styles.activeItem, { backgroundColor: colors.softPrimary }]}
              >
                <Icon name="home" size={20} color="primary" />
                <Typography variant="body" weight="bold" color="primary" style={styles.drawerItemText}>Home</Typography>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  toggleDrawer(false);
                  navigation.navigate('MyBookingsHistory');
                }}
                style={styles.drawerListItem}
              >
                <Icon name="calendar-outline" size={20} color="ink" />
                <Typography variant="body" style={styles.drawerItemText}>My Bookings</Typography>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  toggleDrawer(false);
                  navigation.navigate('MyCoupons');
                }}
                style={styles.drawerListItem}
              >
                <Icon name="ticket-outline" size={20} color="ink" />
                <Typography variant="body" style={styles.drawerItemText}>My Coupons</Typography>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  toggleDrawer(false);
                  navigation.navigate('NotificationSettings');
                }}
                style={styles.drawerListItem}
              >
                <Icon name="notifications-outline" size={20} color="ink" />
                <Typography variant="body" style={styles.drawerItemText}>Notification Settings</Typography>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  toggleDrawer(false);
                  navigation.navigate('HelpSupport');
                }}
                style={styles.drawerListItem}
              >
                <Icon name="help-circle-outline" size={20} color="ink" />
                <Typography variant="body" style={styles.drawerItemText}>Help & Support</Typography>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  toggleDrawer(false);
                  Alert.alert('About Us', 'Barobar Shop application v1.0.0. A premium grooming experience.');
                }}
                style={styles.drawerListItem}
              >
                <Icon name="information-circle-outline" size={20} color="ink" />
                <Typography variant="body" style={styles.drawerItemText}>About Us</Typography>
              </TouchableOpacity>

              <View style={[styles.drawerLineSeparator, { backgroundColor: colors.line }]} />

              <TouchableOpacity
                onPress={handleLogout}
                style={styles.drawerListItem}
              >
                <Icon name="log-out-outline" size={20} color="error" />
                <Typography variant="body" weight="bold" color="error" style={styles.drawerItemText}>Logout</Typography>
              </TouchableOpacity>
            </ScrollView>
          </Animated.View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBtn: { padding: 4 },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4B4B',
  },
  scrollContent: { padding: 16, paddingBottom: 100 },
  greetingContainer: { marginBottom: 20 },
  banner: {
    borderRadius: premiumSpacing.radius,
    padding: 24,
    marginBottom: 24,
  },
  bannerContent: { width: '60%' },
  bannerSubtitle: { marginVertical: 12, lineHeight: 18 },
  bannerBtn: { alignSelf: 'flex-start' },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  
  // Services dynamic grid
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 16,
  },
  gridServiceCard: {
    width: '31%',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  gridIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  serviceGridTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  
  // Appointment card
  appointmentCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: premiumSpacing.cardRadius,
    alignItems: 'center',
    marginBottom: 24,
  },
  dateBox: {
    width: 60,
    height: 66,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  dayText: {
    fontSize: 8,
    fontWeight: '800',
  },
  appointmentInfo: { flex: 1 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  infoText: { marginLeft: 4 },
  badgeConfirmed: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  // Highlight Cards
  highlightsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  highlightItemCard: {
    width: '48%',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    gap: 8,
  },
  highlightTitle: {
    fontSize: 11,
    textAlign: 'center',
  },

  // CUSTOM DRAWER SCRIM AND STYLES
  drawerBackdropScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(16, 18, 24, 0.4)',
    zIndex: 999999,
  },
  drawerPanel: {
    width: 280,
    height: '100%',
    borderRightWidth: 1.5,
    paddingTop: Platform.OS === 'ios' ? 60 : 30,
    elevation: 8,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomWidth: 1,
  },
  drawerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  drawerProfileInfo: {
    flex: 1,
  },
  drawerList: {
    padding: 16,
    gap: 6,
  },
  drawerListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  activeItem: {
    borderRadius: 12,
  },
  drawerItemText: {
    marginLeft: 16,
    fontSize: 15,
  },
  drawerLineSeparator: {
    height: 1,
    marginVertical: 12,
    marginHorizontal: 14,
  },
});

export default UserHome;
