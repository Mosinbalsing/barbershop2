import React, { useState, useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { usePremiumTheme, premiumShadow } from '../../shared/theme/premiumTheme';

type BookingItem = {
  id: string;
  name: string;
  service: string;
  price: string;
  time: string;
  date: string; // e.g. "20 May"
  fullDate: string; // e.g. "20 May 2025 (Tue)"
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  avatar: string;
  phone: string;
  duration: string;
  payment: string;
};

const MOCK_BOOKINGS: BookingItem[] = [
  {
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
  },
  {
    id: '#820250520002',
    name: 'Amit Kumar',
    service: 'Haircut',
    price: '₹149',
    time: '06:30 PM',
    date: '20 May',
    fullDate: '20 May 2025 (Tue)',
    status: 'Confirmed',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    phone: '9123456780',
    duration: '20 mins',
    payment: 'Cash at Shop',
  },
  {
    id: '#820250521003',
    name: 'Vikram Singh',
    service: 'Hair Spa',
    price: '₹499',
    time: '11:00 AM',
    date: '21 May',
    fullDate: '21 May 2025 (Wed)',
    status: 'Pending',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    phone: '9888776655',
    duration: '45 mins',
    payment: 'UPI Online',
  },
  {
    id: '#820250521004',
    name: 'Rohit Sharma',
    service: 'Shave',
    price: '₹149',
    time: '04:00 PM',
    date: '21 May',
    fullDate: '21 May 2025 (Wed)',
    status: 'Confirmed',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    phone: '8877665544',
    duration: '15 mins',
    payment: 'Cash at Shop',
  },
  {
    id: '#820250522005',
    name: 'Manish Patel',
    service: 'Haircut & Beard Trim',
    price: '₹299',
    time: '05:30 PM',
    date: '22 May',
    fullDate: '22 May 2025 (Thu)',
    status: 'Confirmed',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
    phone: '7766554433',
    duration: '30 mins',
    payment: 'Card Payment',
  },
];

const AdminBookings = () => {
  const { colors, mode } = usePremiumTheme();
  const navigation = useNavigation<any>();

  const brownTheme = {
    primary: '#683E26',
    activeBg: mode === 'dark' ? '#3A281E' : '#F5F1ED',
    divider: mode === 'dark' ? '#332721' : '#EAE6DF',
  };

  const [activeSegment, setActiveSegment] = useState<'All' | 'Confirmed' | 'Pending' | 'Cancelled'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const filteredBookings = useMemo(() => {
    return MOCK_BOOKINGS.filter(b => {
      // Filter by Segment
      if (activeSegment !== 'All' && b.status !== activeSegment) {
        return false;
      }
      // Filter by Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return b.name.toLowerCase().includes(query) || b.service.toLowerCase().includes(query);
      }
      return true;
    });
  }, [activeSegment, searchQuery]);

  const getStatusBadgeColors = (status: BookingItem['status']) => {
    if (status === 'Confirmed') {
      return { bg: mode === 'dark' ? 'rgba(16,185,129,0.15)' : '#EAFBF6', text: '#10B981' };
    }
    if (status === 'Pending') {
      return { bg: mode === 'dark' ? 'rgba(245,158,11,0.15)' : '#FFEED6', text: '#F59E0B' };
    }
    return { bg: mode === 'dark' ? 'rgba(239,68,68,0.15)' : '#FEE2E2', text: '#EF4444' };
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.canvas }]}>
      <TouchableOpacity
        onPress={() => setShowSearch(s => !s)}
        style={[
          styles.floatingSearchBtn,
          {
            backgroundColor: colors.surface,
            borderColor: colors.line,
          },
        ]}
        activeOpacity={0.85}
      >
        <Icon name="search" size={18} color={colors.ink} />
      </TouchableOpacity>

      {/* Conditional Search Box */}
      {showSearch && (
        <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderBottomColor: colors.line }]}>
          <Icon name="search" size={14} color={colors.muted} style={styles.searchIcon} />
          <TextInput
            placeholder="Search bookings..."
            placeholderTextColor={colors.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchInput, { color: colors.ink }]}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="times-circle" size={16} color={colors.muted} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Horizontal Segments Control */}
      <View style={[styles.segmentContainer, { backgroundColor: colors.surface, borderBottomColor: colors.line }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.segmentScroll}>
          {[
            { key: 'All', label: `All (${MOCK_BOOKINGS.length})` },
            { key: 'Confirmed', label: `Confirmed (${MOCK_BOOKINGS.filter(b => b.status === 'Confirmed').length})` },
            { key: 'Pending', label: `Pending (${MOCK_BOOKINGS.filter(b => b.status === 'Pending').length})` },
            { key: 'Cancelled', label: `Cancelled (${MOCK_BOOKINGS.filter(b => b.status === 'Cancelled').length})` },
          ].map(seg => {
            const isActive = activeSegment === seg.key;
            return (
              <TouchableOpacity
                key={seg.key}
                onPress={() => setActiveSegment(seg.key as any)}
                style={[
                  styles.segmentItem,
                  isActive && { borderBottomColor: brownTheme.primary }
                ]}
              >
                <Text style={[
                  styles.segmentText,
                  isActive ? { color: colors.ink, fontWeight: 'bold' } : { color: colors.muted }
                ]}>
                  {seg.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Bookings List */}
      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {filteredBookings.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="calendar-times-o" size={42} color={colors.muted} />
            <Text style={[styles.emptyText, { color: colors.muted }]}>No bookings found</Text>
          </View>
        ) : (
          filteredBookings.map(item => {
            const statusTheme = getStatusBadgeColors(item.status);
            // Splitting date into day and month name
            const dateParts = item.date.split(' ');
            const dayNum = dateParts[0];
            const monthName = dateParts[1] ? dateParts[1].toUpperCase() : 'MAY';

            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.bookingCard, { backgroundColor: colors.surface, borderColor: colors.line }]}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('AdminBookingDetails', { booking: item })}
              >
                <View style={styles.cardRow}>
                  {/* Left Date Block */}
                  <View style={[styles.dateBlock, { backgroundColor: brownTheme.activeBg }]}>
                    <Text style={[styles.dateMonthText, { color: brownTheme.primary }]}>{monthName}</Text>
                    <Text style={[styles.dateDayText, { color: brownTheme.primary }]}>{dayNum}</Text>
                  </View>

                  {/* Middle Info Column */}
                  <View style={styles.cardInfo}>
                    <Text style={[styles.timeText, { color: colors.muted }]}>{item.time}</Text>
                    <Text style={[styles.nameText, { color: colors.ink }]}>{item.name}</Text>
                    <Text style={[styles.serviceText, { color: colors.muted }]}>{item.service}</Text>
                    <Text style={[styles.priceText, { color: colors.ink }]}>{item.price}</Text>
                  </View>

                  {/* Right Status Badge */}
                  <View style={[styles.statusBadge, { backgroundColor: statusTheme.bg }]}>
                    <Text style={[styles.statusBadgeText, { color: statusTheme.text }]}>{item.status}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    position: 'relative',
  },
  floatingSearchBtn: {
    position: 'absolute',
    top: 12,
    right: 16,
    zIndex: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    ...premiumShadow,
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
  headerRightActions: {
    flexDirection: 'row',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 4,
  },
  segmentContainer: {
    borderBottomWidth: 1,
  },
  segmentScroll: {
    paddingHorizontal: 16,
  },
  segmentItem: {
    paddingVertical: 14,
    marginRight: 20,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  emptyState: {
    paddingVertical: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    marginTop: 10,
  },
  bookingCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
    ...premiumShadow,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateBlock: {
    width: 52,
    height: 60,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateMonthText: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  dateDayText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 2,
  },
  cardInfo: {
    flex: 1,
    marginLeft: 14,
  },
  timeText: {
    fontSize: 11,
    fontWeight: '500',
  },
  nameText: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 2,
  },
  serviceText: {
    fontSize: 13,
    marginTop: 2,
  },
  priceText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default AdminBookings;
