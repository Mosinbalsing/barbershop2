
import React, { useMemo } from 'react';

import { useNavigation } from '@react-navigation/native';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const appointments = [
  {
    time: '12:30 PM',
    name: 'David Smith',
    service: 'Haircut, Beard Trim',
    id: '#1267',
    duration: '30m',
    status: 'Confirmed',
    avatar: require('../../../assets/images/PNG/logo-light.png'), // Placeholder
  },
  {
    time: '12:30 PM',
    name: 'Michael Johnson',
    service: 'Haircut, Beard Trim',
    id: '#1267',
    duration: '30m',
    status: 'Confirmed',
    avatar: require('../../../assets/images/PNG/logo-light.png'), // Placeholder
  },
  {
    time: '12:30 PM',
    name: 'Ryan Harris',
    service: 'Haircut, Beard Trim',
    id: '#1267',
    duration: '30m',
    status: 'Confirmed',
    avatar: require('../../../assets/images/PNG/logo-light.png'), // Placeholder
  },
];

const bookingsData = [12, 15, 18, 22, 25, 20, 21]; // Example data for bar chart
const days = ['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon'];
const completedBookings = bookingsData.reduce((a, b) => a + b, 0);

const BarberDashboard = () => {
  const navigation = useNavigation();

  // Dynamic greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return '🌅 Good Morning';
    if (hour < 18) return '☀️ Good Afternoon';
    return '🌙 Good Evening';
  }, []);

  // Find peak day index
  const peakDayIdx = bookingsData.indexOf(Math.max(...bookingsData));

  // Dummy customer names for up to 10 bookings
  const upcomingBookings = appointments.slice(0, 10);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../../../assets/images/PNG/logo-light.png')} style={styles.logo} />
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="search" size={20} color="#222" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileButton}>
            <Image source={require('../../../assets/images/PNG/logo-light.png')} style={styles.profileAvatar} />
            <View style={styles.notificationBadge}><Text style={styles.badgeText}>3</Text></View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Dynamic Greeting */}
      <Text style={styles.greeting}>{greeting}, John!</Text>
      <Text style={styles.subGreeting}>Here's what's happening today</Text>

      {/* Horizontal Upcoming Bookings */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Bookings')}>
            <Text style={styles.sectionAction}>View All &gt;</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList} contentContainerStyle={{ gap: 12 }}>
          {upcomingBookings.map((item, idx) => (
            <View key={idx} style={styles.horizontalCard}>
              <Text style={styles.time}>{item.time}</Text>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.service}>{item.service}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Completed Bookings */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="check-circle" size={20} color="#D4AF37" style={{ marginRight: 8 }} />
            <Text style={styles.sectionTitle}>Completed Bookings</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.sectionAction}>This Week</Text>
            <Text style={styles.sectionAction}>Past Week ▼</Text>
          </View>
        </View>
        <View style={styles.completedRow}>
          <Text style={styles.completedCount}>{completedBookings}</Text>
          <Text style={styles.completedLabel}>Completed</Text>
        </View>
        {/* Bar Chart */}
        <View style={styles.barChartRow}>
          {bookingsData.map((val, idx) => (
            <View key={idx} style={styles.barItem}>
              <View style={[
                styles.bar,
                { height: val * 3 },
                idx === peakDayIdx && styles.barPeak
              ]} />
              <Text style={[styles.barLabel, idx === peakDayIdx && styles.barLabelPeak]}>{days[idx]}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.peakDayText}>Peak Day: {days[peakDayIdx]}</Text>
      </View>

      {/* Completed Cards */}
      <View style={styles.completedCardsRow}>
        {appointments.map((item, idx) => (
          <View key={idx} style={styles.completedCard}>
            <Text style={styles.time}>{item.time}</Text>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.service}>{item.service}</Text>
            <View style={styles.row}>
              <Text style={styles.duration}>{item.duration}</Text>
              <View style={styles.statusBadge}><Text style={styles.statusText}>{item.status}</Text></View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  horizontalList: {
    marginTop: 8,
    marginBottom: 4,
  },
  horizontalCard: {
    backgroundColor: '#23232A',
    borderRadius: 14,
    padding: 14,
    minWidth: 140,
    marginRight: 0,
    marginLeft: 0,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  barPeak: {
    backgroundColor: '#FFD700',
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  barLabelPeak: {
    color: '#D4AF37',
    fontWeight: 'bold',
  },
  peakDayText: {
    color: '#D4AF37',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 16,
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    backgroundColor: '#EFEFEF',
    borderRadius: 20,
    padding: 8,
    marginRight: 12,
  },
  profileButton: {
    position: 'relative',
  },
  profileAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#DDD',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
    minWidth: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 12,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 15,
    color: '#888',
    marginBottom: 18,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
  },
  sectionAction: {
    fontSize: 14,
    color: '#888',
    marginLeft: 12,
  },
  cardList: {
    gap: 12,
  },
  appointmentCard: {
    backgroundColor: '#23232A',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
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
  dot: {
    color: '#aaa',
    fontSize: 13,
    marginHorizontal: 2,
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
  today: {
    color: '#aaa',
    fontSize: 13,
    marginLeft: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginLeft: 8,
    backgroundColor: '#444',
  },
  completedRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
    marginTop: 8,
  },
  completedCount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    marginRight: 8,
  },
  completedLabel: {
    fontSize: 15,
    color: '#888',
    marginBottom: 3,
  },
  barChartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 8,
    height: 80,
  },
  barItem: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 16,
    backgroundColor: '#FFD700',
    borderRadius: 6,
    marginBottom: 4,
  },
  barLabel: {
    fontSize: 12,
    color: '#888',
  },
  completedCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 8,
  },
  completedCard: {
    backgroundColor: '#23232A',
    borderRadius: 14,
    padding: 12,
    flex: 1,
    marginHorizontal: 2,
    minWidth: 100,
    alignItems: 'flex-start',
  },
});

export default BarberDashboard;
