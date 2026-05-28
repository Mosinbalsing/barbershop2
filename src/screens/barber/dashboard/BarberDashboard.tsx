import React, { useMemo, useState, useEffect } from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LineChart } from 'react-native-gifted-charts';
import { useGetBarberDashboard, useGetDashboardByDate } from './BarberDashboardApi';
import { usePremiumTheme, premiumShadow, premiumSpacing } from '../../../shared/theme/premiumTheme';

const { width } = Dimensions.get('window');

type DashboardWeekItem = {
  date: string;
  day: string;
  booking_count: number;
  is_weekly_holiday: boolean;
  is_emergency_holiday: boolean;
};

type DashboardAppointment = {
  booking_id: number;
  customer_name: string;
  services: Array<{ name?: string } | string>;
  start_time: string;
  end_time: string;
  status: string;
  total_amount: number;
};

type BarberDashboardResponse = {
  first_name?: string;
  total_bookings?: number;
  total_week_bookings?: number;
  week_data?: DashboardWeekItem[];
  appointments?: DashboardAppointment[];
};

const customerAvatars = [
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?auto=format&fit=crop&w=120&q=80',
];

const getCustomerAvatar = (idx: number) => {
  return customerAvatars[idx % customerAvatars.length];
};

const formatServiceLabel = (services: DashboardAppointment['services']) => {
  if (!services || services.length === 0) return 'Haircut & Beard Trim';
  return services
    .map(service => {
      if (typeof service === 'string') return service;
      return service?.name || '';
    })
    .filter(Boolean)
    .join(', ');
};

const DashboardSkeleton = ({ colors }: { colors: any }) => {
  const styles = createSkeletonStyles(colors);
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.cardHero} />
      <View style={styles.cardHeader} />
      <View style={styles.chartBlock} />
      <View style={styles.metricsRow}>
        <View style={styles.metricCard} />
        <View style={styles.metricCard} />
        <View style={styles.metricCard} />
      </View>
    </ScrollView>
  );
};

const BarberDashboard = () => {
  const navigation = useNavigation<any>();
  const { colors, mode } = usePremiumTheme();
  
  // View State: 'dashboard' | 'appointments'
  const [activeView, setActiveView] = useState<'dashboard' | 'appointments'>('dashboard');

  // Filter States inside appointments full view
  const [activeFilterTab, setActiveFilterTab] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');

  const purpleTheme = {
    primary: '#6D4CF3',
    secondary: '#B99BFF',
    activeBg: mode === 'dark' ? 'rgba(109, 76, 243, 0.25)' : 'rgba(109, 76, 243, 0.12)',
  };

  const styles = useMemo(() => createStyles(colors, mode, purpleTheme), [colors, mode]);

  const [selectedDate, setSelectedDate] = useState<string | undefined>();
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Hello';
    if (hour < 18) return 'Hello';
    return 'Hello';
  }, []);

  const { data: dashboardData, isLoading, refetch } = useGetBarberDashboard();
  const { data: dateSpecificData, isLoading: isLoadingDateData } = useGetDashboardByDate(selectedDate);

  // Sync date strip selection to today's date if empty
  useEffect(() => {
    if (dashboardData?.week_data && dashboardData.week_data.length > 0 && !selectedDate) {
      setSelectedDate(dashboardData.week_data[0].date);
    }
  }, [dashboardData, selectedDate]);

  // Combined Dashboard response
  const dashboard = useMemo(() => {
    if (selectedDate && dateSpecificData) {
      return dateSpecificData as BarberDashboardResponse | undefined;
    }
    return dashboardData as BarberDashboardResponse | undefined;
  }, [selectedDate, dateSpecificData, dashboardData]);

  const appointments = useMemo(() => {
    return dashboard?.appointments ?? [];
  }, [dashboard]);

  // Chart data mappings
  const chartData = useMemo(() => {
    const defaultData = [
      { value: 2, label: 'Mon' },
      { value: 4, label: 'Tue' },
      { value: 8.45, label: 'Wed' },
      { value: 3, label: 'Thu' },
      { value: 5, label: 'Fri' },
      { value: 4, label: 'Sat' },
      { value: 7, label: 'Sun' },
    ];
    if (!dashboardData?.week_data || dashboardData.week_data.length === 0) return defaultData;

    return dashboardData.week_data.map((item: any) => ({
      value: item.booking_count === 0 ? 1 : item.booking_count,
      label: item.day,
    }));
  }, [dashboardData]);

  // Dynamically compute today's overview values
  const overviewStats = useMemo(() => {
    const total = appointments.length;
    const completed = appointments.filter(a => a.status.toLowerCase() === 'completed').length;
    const pending = appointments.filter(a => a.status.toLowerCase() === 'pending' || a.status.toLowerCase() === 'booked').length;
    const confirmed = appointments.filter(a => a.status.toLowerCase() === 'confirmed').length;
    const cancelled = appointments.filter(a => a.status.toLowerCase() === 'cancelled' || a.status.toLowerCase() === 'canceled').length;
    const revenue = appointments.reduce((sum, item) => sum + (item.total_amount || 0), 0);

    return {
      total: total || 12,
      completed: completed || 8,
      pending: pending || 3,
      confirmed: confirmed || 8,
      cancelled: cancelled || 1,
      revenue: revenue || 8450,
    };
  }, [appointments]);

  // Filter appointments when in Full Appointments View
  const filteredAppointments = useMemo(() => {
    if (activeFilterTab === 'all') return appointments;
    return appointments.filter(appt => {
      const status = appt.status.toLowerCase();
      if (activeFilterTab === 'pending') return status === 'pending' || status === 'booked';
      if (activeFilterTab === 'confirmed') return status === 'confirmed' || status === 'completed';
      if (activeFilterTab === 'cancelled') return status === 'cancelled' || status === 'canceled';
      return true;
    });
  }, [appointments, activeFilterTab]);

  const activeDateLabel = useMemo(() => {
    if (!selectedDate) return '20 May 2025';
    const options: any = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(selectedDate).toLocaleDateString('en-US', options);
  }, [selectedDate]);

  const displayName = dashboard?.first_name || 'Rahul';

  // Toggle to Full View
  const handleViewAllAppointments = () => {
    setActiveView('appointments');
  };

  const handleBackToDashboard = () => {
    setActiveView('dashboard');
  };

  // 2. Full Appointments View Screen
  if (activeView === 'appointments') {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.canvas }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.line }]}>
          <TouchableOpacity style={styles.headerBtn} onPress={handleBackToDashboard}>
            <Icon name="arrow-left" size={18} color={colors.ink} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.ink }]}>Appointments</Text>
          
          <TouchableOpacity style={styles.headerBtn}>
            <Icon name="calendar" size={18} color={colors.ink} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.listScrollContent} showsVerticalScrollIndicator={false}>
          {/* Calendar Strip */}
          <View style={{ marginTop: 14 }}>
            <FlatList
              horizontal
              data={dashboardData?.week_data ?? []}
              keyExtractor={item => item.date}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dateCarouselContent}
              renderItem={({ item }) => {
                const isSelected = selectedDate === item.date;
                const dayNum = new Date(item.date).getDate();
                return (
                  <TouchableOpacity
                    onPress={() => setSelectedDate(item.date)}
                    style={[
                      styles.datePillCircle,
                      { backgroundColor: colors.surface, borderColor: colors.line },
                      isSelected && { backgroundColor: purpleTheme.primary, borderColor: purpleTheme.primary }
                    ]}
                  >
                    <Text style={[styles.datePillDayText, { color: colors.muted }, isSelected && { color: '#FFFFFF' }]}>
                      {item.day}
                    </Text>
                    <Text style={[styles.datePillNumText, { color: colors.ink }, isSelected && { color: '#FFFFFF', fontWeight: 'bold' }]}>
                      {dayNum}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>

          {/* Date Label Header */}
          <Text style={[styles.dateSectionLabelTitle, { color: colors.ink, paddingHorizontal: 16 }]}>
            {activeDateLabel}
          </Text>

          {/* Filter Status Tabs */}
          <View style={styles.filterTabsWrapperRow}>
            {([
              { label: 'All', value: 'all', count: overviewStats.total, color: purpleTheme.primary, bg: purpleTheme.activeBg },
              { label: 'Pending', value: 'pending', count: overviewStats.pending, color: '#E2B13C', bg: 'rgba(226, 177, 60, 0.12)' },
              { label: 'Confirmed', value: 'confirmed', count: overviewStats.confirmed, color: '#10B981', bg: 'rgba(16, 185, 129, 0.12)' },
              { label: 'Cancelled', value: 'cancelled', count: overviewStats.cancelled, color: '#EF4444', bg: 'rgba(239, 68, 68, 0.12)' },
            ] as const).map(tab => {
              const active = activeFilterTab === tab.value;
              return (
                <TouchableOpacity
                  key={tab.value}
                  style={[
                    styles.filterTabItemChip,
                    { backgroundColor: colors.surface, borderColor: colors.line },
                    active && { backgroundColor: tab.bg, borderColor: tab.color }
                  ]}
                  onPress={() => setActiveFilterTab(tab.value)}
                >
                  <Text style={[
                    styles.filterTabItemLabel,
                    { color: colors.muted },
                    active && { color: tab.color, fontWeight: 'bold' }
                  ]}>
                    {tab.label} ({tab.count})
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Appointment list items */}
          <View style={[styles.appointmentsListOuterCard, { backgroundColor: colors.surface, borderColor: colors.line }]}>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((item, index) => {
                const isLast = index === filteredAppointments.length - 1;
                const status = item.status.toLowerCase();
                const isConfirmed = status === 'confirmed' || status === 'completed';
                const isCancelled = status === 'cancelled' || status === 'canceled';
                const statusLabel = isConfirmed ? 'Confirmed' : (isCancelled ? 'Cancelled' : 'Pending');
                const statusColor = isConfirmed ? '#10B981' : (isCancelled ? '#EF4444' : '#E2B13C');
                const statusBg = isConfirmed ? 'rgba(16, 185, 129, 0.1)' : (isCancelled ? 'rgba(239, 68, 68, 0.1)' : 'rgba(226, 177, 60, 0.1)');

                return (
                  <TouchableOpacity
                    key={item.booking_id}
                    style={[
                      styles.appointmentRowItemFull,
                      { borderBottomColor: colors.line },
                      !isLast && { borderBottomWidth: 1 }
                    ]}
                    onPress={() => navigation.navigate('BookingDetails', { bookingId: item.booking_id })}
                  >
                    {/* Time Label on left */}
                    <Text style={[styles.appointmentTimeTextColumn, { color: purpleTheme.primary }]}>
                      {item.start_time || '10:00 AM'}
                    </Text>

                    {/* Customer Photo */}
                    <Image source={{ uri: getCustomerAvatar(index) }} style={styles.customerAvatarFrameRound} />

                    {/* Center details copy */}
                    <View style={styles.appointmentMiddleLabelCol}>
                      <Text style={[styles.customerProfileNameText, { color: colors.ink }]}>{item.customer_name}</Text>
                      <Text style={[styles.customerServiceDescText, { color: colors.muted }]}>{formatServiceLabel(item.services)}</Text>
                      <Text style={[styles.customerPriceLabelTextText, { color: colors.ink }]}>₹{item.total_amount || 299}</Text>
                    </View>

                    {/* Right side status badge and chevron */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <View style={[styles.statusBadgeCapsuleContainer, { backgroundColor: statusBg }]}>
                        <Text style={[styles.statusBadgeCapsuleTextText, { color: statusColor }]}>{statusLabel}</Text>
                      </View>
                      <Icon name="chevron-right" size={11} color={colors.muted} />
                    </View>
                  </TouchableOpacity>
                );
              })
            ) : (
              <View style={{ padding: 36, alignItems: 'center' }}>
                <Icon name="calendar-times-o" size={24} color={colors.muted} />
                <Text style={{ color: colors.muted, fontWeight: '700', marginTop: 12 }}>No appointments matching filters.</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // 1. Dashboard View Screen
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.canvas }]}>
      {/* Top Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.line }]}>
        <View style={styles.headerBarberProfileRow}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80' }}
            style={styles.headerBarberAvatar}
          />
          <View style={{ marginLeft: 12 }}>
            <Text style={[styles.headerGreetingText, { color: colors.ink }]}>Hello, {displayName} 👋</Text>
            <Text style={[styles.headerGreetingSub, { color: colors.muted }]}>Welcome back to your dashboard</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.notificationBellCircle} onPress={() => navigation.navigate('BarberNotifications')}>
          <Icon name="bell" size={16} color={colors.ink} />
          <View style={styles.notificationRedDot} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <DashboardSkeleton colors={colors} />
      ) : (
        <ScrollView contentContainerStyle={styles.listScrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Today's Overview Purple Hero Card */}
          <View style={[styles.purpleOverviewHeroCard, { backgroundColor: purpleTheme.primary }]}>
            <View style={styles.heroOverviewTopRow}>
              <View>
                <Text style={styles.heroOverviewTitle}>Today's Overview</Text>
                <Text style={styles.heroOverviewSub}>20 May 2025, Tuesday</Text>
              </View>

              <TouchableOpacity style={styles.heroOverviewSelectorDropdown}>
                <Text style={styles.heroOverviewDropdownLabel}>Today</Text>
                <Icon name="chevron-down" size={10} color="#FFFFFF" style={{ marginLeft: 6 }} />
              </TouchableOpacity>
            </View>

            <View style={styles.heroOverviewMetricsGridRow}>
              {/* Card 1: Total Bookings */}
              <View style={styles.heroOverviewMetricBox}>
                <View style={[styles.heroOverviewMetricIconCircle, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
                  <Icon name="calendar-check-o" size={14} color="#FFFFFF" />
                </View>
                <Text style={styles.heroOverviewMetricCountValue}>{overviewStats.total}</Text>
                <Text style={styles.heroOverviewMetricLabel}>Total Bookings</Text>
              </View>

              {/* Card 2: Completed */}
              <View style={styles.heroOverviewMetricBox}>
                <View style={[styles.heroOverviewMetricIconCircle, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
                  <Icon name="check-circle" size={14} color="#FFFFFF" />
                </View>
                <Text style={styles.heroOverviewMetricCountValue}>{overviewStats.completed}</Text>
                <Text style={styles.heroOverviewMetricLabel}>Completed</Text>
              </View>

              {/* Card 3: Pending */}
              <View style={styles.heroOverviewMetricBox}>
                <View style={[styles.heroOverviewMetricIconCircle, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
                  <Icon name="clock-o" size={14} color="#FFFFFF" />
                </View>
                <Text style={styles.heroOverviewMetricCountValue}>{overviewStats.pending}</Text>
                <Text style={styles.heroOverviewMetricLabel}>Pending</Text>
              </View>

              {/* Card 4: Revenue */}
              <View style={styles.heroOverviewMetricBox}>
                <View style={[styles.heroOverviewMetricIconCircle, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
                  <Icon name="money" size={14} color="#FFFFFF" />
                </View>
                <Text style={styles.heroOverviewMetricCountValue}>₹ {overviewStats.revenue.toLocaleString()}</Text>
                <Text style={styles.heroOverviewMetricLabel}>Revenue</Text>
              </View>
            </View>
          </View>

          {/* This Week Overview Section */}
          <View style={styles.weekOverviewHeaderRow}>
            <Text style={[styles.sectionTitleLabel, { color: colors.ink }]}>This Week Overview</Text>
            
            <TouchableOpacity style={[styles.timePeriodCapsuleDropdown, { backgroundColor: colors.surface, borderColor: colors.line }]}>
              <Text style={[styles.timePeriodLabelText, { color: colors.ink }]}>This Week</Text>
              <Icon name="chevron-down" size={10} color={colors.ink} style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>

          {/* Spline chart card */}
          <View style={[styles.chartWrapperCardFrame, { backgroundColor: colors.surface, borderColor: colors.line }]}>
            <View style={styles.splineChartContainerArea}>
              <LineChart
                data={chartData}
                areaChart
                curved
                color={purpleTheme.primary}
                startFillColor={purpleTheme.primary}
                endFillColor={purpleTheme.primary}
                startOpacity={0.24}
                endOpacity={0.03}
                thickness={3}
                yAxisColor="transparent"
                xAxisColor="transparent"
                rulesColor={colors.line}
                rulesType="solid"
                yAxisTextStyle={{ color: colors.muted, fontSize: 9, fontWeight: '700' }}
                xAxisLabelTextStyle={{ color: colors.muted, fontSize: 9, fontWeight: '700' }}
                hideDataPoints={false}
                dataPointsColor={purpleTheme.primary}
                dataPointsRadius={4}
                noOfSections={4}
                maxValue={12}
                spacing={(width - 92) / 7}
                initialSpacing={14}
                endSpacing={10}
                hideOrigin
              />
              
              {/* Tooltip bubble on peak */}
              <View style={[styles.splinePeakTooltipOverlay, { backgroundColor: purpleTheme.primary }]}>
                <Text style={styles.splineTooltipTextText}>₹ 8,450</Text>
              </View>
            </View>
          </View>

          {/* Performance stats capsules row */}
          <View style={styles.performanceMetricsRowContainer}>
            {/* Total Revenue */}
            <View style={[styles.performanceMetricCardCell, { backgroundColor: colors.surface, borderColor: colors.line }]}>
              <Text style={[styles.performanceMetricCellLabelText, { color: colors.muted }]}>Total Revenue</Text>
              <Text style={[styles.performanceMetricCellValueTextText, { color: colors.ink }]}>₹ 32,450</Text>
              <Text style={styles.performanceMetricCellGrowthText}>+15.6% vs last week</Text>
            </View>

            {/* Total Bookings */}
            <View style={[styles.performanceMetricCardCell, { backgroundColor: colors.surface, borderColor: colors.line }]}>
              <Text style={[styles.performanceMetricCellLabelText, { color: colors.muted }]}>Total Bookings</Text>
              <Text style={[styles.performanceMetricCellValueTextText, { color: colors.ink }]}>48</Text>
              <Text style={styles.performanceMetricCellGrowthText}>+18.7% vs last week</Text>
            </View>

            {/* Avg Rating */}
            <View style={[styles.performanceMetricCardCell, { backgroundColor: colors.surface, borderColor: colors.line }]}>
              <Text style={[styles.performanceMetricCellLabelText, { color: colors.muted }]}>Avg. Rating</Text>
              <Text style={[styles.performanceMetricCellValueTextText, { color: colors.ink }]}>4.8</Text>
              <Text style={styles.performanceMetricCellGrowthText}>+0.3 vs last week</Text>
            </View>
          </View>

          {/* Appointments section header */}
          <View style={styles.appointmentsSectionHeaderRow}>
            <Text style={[styles.sectionTitleLabel, { color: colors.ink }]}>Appointments</Text>
            <TouchableOpacity onPress={handleViewAllAppointments}>
              <Text style={[styles.viewAllBtnTextLink, { color: purpleTheme.primary }]}>View All</Text>
            </TouchableOpacity>
          </View>

          {/* Calendar Strip (Horizontal strip carousel) */}
          <View style={{ marginBottom: 16 }}>
            <FlatList
              horizontal
              data={dashboardData?.week_data ?? []}
              keyExtractor={item => item.date}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dateCarouselContent}
              renderItem={({ item }) => {
                const isSelected = selectedDate === item.date;
                const dayNum = new Date(item.date).getDate();
                return (
                  <TouchableOpacity
                    onPress={() => setSelectedDate(item.date)}
                    style={[
                      styles.datePillCircle,
                      { backgroundColor: colors.surface, borderColor: colors.line },
                      isSelected && { backgroundColor: purpleTheme.primary, borderColor: purpleTheme.primary }
                    ]}
                  >
                    <Text style={[styles.datePillDayText, { color: colors.muted }, isSelected && { color: '#FFFFFF' }]}>
                      {item.day}
                    </Text>
                    <Text style={[styles.datePillNumText, { color: colors.ink }, isSelected && { color: '#FFFFFF', fontWeight: 'bold' }]}>
                      {dayNum}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>

          {/* Appointment counts row */}
          <View style={styles.appointmentsCountsCapsuleRow}>
            <View style={[styles.countRowItemChip, { backgroundColor: 'rgba(109,76,243,0.12)' }]}>
              <Text style={[styles.countRowItemCount, { color: purpleTheme.primary }]}>{overviewStats.total}</Text>
              <Text style={[styles.countRowItemLabelTextText, { color: colors.muted }]}>Total</Text>
            </View>

            <View style={[styles.countRowItemChip, { backgroundColor: 'rgba(226,177,60,0.12)' }]}>
              <Text style={[styles.countRowItemCount, { color: '#E2B13C' }]}>{overviewStats.pending}</Text>
              <Text style={[styles.countRowItemLabelTextText, { color: colors.muted }]}>Pending</Text>
            </View>

            <View style={[styles.countRowItemChip, { backgroundColor: 'rgba(16,185,129,0.12)' }]}>
              <Text style={[styles.countRowItemCount, { color: '#10B981' }]}>{overviewStats.confirmed}</Text>
              <Text style={[styles.countRowItemLabelTextText, { color: colors.muted }]}>Confirmed</Text>
            </View>

            <View style={[styles.countRowItemChip, { backgroundColor: 'rgba(239,68,68,0.12)' }]}>
              <Text style={[styles.countRowItemCount, { color: '#EF4444' }]}>{overviewStats.cancelled}</Text>
              <Text style={[styles.countRowItemLabelTextText, { color: colors.muted }]}>Cancelled</Text>
            </View>
          </View>

          {/* Subheader Title Appointments */}
          <Text style={[styles.todayAppointmentsLabelHeader, { color: colors.ink, paddingHorizontal: 16 }]}>
            Today's Appointments (20 May 2025)
          </Text>

          {/* Appointments short list */}
          <View style={[styles.appointmentsListOuterCard, { backgroundColor: colors.surface, borderColor: colors.line }]}>
            {appointments.length > 0 ? (
              appointments.slice(0, 3).map((item, index) => {
                const isLast = index === Math.min(appointments.length, 3) - 1;
                const status = item.status.toLowerCase();
                const isConfirmed = status === 'confirmed' || status === 'completed';
                const isCancelled = status === 'cancelled' || status === 'canceled';
                const statusLabel = isConfirmed ? 'Confirmed' : (isCancelled ? 'Cancelled' : 'Pending');
                const statusColor = isConfirmed ? '#10B981' : (isCancelled ? '#EF4444' : '#E2B13C');
                const statusBg = isConfirmed ? 'rgba(16, 185, 129, 0.1)' : (isCancelled ? 'rgba(239, 68, 68, 0.1)' : 'rgba(226, 177, 60, 0.1)');

                return (
                  <TouchableOpacity
                    key={item.booking_id}
                    style={[
                      styles.appointmentRowItemFull,
                      { borderBottomColor: colors.line },
                      !isLast && { borderBottomWidth: 1 }
                    ]}
                    onPress={() => navigation.navigate('BookingDetails', { bookingId: item.booking_id })}
                  >
                    {/* Time Column */}
                    <Text style={[styles.appointmentTimeTextColumn, { color: purpleTheme.primary }]}>
                      {item.start_time || '10:00 AM'}
                    </Text>

                    {/* Customer Photo */}
                    <Image source={{ uri: getCustomerAvatar(index) }} style={styles.customerAvatarFrameRound} />

                    {/* Center copy details */}
                    <View style={styles.appointmentMiddleLabelCol}>
                      <Text style={[styles.customerProfileNameText, { color: colors.ink }]}>{item.customer_name}</Text>
                      <Text style={[styles.customerServiceDescText, { color: colors.muted }]}>{formatServiceLabel(item.services)}</Text>
                      <Text style={[styles.customerPriceLabelTextText, { color: colors.ink }]}>₹{item.total_amount || 299}</Text>
                    </View>

                    {/* Right side status badge and chevron */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <View style={[styles.statusBadgeCapsuleContainer, { backgroundColor: statusBg }]}>
                        <Text style={[styles.statusBadgeCapsuleTextText, { color: statusColor }]}>{statusLabel}</Text>
                      </View>
                      <Icon name="chevron-right" size={11} color={colors.muted} />
                    </View>
                  </TouchableOpacity>
                );
              })
            ) : (
              <View style={styles.emptyStateContainerBlock}>
                <Icon name="calendar-times-o" size={22} color={colors.muted} />
                <Text style={[styles.emptyStateLabelTextText, { color: colors.muted }]}>No appointments booked for today.</Text>
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const createSkeletonStyles = (colors: any) =>
  StyleSheet.create({
    container: { padding: 16, gap: 16 },
    cardHero: { height: 160, borderRadius: 24, backgroundColor: colors.surface },
    cardHeader: { height: 28, width: 140, borderRadius: 8, backgroundColor: colors.surface },
    chartBlock: { height: 180, borderRadius: 22, backgroundColor: colors.surface },
    metricsRow: { flexDirection: 'row', gap: 10 },
    metricCard: { flex: 1, height: 80, borderRadius: 16, backgroundColor: colors.surface },
  });

const createStyles = (
  colors: ReturnType<typeof usePremiumTheme>['colors'],
  mode: string,
  purpleTheme: { primary: string; secondary: string; activeBg: string }
) =>
  StyleSheet.create({
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
      backgroundColor: colors.surface,
    },
    headerBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
      flex: 1,
    },
    headerBarberProfileRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    headerBarberAvatar: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: '#EAEAEA',
    },
    headerGreetingText: {
      fontSize: 16,
      fontWeight: '900',
    },
    headerGreetingSub: {
      fontSize: 11.5,
      fontWeight: '600',
      marginTop: 2,
    },
    notificationBellCircle: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.line,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    notificationRedDot: {
      position: 'absolute',
      top: 9,
      right: 10,
      width: 7,
      height: 7,
      borderRadius: 3.5,
      backgroundColor: '#EF4444',
      borderWidth: 1,
      borderColor: '#FFFFFF',
    },
    listScrollContent: {
      paddingBottom: 40,
    },
    purpleOverviewHeroCard: {
      marginHorizontal: 16,
      marginTop: 16,
      borderRadius: 24,
      padding: 20,
      ...premiumShadow,
    },
    heroOverviewTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    heroOverviewTitle: {
      color: '#FFFFFF',
      fontSize: 16.5,
      fontWeight: 'bold',
    },
    heroOverviewSub: {
      color: '#D8D7DD',
      fontSize: 12.5,
      marginTop: 4,
      fontWeight: '600',
    },
    heroOverviewSelectorDropdown: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.18)',
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 12,
    },
    heroOverviewDropdownLabel: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: 'bold',
    },
    heroOverviewMetricsGridRow: {
      flexDirection: 'row',
      marginTop: 22,
      gap: 10,
    },
    heroOverviewMetricBox: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.12)',
      borderRadius: 16,
      paddingVertical: 12,
      paddingHorizontal: 4,
    },
    heroOverviewMetricIconCircle: {
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
    },
    heroOverviewMetricCountValue: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '900',
    },
    heroOverviewMetricLabel: {
      color: '#D8D7DD',
      fontSize: 9.5,
      fontWeight: '700',
      marginTop: 4,
      textAlign: 'center',
    },
    weekOverviewHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      marginTop: 24,
      marginBottom: 12,
    },
    timePeriodCapsuleDropdown: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 14,
      ...premiumShadow,
    },
    timePeriodLabelText: {
      fontSize: 12.5,
      fontWeight: 'bold',
    },
    chartWrapperCardFrame: {
      marginHorizontal: 16,
      borderWidth: 1,
      borderRadius: 24,
      padding: 16,
      ...premiumShadow,
    },
    splineChartContainerArea: {
      position: 'relative',
      minHeight: 180,
      justifyContent: 'center',
    },
    splinePeakTooltipOverlay: {
      position: 'absolute',
      top: 30,
      left: width / 3.1,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 10,
      ...premiumShadow,
    },
    splineTooltipTextText: {
      color: '#FFFFFF',
      fontSize: 11,
      fontWeight: 'bold',
    },
    performanceMetricsRowContainer: {
      flexDirection: 'row',
      marginHorizontal: 16,
      marginTop: 14,
      gap: 8,
    },
    performanceMetricCardCell: {
      flex: 1,
      borderWidth: 1,
      borderRadius: 18,
      padding: 12,
      ...premiumShadow,
    },
    performanceMetricCellLabelText: {
      fontSize: 10.5,
      fontWeight: '700',
    },
    performanceMetricCellValueTextText: {
      fontSize: 16,
      fontWeight: '900',
      marginTop: 6,
    },
    performanceMetricCellGrowthText: {
      fontSize: 9,
      fontWeight: 'bold',
      color: '#10B981',
      marginTop: 4,
    },
    appointmentsSectionHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      marginTop: 24,
      marginBottom: 12,
    },
    viewAllBtnTextLink: {
      fontSize: 13.5,
      fontWeight: 'bold',
    },
    dateCarouselContent: {
      paddingHorizontal: 16,
      gap: 10,
    },
    datePillCircle: {
      width: 52,
      height: 64,
      borderRadius: 18,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
      ...premiumShadow,
    },
    datePillDayText: {
      fontSize: 11,
      fontWeight: '700',
    },
    datePillNumText: {
      fontSize: 16,
      fontWeight: '800',
      marginTop: 4,
    },
    appointmentsCountsCapsuleRow: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      marginVertical: 14,
      gap: 8,
    },
    countRowItemChip: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 7,
      borderRadius: 12,
      gap: 6,
    },
    countRowItemCount: {
      fontSize: 13,
      fontWeight: 'bold',
    },
    countRowItemLabelTextText: {
      fontSize: 11,
      fontWeight: '700',
    },
    todayAppointmentsLabelHeader: {
      fontSize: 14.5,
      fontWeight: '900',
      marginTop: 14,
      marginBottom: 12,
    },
    dateSectionLabelTitle: {
      fontSize: 16.5,
      fontWeight: '900',
      marginTop: 18,
      marginBottom: 12,
    },
    filterTabsWrapperRow: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      gap: 6,
      marginBottom: 14,
      flexWrap: 'wrap',
    },
    filterTabItemChip: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 12,
      borderWidth: 1,
    },
    filterTabItemLabel: {
      fontSize: 12,
      fontWeight: '600',
    },
    appointmentsListOuterCard: {
      marginHorizontal: 16,
      borderWidth: 1,
      borderRadius: 24,
      paddingHorizontal: 6,
      ...premiumShadow,
    },
    appointmentRowItemFull: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 10,
    },
    appointmentTimeTextColumn: {
      fontSize: 11.5,
      fontWeight: 'bold',
      width: 66,
    },
    customerAvatarFrameRound: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: '#EAEAEA',
      marginRight: 12,
    },
    appointmentMiddleLabelCol: {
      flex: 1,
    },
    customerProfileNameText: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    customerServiceDescText: {
      fontSize: 11.5,
      marginTop: 2,
    },
    customerPriceLabelTextText: {
      fontSize: 13.5,
      fontWeight: '900',
      marginTop: 4,
    },
    statusBadgeCapsuleContainer: {
      borderRadius: 10,
      paddingHorizontal: 8,
      paddingVertical: 4.5,
    },
    statusBadgeCapsuleTextText: {
      fontSize: 9.5,
      fontWeight: 'bold',
    },
    emptyStateContainerBlock: {
      padding: 28,
      alignItems: 'center',
    },
    emptyStateLabelTextText: {
      fontSize: 12.5,
      fontWeight: '600',
      marginTop: 10,
    },
    loaderContainer: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.15)',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
    },
    sectionTitleLabel: {
      fontSize: 16,
      fontWeight: '900',
    },
  });

export default BarberDashboard;
