import React, { useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { LineChart } from 'react-native-gifted-charts';
import { usePremiumTheme, premiumShadow } from '../../shared/theme/premiumTheme';

const { width } = Dimensions.get('window');

type MetricItem = {
  label: string;
  value: string;
  percent: string;
  icon: string;
  iconBgColor: string;
};

const AdminDashboard = () => {
  const { colors, mode } = usePremiumTheme();
  const navigation = useNavigation<any>();

  const brownTheme = {
    primary: '#683E26',
    activeBg: mode === 'dark' ? '#3A281E' : '#F5F1ED',
  };

  const metrics: MetricItem[] = [
    {
      label: 'Total Bookings',
      value: '128',
      percent: '16%',
      icon: 'calendar',
      iconBgColor: mode === 'dark' ? 'rgba(104, 62, 38, 0.2)' : 'rgba(104, 62, 38, 0.1)',
    },
    {
      label: "Today's Bookings",
      value: '12',
      percent: '9%',
      icon: 'clock-o',
      iconBgColor: mode === 'dark' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)',
    },
    {
      label: 'Total Customers',
      value: '256',
      percent: '22%',
      icon: 'users',
      iconBgColor: mode === 'dark' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)',
    },
    {
      label: 'Total Revenue',
      value: '₹ 48,750',
      percent: '25%',
      icon: 'money',
      iconBgColor: mode === 'dark' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.1)',
    },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.canvas }]}>
      <TouchableOpacity
        style={[
          styles.floatingBellBtn,
          {
            backgroundColor: colors.surface,
            borderColor: colors.line,
          },
        ]}
        onPress={() => navigation.navigate('More')}
        activeOpacity={0.85}
      >
        <View style={styles.bellWrapper}>
          <Icon name="bell-o" size={18} color={colors.ink} />
          <View style={styles.badgeDot} />
        </View>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {/* Hello Admin Welcomer */}
        <View style={styles.welcomeRow}>
          <Text style={[styles.welcomeTitle, { color: colors.ink }]}>Hello, Admin 👋</Text>
          <Text style={[styles.welcomeSubText, { color: colors.muted }]}>
            Welcome back! Here's what's happening.
          </Text>
        </View>

        {/* Metrics Grid */}
        <View style={styles.metricsGrid}>
          {metrics.map(m => (
            <View key={m.label} style={[styles.metricCard, { backgroundColor: colors.surface, borderColor: colors.line }]}>
              <View style={styles.metricHeader}>
                <View style={[styles.metricIconBox, { backgroundColor: m.iconBgColor }]}>
                  <Icon name={m.icon} size={15} color={brownTheme.primary} />
                </View>
                <View style={styles.percentRow}>
                  <Icon name="arrow-up" size={10} color="#10B981" />
                  <Text style={styles.percentText}>{m.percent}</Text>
                </View>
              </View>
              <Text style={[styles.metricValue, { color: colors.ink }]}>{m.value}</Text>
              <Text style={[styles.metricLabel, { color: colors.muted }]} numberOfLines={1}>{m.label}</Text>
            </View>
          ))}
        </View>

        {/* Bookings Overview Monthly Line Chart */}
        <View style={[styles.chartCard, { backgroundColor: colors.surface, borderColor: colors.line }]}>
          <View style={styles.chartHeader}>
            <Text style={[styles.chartTitleText, { color: colors.ink }]}>Bookings Overview</Text>
            <TouchableOpacity style={[styles.dropdownRow, { backgroundColor: colors.canvas, borderColor: colors.line }]}>
              <Text style={[styles.dropdownText, { color: colors.ink }]}>This Month</Text>
              <Icon name="chevron-down" size={10} color={colors.ink} style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>

          {/* Premium Custom spline line chart using GiftedCharts */}
          <View style={{ height: 160, paddingRight: 10, overflow: 'hidden' }}>
            <LineChart
              data={[
                { value: 30, label: '1 May' },
                { value: 45, label: '10 May' },
                { value: 35, label: '20 May' },
                { value: 65, label: '31 May' }
              ]}
              data2={[
                { value: 15, label: '1 May' },
                { value: 25, label: '10 May' },
                { value: 20, label: '20 May' },
                { value: 30, label: '31 May' }
              ]}
              data3={[
                { value: 5, label: '1 May' },
                { value: 12, label: '10 May' },
                { value: 8, label: '20 May' },
                { value: 15, label: '31 May' }
              ]}
              curved
              color1="#10B981"
              color2="#F59E0B"
              color3="#EF4444"
              thickness={3}
              hideDataPoints={false}
              dataPointsColor1="#10B981"
              dataPointsColor2="#F59E0B"
              dataPointsColor3="#EF4444"
              dataPointsRadius={4}
              yAxisColor="transparent"
              xAxisColor="transparent"
              rulesColor={colors.line}
              rulesType="solid"
              yAxisTextStyle={{ color: colors.muted, fontSize: 8, fontWeight: '700' }}
              xAxisLabelTextStyle={{ color: colors.muted, fontSize: 8, fontWeight: '700' }}
              noOfSections={4}
              maxValue={100}
              spacing={(width - 92) / 4}
              initialSpacing={18}
              endSpacing={14}
              hideOrigin
            />
          </View>

          {/* Legend indicators */}
          <View style={[styles.legendContainer, { marginTop: 12 }]}>
            <View style={styles.legendItem}>
              <View style={[styles.legendIndicator, { backgroundColor: '#10B981' }]} />
              <Text style={[styles.legendTextText, { color: colors.muted }]}>Completed</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendIndicator, { backgroundColor: '#F59E0B' }]} />
              <Text style={[styles.legendTextText, { color: colors.muted }]}>Pending</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendIndicator, { backgroundColor: '#EF4444' }]} />
              <Text style={[styles.legendTextText, { color: colors.muted }]}>Cancelled</Text>
            </View>
          </View>
        </View>

        {/* Recent Bookings List */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitleText, { color: colors.ink }]}>Recent Bookings</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Bookings')}>
            <Text style={[styles.viewAllText, { color: brownTheme.primary }]}>View All</Text>
          </TouchableOpacity>
        </View>

        {/* Single booking item row */}
        <TouchableOpacity
          style={[styles.recentCard, { backgroundColor: colors.surface, borderColor: colors.line }]}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('AdminBookingDetails', {
            booking: {
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
            }
          })}
        >
          <View style={styles.recentRow}>
            {/* Left Date Block */}
            <View style={[styles.dateBlock, { backgroundColor: brownTheme.activeBg }]}>
              <Text style={[styles.dateMonthText, { color: brownTheme.primary }]}>MAY</Text>
              <Text style={[styles.dateDayText, { color: brownTheme.primary }]}>20</Text>
            </View>

            {/* Middle customer name & details */}
            <View style={styles.recentInfo}>
              <Text style={[styles.recentNameText, { color: colors.ink }]}>Rahul Verma</Text>
              <Text style={[styles.recentServiceText, { color: colors.muted }]}>Haircut & Beard Trim</Text>
            </View>

            {/* Price right aligned */}
            <Text style={[styles.recentPriceText, { color: colors.ink }]}>₹299</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    position: 'relative',
  },
  floatingBellBtn: {
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
  bellWrapper: {
    position: 'relative',
  },
  badgeDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  welcomeRow: {
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  welcomeSubText: {
    fontSize: 14,
    marginTop: 4,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
    marginBottom: 20,
  },
  metricCard: {
    width: (width - 44) / 2,
    borderWidth: 1,
    borderRadius: 18,
    padding: 12,
    ...premiumShadow,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metricIconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  percentText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 3,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  metricLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  chartCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 16,
    marginBottom: 20,
    ...premiumShadow,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  chartTitleText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  dropdownText: {
    fontSize: 12,
    fontWeight: '600',
  },
  chartPlaceholder: {
    height: 120,
    position: 'relative',
    marginBottom: 12,
  },
  gridLineHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    opacity: 0.1,
  },
  curveWrapper: {
    ...StyleSheet.absoluteFillObject,
  },
  chartDot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  lineSegment: {
    position: 'absolute',
  },
  xAxisLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 14,
  },
  xAxisText: {
    fontSize: 10,
    fontWeight: '600',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendTextText: {
    fontSize: 11,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitleText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  recentCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 12,
    marginBottom: 20,
    ...premiumShadow,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateBlock: {
    width: 50,
    height: 54,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateMonthText: {
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  dateDayText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 1,
  },
  recentInfo: {
    flex: 1,
    marginLeft: 14,
  },
  recentNameText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  recentServiceText: {
    fontSize: 13,
    marginTop: 2,
  },
  recentPriceText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default AdminDashboard;
