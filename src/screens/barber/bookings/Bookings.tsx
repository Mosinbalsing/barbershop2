import React, { useMemo, useState, useEffect } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  SafeAreaView,
  Platform,
  TextInput,
  Alert,
  Linking,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { usePremiumTheme, premiumShadow, zIndices } from '../../../shared/theme/premiumTheme';
import { useOwnerBookings } from './BookingApi';
import { useGetServices } from '../services/ServiceApi';

type BookingItem = {
  id: string;
  name: string;
  service: string;
  price: string;
  time: string;
  date: string;
  duration: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';
  avatar: string;
  mobile: string;
  notes?: string;
  paymentMethod?: string;
  servicesList?: Array<{ name: string; price: number }>;
};

// Initial High-Fidelity Mockup Records matching screen mockups exactly
const BASELINE_MOCK_BOOKINGS: BookingItem[] = [
  {
    id: '#BK-250520-0012',
    name: 'Rahul Verma',
    service: 'Haircut & Beard Trim',
    price: '₹299',
    time: '10:00 AM',
    date: '2025-05-20',
    duration: '45 mins',
    status: 'Confirmed',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    mobile: '+91 98765 43210',
    notes: 'Customer wants a classic look.',
    paymentMethod: 'Cash',
    servicesList: [
      { name: 'Haircut', price: 199 },
      { name: 'Beard Trim', price: 100 }
    ]
  },
  {
    id: '#BK-250520-0013',
    name: 'Amit Kumar',
    service: 'Haircut',
    price: '₹149',
    time: '11:30 AM',
    date: '2025-05-20',
    duration: '30 mins',
    status: 'Confirmed',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    mobile: '+91 87654 32109',
    notes: 'Needs quick dry styling.',
    paymentMethod: 'Cash',
    servicesList: [
      { name: 'Haircut', price: 149 }
    ]
  },
  {
    id: '#BK-250520-0014',
    name: 'Vikram Singh',
    service: 'Hair Spa',
    price: '₹499',
    time: '01:00 PM',
    date: '2025-05-20',
    duration: '60 mins',
    status: 'Pending',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    mobile: '+91 76543 21098',
    notes: 'Prefer warm organic steam.',
    paymentMethod: 'UPI',
    servicesList: [
      { name: 'Hair Spa', price: 499 }
    ]
  },
  {
    id: '#BK-250520-0015',
    name: 'Rohit Sharma',
    service: 'Beard Trim',
    price: '₹149',
    time: '02:30 PM',
    date: '2025-05-20',
    duration: '30 mins',
    status: 'Confirmed',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
    mobile: '+91 65432 10987',
    notes: 'Apply tea tree balm after shave.',
    paymentMethod: 'Cash',
    servicesList: [
      { name: 'Beard Trim', price: 149 }
    ]
  },
  {
    id: '#BK-250520-0016',
    name: 'Deepak Patel',
    service: 'Haircut & Hair Wash',
    price: '₹249',
    time: '03:45 PM',
    date: '2025-05-20',
    duration: '40 mins',
    status: 'Confirmed',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    mobile: '+91 99887 76655',
    notes: 'Wash with anti-dandruff shampoo.',
    paymentMethod: 'Card',
    servicesList: [
      { name: 'Haircut', price: 149 },
      { name: 'Hair Wash', price: 100 }
    ]
  },
  {
    id: '#BK-250520-0017',
    name: 'Arjun Singh',
    service: 'Hair Spa',
    price: '₹499',
    time: '05:00 PM',
    date: '2025-05-20',
    duration: '60 mins',
    status: 'Cancelled',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
    mobile: '+91 88776 65544',
    notes: 'Requested cancellation due to health issue.',
    paymentMethod: 'Refunded',
    servicesList: [
      { name: 'Hair Spa', price: 499 }
    ]
  }
];

// Helper to format date strings to premium labels
const formatHeaderDate = (dateStr: string) => {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    
    const today = new Date();
    const isToday = d.toDateString() === today.toDateString();
    
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    const formatted = d.toLocaleDateString('en-US', options); // e.g. "May 20, 2025"

    const parts = formatted.split(' ');
    if (parts.length >= 3) {
      const day = parts[1].replace(',', '');
      const month = parts[0];
      const year = parts[2];
      const finalStr = `${day} ${month} ${year}`;
      if (isToday) return `Today, ${finalStr}`;
      return finalStr;
    }
    return dateStr;
  } catch (e) {
    return dateStr;
  }
};

const Bookings = () => {
  const { colors, mode } = usePremiumTheme();

  // Premium colors based on active theme
  const theme = useMemo(() => {
    return {
      primary: '#9167F2',
      primaryBg: '#9167F2',
      lightBg: mode === 'dark' ? '#171A22' : '#FDFBF7',
      cardBg: mode === 'dark' ? '#1E222D' : '#FFFFFF',
      divider: mode === 'dark' ? '#2C303A' : '#EAE6DF',
      textInk: colors.ink,
      textMuted: colors.muted,
      canvas: colors.canvas,
    };
  }, [colors, mode]);

  const styles = useMemo(() => createStyles(colors, mode, theme), [colors, mode, theme]);

  // View control states: 'list' | 'details' | 'add_manual'
  const [currentScreen, setCurrentScreen] = useState<'list' | 'details' | 'add_manual'>('list');

  // Navigation states
  const [activeTab, setActiveTab] = useState<'today' | 'future' | 'past'>('today');
  const [selectedDate, setSelectedDate] = useState<string>('2025-05-20');
  
  // Custom manual bookings stored in local component memory
  const [localBookings, setLocalBookings] = useState<BookingItem[]>(BASELINE_MOCK_BOOKINGS);
  const [filterStatus, setFilterStatus] = useState<'All' | 'Confirmed' | 'Pending' | 'Cancelled'>('All');
  
  // Details screen active target
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);

  // Context overlay options sheet states
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuTarget, setContextMenuTarget] = useState<BookingItem | null>(null);

  // Add Manual Booking form states
  const [formCustomerName, setFormCustomerName] = useState('');
  const [formMobileNo, setFormMobileNo] = useState('');
  const [formDate, setFormDate] = useState('2025-05-20');
  const [formTime, setFormTime] = useState('10:00 AM');
  const [formNotes, setFormNotes] = useState('');
  const [formSelectedServices, setFormSelectedServices] = useState<Array<{ name: string; price: number }>>([
    { name: 'Haircut', price: 199 },
    { name: 'Beard Trim', price: 100 }
  ]);

  // Calendar parameters
  const [calendarMonth, setCalendarMonth] = useState(4); // May (0-indexed)
  const [calendarYear, setCalendarYear] = useState(2025);
  const [calendarVisibleDate, setCalendarVisibleDate] = useState('2025-05-20');
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);
  const [showServiceCatalogModal, setShowServiceCatalogModal] = useState(false);

  // API integrations
  const { data: bookingsData, isLoading: isBookingsLoading } = useOwnerBookings({
    type: activeTab,
    date: activeTab === 'today' ? selectedDate : undefined,
  });

  const { data: servicesCatalogData } = useGetServices();

  // Unified final combined lists
  const currentFilteredBookings = useMemo(() => {
    // 1. Filter local cache items
    let list = localBookings.filter(b => {
      if (activeTab === 'today') {
        return b.date === selectedDate;
      } else if (activeTab === 'future') {
        return b.date > '2025-05-20';
      } else {
        return b.date < '2025-05-20';
      }
    });

    // 2. Map API items dynamically if available
    if (bookingsData && Array.isArray(bookingsData)) {
      const mappedApi: BookingItem[] = bookingsData.map((item: any) => ({
        id: `#BK-API-${item.booking_id || item.id}`,
        name: item.customer_name || 'Walk-in Client',
        service: item.services && item.services[0]?.name ? item.services[0].name : 'Grooming Service',
        price: `₹${item.total_amount || 150}`,
        time: item.start_time || '12:00 PM',
        date: item.booking_date || '2025-05-20',
        duration: `${item.total_duration || 30} mins`,
        status: item.status === 'success' || item.status === 'Confirmed' ? 'Confirmed' : item.status === 'Pending' ? 'Pending' : 'Cancelled',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        mobile: item.mobile_no || '+91 99999 88888',
        notes: item.notes || '',
        paymentMethod: 'Cash',
        servicesList: Array.isArray(item.services) ? item.services.map((s: any) => ({ name: s.name || s, price: s.price || 150 })) : []
      }));

      // Merge avoiding duplicates
      mappedApi.forEach(apiItem => {
        if (!list.some(b => b.id === apiItem.id)) {
          list.push(apiItem);
        }
      });
    }

    // Sort by time slots
    list.sort((a, b) => a.time.localeCompare(b.time));

    // Apply main filters (Confirmed, Pending, Cancelled)
    if (filterStatus !== 'All') {
      list = list.filter(b => b.status === filterStatus);
    }

    return list;
  }, [localBookings, activeTab, selectedDate, bookingsData, filterStatus]);

  // Group bookings for list rendering
  const groupedBookings = useMemo(() => {
    const groups: { [dateStr: string]: BookingItem[] } = {};
    currentFilteredBookings.forEach(b => {
      const header = formatHeaderDate(b.date);
      if (!groups[header]) {
        groups[header] = [];
      }
      groups[header].push(b);
    });
    return groups;
  }, [currentFilteredBookings]);

  // Tab Badge counts calculation
  const counts = useMemo(() => {
    const todayCount = localBookings.filter(b => b.date === '2025-05-20').length;
    const futureCount = localBookings.filter(b => b.date > '2025-05-20').length;
    const pastCount = localBookings.filter(b => b.date < '2025-05-20').length;
    return {
      today: todayCount,
      future: futureCount,
      past: pastCount,
    };
  }, [localBookings]);

  // Status Metrics row counters (Today tab only)
  const metrics = useMemo(() => {
    const todayList = localBookings.filter(b => b.date === '2025-05-20');
    return {
      total: todayList.length,
      confirmed: todayList.filter(b => b.status === 'Confirmed').length,
      pending: todayList.filter(b => b.status === 'Pending').length,
      cancelled: todayList.filter(b => b.status === 'Cancelled').length,
    };
  }, [localBookings]);

  // Calendar cells calculation for May 2025
  const calendarCells = useMemo(() => {
    const firstDay = new Date(calendarYear, calendarMonth, 1);
    const startDayOfWeek = firstDay.getDay(); // 0 = Sun, 1 = Mon...
    // Adjust calendar start: Monday is index 0 in the mockup view list
    const shift = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
    const totalDays = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const prevMonthTotalDays = new Date(calendarYear, calendarMonth, 0).getDate();

    const cells = [];
    // Trail days from April
    for (let i = shift - 1; i >= 0; i--) {
      const d = prevMonthTotalDays - i;
      const m = calendarMonth === 0 ? 11 : calendarMonth - 1;
      const y = calendarMonth === 0 ? calendarYear - 1 : calendarYear;
      cells.push({
        day: d,
        isActiveMonth: false,
        dateString: `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      });
    }
    // Days in active May
    for (let i = 1; i <= totalDays; i++) {
      cells.push({
        day: i,
        isActiveMonth: true,
        dateString: `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
      });
    }
    // Leading days of June
    const remaining = 42 - cells.length;
    for (let i = 1; i <= remaining; i++) {
      const m = calendarMonth === 11 ? 0 : calendarMonth + 1;
      const y = calendarMonth === 11 ? calendarYear + 1 : calendarYear;
      cells.push({
        day: i,
        isActiveMonth: false,
        dateString: `${y}-${String(m + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
      });
    }
    return cells;
  }, [calendarMonth, calendarYear]);

  // Available catalog list of services (incorporating API or elegant default catalog fallback)
  const availableServicesCatalog = useMemo(() => {
    if (servicesCatalogData && Array.isArray(servicesCatalogData)) {
      // Flattens nested services from category API response
      const list: Array<{ name: string; price: number }> = [];
      servicesCatalogData.forEach((cat: any) => {
        if (Array.isArray(cat.services)) {
          cat.services.forEach((s: any) => {
            list.push({ name: s.name, price: Number(s.price) || 150 });
          });
        }
      });
      if (list.length > 0) return list;
    }
    // Default high-fidelity premium catalog items
    return [
      { name: 'Haircut', price: 199 },
      { name: 'Beard Trim', price: 100 },
      { name: 'Hair Spa', price: 499 },
      { name: 'Hair Wash', price: 99 },
      { name: 'Shave & Facial', price: 349 },
      { name: 'Tan Removal Scrub', price: 199 },
      { name: 'Detan Mask', price: 149 }
    ];
  }, [servicesCatalogData]);

  // Form total sum value calculation
  const formTotalAmount = useMemo(() => {
    return formSelectedServices.reduce((sum, item) => sum + item.price, 0);
  }, [formSelectedServices]);

  // Click selectors and actions
  const handleAddNewManualBooking = () => {
    // Prefill form states
    setFormCustomerName('');
    setFormMobileNo('');
    setFormDate('2025-05-20');
    setFormTime('10:00 AM');
    setFormNotes('');
    setFormSelectedServices([
      { name: 'Haircut', price: 199 },
      { name: 'Beard Trim', price: 100 }
    ]);
    setCurrentScreen('add_manual');
  };

  const handleSaveManualBooking = () => {
    if (!formCustomerName.trim()) {
      Alert.alert('Details Required', 'Please input customer name.');
      return;
    }
    if (!formMobileNo.trim()) {
      Alert.alert('Details Required', 'Please input customer mobile number.');
      return;
    }

    const uniqueId = `#BK-${formDate.replace(/-/g, '').substring(2)}-${String(localBookings.length + 12).padStart(4, '0')}`;
    const mainServiceLabel = formSelectedServices.map(s => s.name).join(' & ');
    
    const newRecord: BookingItem = {
      id: uniqueId,
      name: formCustomerName,
      service: mainServiceLabel || 'Grooming service',
      price: `₹${formTotalAmount}`,
      time: formTime,
      date: formDate,
      duration: '45 mins',
      status: 'Confirmed',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      mobile: formMobileNo,
      notes: formNotes,
      paymentMethod: 'Cash',
      servicesList: formSelectedServices,
    };

    // Update screen state cache instantly
    setLocalBookings([newRecord, ...localBookings]);
    Alert.alert('Booking Saved Successfully', `Created walk-in booking ${uniqueId} for ${formCustomerName}.`);
    
    // Redirect back to list
    setCurrentScreen('list');
  };

  const handleSelectFormDate = (dateString: string) => {
    setFormDate(dateString);
    setShowDatePickerModal(false);
  };

  // Option Action triggers
  const handleOpenRowOptions = (booking: BookingItem) => {
    setContextMenuTarget(booking);
    setContextMenuVisible(true);
  };

  const handleViewOptionDetails = () => {
    if (contextMenuTarget) {
      setSelectedBooking(contextMenuTarget);
      setCurrentScreen('details');
    }
    setContextMenuVisible(false);
  };

  const handleCancelOptionBooking = () => {
    if (contextMenuTarget) {
      const updated = localBookings.map(b => {
        if (b.id === contextMenuTarget.id) {
          return { ...b, status: 'Cancelled' as const };
        }
        return b;
      });
      setLocalBookings(updated);
      Alert.alert('Booking Cancelled', `Successfully cancelled appointment ${contextMenuTarget.id}`);
    }
    setContextMenuVisible(false);
  };

  const handleRescheduleOption = () => {
    setCalendarVisibleDate(contextMenuTarget?.date || '2025-05-20');
    setShowDatePickerModal(true);
  };

  const handleApplyReschedule = (dateString: string) => {
    if (contextMenuTarget) {
      const updated = localBookings.map(b => {
        if (b.id === contextMenuTarget.id) {
          return { ...b, date: dateString, time: '11:30 AM' }; // default slot
        }
        return b;
      });
      setLocalBookings(updated);
      Alert.alert('Appointment Rescheduled', `Shifted booking ${contextMenuTarget.id} to date ${dateString}`);
    }
    setShowDatePickerModal(false);
    setContextMenuVisible(false);
  };

  const handleShareOption = () => {
    if (contextMenuTarget) {
      Alert.alert('Sharing Booking Specs', `Booking Info:\nCustomer: ${contextMenuTarget.name}\nSlot: ${contextMenuTarget.time}\nServices: ${contextMenuTarget.service}\nSum: ${contextMenuTarget.price}`);
    }
    setContextMenuVisible(false);
  };

  // Contacts picker mock selector
  const handlePickContactMock = () => {
    const randomClients = [
      { name: 'Karan Sharma', phone: '+91 94567 12345' },
      { name: 'Mohit Jain', phone: '+91 81234 56789' },
      { name: 'Sanjay Gupta', phone: '+91 78901 23456' },
      { name: 'Deepak Patel', phone: '+91 99988 77766' }
    ];
    const chosen = randomClients[Math.floor(Math.random() * randomClients.length)];
    setFormCustomerName(chosen.name);
    setFormMobileNo(chosen.phone);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ==================== 1. SCREEN VIEW: BOOKING LIST DASHBOARD ==================== */}
      {currentScreen === 'list' && (
        <View style={{ flex: 1 }}>
          {/* Header row */}
          <View style={styles.header}>
            <View style={styles.headerLeftBlock}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' }}
                style={styles.headerAvatar}
              />
              <View style={styles.headerTitles}>
                <Text style={styles.headerMainTitle}>Bookings</Text>
                <Text style={styles.headerSubTitle}>Manage all your appointments</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.headerAddBtn} onPress={handleAddNewManualBooking}>
              <Ionicons name="plus-outline" size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={styles.headerAddBtnText}>Manual Booking</Text>
            </TouchableOpacity>
          </View>

          {/* Segment selection tabs with counts */}
          <View style={styles.tabBar}>
            {[
              { key: 'today' as const, label: 'Today', badge: counts.today },
              { key: 'future' as const, label: 'Future', badge: counts.future },
              { key: 'past' as const, label: 'Past', badge: counts.past },
            ].map(tab => {
              const isActive = activeTab === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[styles.tabBtn, isActive && styles.tabBtnActive]}
                  onPress={() => setActiveTab(tab.key)}
                >
                  <Text style={[styles.tabBtnLabel, isActive && styles.tabBtnLabelActive]}>
                    {tab.label}
                  </Text>
                  <View style={[styles.tabBadge, isActive && styles.tabBadgeActive]}>
                    <Text style={[styles.tabBadgeText, isActive && styles.tabBadgeTextActive]}>
                      {tab.badge}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
            {/* Dynamic tabs render details */}
            {activeTab === 'today' ? (
              <View>
                {/* Date select row with calendar button and filter button */}
                <View style={styles.todayDateRow}>
                  <TouchableOpacity style={styles.todayDateSelectBtn} onPress={() => setShowDatePickerModal(true)}>
                    <Ionicons name="calendar-outline" size={18} color={theme.primary} style={{ marginRight: 8 }} />
                    <Text style={styles.todayDateText}>{formatHeaderDate(selectedDate)}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.filterBtnOutline} onPress={() => setShowFiltersModal(true)}>
                    <Ionicons name="funnel-outline" size={15} color={theme.primary} style={{ marginRight: 6 }} />
                    <Text style={styles.filterBtnLabel}>Filters</Text>
                  </TouchableOpacity>
                </View>

                {/* Dashboard Metrics grid row */}
                <View style={styles.metricsStrip}>
                  {[
                    { label: 'Total', count: metrics.total, icon: 'grid', color: theme.primary },
                    { label: 'Confirmed', count: metrics.confirmed, icon: 'checkmark-circle', color: '#10B981' },
                    { label: 'Pending', count: metrics.pending, icon: 'time', color: '#F59E0B' },
                    { label: 'Cancelled', count: metrics.cancelled, icon: 'close-circle', color: '#EF4444' },
                  ].map((m, idx) => (
                    <View key={idx} style={styles.metricCard}>
                      <View style={[styles.metricIconBg, { backgroundColor: m.color + '15' }]}>
                        <Ionicons name={m.icon} size={16} color={m.color} />
                      </View>
                      <Text style={styles.metricCountVal}>{m.count}</Text>
                      <Text style={styles.metricCountLabel}>{m.label}</Text>
                    </View>
                  ))}
                </View>

                {/* Section title */}
                <Text style={styles.sectionHeaderTitle}>Today's Appointments</Text>
              </View>
            ) : (
              <View>
                {/* Future/Past Date selectors */}
                <View style={styles.futureDateSection}>
                  <Text style={styles.futureDateTitle}>Select Date</Text>
                  <Text style={styles.futureDateSubTitle}>
                    {activeTab === 'future' ? 'Pick a future date' : 'Pick a past date'}
                  </Text>
                  <TouchableOpacity
                    style={styles.futureDateInputBox}
                    onPress={() => setShowDatePickerModal(true)}
                  >
                    <Text style={styles.futureDateInputText}>
                      {selectedDate ? formatHeaderDate(selectedDate) : 'Select date'}
                    </Text>
                    <Ionicons name="calendar-outline" size={18} color={theme.primary} />
                  </TouchableOpacity>
                </View>

                {/* Inline calendar grid */}
                

                {/* Section title */}
                <Text style={styles.sectionHeaderTitle}>
                  {activeTab === 'future' ? 'Upcoming Appointments' : 'Past Appointments'}
                </Text>
              </View>
            )}

            {/* List entries */}
            {currentFilteredBookings.length === 0 ? (
              <View style={styles.placeholderCard}>
                <View style={styles.placeholderCircle}>
                  <Ionicons name="calendar" size={36} color={theme.primary} />
                </View>
                <Text style={styles.placeholderLabel}>
                  {activeTab === 'future' ? 'Select a future date' : 'Select a past date'}
                </Text>
                <Text style={styles.placeholderSubLabel}>to view appointments</Text>
              </View>
            ) : (
              Object.keys(groupedBookings).map(dateHeader => (
                <View key={dateHeader} style={styles.dateGroupContainer}>
                  <Text style={styles.dateGroupHeaderTitle}>{dateHeader}</Text>
                  
                  {groupedBookings[dateHeader].map(b => (
                    <TouchableOpacity
                      key={b.id}
                      style={styles.appointmentCard}
                      activeOpacity={0.9}
                      onPress={() => {
                        setSelectedBooking(b);
                        setCurrentScreen('details');
                      }}
                    >
                      <View style={styles.appointmentTimeCol}>
                        <Text style={styles.appointmentTimeText}>{b.time}</Text>
                      </View>

                      <Image source={{ uri: b.avatar }} style={styles.appointmentAvatar} />

                      <View style={styles.appointmentInfoCol}>
                        <Text style={styles.appointmentNameText} numberOfLines={1}>{b.name}</Text>
                        <Text style={styles.appointmentServiceText} numberOfLines={1}>{b.service}</Text>
                        <Text style={styles.appointmentPriceText}>{b.price}</Text>
                      </View>

                      <View style={styles.appointmentActionCol}>
                        <View style={[
                          styles.statusPill,
                          b.status === 'Confirmed' && styles.statusPillSuccess,
                          b.status === 'Pending' && styles.statusPillPending,
                          b.status === 'Cancelled' && styles.statusPillCancelled
                        ]}>
                          <Text style={[
                            styles.statusPillLabel,
                            b.status === 'Confirmed' && styles.statusPillLabelSuccess,
                            b.status === 'Pending' && styles.statusPillLabelPending,
                            b.status === 'Cancelled' && styles.statusPillLabelCancelled
                          ]}>
                            {b.status}
                          </Text>
                        </View>

                        <TouchableOpacity
                          style={styles.cardEllipsisBtn}
                          onPress={() => handleOpenRowOptions(b)}
                        >
                          <Ionicons name="ellipsis-vertical" size={16} color={theme.textMuted} />
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              ))
            )}
          </ScrollView>

          {/* Bottom sticky action bar on Future/Past views */}
          {/* {activeTab !== 'today' && (
            <View style={styles.stickyFooterPanel}>
              <TouchableOpacity style={styles.stickyFooterBtn} onPress={handleAddNewManualBooking}>
                <Ionicons name="plus-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.stickyFooterBtnText}>Manual Booking</Text>
              </TouchableOpacity>
            </View>
          )} */}
        </View>
      )}

      {/* ==================== 2. SCREEN VIEW: ADD MANUAL BOOKING FORM ==================== */}
      {currentScreen === 'add_manual' && (
        <View style={{ flex: 1, backgroundColor: theme.lightBg }}>
          {/* Header row */}
          <View style={styles.modalSubHeader}>
            <TouchableOpacity style={styles.modalSubHeaderBackBtn} onPress={() => setCurrentScreen('list')}>
              <Ionicons name="arrow-back" size={24} color={theme.textInk} />
            </TouchableOpacity>
            <Text style={styles.modalSubHeaderTitle}>Add Manual Booking</Text>
            <View style={{ width: 44 }} />
          </View>

          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 18, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
            {/* Customer Details Block */}
            <Text style={styles.formSectionHeading}>Customer Details</Text>
            
            <View style={styles.formInputGroup}>
              <TextInput
                style={styles.formTextInput}
                placeholder="Customer Name"
                placeholderTextColor={theme.textMuted}
                value={formCustomerName}
                onChangeText={setFormCustomerName}
              />
            </View>

            <View style={styles.formInputGroup}>
              <View style={styles.phoneInputContainer}>
                <TextInput
                  style={[styles.formTextInput, { flex: 1, borderTopRightRadius: 0, borderBottomRightRadius: 0 }]}
                  placeholder="Mobile Number"
                  placeholderTextColor={theme.textMuted}
                  value={formMobileNo}
                  onChangeText={setFormMobileNo}
                  keyboardType="phone-pad"
                />
                <TouchableOpacity style={styles.phoneContactBtn} onPress={handlePickContactMock}>
                  <Ionicons name="person-add-outline" size={20} color={theme.primary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Booking Details Double column picker */}
            <Text style={styles.formSectionHeading}>Booking Details</Text>
            
            <View style={styles.doubleColPickerRow}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.colPickerLabel}>Date</Text>
                <TouchableOpacity style={styles.colPickerBox} onPress={() => setShowDatePickerModal(true)}>
                  <Text style={styles.colPickerBoxVal}>{formatHeaderDate(formDate)}</Text>
                  <Ionicons name="calendar-outline" size={16} color={theme.textMuted} />
                </TouchableOpacity>
              </View>

              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.colPickerLabel}>Time</Text>
                <TouchableOpacity style={styles.colPickerBox} onPress={() => {
                  Alert.alert('Select Slots', 'Choose a booking slot', [
                    { text: '10:00 AM', onPress: () => setFormTime('10:00 AM') },
                    { text: '11:30 AM', onPress: () => setFormTime('11:30 AM') },
                    { text: '01:00 PM', onPress: () => setFormTime('01:00 PM') },
                    { text: '02:30 PM', onPress: () => setFormTime('02:30 PM') },
                    { text: '03:45 PM', onPress: () => setFormTime('03:45 PM') },
                    { text: '05:00 PM', onPress: () => setFormTime('05:00 PM') },
                  ]);
                }}>
                  <Text style={styles.colPickerBoxVal}>{formTime}</Text>
                  <Ionicons name="time-outline" size={16} color={theme.textMuted} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Services selected lines */}
            <View style={styles.servicesHeadingRow}>
              <Text style={styles.formSectionHeading}>Services</Text>
              <TouchableOpacity onPress={() => setShowServiceCatalogModal(true)}>
                <Text style={styles.formServicesAddBtnLabel}>Add Services</Text>
              </TouchableOpacity>
            </View>

            {formSelectedServices.map((service, index) => (
              <View key={index} style={styles.selectedServiceItemRow}>
                <Text style={styles.selectedServiceNameText}>{service.name}</Text>
                <View style={styles.selectedServiceRightCol}>
                  <Text style={styles.selectedServicePriceText}>₹{service.price}</Text>
                  <TouchableOpacity
                    style={styles.selectedServiceDeleteBtn}
                    onPress={() => {
                      const updated = [...formSelectedServices];
                      updated.splice(index, 1);
                      setFormSelectedServices(updated);
                    }}
                  >
                    <Ionicons name="close-circle" size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <TouchableOpacity
              style={styles.formAddAnotherServiceLink}
              onPress={() => setShowServiceCatalogModal(true)}
            >
              <Ionicons name="plus" size={15} color={theme.primary} style={{ marginRight: 4 }} />
              <Text style={styles.formAddAnotherServiceLinkLabel}>Add Another Service</Text>
            </TouchableOpacity>

            {/* Notes Section */}
            <Text style={styles.formSectionHeading}>Notes (Optional)</Text>
            <View style={styles.formNotesInputBox}>
              <TextInput
                style={styles.formNotesTextInput}
                placeholder="Add notes or special request"
                placeholderTextColor={theme.textMuted}
                value={formNotes}
                onChangeText={setFormNotes}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          {/* Form Create Footer panel */}
          <View style={styles.formFooterPanel}>
            <View style={styles.formFooterTotalCol}>
              <Text style={styles.formFooterTotalLabel}>Total Amount</Text>
              <Text style={styles.formFooterTotalVal}>₹{formTotalAmount}</Text>
            </View>

            <TouchableOpacity style={styles.formFooterCreateBtn} onPress={handleSaveManualBooking}>
              <Text style={styles.formFooterCreateBtnText}>Create Booking</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ==================== 3. SCREEN VIEW: BOOKING DETAILS PANEL ==================== */}
      {currentScreen === 'details' && selectedBooking && (
        <View style={{ flex: 1, backgroundColor: theme.lightBg }}>
          {/* Header row */}
          <View style={styles.modalSubHeader}>
            <TouchableOpacity style={styles.modalSubHeaderBackBtn} onPress={() => setCurrentScreen('list')}>
              <Ionicons name="arrow-back" size={24} color={theme.textInk} />
            </TouchableOpacity>
            <Text style={styles.modalSubHeaderTitle}>Booking Details</Text>
            <TouchableOpacity
              style={styles.modalSubHeaderActionBtn}
              onPress={() => handleOpenRowOptions(selectedBooking)}
            >
              <Ionicons name="ellipsis-vertical" size={20} color={theme.textInk} />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 18, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
            {/* Banner card */}
            <View style={styles.detailBannerCard}>
              <Image source={{ uri: selectedBooking.avatar }} style={styles.detailBannerAvatar} />
              <Text style={styles.detailBannerName}>{selectedBooking.name}</Text>
              
              <View style={[
                styles.statusPill,
                selectedBooking.status === 'Confirmed' && styles.statusPillSuccess,
                selectedBooking.status === 'Pending' && styles.statusPillPending,
                selectedBooking.status === 'Cancelled' && styles.statusPillCancelled,
                { alignSelf: 'center', marginTop: 10 }
              ]}>
                <Text style={[
                  styles.statusPillLabel,
                  selectedBooking.status === 'Confirmed' && styles.statusPillLabelSuccess,
                  selectedBooking.status === 'Pending' && styles.statusPillLabelPending,
                  selectedBooking.status === 'Cancelled' && styles.statusPillLabelCancelled,
                  { fontSize: 13, paddingHorizontal: 12, paddingVertical: 6 }
                ]}>
                  {selectedBooking.status}
                </Text>
              </View>
            </View>

            {/* Bubble Action list */}
            <View style={styles.detailBubblesRow}>
              {[
                { label: 'Call', icon: 'phone-portrait', color: '#10B981', action: () => Linking.openURL(`tel:${selectedBooking.mobile}`) },
                { label: 'Message', icon: 'chatbox-ellipses', color: '#6366F1', action: () => Linking.openURL(`sms:${selectedBooking.mobile}`) },
                { label: 'Reschedule', icon: 'sync', color: '#F59E0B', action: () => handleRescheduleOption() },
                { label: 'Cancel', icon: 'close-circle', color: '#EF4444', action: () => {
                  Alert.alert('Cancel Appointment', 'Do you want to cancel this booking?', [
                    { text: 'No' },
                    { text: 'Yes, Cancel', onPress: () => {
                      const updated = localBookings.map(b => b.id === selectedBooking.id ? { ...b, status: 'Cancelled' as const } : b);
                      setLocalBookings(updated);
                      setSelectedBooking({ ...selectedBooking, status: 'Cancelled' });
                    }}
                  ]);
                }},
              ].map((bub, i) => (
                <TouchableOpacity key={i} style={styles.bubbleActionBtn} onPress={bub.action}>
                  <View style={[styles.bubbleCircleIcon, { backgroundColor: bub.color + '15' }]}>
                    <Ionicons name={bub.icon} size={22} color={bub.color} />
                  </View>
                  <Text style={styles.bubbleActionLabel}>{bub.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Spec details card block */}
            <View style={styles.detailSpecCard}>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Booking ID</Text>
                <Text style={styles.specValue}>{selectedBooking.id}</Text>
              </View>

              <View style={styles.specDivider} />

              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Date & Time</Text>
                <Text style={styles.specValue}>{formatHeaderDate(selectedBooking.date)} • {selectedBooking.time}</Text>
              </View>

              <View style={styles.specDivider} />

              <View style={[styles.specRow, { flexDirection: 'column', alignItems: 'flex-start' }]}>
                <Text style={[styles.specLabel, { marginBottom: 8 }]}>Services</Text>
                
                {(selectedBooking.servicesList || [
                  { name: selectedBooking.service, price: parseInt(selectedBooking.price.replace('₹', '')) || 299 }
                ]).map((srv, idx) => (
                  <View key={idx} style={styles.specBulletRow}>
                    <Text style={styles.specBulletDot}>•</Text>
                    <Text style={styles.specBulletName}>{srv.name}</Text>
                    <Text style={styles.specBulletPrice}>₹{srv.price}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.specDivider} />

              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Total Amount</Text>
                <Text style={[styles.specValue, { fontSize: 16, fontWeight: 'bold', color: theme.primary }]}>
                  {selectedBooking.price}
                </Text>
              </View>

              <View style={styles.specDivider} />

              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Payment Method</Text>
                <Text style={styles.specValue}>{selectedBooking.paymentMethod || 'Cash'}</Text>
              </View>

              {selectedBooking.notes ? (
                <>
                  <View style={styles.specDivider} />
                  <View style={[styles.specRow, { flexDirection: 'column', alignItems: 'flex-start' }]}>
                    <Text style={[styles.specLabel, { marginBottom: 6 }]}>Notes</Text>
                    <Text style={styles.specNotesText}>{selectedBooking.notes}</Text>
                  </View>
                </>
              ) : null}
            </View>
          </ScrollView>
        </View>
      )}

      {/* ==================== 4. SYSTEM OVERLAYS & MODALS ==================== */}

      {/* Ellipsis Context sheet */}
      <Modal
        visible={contextMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setContextMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.contextOverlayBackdrop}
          activeOpacity={1}
          onPress={() => setContextMenuVisible(false)}
        >
          <View style={styles.contextMenuCard}>
            <Text style={styles.contextMenuTitle}>Booking Actions</Text>

            <TouchableOpacity style={styles.contextMenuRowBtn} onPress={handleViewOptionDetails}>
              <Ionicons name="eye-outline" size={18} color={theme.textInk} style={{ marginRight: 12 }} />
              <Text style={styles.contextMenuRowLabel}>View Details</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contextMenuRowBtn} onPress={() => {
              if (contextMenuTarget) {
                setFormCustomerName(contextMenuTarget.name);
                setFormMobileNo(contextMenuTarget.mobile);
                setFormDate(contextMenuTarget.date);
                setFormTime(contextMenuTarget.time);
                setFormNotes(contextMenuTarget.notes || '');
                setFormSelectedServices(contextMenuTarget.servicesList || [{ name: contextMenuTarget.service, price: 150 }]);
                setCurrentScreen('add_manual');
              }
              setContextMenuVisible(false);
            }}>
              <Ionicons name="pencil-outline" size={18} color={theme.textInk} style={{ marginRight: 12 }} />
              <Text style={styles.contextMenuRowLabel}>Edit Booking</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contextMenuRowBtn} onPress={handleRescheduleOption}>
              <Ionicons name="time-outline" size={18} color={theme.textInk} style={{ marginRight: 12 }} />
              <Text style={styles.contextMenuRowLabel}>Reschedule</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.contextMenuRowBtn, { borderBottomWidth: 0 }]} onPress={handleCancelOptionBooking}>
              <Ionicons name="close-circle-outline" size={18} color="#EF4444" style={{ marginRight: 12 }} />
              <Text style={[styles.contextMenuRowLabel, { color: '#EF4444' }]}>Cancel Booking</Text>
            </TouchableOpacity>

            <View style={styles.contextMenuDivider} />

            <TouchableOpacity style={styles.contextMenuRowBtn} onPress={handleShareOption}>
              <Ionicons name="share-social-outline" size={18} color={theme.primary} style={{ marginRight: 12 }} />
              <Text style={[styles.contextMenuRowLabel, { color: theme.primary }]}>Share Info</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Date Picker inline calendar modal */}
      <Modal
        visible={showDatePickerModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDatePickerModal(false)}
      >
        <SafeAreaView style={styles.modalOverlaySafeArea}>
          <View style={styles.datePickerModalContent}>
            {/* Header */}
            <View style={styles.datePickerModalHeader}>
              <TouchableOpacity onPress={() => setShowDatePickerModal(false)}>
                <Ionicons name="close" size={24} color={theme.textInk} />
              </TouchableOpacity>
              <Text style={styles.datePickerModalTitle}>Select Date</Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={{ padding: 18 }}>
              {/* Selector */}
              <View style={styles.inlineCalendarMonthSwitcher}>
                <TouchableOpacity onPress={() => setCalendarMonth(m => (m === 0 ? 11 : m - 1))}>
                  <Ionicons name="chevron-back" size={18} color={theme.textInk} />
                </TouchableOpacity>
                <Text style={styles.inlineCalendarMonthLabel}>
                  {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][calendarMonth]} {calendarYear}
                </Text>
                <TouchableOpacity onPress={() => setCalendarMonth(m => (m === 11 ? 0 : m + 1))}>
                  <Ionicons name="chevron-forward" size={18} color={theme.textInk} />
                </TouchableOpacity>
              </View>

              {/* Grid */}
              <View style={styles.inlineCalendarWeekRow}>
                {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(d => (
                  <Text key={d} style={styles.inlineCalendarWeekCell}>{d}</Text>
                ))}
              </View>

              <View style={styles.inlineCalendarCellsGrid}>
                {calendarCells.map((c, i) => {
                  const isSelected = calendarVisibleDate === c.dateString;
                  return (
                    <TouchableOpacity
                      key={i}
                      style={[
                        styles.inlineCalendarDayCell,
                        isSelected && styles.inlineCalendarDayCellSelected,
                        !c.isActiveMonth && { opacity: 0.25 }
                      ]}
                      onPress={() => setCalendarVisibleDate(c.dateString)}
                    >
                      <Text style={[
                        styles.inlineCalendarDayText,
                        isSelected && styles.inlineCalendarDayTextSelected
                      ]}>
                        {c.day}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            {/* Footer buttons */}
            <View style={styles.datePickerModalFooter}>
              <TouchableOpacity
                style={styles.datePickerCancelBtn}
                onPress={() => setShowDatePickerModal(false)}
              >
                <Text style={styles.datePickerCancelBtnLabel}>Clear</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.datePickerDoneBtn}
                onPress={() => {
                  if (currentScreen === 'add_manual') {
                    handleSelectFormDate(calendarVisibleDate);
                  } else {
                    setSelectedDate(calendarVisibleDate);
                    setShowDatePickerModal(false);
                    // Also trigger apply to reschedule if target exists
                    if (contextMenuVisible && contextMenuTarget) {
                      handleApplyReschedule(calendarVisibleDate);
                    }
                  }
                }}
              >
                <Text style={styles.datePickerDoneBtnLabel}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Services selector catalog popup */}
      <Modal
        visible={showServiceCatalogModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowServiceCatalogModal(false)}
      >
        <SafeAreaView style={styles.modalOverlaySafeArea}>
          <View style={styles.servicesCatalogModalCard}>
            <View style={styles.datePickerModalHeader}>
              <TouchableOpacity onPress={() => setShowServiceCatalogModal(false)}>
                <Ionicons name="close" size={24} color={theme.textInk} />
              </TouchableOpacity>
              <Text style={styles.datePickerModalTitle}>Catalog Services</Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={{ padding: 18 }}>
              {availableServicesCatalog.map((s, idx) => {
                const isSelected = formSelectedServices.some(item => item.name === s.name);
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.catalogItemRow, isSelected && styles.catalogItemRowSelected]}
                    onPress={() => {
                      if (isSelected) {
                        setFormSelectedServices(formSelectedServices.filter(item => item.name !== s.name));
                      } else {
                        setFormSelectedServices([...formSelectedServices, s]);
                      }
                    }}
                  >
                    <View style={styles.catalogItemLeftCol}>
                      <Ionicons
                        name={isSelected ? 'checkbox' : 'square-outline'}
                        size={20}
                        color={isSelected ? theme.primary : theme.textMuted}
                        style={{ marginRight: 10 }}
                      />
                      <Text style={styles.catalogItemNameText}>{s.name}</Text>
                    </View>
                    <Text style={styles.catalogItemPriceText}>₹{s.price}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.datePickerModalFooter}>
              <TouchableOpacity
                style={[styles.datePickerDoneBtn, { flex: 1 }]}
                onPress={() => setShowServiceCatalogModal(false)}
              >
                <Text style={styles.datePickerDoneBtnLabel}>Save Selection</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Filters configuration overlay */}
      <Modal
        visible={showFiltersModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFiltersModal(false)}
      >
        <TouchableOpacity
          style={styles.contextOverlayBackdrop}
          activeOpacity={1}
          onPress={() => setShowFiltersModal(false)}
        >
          <View style={styles.filtersMenuCard}>
            <Text style={styles.filtersMenuTitle}>Filter By Status</Text>

            {['All', 'Confirmed', 'Pending', 'Cancelled'].map((status) => {
              const isSelected = filterStatus === status;
              return (
                <TouchableOpacity
                  key={status}
                  style={styles.filterMenuRowBtn}
                  onPress={() => {
                    setFilterStatus(status as any);
                    setShowFiltersModal(false);
                  }}
                >
                  <Text style={[styles.filterMenuRowLabel, isSelected && styles.filterMenuRowLabelActive]}>
                    {status}
                  </Text>
                  {isSelected && <Ionicons name="checkmark" size={18} color={theme.primary} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const createStyles = (
  colors: ReturnType<typeof usePremiumTheme>['colors'],
  mode: string,
  theme: { primary: string; lightBg: string; cardBg: string; divider: string; textInk: string; textMuted: string; canvas: string }
) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.canvas,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingTop: Platform.OS === 'android' ? 14 : 10,
      paddingBottom: 16,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.line,
    },
    headerLeftBlock: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    headerAvatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.softPrimary,
      marginRight: 12,
    },
    headerTitles: {
      justifyContent: 'center',
      flex: 1,
    },
    headerMainTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: theme.textInk,
    },
    headerSubTitle: {
      fontSize: 12,
      color: theme.textMuted,
      marginTop: 2,
    },
    headerAddBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#4F46E5', // royal violet
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 18,
      ...premiumShadow,
    },
    headerAddBtnText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: 'bold',
    },
    tabBar: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.line,
      paddingHorizontal: 8,
    },
    tabBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 14,
      position: 'relative',
    },
    tabBtnActive: {
      borderBottomWidth: 3,
      borderBottomColor: '#4F46E5',
    },
    tabBtnLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.textMuted,
    },
    tabBtnLabelActive: {
      color: '#4F46E5',
      fontWeight: 'bold',
    },
    tabBadge: {
      backgroundColor: colors.line,
      borderRadius: 10,
      paddingHorizontal: 6,
      paddingVertical: 2,
      marginLeft: 6,
      justifyContent: 'center',
      alignItems: 'center',
    },
    tabBadgeActive: {
      backgroundColor: '#4F46E5' + '20',
    },
    tabBadgeText: {
      fontSize: 10,
      fontWeight: 'bold',
      color: theme.textMuted,
    },
    tabBadgeTextActive: {
      color: '#4F46E5',
    },
    todayDateRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 12,
    },
    todayDateSelectBtn: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    todayDateText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.textInk,
    },
    filterBtnOutline: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#4F46E5',
      borderRadius: 16,
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: mode === 'dark' ? '#4F46E5' + '10' : '#FFFFFF',
    },
    filterBtnLabel: {
      fontSize: 12,
      color: '#4F46E5',
      fontWeight: 'bold',
    },
    metricsStrip: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      gap: 10,
      marginBottom: 16,
    },
    metricCard: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 12,
      alignItems: 'flex-start',
      borderWidth: 1,
      borderColor: colors.line,
      ...premiumShadow,
    },
    metricIconBg: {
      width: 28,
      height: 28,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
    },
    metricCountVal: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.textInk,
    },
    metricCountLabel: {
      fontSize: 10,
      color: theme.textMuted,
      marginTop: 2,
    },
    sectionHeaderTitle: {
      fontSize: 15,
      fontWeight: 'bold',
      color: theme.textInk,
      paddingHorizontal: 16,
      marginTop: 8,
      marginBottom: 10,
      letterSpacing: 0.3,
    },
    futureDateSection: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 10,
    },
    futureDateTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.textInk,
    },
    futureDateSubTitle: {
      fontSize: 12,
      color: theme.textMuted,
      marginTop: 2,
    },
    futureDateInputBox: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.line,
      borderRadius: 12,
      padding: 14,
      marginTop: 10,
      ...premiumShadow,
    },
    futureDateInputText: {
      fontSize: 14,
      color: theme.textInk,
      fontWeight: '500',
    },
    inlineCalendarCard: {
      backgroundColor: colors.surface,
      borderRadius: 18,
      padding: 16,
      marginHorizontal: 16,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.line,
      ...premiumShadow,
    },
    inlineCalendarMonthSwitcher: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.line,
    },
    inlineCalendarMonthLabel: {
      fontSize: 15,
      fontWeight: 'bold',
      color: theme.textInk,
    },
    inlineCalendarWeekRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 12,
      marginBottom: 6,
    },
    inlineCalendarWeekCell: {
      width: '14.28%',
      textAlign: 'center',
      fontSize: 10,
      fontWeight: 'bold',
      color: theme.textMuted,
    },
    inlineCalendarCellsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      rowGap: 8,
    },
    inlineCalendarDayCell: {
      width: '14.28%',
      aspectRatio: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    inlineCalendarDayCellSelected: {
      backgroundColor: '#4F46E5',
      borderRadius: 18,
    },
    inlineCalendarDayText: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.textInk,
    },
    inlineCalendarDayTextSelected: {
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    inlineCalendarHelperRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 12,
      justifyContent: 'center',
    },
    inlineCalendarHelperText: {
      fontSize: 11,
      color: theme.textMuted,
    },
    placeholderCard: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 50,
      marginHorizontal: 16,
      backgroundColor: colors.surface,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.line,
      ...premiumShadow,
    },
    placeholderCircle: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: '#4F46E5' + '10',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 14,
    },
    placeholderLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.textInk,
    },
    placeholderSubLabel: {
      fontSize: 12,
      color: theme.textMuted,
      marginTop: 2,
    },
    dateGroupContainer: {
      marginBottom: 16,
      paddingHorizontal: 16,
    },
    dateGroupHeaderTitle: {
      fontSize: 13,
      fontWeight: 'bold',
      color: theme.textMuted,
      marginBottom: 10,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    appointmentCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 18,
      padding: 14,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.line,
      ...premiumShadow,
    },
    appointmentTimeCol: {
      marginRight: 12,
      width: 60,
    },
    appointmentTimeText: {
      fontSize: 13,
      fontWeight: 'bold',
      color: '#4F46E5',
    },
    appointmentAvatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.softPrimary,
      marginRight: 12,
    },
    appointmentInfoCol: {
      flex: 1,
      marginRight: 8,
    },
    appointmentNameText: {
      fontSize: 15,
      fontWeight: 'bold',
      color: theme.textInk,
    },
    appointmentServiceText: {
      fontSize: 12,
      color: theme.textMuted,
      marginTop: 2,
    },
    appointmentPriceText: {
      fontSize: 13,
      fontWeight: 'bold',
      color: theme.textInk,
      marginTop: 4,
    },
    appointmentActionCol: {
      alignItems: 'flex-end',
      gap: 10,
    },
    statusPill: {
      borderRadius: 8,
      paddingHorizontal: 8,
      paddingVertical: 4,
      justifyContent: 'center',
      alignItems: 'center',
    },
    statusPillSuccess: {
      backgroundColor: '#EAFBF6',
    },
    statusPillPending: {
      backgroundColor: '#FFEED6',
    },
    statusPillCancelled: {
      backgroundColor: '#FEE2E2',
    },
    statusPillLabel: {
      fontSize: 10,
      fontWeight: 'bold',
    },
    statusPillLabelSuccess: {
      color: '#10B981',
    },
    statusPillLabelPending: {
      color: '#F59E0B',
    },
    statusPillLabelCancelled: {
      color: '#EF4444',
    },
    cardEllipsisBtn: {
      width: 24,
      height: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    stickyFooterPanel: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.line,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    stickyFooterBtn: {
      flexDirection: 'row',
      backgroundColor: '#4F46E5',
      paddingVertical: 14,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      ...premiumShadow,
    },
    stickyFooterBtnText: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: 'bold',
    },
    modalSubHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 14,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.line,
    },
    modalSubHeaderBackBtn: {
      width: 44,
      height: 44,
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    modalSubHeaderTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.textInk,
    },
    modalSubHeaderActionBtn: {
      width: 44,
      height: 44,
      justifyContent: 'center',
      alignItems: 'flex-end',
    },
    formSectionHeading: {
      fontSize: 13,
      fontWeight: 'bold',
      color: theme.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginTop: 18,
      marginBottom: 10,
    },
    formInputGroup: {
      marginBottom: 12,
    },
    formTextInput: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.line,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 14,
      color: theme.textInk,
    },
    phoneInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    phoneContactBtn: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderLeftWidth: 0,
      borderColor: colors.line,
      borderTopRightRadius: 12,
      borderBottomRightRadius: 12,
      padding: 13,
      justifyContent: 'center',
      alignItems: 'center',
    },
    doubleColPickerRow: {
      flexDirection: 'row',
      marginBottom: 12,
    },
    colPickerLabel: {
      fontSize: 12,
      color: theme.textMuted,
      marginBottom: 6,
    },
    colPickerBox: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.line,
      borderRadius: 12,
      padding: 12,
    },
    colPickerBoxVal: {
      fontSize: 13,
      color: theme.textInk,
      fontWeight: '500',
    },
    servicesHeadingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 18,
      marginBottom: 8,
    },
    formServicesAddBtnLabel: {
      fontSize: 13,
      color: '#4F46E5',
      fontWeight: 'bold',
    },
    selectedServiceItemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 12,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.line,
    },
    selectedServiceNameText: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.textInk,
    },
    selectedServiceRightCol: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    selectedServicePriceText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.textInk,
    },
    selectedServiceDeleteBtn: {
      padding: 2,
    },
    formAddAnotherServiceLink: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
    },
    formAddAnotherServiceLinkLabel: {
      fontSize: 13,
      color: '#4F46E5',
      fontWeight: 'bold',
    },
    formNotesInputBox: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.line,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    formNotesTextInput: {
      fontSize: 14,
      color: theme.textInk,
      height: 60,
    },
    formFooterPanel: {
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.line,
      paddingHorizontal: 16,
      paddingVertical: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    formFooterTotalCol: {
      justifyContent: 'center',
    },
    formFooterTotalLabel: {
      fontSize: 11,
      color: theme.textMuted,
    },
    formFooterTotalVal: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.textInk,
    },
    formFooterCreateBtn: {
      backgroundColor: '#4F46E5',
      paddingHorizontal: 28,
      paddingVertical: 14,
      borderRadius: 20,
      ...premiumShadow,
    },
    formFooterCreateBtnText: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: 'bold',
    },
    detailBannerCard: {
      backgroundColor: '#4F46E5', // royal primary color card
      borderRadius: 24,
      paddingVertical: 28,
      paddingHorizontal: 16,
      alignItems: 'center',
      marginBottom: 20,
      ...premiumShadow,
    },
    detailBannerAvatar: {
      width: 72,
      height: 72,
      borderRadius: 36,
      borderWidth: 3,
      borderColor: '#FFFFFF',
      backgroundColor: colors.softPrimary,
    },
    detailBannerName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginTop: 12,
    },
    detailBubblesRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 20,
    },
    bubbleActionBtn: {
      alignItems: 'center',
    },
    bubbleCircleIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
    },
    bubbleActionLabel: {
      fontSize: 12,
      fontWeight: 'bold',
      color: theme.textInk,
    },
    detailSpecCard: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.line,
      ...premiumShadow,
    },
    specRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 10,
    },
    specDivider: {
      height: 1,
      backgroundColor: colors.line,
      marginVertical: 4,
    },
    specLabel: {
      fontSize: 13,
      color: theme.textMuted,
      fontWeight: '500',
    },
    specValue: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.textInk,
    },
    specBulletRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 4,
      paddingLeft: 10,
      width: '100%',
    },
    specBulletDot: {
      fontSize: 14,
      color: theme.textMuted,
      marginRight: 8,
    },
    specBulletName: {
      flex: 1,
      fontSize: 13,
      color: theme.textInk,
    },
    specBulletPrice: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.textInk,
    },
    specNotesText: {
      fontSize: 13,
      color: theme.textInk,
      lineHeight: 18,
    },
    contextOverlayBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'flex-end',
    },
    contextMenuCard: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 18,
      paddingBottom: Platform.OS === 'ios' ? 36 : 18,
    },
    contextMenuTitle: {
      fontSize: 15,
      fontWeight: 'bold',
      color: theme.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 14,
      textAlign: 'center',
    },
    contextMenuRowBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.line,
    },
    contextMenuRowLabel: {
      fontSize: 15,
      color: theme.textInk,
      fontWeight: '600',
    },
    contextMenuDivider: {
      height: 1,
      backgroundColor: colors.line,
      marginVertical: 8,
    },
    filtersMenuCard: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 18,
      paddingBottom: Platform.OS === 'ios' ? 36 : 18,
    },
    filtersMenuTitle: {
      fontSize: 15,
      fontWeight: 'bold',
      color: theme.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 14,
      textAlign: 'center',
    },
    filterMenuRowBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.line,
    },
    filterMenuRowLabel: {
      fontSize: 15,
      color: theme.textInk,
      fontWeight: '600',
    },
    filterMenuRowLabelActive: {
      color: '#4F46E5',
      fontWeight: 'bold',
    },
    modalOverlaySafeArea: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    datePickerModalContent: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      maxHeight: '90%',
    },
    datePickerModalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.line,
    },
    datePickerModalTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.textInk,
    },
    datePickerModalFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 14,
      borderTopWidth: 1,
      borderTopColor: colors.line,
    },
    datePickerCancelBtn: {
      paddingVertical: 10,
      paddingHorizontal: 8,
    },
    datePickerCancelBtnLabel: {
      fontSize: 15,
      fontWeight: 'bold',
      color: '#4F46E5',
    },
    datePickerDoneBtn: {
      backgroundColor: '#4F46E5',
      borderRadius: 18,
      paddingVertical: 12,
      paddingHorizontal: 28,
      ...premiumShadow,
    },
    datePickerDoneBtnLabel: {
      fontSize: 15,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    servicesCatalogModalCard: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      maxHeight: '80%',
    },
    catalogItemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.line,
      borderRadius: 8,
    },
    catalogItemRowSelected: {
      backgroundColor: '#4F46E5' + '08',
    },
    catalogItemLeftCol: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    catalogItemNameText: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.textInk,
    },
    catalogItemPriceText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.textInk,
    },
  });

export default Bookings;
