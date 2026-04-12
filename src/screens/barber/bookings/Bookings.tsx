

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Modal,
  TextInput,
  FlatList,
  ActivityIndicator,
  Dimensions,
  ToastAndroid,
  PanResponder,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

// Example bookings data
const initialBookings = [
  // ...existing data as before...
  { date: '2026-04-12', time: '09:00 AM', name: 'David Smith', service: 'Haircut, Beard Trim', id: '#1267', duration: '30m', status: 'Confirmed', type: 'today', avatar: require('../../../assets/images/PNG/logo-light.png') },
  { date: '2026-04-12', time: '10:30 AM', name: 'Michael Johnson', service: 'Haircut', id: '#1268', duration: '45m', status: 'Confirmed', type: 'today', avatar: require('../../../assets/images/PNG/logo-light.png') },
  { date: '2026-04-12', time: '12:30 PM', name: 'Ryan Harris', service: 'Beard Trim', id: '#1269', duration: '20m', status: 'Confirmed', type: 'today', avatar: require('../../../assets/images/PNG/logo-light.png') },
  { date: '2026-04-14', time: '02:00 PM', name: 'Emily Clark', service: 'Hair Color', id: '#1270', duration: '60m', status: 'Confirmed', type: 'future', avatar: require('../../../assets/images/PNG/logo-light.png') },
  { date: '2026-04-15', time: '11:00 AM', name: 'Chris Evans', service: 'Shave', id: '#1271', duration: '25m', status: 'Confirmed', type: 'future', avatar: require('../../../assets/images/PNG/logo-light.png') },
  { date: '2026-04-10', time: '11:00 AM', name: 'Sophia Lee', service: 'Haircut', id: '#1272', duration: '30m', status: 'Completed', type: 'past', avatar: require('../../../assets/images/PNG/logo-light.png') },
  { date: '2026-04-09', time: '03:00 PM', name: 'Liam Brown', service: 'Beard Trim', id: '#1273', duration: '20m', status: 'Completed', type: 'past', avatar: require('../../../assets/images/PNG/logo-light.png') },
  { date: '2026-04-08', time: '01:30 PM', name: 'Olivia Wilson', service: 'Haircut, Shave', id: '#1274', duration: '50m', status: 'Completed', type: 'past', avatar: require('../../../assets/images/PNG/logo-light.png') },
];


const groupBookings = (type, bookings) => bookings.filter(b => b.type === type);


// BookingCard with animation, swipe, and click
const SCREEN_WIDTH = Dimensions.get('window').width;
const BookingCard = ({ item, onPress, onSwipeLeft, onSwipeRight, index, fadeAnim }) => {
  // Swipe gesture
  const pan = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 10,
      onPanResponderMove: Animated.event([
        null,
        { dx: pan.x },
      ], { useNativeDriver: false }),
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx < -100) {
          Animated.timing(pan.x, { toValue: -SCREEN_WIDTH, duration: 200, useNativeDriver: false }).start(() => onSwipeLeft(item));
        } else if (gesture.dx > 100) {
          Animated.timing(pan.x, { toValue: SCREEN_WIDTH, duration: 200, useNativeDriver: false }).start(() => onSwipeRight(item));
        } else {
          Animated.spring(pan.x, { toValue: 0, useNativeDriver: false }).start();
        }
      },
      onPanResponderGrant: () => {
        pan.setOffset({ x: pan.x._value, y: 0 });
      },
      onPanResponderEnd: () => {
        pan.flattenOffset();
      },
    })
  ).current;

  return (
    <Animated.View
      style={{
        ...styles.card,
        opacity: fadeAnim,
        transform: [{ translateX: pan.x }],
      }}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity activeOpacity={0.8} onPress={() => onPress(item)}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name="cut" size={24} color="#fff" style={styles.cardIcon} />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.time}>{item.time}</Text>
            <Text style={styles.id}>{item.id}</Text>
          </View>
          <View style={{ flex: 1 }} />
          <Image source={item.avatar} style={styles.avatar} />
        </View>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.service}>{item.service}</Text>
        <View style={styles.row}>
          <Text style={styles.duration}>{item.duration}</Text>
          <View style={styles.statusBadge}><Text style={styles.statusText}>{item.status}</Text></View>
          <Text style={styles.date}>{item.date}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};


const TABS = [
  { key: 'today', label: 'Today' },
  { key: 'future', label: 'Future' },
  { key: 'past', label: 'Past' },
];


const Bookings = () => {
  // State
  const [activeTab, setActiveTab] = useState('today');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [sortBy, setSortBy] = useState('date');
  const [toast, setToast] = useState('');
  const fadeAnims = useRef([]);

  // Simulate loading and backend sync
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setBookings(initialBookings);
      setLoading(false);
    }, 1200);
  }, []);

  // Card fade-in animation
  useEffect(() => {
    if (!loading) {
      fadeAnims.current = groupBookings(activeTab, filteredBookings).map(() => new Animated.Value(0));
      Animated.stagger(120, fadeAnims.current.map(anim =>
        Animated.timing(anim, { toValue: 1, duration: 400, useNativeDriver: true })
      )).start();
    }
  }, [loading, activeTab, search, sortBy]);

  // Toast auto-hide
  useEffect(() => {
    if (toast) {
      ToastAndroid.show(toast, ToastAndroid.SHORT);
      setTimeout(() => setToast(''), 1500);
    }
  }, [toast]);

  // Search, filter, sort
  const filteredBookings = bookings
    .filter(b => b.type === activeTab)
    .filter(b =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.service.toLowerCase().includes(search.toLowerCase()) ||
      b.id.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date') return a.date.localeCompare(b.date);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  // Swipe actions
  const handleSwipeLeft = (item) => {
    setSyncing(true);
    setTimeout(() => {
      setBookings(prev => prev.filter(b => b.id !== item.id));
      setSyncing(false);
      setToast('Booking cancelled');
    }, 900);
  };
  const handleSwipeRight = (item) => {
    setSyncing(true);
    setTimeout(() => {
      setBookings(prev => prev.map(b => b.id === item.id ? { ...b, status: 'Completed', type: 'past' } : b));
      setSyncing(false);
      setToast('Booking marked as completed');
    }, 900);
  };

  // Modal open/close
  const handleCardPress = (item) => {
    setSelectedBooking(item);
    setModalVisible(true);
  };
  const closeModal = () => setModalVisible(false);

  // Date scroll (unique dates)
  const uniqueDates = Array.from(new Set(bookings.filter(b => b.type === activeTab).map(b => b.date)));
  const [selectedDate, setSelectedDate] = useState('');

  // Skeleton loader
  const renderSkeleton = () => (
    <View>
      {[...Array(3)].map((_, i) => (
        <View key={i} style={[styles.card, { backgroundColor: '#e0e0e0', marginBottom: 12, height: 90, opacity: 0.6 }]} />
      ))}
    </View>
  );

  // Booking details modal
  const renderModal = () => (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent
      onRequestClose={closeModal}
    >
      <View style={styles.modalOverlay}>
        <Animated.View style={styles.modalContent}>
          {selectedBooking && (
            <>
              <Text style={styles.modalTitle}>Booking Details</Text>
              <Text style={styles.modalLabel}>Name: <Text style={styles.modalValue}>{selectedBooking.name}</Text></Text>
              <Text style={styles.modalLabel}>Service: <Text style={styles.modalValue}>{selectedBooking.service}</Text></Text>
              <Text style={styles.modalLabel}>Date: <Text style={styles.modalValue}>{selectedBooking.date}</Text></Text>
              <Text style={styles.modalLabel}>Time: <Text style={styles.modalValue}>{selectedBooking.time}</Text></Text>
              <Text style={styles.modalLabel}>Status: <Text style={styles.modalValue}>{selectedBooking.status}</Text></Text>
              <TouchableOpacity style={styles.closeModalBtn} onPress={closeModal}>
                <Text style={styles.closeModalText}>Close</Text>
              </TouchableOpacity>
            </>
          )}
        </Animated.View>
      </View>
    </Modal>
  );

  // Backend sync indicator
  const renderSyncIndicator = () => (
    syncing && (
      <View style={styles.syncIndicator}><ActivityIndicator size="small" color="#FFD700" /><Text style={{ color: '#FFD700', marginLeft: 8 }}>Syncing...</Text></View>
    )
  );

  // Helper to get day and date for column pill
  const getDayAndDate = (dateStr) => {
    const d = new Date(dateStr);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return { day: days[d.getDay()], date: d.getDate() };
  };

  // Date scroll bar (column style)
  const renderDateScroll = () => (
    uniqueDates.length > 1 && (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
        {uniqueDates.map(date => {
          const { day, date: dayNum } = getDayAndDate(date);
          return (
            <TouchableOpacity
              key={date}
              style={[styles.datePill, selectedDate === date && styles.datePillActive, (activeTab !== 'today' && selectedDate === date) && styles.datePillActiveSpecial]}
              onPress={() => setSelectedDate(date === selectedDate ? '' : date)}
            >
              <View style={styles.datePillColumn}>
                <Text style={[styles.datePillDay, selectedDate === date && styles.datePillTextActive]}>{day}</Text>
                <Text style={[styles.datePillNum, selectedDate === date && styles.datePillTextActive]}>{dayNum}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    )
  );

  // Filtered by date if selected
  const bookingsToShow = selectedDate
    ? filteredBookings.filter(b => b.date === selectedDate)
    : filteredBookings;

  // Render
  return (
    <View style={styles.container}>
      {/* Sync indicator */}
      {renderSyncIndicator()}
      {/* Tabs */}
      <View style={styles.tabsRow}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabButton, activeTab === tab.key && styles.tabButtonActive]}
            onPress={() => { setActiveTab(tab.key); setSelectedDate(''); }}
          >
            <Text style={[styles.tabLabel, activeTab === tab.key && styles.tabLabelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
        {/* Sort button */}
        <TouchableOpacity style={styles.sortBtn} onPress={() => setSortBy(sortBy === 'date' ? 'name' : 'date')}>
          <Icon name={sortBy === 'date' ? 'sort-alpha-asc' : 'calendar'} size={18} color="#FFD700" />
        </TouchableOpacity>
      </View>
      {/* Search bar */}
      <View style={styles.searchRow}>
        <Icon name="search" size={18} color="#888" style={{ marginRight: 6 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search bookings..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#aaa"
        />
      </View>
      {/* Date scroll */}
      {renderDateScroll()}
      {/* Skeleton loader or bookings */}
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {loading ? renderSkeleton() : (
          bookingsToShow.length === 0 ? (
            <Text style={styles.empty}>No bookings</Text>
          ) : (
            bookingsToShow.map((item, idx) => (
              <BookingCard
                key={item.id}
                item={item}
                onPress={handleCardPress}
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
                index={idx}
                fadeAnim={fadeAnims.current[idx] || new Animated.Value(1)}
              />
            ))
          )
        )}
      </ScrollView>
      {/* Modal */}
      {renderModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 6,
  },
  tabButtonActive: {
    backgroundColor: '#FFD70022',
  },
  tabLabel: {
    fontSize: 16,
    color: '#888',
    fontWeight: '600',
  },
  tabLabelActive: {
    color: '#222',
    fontWeight: 'bold',
  },
  sortBtn: {
    marginLeft: 'auto',
    padding: 8,
    borderRadius: 16,
    backgroundColor: '#23232A',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#222',
    paddingVertical: 6,
  },
  dateScroll: {
    marginTop: 10,
    marginBottom: 2,
    paddingHorizontal: 10,
    maxHeight: 70,
  },
  datePill: {
    backgroundColor: '#f4f6fa',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 38,
    minHeight: 48,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },
  datePillColumn: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  datePillDay: {
    color: '#888',
    fontWeight: '600',
    fontSize: 13,
    marginBottom: 1,
  },
  datePillNum: {
    color: '#23232A',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 0,
  },
  datePillActive: {
    backgroundColor: '#D4AF37', // blue
  },
  datePillActiveSpecial: {
   
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  datePillText: {
    color: '#888',
    fontWeight: '600',
    fontSize: 14,
  },
  datePillTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#23232A',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
  },
  cardIcon: {
    marginRight: 8,
  },
  time: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 16,
  },
  id: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 2,
  },
  name: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
    marginTop: 8,
  },
  service: {
    color: '#aaa',
    fontSize: 13,
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  duration: {
    color: '#aaa',
    fontSize: 13,
    marginRight: 4,
  },
  statusBadge: {
    backgroundColor: '#D4AF37',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  date: {
    color: '#FFD700',
    fontSize: 13,
    marginLeft: 12,
    fontWeight: '600',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginLeft: 8,
    backgroundColor: '#444',
  },
  empty: {
    color: '#888',
    fontSize: 15,
    marginBottom: 12,
    marginLeft: 8,
  },
  syncIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23232A',
    padding: 8,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 2,
    elevation: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 24,
    minHeight: 260,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#23232A',
    marginBottom: 12,
  },
  modalLabel: {
    fontSize: 15,
    color: '#888',
    marginTop: 6,
  },
  modalValue: {
    color: '#23232A',
    fontWeight: '600',
  },
  closeModalBtn: {
    marginTop: 18,
    backgroundColor: '#FFD700',
    borderRadius: 10,
    alignSelf: 'flex-end',
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  closeModalText: {
    color: '#23232A',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default Bookings;
