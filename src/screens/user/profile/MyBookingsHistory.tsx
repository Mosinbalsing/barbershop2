import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Typography } from '../../../shared/components/Typography';
import { Header } from '../../../shared/components/Header';
import { Icon } from '../../../shared/components/Icon';
import { Button } from '../../../shared/components/Button';
import { usePremiumTheme, premiumSpacing, premiumShadow } from '../../../shared/theme/premiumTheme';
import { useNavigation } from '@react-navigation/native';

interface Booking {
  id: string;
  service: string;
  duration: string;
  price: string;
  dateStr: string; // e.g. "20 May 2025"
  dayStr: string;  // e.g. "20"
  monthStr: string; // e.g. "MAY"
  weekdayStr: string; // e.g. "TUE"
  timeStr: string; // e.g. "05:00 PM"
  shop: string;
  paymentMethod: string;
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
}

type SubScreen = 'list' | 'details' | 'cancel_confirm';

const MyBookingsHistory = () => {
  const { colors } = usePremiumTheme();
  const navigation = useNavigation<any>();

  // Sub-view flow state
  const [subScreen, setSubScreen] = useState<SubScreen>('list');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  
  // Segmented control active tab
  const [activeTab, setActiveTab] = useState<'Upcoming' | 'Completed' | 'Cancelled'>('Upcoming');

  // Bookings list state
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: '#B202505190001',
      service: 'Haircut & Beard Trim',
      duration: '30 mins',
      price: '₹299',
      dateStr: '20 May 2025',
      dayStr: '20',
      monthStr: 'MAY',
      weekdayStr: 'TUE',
      timeStr: '05:00 PM',
      shop: 'Barobar Shop',
      paymentMethod: 'Cash at Shop',
      status: 'Confirmed',
    },
    {
      id: '#B202505280002',
      service: 'Hair Spa',
      duration: '45 mins',
      price: '₹499',
      dateStr: '28 May 2025',
      dayStr: '28',
      monthStr: 'MAY',
      weekdayStr: 'WED',
      timeStr: '04:00 PM',
      shop: 'Barobar Shop',
      paymentMethod: 'UPI',
      status: 'Confirmed',
    },
    {
      id: '#B202506050003',
      service: 'Haircut',
      duration: '30 mins',
      price: '₹299',
      dateStr: '05 Jun 2025',
      dayStr: '05',
      monthStr: 'JUN',
      weekdayStr: 'THU',
      timeStr: '06:30 PM',
      shop: 'Barobar Shop',
      paymentMethod: 'Card',
      status: 'Pending',
    },
    {
      id: '#B202506120004',
      service: 'Shave',
      duration: '15 mins',
      price: '₹149',
      dateStr: '12 Jun 2025',
      dayStr: '12',
      monthStr: 'JUN',
      weekdayStr: 'THU',
      timeStr: '03:30 PM',
      shop: 'Barobar Shop',
      paymentMethod: 'Cash at Shop',
      status: 'Confirmed',
    },
    // Completed
    {
      id: '#B202504150005',
      service: 'Haircut',
      duration: '30 mins',
      price: '₹299',
      dateStr: '15 Apr 2025',
      dayStr: '15',
      monthStr: 'APR',
      weekdayStr: 'TUE',
      timeStr: '11:00 AM',
      shop: 'Barobar Shop',
      paymentMethod: 'Cash at Shop',
      status: 'Completed',
    },
    // Cancelled
    {
      id: '#B202504020006',
      service: 'Beard Trim',
      duration: '20 mins',
      price: '₹199',
      dateStr: '02 Apr 2025',
      dayStr: '02',
      monthStr: 'APR',
      weekdayStr: 'WED',
      timeStr: '02:00 PM',
      shop: 'Barobar Shop',
      paymentMethod: 'UPI',
      status: 'Cancelled',
    },
  ]);

  // Filter bookings based on segment tab
  const getFilteredBookings = () => {
    return bookings.filter(b => {
      if (activeTab === 'Upcoming') {
        return b.status === 'Confirmed' || b.status === 'Pending';
      }
      return b.status === activeTab;
    });
  };

  // Status badge style helper
  const getStatusBadgeStyle = (status: Booking['status']) => {
    switch (status) {
      case 'Confirmed':
        return { bg: '#D1FAE5', text: '#10B981' };
      case 'Pending':
        return { bg: '#FEF3C7', text: '#D97706' };
      case 'Completed':
        return { bg: '#E0F2FE', text: '#0284C7' };
      case 'Cancelled':
        return { bg: '#FEE2E2', text: '#EF4444' };
      default:
        return { bg: '#ECECF3', text: '#858994' };
    }
  };

  const handleCancelBooking = () => {
    if (!selectedBooking) return;
    
    // Perform cancellation
    const updated = bookings.map(b => 
      b.id === selectedBooking.id ? { ...b, status: 'Cancelled' as const } : b
    );
    setBookings(updated);
    
    // Notify
    Alert.alert('Booking Cancelled', 'Your appointment has been cancelled successfully.');
    
    // Reset view back to list
    setSubScreen('list');
    setSelectedBooking(null);
  };

  // CUSTOM HEADER WRAPPER
  const renderHeader = () => {
    let title = "My Bookings";
    let onBack = () => navigation.goBack();

    if (subScreen === 'details') {
      title = "Booking Details";
      onBack = () => setSubScreen('list');
    } else if (subScreen === 'cancel_confirm') {
      title = "Cancel Booking";
      onBack = () => setSubScreen('details');
    }

    return <Header title={title} showBack leftElement={
      subScreen !== 'list' ? (
        <TouchableOpacity onPress={onBack} style={{ padding: 4 }}>
          <Icon name="arrow-back" size={24} color="ink" />
        </TouchableOpacity>
      ) : undefined
    } />;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.canvas }]}>
      {renderHeader()}

      {subScreen === 'list' && (
        <View style={styles.flexContainer}>
          {/* Segmented Tabs */}
          <View style={[styles.tabBarContainer, { backgroundColor: colors.surface, borderColor: colors.line }]}>
            {['Upcoming', 'Completed', 'Cancelled'].map((tab) => {
              const isSelected = activeTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab as any)}
                  style={[
                    styles.tabButton,
                    isSelected && { backgroundColor: colors.primary }
                  ]}
                >
                  <Typography
                    variant="caption"
                    weight="bold"
                    style={{ color: isSelected ? colors.surface : colors.muted }}
                  >
                    {tab}
                  </Typography>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Bookings Scroll List */}
          <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
            {getFilteredBookings().map((booking) => {
              const badge = getStatusBadgeStyle(booking.status);
              return (
                <TouchableOpacity
                  key={booking.id}
                  onPress={() => {
                    setSelectedBooking(booking);
                    setSubScreen('details');
                  }}
                  style={[styles.bookingCard, { backgroundColor: colors.surface }, premiumShadow]}
                >
                  {/* Left Date Block */}
                  <View style={[styles.dateBlock, { backgroundColor: colors.canvas }]}>
                    <Typography variant="caption" color="muted" style={styles.uppercase}>
                      {booking.monthStr}
                    </Typography>
                    <Typography variant="h3" weight="bold">{booking.dayStr}</Typography>
                    <Typography variant="label" color="muted">{booking.weekdayStr}</Typography>
                  </View>

                  {/* Middle Info */}
                  <View style={styles.bookingInfo}>
                    <Typography variant="body" weight="bold">{booking.service}</Typography>
                    <Typography variant="caption" color="muted" style={styles.infoSpacing}>
                      {booking.timeStr}
                    </Typography>
                    <View style={styles.shopRow}>
                      <Icon name="location-outline" size={14} color="muted" />
                      <Typography variant="caption" color="muted" style={styles.shopText}>
                        {booking.shop}
                      </Typography>
                    </View>
                  </View>

                  {/* Right Status badge */}
                  <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                    <Typography variant="label" weight="bold" style={{ color: badge.text }}>
                      {booking.status}
                    </Typography>
                  </View>
                </TouchableOpacity>
              );
            })}

            {getFilteredBookings().length === 0 && (
              <View style={styles.emptyState}>
                <Icon name="calendar-outline" size={48} color="muted" />
                <Typography variant="body" color="muted">No appointments found in this category.</Typography>
              </View>
            )}
          </ScrollView>

          {/* Footer Book Button */}
          <View style={[styles.footer, { backgroundColor: colors.canvas }]}>
            <Button
              title="Book New Appointment"
              size="large"
              onPress={() => {
                navigation.navigate('user', { screen: 'Bookings' });
              }}
            />
          </View>
        </View>
      )}

      {/* SUB-SCREEN: BOOKING DETAILS */}
      {subScreen === 'details' && selectedBooking && (
        <ScrollView contentContainerStyle={styles.detailsContent} showsVerticalScrollIndicator={false}>
          {/* Main Info Card */}
          <View style={[styles.detailsCard, { backgroundColor: colors.surface }, premiumShadow]}>
            <View style={styles.detailsCardHeader}>
              <Icon name="cut-outline" size={28} color="primary" />
              <View style={[
                styles.statusBadge,
                { backgroundColor: getStatusBadgeStyle(selectedBooking.status).bg }
              ]}>
                <Typography
                  variant="label"
                  weight="bold"
                  style={{ color: getStatusBadgeStyle(selectedBooking.status).text }}
                >
                  {selectedBooking.status}
                </Typography>
              </View>
            </View>
            
            <Typography variant="h3" weight="bold" style={styles.detailsServiceName}>
              {selectedBooking.service}
            </Typography>
            <Typography variant="caption" color="muted">
              {selectedBooking.duration} • {selectedBooking.price}
            </Typography>
          </View>

          {/* Details Table */}
          <View style={[styles.tableCard, { backgroundColor: colors.surface }, premiumShadow]}>
            <View style={styles.tableRow}>
              <Typography variant="caption" color="muted">Booking ID</Typography>
              <Typography variant="body" weight="bold">{selectedBooking.id}</Typography>
            </View>
            
            <View style={styles.tableRow}>
              <Typography variant="caption" color="muted">Date</Typography>
              <Typography variant="body" weight="bold">{selectedBooking.dateStr}</Typography>
            </View>
            
            <View style={styles.tableRow}>
              <Typography variant="caption" color="muted">Time</Typography>
              <Typography variant="body" weight="bold">{selectedBooking.timeStr}</Typography>
            </View>
            
            <View style={styles.tableRow}>
              <Typography variant="caption" color="muted">Shop</Typography>
              <Typography variant="body" weight="bold">{selectedBooking.shop}</Typography>
            </View>

            <View style={styles.tableRow}>
              <Typography variant="caption" color="muted">Payment Method</Typography>
              <Typography variant="body" weight="bold">{selectedBooking.paymentMethod}</Typography>
            </View>

            <View style={[styles.tableRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
              <Typography variant="caption" color="muted">Amount</Typography>
              <Typography variant="body" weight="bold" color="primary">{selectedBooking.price}</Typography>
            </View>
          </View>

          {/* Cancel button if upcoming and not cancelled */}
          {(selectedBooking.status === 'Confirmed' || selectedBooking.status === 'Pending') && (
            <TouchableOpacity
              onPress={() => setSubScreen('cancel_confirm')}
              style={[styles.cancelOutlineBtn, { borderColor: '#EF4444' }]}
            >
              <Typography variant="body" weight="bold" style={{ color: '#EF4444' }}>
                Cancel Booking
              </Typography>
            </TouchableOpacity>
          )}
        </ScrollView>
      )}

      {/* SUB-SCREEN: CANCEL BOOKING CONFIRMATION */}
      {subScreen === 'cancel_confirm' && selectedBooking && (
        <ScrollView contentContainerStyle={styles.detailsContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.cancelIllustrationContainer}>
            <View style={[styles.cancelCircleBg, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
              <Icon name="calendar" size={48} color="error" />
              <View style={[styles.cancelCheckBadge, { backgroundColor: '#EF4444' }]}>
                <Icon name="close" size={14} color="surface" />
              </View>
            </View>
            <Typography variant="h3" weight="bold" style={styles.confirmCancelTitle}>Are you sure?</Typography>
            <Typography variant="caption" color="muted" align="center" style={styles.confirmCancelSubtitle}>
              You want to cancel this booking.
            </Typography>
          </View>

          {/* Details Box */}
          <View style={[styles.cancelBoxCard, { backgroundColor: colors.surface }, premiumShadow]}>
            <View style={styles.cancelBoxRow}>
              <Typography variant="caption" color="muted">Service</Typography>
              <Typography variant="body" weight="bold">{selectedBooking.service}</Typography>
            </View>
            <View style={styles.cancelBoxRow}>
              <Typography variant="caption" color="muted">Date</Typography>
              <Typography variant="body" weight="bold">{selectedBooking.dateStr}</Typography>
            </View>
            <View style={[styles.cancelBoxRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
              <Typography variant="caption" color="muted">Time</Typography>
              <Typography variant="body" weight="bold">{selectedBooking.timeStr}</Typography>
            </View>
          </View>

          {/* Warning Note */}
          <View style={[styles.noteBox, { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' }]}>
            <Icon name="star" size={16} color="error" style={styles.noteIcon} />
            <Typography variant="caption" style={{ color: '#B45309', flex: 1, lineHeight: 18 }}>
              Note: You can cancel before 2 hours of appointment time.
            </Typography>
          </View>

          {/* Confirm Button */}
          <Button
            title="Yes, Cancel Booking"
            onPress={handleCancelBooking}
            style={styles.solidCancelBtn}
          />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  flexContainer: { flex: 1 },
  tabBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 4,
    borderRadius: 14,
    borderWidth: 1,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: { padding: 16, paddingBottom: 100, gap: 12 },
  bookingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 12,
  },
  dateBlock: {
    width: 60,
    height: 70,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  uppercase: { textTransform: 'uppercase', fontSize: 10, fontWeight: '700' },
  bookingInfo: { flex: 1 },
  infoSpacing: { marginVertical: 3 },
  shopRow: { flexDirection: 'row', alignItems: 'center' },
  shopText: { marginLeft: 4 },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32,
  },
  
  // Details subview styles
  detailsContent: { padding: 16, paddingBottom: 60 },
  detailsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  detailsCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailsServiceName: { marginBottom: 4 },
  tableCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(236, 236, 243, 0.5)',
  },
  cancelOutlineBtn: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Cancel view styles
  cancelIllustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  cancelCircleBg: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 16,
  },
  cancelCheckBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  confirmCancelTitle: { marginBottom: 8 },
  confirmCancelSubtitle: { maxWidth: '80%', lineHeight: 18 },
  cancelBoxCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  cancelBoxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(236, 236, 243, 0.5)',
  },
  noteBox: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  noteIcon: { marginRight: 10, marginTop: 1 },
  solidCancelBtn: {
    width: '100%',
    backgroundColor: '#EF4444',
  },
});

export default MyBookingsHistory;
