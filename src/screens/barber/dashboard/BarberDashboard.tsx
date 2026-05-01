import React, { useMemo } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MetricCard, PremiumHeader } from '../../../shared/components/PremiumScaffold';
import { premiumColors, premiumShadow, premiumSpacing } from '../../../shared/theme/premiumTheme';

const appointments = [
  { time: '09:00 AM', name: 'Oliver Thompson', service: 'Hair & Beard Cut', status: 'Success' },
  { time: '10:30 AM', name: 'Liam Walker', service: 'Beard Trim & Style', status: 'Pending' },
  { time: '11:00 AM', name: 'William Wilson', service: 'Hair & Beard Cut', status: 'Pending' },
  { time: '12:00 PM', name: 'Ethan James', service: 'Trendy Hair Blonde', status: 'Pending' },
  { time: '01:00 PM', name: 'James Taylor', service: 'Hair Cut & Blonde', status: 'Pending' },
];

const week = [
  { day: 'Sun', date: '11', active: true },
  { day: 'Mon', date: '12' },
  { day: 'Tue', date: '13' },
  { day: 'Wed', date: '14' },
  { day: 'Thu', date: '15' },
];

const BarberDashboard = () => {
  const navigation = useNavigation<any>();
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  return (
    <View style={styles.screen}>
      <PremiumHeader
        eyebrow="Barber admin"
        title={`${greeting}, Shoyeb`}
        subtitle="Your shop is on pace for a strong booking day."
        right={
          <TouchableOpacity style={styles.headerAction}>
            <Icon name="bell-o" size={18} color={premiumColors.primary} />
          </TouchableOpacity>
        }
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.heroLabel}>Total Booking</Text>
              <Text style={styles.heroValue}>2K</Text>
              <Text style={styles.heroDetail}>+8% from last week</Text>
            </View>
            <View style={styles.avatarCluster}>
              <Image source={require('../../../assets/images/PNG/logo-light.png')} style={styles.avatar} />
              <View style={styles.smallBubble}>
                <Icon name="calendar-check-o" size={15} color={premiumColors.secondary} />
              </View>
            </View>
          </View>
          <View style={styles.metricsRow}>
            <MetricCard label="Appointments" value="6" detail="Today" />
            <MetricCard label="Retention" value="12%" detail="Past 90 days" tone="secondary" />
            <MetricCard label="Productivity" value="45%" detail="Past 90 days" />
          </View>
        </View>

        <View style={styles.calendarRow}>
          {week.map(item => (
            <TouchableOpacity key={item.date} style={[styles.datePill, item.active && styles.datePillActive]}>
              <Text style={[styles.dateDay, item.active && styles.dateActiveText]}>{item.day}</Text>
              <Text style={[styles.dateNum, item.active && styles.dateActiveText]}>{item.date}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Appointment</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Bookings')}>
            <Text style={styles.sectionAction}>View all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listCard}>
          {appointments.map((item, index) => (
            <TouchableOpacity key={item.name} style={[styles.appointmentRow, index === appointments.length - 1 && styles.lastRow]}>
              <Image source={require('../../../assets/images/PNG/logo-light.png')} style={styles.customerAvatar} />
              <View style={styles.appointmentText}>
                <Text style={styles.customerName}>{item.name}</Text>
                <Text style={styles.customerService}>{item.service}</Text>
              </View>
              <View style={[styles.statusBadge, item.status === 'Success' && styles.statusSuccess]}>
                <Text style={[styles.statusText, item.status === 'Success' && styles.statusSuccessText]}>{item.status}</Text>
              </View>
              <Text style={styles.time}>{item.time}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: premiumColors.canvas,
  },
  content: {
    paddingHorizontal: premiumSpacing.screen,
    paddingBottom: 112,
  },
  headerAction: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: premiumColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...premiumShadow,
  },
  heroCard: {
    backgroundColor: premiumColors.surface,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: premiumColors.line,
    ...premiumShadow,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroLabel: {
    color: premiumColors.muted,
    fontSize: 13,
    fontWeight: '700',
  },
  heroValue: {
    color: premiumColors.ink,
    fontSize: 34,
    fontWeight: '800',
    marginTop: 8,
  },
  heroDetail: {
    color: premiumColors.secondary,
    fontSize: 13,
    fontWeight: '800',
    marginTop: 4,
  },
  avatarCluster: {
    alignItems: 'center',
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: premiumColors.softPrimary,
  },
  smallBubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: premiumColors.softSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -10,
    borderWidth: 3,
    borderColor: premiumColors.surface,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  calendarRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  datePill: {
    width: 54,
    height: 70,
    borderRadius: 18,
    backgroundColor: premiumColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: premiumColors.line,
  },
  datePillActive: {
    backgroundColor: premiumColors.primary,
    borderColor: premiumColors.primary,
  },
  dateDay: {
    color: premiumColors.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  dateNum: {
    color: premiumColors.ink,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 6,
  },
  dateActiveText: {
    color: premiumColors.surface,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    color: premiumColors.ink,
    fontSize: 20,
    fontWeight: '800',
  },
  sectionAction: {
    color: premiumColors.primary,
    fontSize: 13,
    fontWeight: '800',
  },
  listCard: {
    backgroundColor: premiumColors.surface,
    borderRadius: 22,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: premiumColors.line,
  },
  appointmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: premiumColors.line,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  customerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: premiumColors.softPrimary,
  },
  appointmentText: {
    flex: 1,
    marginLeft: 12,
  },
  customerName: {
    color: premiumColors.ink,
    fontSize: 14,
    fontWeight: '800',
  },
  customerService: {
    color: premiumColors.muted,
    fontSize: 12,
    marginTop: 3,
  },
  statusBadge: {
    backgroundColor: premiumColors.softPrimary,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusSuccess: {
    backgroundColor: premiumColors.softSecondary,
  },
  statusText: {
    color: premiumColors.primary,
    fontSize: 10,
    fontWeight: '800',
  },
  statusSuccessText: {
    color: premiumColors.secondary,
  },
  time: {
    color: premiumColors.muted,
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 8,
  },
});

export default BarberDashboard;
