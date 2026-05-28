import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Typography } from '../../../shared/components/Typography';
import { Header } from '../../../shared/components/Header';
import { Icon } from '../../../shared/components/Icon';
import { Button } from '../../../shared/components/Button';
import { usePremiumTheme, premiumShadow } from '../../../shared/theme/premiumTheme';
import { useNavigation } from '@react-navigation/native';

const AppointmentDetails = () => {
  const { colors } = usePremiumTheme();
  const navigation = useNavigation<any>();
  const [status, setStatus] = useState<'Confirmed' | 'Cancelled'>('Confirmed');

  const handleReschedule = () => {
    Alert.alert(
      'Reschedule Appointment',
      'Would you like to reschedule this appointment? This will open the calendar slots booking screen.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reschedule', onPress: () => navigation.navigate('user', { screen: 'Bookings' }) }
      ]
    );
  };

  const handleCancelAppointment = () => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            setStatus('Cancelled');
            Alert.alert('Cancelled', 'Your appointment has been cancelled successfully.');
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.canvas }]}>
      <Header title="Appointment Details" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Top visual graphic card */}
        <View style={[styles.graphicCard, { backgroundColor: colors.surface }, premiumShadow]}>
          <View style={[styles.iconCircleBg, { backgroundColor: colors.softPrimary }]}>
            <Icon name="calendar-outline" size={36} color="primary" />
          </View>
          
          <Typography variant="h3" weight="bold" style={styles.title}>Haircut & Beard Trim</Typography>
          
          <View style={[
            styles.statusBadge,
            { backgroundColor: status === 'Confirmed' ? '#D1FAE5' : 'rgba(239, 68, 68, 0.1)' }
          ]}>
            <Typography
              variant="label"
              weight="bold"
              style={{ color: status === 'Confirmed' ? '#10B981' : '#EF4444' }}
            >
              {status}
            </Typography>
          </View>
        </View>

        {/* Details Table Card */}
        <View style={[styles.tableCard, { backgroundColor: colors.surface }, premiumShadow]}>
          <View style={styles.tableRow}>
            <Typography variant="caption" color="muted">Date</Typography>
            <Typography variant="body" weight="bold">20 May 2025 (Tuesday)</Typography>
          </View>

          <View style={styles.tableRow}>
            <Typography variant="caption" color="muted">Time</Typography>
            <Typography variant="body" weight="bold">05:00 PM</Typography>
          </View>

          <View style={styles.tableRow}>
            <Typography variant="caption" color="muted">Shop</Typography>
            <Typography variant="body" weight="bold">Barobar Shop</Typography>
          </View>

          <View style={styles.tableRow}>
            <Typography variant="caption" color="muted">Service</Typography>
            <Typography variant="body" weight="bold">Haircut & Beard Trim</Typography>
          </View>

          <View style={styles.tableRow}>
            <Typography variant="caption" color="muted">Duration</Typography>
            <Typography variant="body" weight="bold">50 mins</Typography>
          </View>

          <View style={styles.tableRow}>
            <Typography variant="caption" color="muted">Payment</Typography>
            <Typography variant="body" weight="bold">Cash at Shop</Typography>
          </View>

          <View style={[styles.tableRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
            <Typography variant="caption" color="muted">Amount</Typography>
            <Typography variant="body" weight="bold" color="primary">₹299</Typography>
          </View>
        </View>

        {/* Dynamic Buttons */}
        {status === 'Confirmed' ? (
          <View style={styles.actionsContainer}>
            <Button
              title="Reschedule"
              size="large"
              onPress={handleReschedule}
            />
            
            <TouchableOpacity
              onPress={handleCancelAppointment}
              style={[styles.cancelBtn, { borderColor: '#EF4444' }]}
            >
              <Typography variant="body" weight="bold" style={{ color: '#EF4444' }}>
                Cancel Appointment
              </Typography>
            </TouchableOpacity>
          </View>
        ) : (
          <Button
            title="Book a New Slots"
            size="large"
            onPress={() => navigation.navigate('user', { screen: 'Bookings' })}
            style={{ marginTop: 12 }}
          />
        )}

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16, gap: 16 },
  graphicCard: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
  },
  iconCircleBg: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  tableCard: {
    borderRadius: 16,
    padding: 20,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(236, 236, 243, 0.5)',
  },
  actionsContainer: {
    marginTop: 8,
    gap: 12,
  },
  cancelBtn: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AppointmentDetails;
