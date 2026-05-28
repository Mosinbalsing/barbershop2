import React, { useState, useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { usePremiumTheme, premiumShadow } from '../../../shared/theme/premiumTheme';

type NotificationItem = {
  id: string;
  title: string;
  body: string;
  time: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  type: 'booking' | 'payment' | 'review' | 'offer';
  unread: boolean;
};

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: 'New Booking Received',
    body: 'Rahul booked a Haircut',
    time: '10:30 AM',
    icon: 'calendar-check-o',
    iconColor: '#6D4CF3',
    iconBg: 'rgba(109, 76, 243, 0.12)',
    type: 'booking',
    unread: true,
  },
  {
    id: '2',
    title: 'Payment Received',
    body: '₹490 received from Amit Kumar',
    time: 'Yesterday',
    icon: 'money',
    iconColor: '#10B981',
    iconBg: 'rgba(16, 185, 129, 0.12)',
    type: 'payment',
    unread: true,
  },
  {
    id: '3',
    title: 'Booking Cancelled',
    body: 'Rahul cancelled the booking',
    time: '2 Days Ago',
    icon: 'times-circle-o',
    iconColor: '#EF4444',
    iconBg: 'rgba(239, 68, 68, 0.12)',
    type: 'booking',
    unread: false,
  },
  {
    id: '4',
    title: 'New Review Received',
    body: 'You received a new review',
    time: '3 Days Ago',
    icon: 'star',
    iconColor: '#F59E0B',
    iconBg: 'rgba(245, 158, 11, 0.12)',
    type: 'review',
    unread: false,
  },
  {
    id: '5',
    title: 'Offer Activated',
    body: 'Summer Sale 20% is active',
    time: '5 Days Ago',
    icon: 'tag',
    iconColor: '#2563EB',
    iconBg: 'rgba(37, 99, 235, 0.12)',
    type: 'offer',
    unread: false,
  },
];

const BarberNotifications = () => {
  const { colors, mode } = usePremiumTheme();
  const navigation = useNavigation<any>();

  const purpleTheme = {
    primary: '#6D4CF3',
  };

  const [activeTab, setActiveTab] = useState<'All' | 'Unread' | 'Bookings' | 'Offers'>('All');

  const filteredList = useMemo(() => {
    return MOCK_NOTIFICATIONS.filter(item => {
      if (activeTab === 'Unread') return item.unread;
      if (activeTab === 'Bookings') return item.type === 'booking';
      if (activeTab === 'Offers') return item.type === 'offer';
      return true;
    });
  }, [activeTab]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.canvas }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.line }]}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={18} color={colors.ink} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.ink }]}>Notifications</Text>

        <View style={{ width: 36 }} />
      </View>

      {/* Navigation tabs */}
      <View style={[styles.tabBar, { backgroundColor: colors.surface, borderBottomColor: colors.line }]}>
        {['All', 'Unread', 'Bookings', 'Offers'].map(tab => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tabItem, isActive && { borderBottomColor: purpleTheme.primary }]}
              onPress={() => setActiveTab(tab as any)}
            >
              <Text style={[
                styles.tabText,
                isActive ? { color: colors.ink, fontWeight: 'bold' } : { color: colors.muted }
              ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Notifications list */}
      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {filteredList.map(item => (
          <TouchableOpacity
            key={item.id}
            style={[styles.cardItem, { backgroundColor: colors.surface, borderColor: colors.line }]}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('BarberNotificationDetail', { notification: item })}
          >
            <View style={styles.row}>
              {/* Icon Container */}
              <View style={[styles.iconBox, { backgroundColor: item.iconBg }]}>
                <Icon name={item.icon} size={16} color={item.iconColor} />
              </View>

              {/* Middle Copy Info */}
              <View style={styles.infoCol}>
                <Text style={[styles.title, { color: colors.ink }]}>{item.title}</Text>
                <Text style={[styles.body, { color: colors.muted }]}>{item.body}</Text>
              </View>

              {/* Right Time stamp & unread dot */}
              <View style={styles.rightCol}>
                <Text style={[styles.time, { color: colors.muted }]}>{item.time}</Text>
                {item.unread && <View style={styles.unreadDot} />}
              </View>
            </View>
          </TouchableOpacity>
        ))}
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
    textAlign: 'center',
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  cardItem: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 12,
    marginBottom: 12,
    ...premiumShadow,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCol: {
    flex: 1,
    marginLeft: 14,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  body: {
    fontSize: 12,
    marginTop: 2.5,
  },
  rightCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  time: {
    fontSize: 10,
    fontWeight: '500',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    marginTop: 6,
  },
});

export default BarberNotifications;
