import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Alert,
  Modal,
  FlatList,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { usePremiumTheme, premiumShadow } from '../../../shared/theme/premiumTheme';
import { useGetSettings, usePostSettings } from '../setting/SettingApi';

const timeOptions = Array.from({ length: 48 }, (_, index) => {
  const hour24 = Math.floor(index / 2);
  const minute = index % 2 === 0 ? '00' : '30';
  const period = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 % 12 || 12;
  return `${hour12.toString().padStart(2, '0')}:${minute} ${period}`;
});

const BarberShopTimingEdit = () => {
  const { colors, mode } = usePremiumTheme();
  const navigation = useNavigation<any>();

  const purpleTheme = {
    primary: '#6D4CF3',
    activeBg: mode === 'dark' ? '#3A281E' : '#F5F1ED',
  };

  const [openTime, setOpenTime] = useState('09:00 AM');
  const [closeTime, setCloseTime] = useState('08:00 PM');
  
  // Selection of open days
  const [openDays, setOpenDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
  const daysList = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Other fetched settings to avoid overwriting them
  const [weeklyHoliday, setWeeklyHoliday] = useState('Sun');
  const [slotDuration, setSlotDuration] = useState(30);
  const [lunchStartTime, setLunchStartTime] = useState('01:00 PM');
  const [lunchEndTime, setLunchEndTime] = useState('02:00 PM');
  const [holidayMode, setHolidayMode] = useState(false);
  const [holidayStartDate, setHolidayStartDate] = useState('');
  const [holidayEndDate, setHolidayEndDate] = useState('');
  const [holidayReason, setHolidayReason] = useState('');

  // Dropdown Picker State
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [activeTimeField, setActiveTimeField] = useState<'open' | 'close'>('open');

  // Loading States
  const [isLoadingState, setIsLoadingState] = useState(false);

  // APIs hooks
  const { data: settingsResponse, isLoading } = useGetSettings();
  const { mutate: postSettings } = usePostSettings();

  useEffect(() => {
    if (settingsResponse) {
      const dataPayload = settingsResponse.data || settingsResponse;
      const s = dataPayload?.setting || dataPayload;
      if (s) {
        if (s.opening_time) setOpenTime(s.opening_time);
        if (s.closing_time) setCloseTime(s.closing_time);
        if (s.week_holiday || s.weekly_holiday) {
          const hol = s.week_holiday || s.weekly_holiday;
          setWeeklyHoliday(hol);
          setOpenDays(daysList.filter(d => d !== hol));
        }
        if (s.slot_duration) setSlotDuration(Number(s.slot_duration));
        if (s.lunch_start_time) setLunchStartTime(s.lunch_start_time);
        if (s.lunch_end_time) setLunchEndTime(s.lunch_end_time);
      }
      
      const e = dataPayload?.emergency_holiday;
      if (e) {
        setHolidayMode(!!e.enabled);
        if (e.reason) setHolidayReason(e.reason);
        if (e.start_date) setHolidayStartDate(e.start_date);
        if (e.end_date) setHolidayEndDate(e.end_date);
      }
    }
  }, [settingsResponse]);

  const toggleDay = (day: string) => {
    if (openDays.includes(day)) {
      setOpenDays(openDays.filter(d => d !== day));
    } else {
      setOpenDays([...openDays, day]);
    }
  };

  const handleOpenDropdown = (field: 'open' | 'close') => {
    setActiveTimeField(field);
    setTimePickerOpen(true);
  };

  const handleSaveChanges = () => {
    if (openDays.length === 0) {
      Alert.alert('Empty Workdays', 'Please select at least one open day.');
      return;
    }

    // Find first day that is not in openDays to declare as weekly holiday
    const computedHoliday = daysList.find(day => !openDays.includes(day)) || 'Sun';

    const payload = {
      setting: {
        opening_time: openTime.trim(),
        closing_time: closeTime.trim(),
        week_holiday: computedHoliday,
        slot_duration: slotDuration,
        lunch_start_time: lunchStartTime.trim(),
        lunch_end_time: lunchEndTime.trim(),
      },
      emergency_holiday: {
        enabled: holidayMode,
        start_date: holidayMode ? holidayStartDate : null,
        end_date: holidayMode ? holidayEndDate : null,
        reason: holidayMode ? holidayReason.trim() : null,
      },
    };

    setIsLoadingState(true);
    postSettings(payload, {
      onSuccess: () => {
        Alert.alert('Success', 'Shop timing configurations saved successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      },
      onError: (err: any) => {
        Alert.alert('Error', err.message || 'Failed to save shop timings.');
      },
      onSettled: () => {
        setIsLoadingState(false);
      }
    });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.canvas }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.line }]}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={18} color={colors.ink} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.ink }]}>Shop Timing</Text>

        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {/* Timing Dropdowns Card */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.line }]}>
          {/* Open Time Dropdown Row */}
          <Text style={[styles.label, { color: colors.muted }]}>Open Time</Text>
          <TouchableOpacity 
            style={[styles.dropdownSelector, { backgroundColor: colors.canvas, borderColor: colors.line }]}
            onPress={() => handleOpenDropdown('open')}
          >
            <Text style={[styles.dropdownValueText, { color: colors.ink }]}>{openTime}</Text>
            <Icon name="chevron-down" size={12} color={colors.ink} />
          </TouchableOpacity>

          <View style={{ height: 16 }} />

          {/* Close Time Dropdown Row */}
          <Text style={[styles.label, { color: colors.muted }]}>Close Time</Text>
          <TouchableOpacity 
            style={[styles.dropdownSelector, { backgroundColor: colors.canvas, borderColor: colors.line }]}
            onPress={() => handleOpenDropdown('close')}
          >
            <Text style={[styles.dropdownValueText, { color: colors.ink }]}>{closeTime}</Text>
            <Icon name="chevron-down" size={12} color={colors.ink} />
          </TouchableOpacity>
        </View>

        {/* Weekdays Bubble Selector Card */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.line }]}>
          <Text style={[styles.cardTitle, { color: colors.ink }]}>Open Days</Text>
          <Text style={[styles.cardSubtitle, { color: colors.muted }]}>Select the days shop is operational</Text>

          <View style={styles.dayGrid}>
            {daysList.map(day => {
              const isSelected = openDays.includes(day);
              return (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayChipCircle,
                    isSelected ? { backgroundColor: purpleTheme.primary } : { backgroundColor: colors.canvas, borderColor: colors.line, borderWidth: 1 }
                  ]}
                  onPress={() => toggleDay(day)}
                >
                  <Text style={[
                    styles.dayChipText,
                    isSelected ? { color: '#FFFFFF' } : { color: colors.muted }
                  ]}>
                    {day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Save CTA */}
        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: purpleTheme.primary }]}
          onPress={handleSaveChanges}
        >
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Dropdown Time Picker Modal */}
      <Modal
        visible={timePickerOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setTimePickerOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalSheet, { backgroundColor: colors.surface }]}>
            <View style={styles.sheetHeader}>
              <Text style={[styles.sheetTitle, { color: colors.ink }]}>
                Select {activeTimeField === 'open' ? 'Open Time' : 'Close Time'}
              </Text>
              <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: colors.canvas }]}
                onPress={() => setTimePickerOpen(false)}
              >
                <Icon name="close" size={16} color={colors.ink} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={timeOptions}
              keyExtractor={item => item}
              style={{ maxHeight: 300 }}
              renderItem={({ item }) => {
                const isSelected = activeTimeField === 'open' ? openTime === item : closeTime === item;
                return (
                  <TouchableOpacity
                    style={[
                      styles.slotOptionItem,
                      { borderColor: colors.line },
                      isSelected && { backgroundColor: purpleTheme.primary }
                    ]}
                    onPress={() => {
                      if (activeTimeField === 'open') {
                        setOpenTime(item);
                      } else {
                        setCloseTime(item);
                      }
                      setTimePickerOpen(false);
                    }}
                  >
                    <Text style={[
                      styles.slotOptionText,
                      { color: isSelected ? '#FFFFFF' : colors.ink }
                    ]}>
                      {item}
                    </Text>
                    {isSelected && <Icon name="check" size={14} color="#FFFFFF" />}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>

      {/* Loading Overlay */}
      {(isLoading || isLoadingState) && (
        <View style={styles.loaderContainer}>
          <View style={[styles.loaderBox, { backgroundColor: colors.surface }]}>
            <ActivityIndicator size="large" color={purpleTheme.primary} />
            <Text style={[styles.loaderText, { color: colors.ink }]}>Saving Changes...</Text>
          </View>
        </View>
      )}
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
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 16,
    marginBottom: 16,
    ...premiumShadow,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 11.5,
    marginTop: 4,
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  dropdownSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 14,
    height: 44,
    paddingHorizontal: 14,
  },
  dropdownValueText: {
    fontSize: 14,
    fontWeight: '600',
  },
  dayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayChipCircle: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 46,
  },
  dayChipText: {
    fontSize: 12.5,
    fontWeight: 'bold',
  },
  saveBtn: {
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    ...premiumShadow,
    marginTop: 8,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(32,35,42,0.42)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 44 : 24,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  slotOptionText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  loaderBox: {
    padding: 24,
    borderRadius: 18,
    alignItems: 'center',
    gap: 12,
    elevation: 4,
  },
  loaderText: {
    fontSize: 13,
    fontWeight: '700',
  },
});

export default BarberShopTimingEdit;
