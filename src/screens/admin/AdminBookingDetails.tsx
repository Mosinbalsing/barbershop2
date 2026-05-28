import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useRoute } from '@react-navigation/native';
import { usePremiumTheme, premiumShadow } from '../../shared/theme/premiumTheme';

type BookingItem = {
  id: string;
  name: string;
  service: string;
  price: string;
  time: string;
  date: string;
  fullDate: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  avatar: string;
  phone: string;
  duration: string;
  payment: string;
};

const AdminBookingDetails = () => {
  const { colors, mode } = usePremiumTheme();
  const navigation = useNavigation();
  const route = useRoute<any>();

  // Fetch routing booking param or default fallback
  const booking: BookingItem = route.params?.booking || {
    id: '#820250520001',
    name: 'Rahul Verma',
    service: 'Haircut & Beard Trim',
    price: '₹299',
    time: '05:00 PM',
    date: '20 May',
    fullDate: '20 May 2025 (Tue)',
    status: 'Confirmed',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    phone: '9876543210',
    duration: '30 mins',
    payment: 'Cash at Shop',
  };

  const brownTheme = {
    primary: '#683E26',
    activeBg: mode === 'dark' ? '#3A281E' : '#F5F1ED',
  };

  const detailRows = [
    { label: 'Service', value: booking.service },
    { label: 'Date', value: booking.fullDate },
    { label: 'Time', value: booking.time },
    { label: 'Duration', value: booking.duration },
    { label: 'Amount', value: booking.price },
    { label: 'Payment', value: booking.payment },
    { label: 'Booking ID', value: booking.id },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.canvas }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.line }]}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={18} color={colors.ink} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.ink }]}>Booking Details</Text>

        <View style={[styles.statusBadge, { backgroundColor: '#EAFBF6' }]}>
          <Text style={[styles.statusBadgeText, { color: '#10B981' }]}>{booking.status}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.surface, borderColor: colors.line }]}>
          <Image source={{ uri: booking.avatar }} style={styles.avatar} />
          <Text style={[styles.profileName, { color: colors.ink }]}>{booking.name}</Text>
          <Text style={[styles.profilePhone, { color: colors.muted }]}>{booking.phone}</Text>
        </View>

        {/* Info Rows */}
        <View style={[styles.detailsContainer, { backgroundColor: colors.surface, borderColor: colors.line }]}>
          {detailRows.map((row, idx) => {
            const isLast = idx === detailRows.length - 1;
            return (
              <View
                key={row.label}
                style={[
                  styles.detailRow,
                  { borderBottomColor: colors.line },
                  !isLast && { borderBottomWidth: 1 }
                ]}
              >
                <Text style={[styles.rowLabel, { color: colors.muted }]}>{row.label}</Text>
                <Text style={[styles.rowValue, { color: colors.ink }]}>{row.value}</Text>
              </View>
            );
          })}
        </View>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.rescheduleBtn, { backgroundColor: brownTheme.primary }]}
            onPress={() => Alert.alert('Reschedule Booking', 'Open rescheduling settings.')}
          >
            <Text style={styles.rescheduleText}>Reschedule</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => Alert.alert('Cancel Booking', 'Are you sure you want to cancel this booking?')}
          >
            <Text style={styles.cancelText}>Cancel Booking</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  },
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  profileCard: {
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 22,
    paddingVertical: 20,
    marginBottom: 16,
    ...premiumShadow,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#ECECF3',
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  profilePhone: {
    fontSize: 13,
    marginTop: 4,
  },
  detailsContainer: {
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 16,
    marginBottom: 24,
    ...premiumShadow,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  rowValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonRow: {
    gap: 12,
  },
  rescheduleBtn: {
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    ...premiumShadow,
  },
  rescheduleText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelBtn: {
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  cancelText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdminBookingDetails;
