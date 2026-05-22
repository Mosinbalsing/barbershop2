import React, { useMemo, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { PremiumHeader } from '../../../shared/components/PremiumScaffold';
import {
  premiumShadow,
  premiumSpacing,
  usePremiumTheme,
  zIndices,
} from '../../../shared/theme/premiumTheme';
import { useOwnerBookings } from './BookingApi';

const tabs = [
  { key: 'today', label: 'Today' },
  { key: 'future', label: 'Future' },
  { key: 'past', label: 'Past' },
];

type BookingApiItem = {
  booking_id: number;
  customer_name: string;
  mobile_no?: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  total_amount: number;
  total_duration: number;
  status: string;
  services: Array<{ name?: string } | string>;
};

type BookingCardItem = {
  id: string;
  name: string;
  service: string;
  status: string;
  time: string;
  date: string;
};

export const barberBookings: BookingApiItem[] = [];

const BookingCard = ({
  item,
  onPress,
  styles,
  premiumColors,
}: {
  item: any;
  onPress: () => void;
  styles: ReturnType<typeof createStyles>;
  premiumColors: ReturnType<typeof usePremiumTheme>['colors'];
}) => (
  <TouchableOpacity
    style={styles.bookingCard}
    activeOpacity={0.85}
    onPress={onPress}
  >
    <View style={styles.cardTop}>
      <Image
        source={require('../../../assets/images/PNG/logo-light.png')}
        style={styles.avatar}
      />
      <View style={styles.bookingInfo}>
        <Text style={styles.customerName}>{item.name}</Text>
        <Text style={styles.service}>{item.service}</Text>
      </View>
      <View
        style={[
          styles.badge,
          item.status.toLowerCase() === 'booked' && styles.badgeSuccess,
        ]}
      >
        <Text
          style={[
            styles.badgeText,
            item.status.toLowerCase() === 'booked' && styles.badgeSuccessText,
          ]}
        >
          {item.status}
        </Text>
      </View>
    </View>
    <View style={styles.metaRow}>
      <Icon name="clock-o" size={14} color={premiumColors.primary} />
      <Text style={styles.metaText}>{item.time}</Text>
      {!item.hideDate && (
        <>
          <Icon
            name="calendar-o"
            size={14}
            color={premiumColors.primary}
            style={styles.metaIcon}
          />
          <Text style={styles.metaText}>{item.date}</Text>
        </>
      )}
      <Text style={styles.idText}>{item.id}</Text>
    </View>
  </TouchableOpacity>
);

const SkeletonCard = ({
  styles,
  premiumColors,
}: {
  styles: ReturnType<typeof createStyles>;
  premiumColors: ReturnType<typeof usePremiumTheme>['colors'];
}) => (
  <View
    style={[
      styles.bookingCard,
      { opacity: 0.5, alignSelf: 'stretch', width: '100%' },
    ]}
  >
    <View style={styles.cardTop}>
      <View style={[styles.avatar, { backgroundColor: premiumColors.line }]} />
      <View style={[styles.bookingInfo, { flex: 1 }]}>
        <View
          style={{
            width: '70%',
            height: 16,
            backgroundColor: premiumColors.line,
            borderRadius: 8,
            marginBottom: 8,
            alignSelf: 'flex-start',
          }}
        />
        <View
          style={{
            width: '40%',
            height: 12,
            backgroundColor: premiumColors.line,
            borderRadius: 6,
            alignSelf: 'flex-start',
          }}
        />
      </View>
      <View
        style={[
          styles.badge,
          { backgroundColor: premiumColors.line, width: 60, height: 22 },
        ]}
      />
    </View>
    <View style={styles.metaRow}>
      <View
        style={{
          width: 60,
          height: 12,
          backgroundColor: premiumColors.line,
          borderRadius: 6,
          marginRight: 8,
        }}
      />
      <View
        style={{
          width: 60,
          height: 12,
          backgroundColor: premiumColors.line,
          borderRadius: 6,
        }}
      />
    </View>
  </View>
);

const formatServiceLabel = (services: BookingApiItem['services']) => {
  if (!services || services.length === 0) return 'No services added';

  return services
    .map(service => {
      if (typeof service === 'string') return service;
      return service?.name || '';
    })
    .filter(Boolean)
    .join(', ');
};

const mapBookings = (
  items: BookingApiItem[] | undefined | null
): BookingCardItem[] => {
  if (!items || !Array.isArray(items)) {
    return [];
  }
  return items.map(item => ({
    id: `#${item.booking_id}`,
    name: item.customer_name,
    service: formatServiceLabel(item.services),
    status: item.status,
    time: item.start_time,
    date: item.booking_date,
  }));
};

const Bookings = () => {
  const navigation = useNavigation<any>();
  const { colors: premiumColors } = usePremiumTheme();
  const styles = useMemo(() => createStyles(premiumColors), [premiumColors]);
  const [activeTab, setActiveTab] = useState('today');
  const [search, setSearch] = useState('');
  const getYesterdayIso = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    d.setHours(0, 0, 0, 0);
    return d.toISOString().slice(0, 10);
  };
  const [selectedDate, setSelectedDate] = useState<string>(getYesterdayIso());
  const [showCalendar, setShowCalendar] = useState(false);
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  const { data: bookingsData, isLoading, isFetching } = useOwnerBookings({
    type: activeTab as 'today' | 'future' | 'past',
    date: activeTab === 'past' ? selectedDate : undefined,
  });
  const displayBookings = useMemo(() => {
    const bookingsArray = Array.isArray(bookingsData) 
      ? bookingsData 
      : (bookingsData as any)?.data 
        ? (bookingsData as any).data 
        : [];
    
    const mapped = mapBookings(bookingsArray as BookingApiItem[]);

    return mapped.filter(item => {
      const query = `${item.name} ${item.service} ${item.id}`.toLowerCase();
      return query.includes(search.toLowerCase());
    });
  }, [bookingsData, search]);

  const dates = useMemo(() => {
    if (activeTab === 'today') return [];
    return Array.from(new Set(displayBookings.map(item => item.date)));
  }, [activeTab, displayBookings]);

  const showSkeleton = isLoading || isFetching;

  return (
    <View style={[styles.screen, { flex: 1 }]}>
      <PremiumHeader
        eyebrow="Schedule"
        title="Bookings"
        subtitle="Manage today's flow, future work, and completed visits."
        right={
          <View style={styles.countPill}>
            <Text style={styles.countText}>{displayBookings.length}</Text>
          </View>
        }
      />

      <View style={styles.tabs}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.tabTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'past' && (
        <View style={styles.pastDateRow}>
          <TouchableOpacity
            style={styles.pastDatePill}
            onPress={() => setShowCalendar(v => !v)}
          >
            <Icon name="calendar-o" size={14} color={premiumColors.primary} />
            <Text style={styles.pastDateText}>
              {new Date(selectedDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.searchBox}>
        <Icon name="search" size={16} color={premiumColors.muted} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search bookings"
          placeholderTextColor={premiumColors.muted}
          style={styles.searchInput}
        />
      </View>

      {(activeTab === 'future' || activeTab === 'past') && dates.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateRow}
        >
          {dates.map((date, index) => {
            const d = new Date(date);
            return (
              <View
                key={date}
                style={[styles.datePill, index === 0 && styles.dateActive]}
              >
                <Text
                  style={[
                    styles.dateMonth,
                    index === 0 && styles.dateActiveText,
                  ]}
                >
                  {d.toLocaleString('en-US', { weekday: 'short' })}
                </Text>
                <Text
                  style={[
                    styles.dateNumber,
                    index === 0 && styles.dateActiveText,
                  ]}
                >
                  {d.getDate()}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      )}

      <View style={{ flex: 1, minHeight: 300 }}>
        {showCalendar && activeTab === 'past' && (
          <Calendar
            onDayPress={day => {
              setSelectedDate(day.dateString);
              setShowCalendar(false);
            }}
            markedDates={{ [selectedDate]: { selected: true } }}
            maxDate={getYesterdayIso()}
            theme={{
              selectedDayBackgroundColor: premiumColors.primary,
              todayTextColor: premiumColors.primary,
            }}
            style={{ marginHorizontal: premiumSpacing.screen }}
          />
        )}
        {showSkeleton ? (
          <ScrollView
            contentContainerStyle={[
              styles.list,
              { flexGrow: 1, minHeight: 300 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {Array.from({
              length: activeTab === 'future' || activeTab === 'today' ? 4 : 1,
            }).map((_, idx) => (
              <SkeletonCard
                key={idx}
                styles={styles}
                premiumColors={premiumColors}
              />
            ))}
          </ScrollView>
        ) : displayBookings.length === 0 ? (
          <View
            style={[
              styles.emptyCard,
              { marginTop: 0, justifyContent: 'flex-start' },
            ]}
          >
            <Icon name="calendar-o" size={28} color={premiumColors.primary} />
            <Text style={styles.emptyTitle}>No bookings found</Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={[
              styles.list,
              { flexGrow: 1, minHeight: 300 },
            ]}
            showsVerticalScrollIndicator={true}
          >
            {displayBookings.map(item => (
              <BookingCard
                key={item.id}
                item={{ ...item, hideDate: activeTab === 'today' }}
                styles={styles}
                premiumColors={premiumColors}
                onPress={() =>
                  navigation.navigate('BookingDetails', { booking: item })
                }
              />
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const createStyles = (
  premiumColors: ReturnType<typeof usePremiumTheme>['colors'],
) =>
  StyleSheet.create({
    screen: {
      backgroundColor: premiumColors.canvas,
    },
    countPill: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: premiumColors.softSecondary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    countText: {
      color: premiumColors.secondary,
      fontWeight: '900',
      fontSize: 16,
    },
    tabs: {
      flexDirection: 'row',
      marginHorizontal: premiumSpacing.screen,
      backgroundColor: premiumColors.surface,
      borderRadius: 18,
      padding: 5,
      borderWidth: 1,
      borderColor: premiumColors.line,
    },
    tab: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 11,
      borderRadius: 14,
    },
    tabActive: { backgroundColor: premiumColors.primary },
    tabText: { color: premiumColors.muted, fontWeight: '800' },
    tabTextActive: { color: premiumColors.surface },
    searchBox: {
      flexDirection: 'row',
      alignItems: 'center',
      margin: premiumSpacing.screen,
      marginBottom: 8,
      backgroundColor: premiumColors.surface,
      borderRadius: 16,
      paddingHorizontal: 14,
      borderWidth: 1,
      borderColor: premiumColors.line,
    },
    searchInput: {
      flex: 1,
      color: premiumColors.ink,
      fontSize: 15,
      paddingVertical: 12,
      marginLeft: 8,
    },
    dateRow: {
      paddingHorizontal: premiumSpacing.screen,
      gap: 10,
      paddingVertical: 6,
    },
    pastDateRow: {
      marginHorizontal: premiumSpacing.screen,
      marginTop: 10,
      marginBottom: 8,
      alignItems: 'flex-start',
    },
    pastDatePill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 14,
      backgroundColor: premiumColors.surface,
      borderWidth: 1,
      borderColor: premiumColors.line,
    },
    pastDateText: { color: premiumColors.ink, marginLeft: 8, fontWeight: '800' },
    datePill: {
      width: 54,
      height: 54,
      borderRadius: 14,
      backgroundColor: premiumColors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: premiumColors.line,
    },
    dateActive: {
      backgroundColor: premiumColors.primary,
      borderColor: premiumColors.primary,
    },
    dateMonth: { color: premiumColors.muted, fontWeight: '800', fontSize: 12 },
    dateNumber: {
      color: premiumColors.ink,
      fontWeight: '900',
      fontSize: 18,
      marginTop: 4,
    },
    dateActiveText: { color: premiumColors.surface },
    list: {
      flexGrow: 1,
      minHeight: 300,
      display: 'flex',
      justifyContent: 'flex-start',
      padding: premiumSpacing.screen,
      paddingTop: 0,
    },
    bookingCard: {
      backgroundColor: premiumColors.surface,
      borderRadius: 20,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: premiumColors.line,
      ...premiumShadow,
    },
    cardTop: { flexDirection: 'row', alignItems: 'center' },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: premiumColors.softPrimary,
    },
    bookingInfo: { flex: 1, marginLeft: 12 },
    customerName: { color: premiumColors.ink, fontSize: 16, fontWeight: '900' },
    service: { color: premiumColors.muted, fontSize: 13, marginTop: 4 },
    badge: {
      backgroundColor: premiumColors.softPrimary,
      borderRadius: 10,
      paddingHorizontal: 9,
      paddingVertical: 5,
    },
    badgeSuccess: { backgroundColor: premiumColors.softSecondary },
    badgeText: {
      color: premiumColors.primary,
      fontSize: 11,
      fontWeight: '900',
    },
    badgeSuccessText: { color: premiumColors.secondary },
    metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 14 },
    metaIcon: { marginLeft: 14 },
    metaText: {
      color: premiumColors.muted,
      fontSize: 12,
      fontWeight: '700',
      marginLeft: 6,
    },
    idText: {
      marginLeft: 'auto',
      color: premiumColors.primary,
      fontSize: 12,
      fontWeight: '900',
    },
    emptyCard: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: premiumColors.surface,
      borderRadius: 20,
      padding: 28,
    },
    emptyTitle: {
      color: premiumColors.ink,
      fontSize: 16,
      fontWeight: '800',
      marginTop: 10,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(32,35,42,0.35)',
      justifyContent: 'flex-end',
      zIndex: zIndices.modalOverlay,
      elevation: zIndices.modalOverlay,
    },
    sheet: {
      backgroundColor: premiumColors.surface,
      borderTopLeftRadius: 26,
      borderTopRightRadius: 26,
      padding: 22,
      zIndex: zIndices.modalSheet,
      elevation: zIndices.modalSheet,
    },
    sheetHandle: {
      width: 44,
      height: 5,
      borderRadius: 3,
      backgroundColor: premiumColors.line,
      alignSelf: 'center',
      marginBottom: 18,
    },
    sheetTitle: { color: premiumColors.ink, fontSize: 20, fontWeight: '900' },
    sheetName: {
      color: premiumColors.ink,
      fontSize: 18,
      fontWeight: '900',
      marginTop: 18,
    },
    sheetSub: { color: premiumColors.muted, marginTop: 4, marginBottom: 18 },
    sheetRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: premiumColors.line,
    },
    sheetLabel: { color: premiumColors.muted, fontWeight: '700' },
    sheetValue: { color: premiumColors.ink, fontWeight: '900' },
    primaryButton: {
      backgroundColor: premiumColors.primary,
      borderRadius: 16,
      alignItems: 'center',
      paddingVertical: 14,
      marginTop: 12,
    },
    primaryButtonText: {
      color: premiumColors.surface,
      fontSize: 16,
      fontWeight: '900',
    },
  });

export default Bookings;
