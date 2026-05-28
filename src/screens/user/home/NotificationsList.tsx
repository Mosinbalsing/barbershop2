import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Typography } from '../../../shared/components/Typography';
import { Header } from '../../../shared/components/Header';
import { Icon } from '../../../shared/components/Icon';
import { usePremiumTheme, premiumShadow } from '../../../shared/theme/premiumTheme';

interface NotificationItem {
  id: string;
  category: 'Today' | 'Older';
  title: string;
  time: string;
  message: string;
  unread: boolean;
  iconName: string;
}

const NotificationsList = () => {
  const { colors } = usePremiumTheme();

  // Notification items state
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      category: 'Today',
      title: 'Appointment Reminder',
      time: '09:30 AM',
      message: 'Your Haircut & Beard Trim appointment is tomorrow at 05:00 PM.',
      unread: true,
      iconName: 'alarm-outline'
    },
    {
      id: '2',
      category: 'Today',
      title: 'Offer Just for You!',
      time: '08:15 AM',
      message: 'Flat 20% OFF on all services. Use code: SAVE20',
      unread: true,
      iconName: 'ticket-outline'
    },
    {
      id: '3',
      category: 'Today',
      title: 'Booking Confirmed',
      time: 'Yesterday',
      message: 'Your appointment on 20 May 2025 at 05:00 PM is confirmed.',
      unread: false,
      iconName: 'checkmark-circle-outline'
    },
    {
      id: '4',
      category: 'Older',
      title: 'New Service Added',
      time: '18 May',
      message: 'We have added a new service Hair Color.',
      unread: false,
      iconName: 'star-outline'
    },
    {
      id: '5',
      category: 'Older',
      title: 'Special Offer',
      time: '16 May',
      message: 'Flat ₹100 OFF on minimum booking of ₹500.',
      unread: false,
      iconName: 'gift-outline'
    }
  ]);

  const handleMarkAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, unread: false }));
    setNotifications(updated);
  };

  const handleItemPress = (id: string) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, unread: false } : n
    );
    setNotifications(updated);
  };

  // Grouped listings
  const todayNotifications = notifications.filter(n => n.category === 'Today');
  const olderNotifications = notifications.filter(n => n.category === 'Older');

  return (
    <View style={[styles.container, { backgroundColor: colors.canvas }]}>
      <Header
        title="Notifications"
        showBack
        rightElement={
          <TouchableOpacity onPress={handleMarkAllAsRead} style={styles.headerTextBtn}>
            <Typography variant="label" color="primary" weight="bold">Mark all as read</Typography>
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Today Group */}
        {todayNotifications.length > 0 && (
          <View style={styles.groupContainer}>
            <Typography variant="label" color="muted" weight="bold" style={styles.groupHeader}>TODAY</Typography>
            
            <View style={[styles.listCard, { backgroundColor: colors.surface }, premiumShadow]}>
              {todayNotifications.map((notif, index) => (
                <TouchableOpacity
                  key={notif.id}
                  onPress={() => handleItemPress(notif.id)}
                  style={[
                    styles.notifRow,
                    { borderBottomColor: colors.line, borderBottomWidth: index === todayNotifications.length - 1 ? 0 : 1 },
                    notif.unread && { backgroundColor: `${colors.primary}05` }
                  ]}
                >
                  <View style={[styles.iconWrapper, { backgroundColor: colors.softPrimary }]}>
                    <Icon name={notif.iconName} size={20} color="primary" />
                  </View>
                  
                  <View style={styles.textContainer}>
                    <View style={styles.titleRow}>
                      <Typography variant="body" weight="bold">{notif.title}</Typography>
                      <Typography variant="label" color="muted">{notif.time}</Typography>
                    </View>
                    <Typography variant="caption" color="muted" style={styles.message}>
                      {notif.message}
                    </Typography>
                  </View>

                  {notif.unread && (
                    <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Older Group */}
        {olderNotifications.length > 0 && (
          <View style={[styles.groupContainer, { marginTop: 24 }]}>
            <Typography variant="label" color="muted" weight="bold" style={styles.groupHeader}>OLDER</Typography>
            
            <View style={[styles.listCard, { backgroundColor: colors.surface }, premiumShadow]}>
              {olderNotifications.map((notif, index) => (
                <TouchableOpacity
                  key={notif.id}
                  onPress={() => handleItemPress(notif.id)}
                  style={[
                    styles.notifRow,
                    { borderBottomColor: colors.line, borderBottomWidth: index === olderNotifications.length - 1 ? 0 : 1 }
                  ]}
                >
                  <View style={[styles.iconWrapper, { backgroundColor: colors.line }]}>
                    <Icon name={notif.iconName} size={20} color="muted" />
                  </View>
                  
                  <View style={styles.textContainer}>
                    <View style={styles.titleRow}>
                      <Typography variant="body" weight="bold">{notif.title}</Typography>
                      <Typography variant="label" color="muted">{notif.time}</Typography>
                    </View>
                    <Typography variant="caption" color="muted" style={styles.message}>
                      {notif.message}
                    </Typography>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerTextBtn: { padding: 4 },
  scrollContent: { padding: 16 },
  groupContainer: {
    gap: 8,
  },
  groupHeader: {
    fontSize: 10,
    letterSpacing: 1,
    paddingLeft: 4,
  },
  listCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    position: 'relative',
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  message: {
    lineHeight: 18,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
    top: 20,
    right: 16,
  },
});

export default NotificationsList;
