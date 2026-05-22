import React, { useMemo } from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LineChart } from 'react-native-gifted-charts';
import { PremiumHeader } from '../../../shared/components/PremiumScaffold';
import {
  premiumShadow,
  premiumSpacing,
  usePremiumTheme,
} from '../../../shared/theme/premiumTheme';
import { useGetBarberDashboard, useGetDashboardByDate } from './BarberDashboardApi';

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

const statusLabel = (status?: string) => {
  const normalized = (status || '').toLowerCase();
  if (normalized === 'booked') return 'Booked';
  if (normalized === 'confirmed') return 'Confirmed';
  if (normalized === 'completed') return 'Completed';
  if (normalized === 'cancelled' || normalized === 'canceled')
    return 'Cancelled';
  if (!status) return 'Pending';
  return status[0].toUpperCase() + status.slice(1);
};

const formatServiceLabel = (services: DashboardAppointment['services']) => {
  if (!services || services.length === 0) return 'No services added';

  return services
    .map(service => {
      if (typeof service === 'string') return service;
      return service?.name || '';
    })
    .filter(Boolean)
    .join(', ');
};

const DashboardSkeleton = ({
  colors,
}: {
  colors: ReturnType<typeof usePremiumTheme>['colors'];
}) => {
  const styles = createStyles(colors);

  return (
    <ScrollView
      contentContainerStyle={styles.skeletonWrap}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.skeletonHeroCard}>
        <View style={styles.skeletonHeroTop}>
          <View style={styles.skeletonHeroCopy}>
            <View style={styles.skeletonLineShort} />
            <View style={styles.skeletonLineBig} />
            <View style={styles.skeletonLineTiny} />
          </View>
          <View style={styles.skeletonAvatar} />
        </View>

        <View style={styles.skeletonChartHeaderRow}>
          <View style={styles.skeletonLineMedium} />
          <View style={styles.skeletonLineShorter} />
        </View>
        <View style={styles.skeletonChart} />
      </View>

      <View style={styles.skeletonCalendarRow}>
        {Array.from({ length: 7 }).map((_, index) => (
          <View key={index} style={styles.skeletonDatePill} />
        ))}
      </View>

      <View style={styles.skeletonSectionHeader}>
        <View style={styles.skeletonLineMedium} />
        <View style={styles.skeletonLineShorter} />
      </View>

      <View style={styles.skeletonListCard}>
        {Array.from({ length: 3 }).map((_, index) => (
          <View key={index} style={styles.skeletonAppointmentRow}>
            <View style={styles.skeletonAvatarSmall} />
            <View style={styles.skeletonAppointmentCopy}>
              <View style={styles.skeletonLineMedium} />
              <View style={styles.skeletonLineTiny} />
            </View>
            <View style={styles.skeletonBadge} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const BarberDashboard = () => {
  const navigation = useNavigation<any>();
  const { colors: premiumColors } = usePremiumTheme();
  const styles = useMemo(() => createStyles(premiumColors), [premiumColors]);
  const [selectedDate, setSelectedDate] = React.useState<string | undefined>();
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const { data: dashboardData, isLoading } = useGetBarberDashboard();
  const { data: dateSpecificData, isLoading: isLoadingDateData } = useGetDashboardByDate(selectedDate);
  
  // Ensure data has correct structure before using
  const dashboard = useMemo(() => {
    if (selectedDate && dateSpecificData) {
      return dateSpecificData as BarberDashboardResponse | undefined;
    }
    return dashboardData as BarberDashboardResponse | undefined;
  }, [selectedDate, dateSpecificData, dashboardData]);
  const chartData = useMemo(
    () =>
      (dashboard?.week_data ?? []).map(item => ({
        value: item.booking_count,
        label: item.day,
      })),
    [dashboard?.week_data],
  );
  const appointments = dashboard?.appointments ?? [];
  const displayName = dashboard?.first_name || 'there';

  return (
    <View style={styles.screen}>
      <PremiumHeader
        eyebrow="Barber admin"
        title={`${greeting}, ${displayName}`}
        subtitle="Your shop summary is powered by live dashboard data."
        right={
          <TouchableOpacity
            style={styles.headerAction}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Icon name="bell-o" size={18} color={premiumColors.primary} />
          </TouchableOpacity>
        }
      />

      {isLoading ? (
        <DashboardSkeleton colors={premiumColors} />
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroCard}>
            <View style={styles.heroTop}>
              <View>
                <Text style={styles.heroLabel}>Total Bookings</Text>
                <Text style={styles.heroValue}>
                  {dashboard?.total_bookings ?? 0}
                </Text>
                <Text style={styles.heroDetail}>
                  {dashboard?.total_week_bookings ?? 0} this week
                </Text>
              </View>
              <View style={styles.avatarCluster}>
                <Image
                  source={require('../../../assets/images/PNG/logo-light.png')}
                  style={styles.avatar}
                />
                <View style={styles.smallBubble}>
                  <Icon
                    name="calendar-check-o"
                    size={15}
                    color={premiumColors.secondary}
                  />
                </View>
              </View>
            </View>

            <View style={styles.chartHeaderRow}>
              <Text style={styles.chartTitle}>This Week Customers</Text>
              <Text style={styles.chartSubTitle}>
                {dashboard?.total_week_bookings ?? 0} bookings
              </Text>
            </View>
            <View style={styles.chartWrap}>
              {chartData.length > 0 ? (
                <LineChart
                  data={chartData}
                  areaChart
                  curved
                  color={premiumColors.primary}
                  startFillColor={premiumColors.primary}
                  endFillColor={premiumColors.primary}
                  startOpacity={0.22}
                  endOpacity={0.04}
                  thickness={3}
                  yAxisColor="transparent"
                  xAxisColor={premiumColors.line}
                  rulesColor={premiumColors.line}
                  rulesType="solid"
                  yAxisTextStyle={{ color: premiumColors.muted, fontSize: 10 }}
                  xAxisLabelTextStyle={{
                    color: premiumColors.muted,
                    fontSize: 10,
                  }}
                  hideDataPoints={false}
                  dataPointsColor={premiumColors.secondary}
                  dataPointsRadius={4}
                  noOfSections={4}
                  maxValue={
                    Math.max(...chartData.map(item => item.value), 1) + 5
                  }
                  spacing={32}
                  initialSpacing={8}
                  endSpacing={8}
                  hideOrigin
                />
              ) : (
                <View style={styles.chartEmptyState}>
                  <Icon
                    name="line-chart"
                    size={24}
                    color={premiumColors.muted}
                  />
                  <Text style={styles.chartEmptyText}>No weekly data yet</Text>
                </View>
              )}
            </View>
          </View>

          <FlatList
            data={dashboard?.week_data ?? []}
            horizontal
            keyExtractor={item => item.date}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.calendarRow}
            renderItem={({ item }) => {
              const holiday =
                item.is_weekly_holiday || item.is_emergency_holiday;
              const isSelected = selectedDate === item.date;

              return (
                <TouchableOpacity
                  onPress={() => setSelectedDate(item.date)}
                  style={[
                    styles.datePill,
                    item.booking_count > 0 && styles.datePillActive,
                    holiday && styles.datePillHoliday,
                    isSelected && styles.datePillSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.dateDay,
                      item.booking_count > 0 && styles.dateActiveText,
                      holiday && styles.dateHolidayText,
                      isSelected && styles.dateSelectedText,
                    ]}
                  >
                    {item.day}
                  </Text>

                  <Text
                    style={[
                      styles.dateNum,
                      item.booking_count > 0 && styles.dateActiveText,
                      holiday && styles.dateHolidayText,
                      isSelected && styles.dateSelectedText,
                    ]}
                  >
                    {new Date(item.date).getDate()}
                  </Text>

                  {/* <Text
          style={[
            styles.dateCount,
            item.booking_count > 0 && styles.dateCountActive,
          ]}
        >
          {item.booking_count}
        </Text> */}
                </TouchableOpacity>
              );
            }}
          />

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Appointment</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Bookings')}>
              <Text style={styles.sectionAction}>View all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.listCard}>
            {appointments.length > 0 ? (
              appointments.map((item, index) => (
                <TouchableOpacity
                  key={item.booking_id}
                  style={[
                    styles.appointmentRow,
                    index === appointments.length - 1 && styles.lastRow,
                  ]}
                >
                  <Image
                    source={require('../../../assets/images/PNG/logo-light.png')}
                    style={styles.customerAvatar}
                  />
                  <View style={styles.appointmentText}>
                    <Text style={styles.customerName}>
                      {item.customer_name}
                    </Text>
                    <Text style={styles.customerService}>
                      {formatServiceLabel(item.services)}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      item.status.toLowerCase() === 'completed' &&
                        styles.statusSuccess,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        item.status.toLowerCase() === 'completed' &&
                          styles.statusSuccessText,
                      ]}
                    >
                      {statusLabel(item.status)}
                    </Text>
                  </View>
                  <Text style={styles.time}>{item.start_time}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Icon
                  name="calendar-o"
                  size={24}
                  color={premiumColors.primary}
                />
                <Text style={styles.emptyTitle}>No appointments found</Text>
                <Text style={styles.emptySubtitle}>
                  The dashboard API returned no appointments yet.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const createStyles = (
  premiumColors: ReturnType<typeof usePremiumTheme>['colors'],
) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: premiumColors.canvas,
    },
    content: {
      paddingHorizontal: premiumSpacing.screen,
      paddingBottom: 112,
    },
    skeletonWrap: {
      paddingHorizontal: premiumSpacing.screen,
      paddingBottom: 112,
    },
    skeletonHeroCard: {
      backgroundColor: premiumColors.surface,
      borderRadius: 24,
      padding: 18,
      borderWidth: 1,
      borderColor: premiumColors.line,
      ...premiumShadow,
    },
    skeletonHeroTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    skeletonHeroCopy: {
      flex: 1,
      marginRight: 16,
    },
    skeletonAvatar: {
      width: 58,
      height: 58,
      borderRadius: 29,
      backgroundColor: premiumColors.line,
    },
    skeletonLineShort: {
      width: '42%',
      height: 14,
      borderRadius: 7,
      backgroundColor: premiumColors.line,
      marginBottom: 10,
    },
    skeletonLineBig: {
      width: '48%',
      height: 32,
      borderRadius: 12,
      backgroundColor: premiumColors.line,
      marginBottom: 8,
    },
    skeletonLineTiny: {
      width: '34%',
      height: 12,
      borderRadius: 6,
      backgroundColor: premiumColors.line,
    },
    skeletonChartHeaderRow: {
      marginTop: 18,
      marginBottom: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    skeletonLineMedium: {
      width: '36%',
      height: 16,
      borderRadius: 8,
      backgroundColor: premiumColors.line,
    },
    skeletonLineShorter: {
      width: '20%',
      height: 12,
      borderRadius: 6,
      backgroundColor: premiumColors.line,
    },
    skeletonChart: {
      height: 180,
      borderRadius: 16,
      backgroundColor: premiumColors.canvas,
    },
    skeletonCalendarRow: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 18,
    },
    skeletonDatePill: {
      width: 54,
      height: 70,
      borderRadius: 18,
      backgroundColor: premiumColors.surface,
      borderWidth: 1,
      borderColor: premiumColors.line,
    },
    skeletonSectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 24,
      marginBottom: 12,
    },
    skeletonListCard: {
      backgroundColor: premiumColors.surface,
      borderRadius: 22,
      paddingHorizontal: 14,
      borderWidth: 1,
      borderColor: premiumColors.line,
    },
    skeletonAppointmentRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: premiumColors.line,
    },
    skeletonAvatarSmall: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: premiumColors.line,
    },
    skeletonAppointmentCopy: {
      flex: 1,
      marginLeft: 12,
    },
    skeletonBadge: {
      width: 60,
      height: 22,
      borderRadius: 10,
      backgroundColor: premiumColors.line,
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
    chartHeaderRow: {
      marginTop: 2,
      marginBottom: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    chartTitle: {
      color: premiumColors.ink,
      fontSize: 15,
      fontWeight: '800',
    },
    chartSubTitle: {
      color: premiumColors.muted,
      fontSize: 12,
      fontWeight: '700',
    },
    chartWrap: {
      borderRadius: 16,
      paddingVertical: 8,
      paddingRight: 8,
      paddingLeft: 2,
      backgroundColor: premiumColors.canvas,
      minHeight: 180,
      justifyContent: 'center',
    },
    chartEmptyState: {
      minHeight: 180,
      alignItems: 'center',
      justifyContent: 'center',
    },
    chartEmptyText: {
      color: premiumColors.muted,
      fontSize: 12,
      fontWeight: '700',
      marginTop: 8,
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
    datePillHoliday: {
      backgroundColor: premiumColors.canvas,
      borderStyle: 'dashed',
    },
    datePillSelected: {
      borderWidth: 2,
      borderColor: premiumColors.secondary,
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
    dateCount: {
      color: premiumColors.muted,
      fontSize: 11,
      fontWeight: '700',
      marginTop: 4,
    },
    dateCountActive: {
      color: premiumColors.secondary,
    },
    dateActiveText: {
      color: premiumColors.surface,
    },
    dateHolidayText: {
      color: premiumColors.primary,
    },
    dateSelectedText: {
      color: premiumColors.secondary,
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
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 28,
    },
    emptyTitle: {
      color: premiumColors.ink,
      fontSize: 16,
      fontWeight: '800',
      marginTop: 10,
    },
    emptySubtitle: {
      color: premiumColors.muted,
      fontSize: 12,
      marginTop: 4,
      textAlign: 'center',
    },
  });

export default BarberDashboard;
