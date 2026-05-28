import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useRoute } from '@react-navigation/native';
import { usePremiumTheme, premiumShadow } from '../../../shared/theme/premiumTheme';

const BarberNotificationDetail = () => {
  const { colors, mode } = usePremiumTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  // Fetch routing param details
  const alertDetail = route.params?.notification || {
    title: 'New Booking Received',
    body: 'Rahul has booked a Haircut & Beard Trim',
    time: 'Today, 10:30 AM',
    iconColor: '#6D4CF3',
  };

  const purpleTheme = {
    primary: '#6D4CF3',
    activeBg: mode === 'dark' ? 'rgba(109, 76, 243, 0.25)' : 'rgba(109, 76, 243, 0.12)',
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.canvas }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.line }]}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={18} color={colors.ink} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.ink }]}>Notification Detail</Text>

        <View style={{ width: 36 }} />
      </View>

      <View style={styles.content}>
        {/* Detail Panel Card */}
        <View style={[styles.detailCard, { backgroundColor: colors.surface, borderColor: colors.line }]}>
          {/* Big Circle Icon */}
          <View style={[styles.bigIconCircle, { backgroundColor: purpleTheme.activeBg }]}>
            <Icon name="calendar-check-o" size={44} color={purpleTheme.primary} />
          </View>

          {/* Heading */}
          <Text style={[styles.headline, { color: colors.ink }]}>{alertDetail.title}</Text>

          {/* Body content */}
          <Text style={[styles.bodyText, { color: colors.muted }]}>
            {alertDetail.body}
          </Text>
          
          <Text style={[styles.timeText, { color: colors.muted }]}>
            {alertDetail.time.includes('AM') || alertDetail.time.includes('PM') ? `Today, ${alertDetail.time}` : alertDetail.time}
          </Text>
        </View>

        {/* View Booking CTA */}
        <TouchableOpacity
          style={[styles.viewBookingBtn, { backgroundColor: purpleTheme.primary }]}
          onPress={() => {
            Alert.alert('Booking Details', 'Redirect to actual Booking info page.');
            navigation.navigate('Bookings');
          }}
        >
          <Text style={styles.viewBookingText}>View Booking</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  detailCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    marginBottom: 32,
    ...premiumShadow,
  },
  bigIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  headline: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  bodyText: {
    fontSize: 14.5,
    lineHeight: 22,
    textAlign: 'center',
  },
  timeText: {
    fontSize: 14.5,
    lineHeight: 22,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 4,
  },
  viewBookingBtn: {
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    ...premiumShadow,
  },
  viewBookingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BarberNotificationDetail;
