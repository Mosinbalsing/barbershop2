import React, { useState, useEffect, useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Switch,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
  FlatList,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { usePremiumTheme, premiumShadow } from '../../../shared/theme/premiumTheme';
import { useGetSettings, usePostSettings } from '../setting/SettingApi';

type SettingRow = {
  id: string;
  label: string;
  value: string;
  icon: string;
  route?: string;
  isSwitch?: boolean;
};

const getDateRange = (startDate: string, endDate: string) => {
  if (!startDate || !endDate) return [];
  const dates = [];
  const current = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  while (current <= end) {
    dates.push(current.toISOString().slice(0, 10));
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

const timeOptions = Array.from({ length: 48 }, (_, index) => {
  const hour24 = Math.floor(index / 2);
  const minute = index % 2 === 0 ? '00' : '30';
  const period = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 % 12 || 12;
  return `${hour12.toString().padStart(2, '0')}:${minute} ${period}`;
});

const BarberShopSettings = () => {
  const { colors, mode } = usePremiumTheme();
  const navigation = useNavigation<any>();

  const purpleTheme = {
    primary: '#6D4CF3',
    activeBg: mode === 'dark' ? 'rgba(109, 76, 243, 0.25)' : 'rgba(109, 76, 243, 0.12)',
  };

  // Local configurations fetched from backend
  const [openingTime, setOpeningTime] = useState('09:00 AM');
  const [closingTime, setClosingTime] = useState('08:00 PM');
  const [weeklyHoliday, setWeeklyHoliday] = useState('Sun');
  const [slotDuration, setSlotDuration] = useState(30);
  const [lunchStartTime, setLunchStartTime] = useState('01:00 PM');
  const [lunchEndTime, setLunchEndTime] = useState('02:00 PM');

  // Emergency holiday configurations
  const [holidayMode, setHolidayMode] = useState(false);
  const [holidayStartDate, setHolidayStartDate] = useState('');
  const [holidayEndDate, setHolidayEndDate] = useState('');
  const [holidayReason, setHolidayReason] = useState('Emergency Holiday');

  // Modal Open states
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [slotModalOpen, setSlotModalOpen] = useState(false);
  const [breakModalOpen, setBreakModalOpen] = useState(false);

  // Temporary picker states
  const [tempStartDate, setTempStartDate] = useState('');
  const [tempEndDate, setTempEndDate] = useState('');
  const [tempReason, setTempReason] = useState('Emergency Holiday');
  const [tempLunchStart, setTempLunchStart] = useState('01:00 PM');
  const [tempLunchEnd, setTempLunchEnd] = useState('02:00 PM');

  // API loading overlay states
  const [isLoadingState, setIsLoadingState] = useState(false);

  // Query settings from server
  const { data: settingsResponse, isLoading, refetch } = useGetSettings();
  const { mutate: postSettings } = usePostSettings();

  useEffect(() => {
    if (settingsResponse) {
      const dataPayload = settingsResponse.data || settingsResponse;
      const s = dataPayload?.setting || dataPayload;
      if (s) {
        if (s.opening_time) setOpeningTime(s.opening_time);
        if (s.closing_time) setClosingTime(s.closing_time);
        if (s.week_holiday || s.weekly_holiday) setWeeklyHoliday(s.week_holiday || s.weekly_holiday);
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

  // Refetch settings on refocus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refetch();
    });
    return unsubscribe;
  }, [navigation]);

  // General save payload utility
  const saveSettingsPayload = (updatedFields: Partial<{
    openingTime: string;
    closingTime: string;
    weeklyHoliday: string;
    slotDuration: number;
    lunchStartTime: string;
    lunchEndTime: string;
    holidayMode: boolean;
    holidayStartDate: string | null;
    holidayEndDate: string | null;
    holidayReason: string | null;
  }>) => {
    const payload = {
      setting: {
        opening_time: (updatedFields.openingTime !== undefined ? updatedFields.openingTime : openingTime).trim(),
        closing_time: (updatedFields.closingTime !== undefined ? updatedFields.closingTime : closingTime).trim(),
        week_holiday: updatedFields.weeklyHoliday !== undefined ? updatedFields.weeklyHoliday : weeklyHoliday,
        slot_duration: updatedFields.slotDuration !== undefined ? updatedFields.slotDuration : slotDuration,
        lunch_start_time: (updatedFields.lunchStartTime !== undefined ? updatedFields.lunchStartTime : lunchStartTime).trim(),
        lunch_end_time: (updatedFields.lunchEndTime !== undefined ? updatedFields.lunchEndTime : lunchEndTime).trim(),
      },
      emergency_holiday: {
        enabled: updatedFields.holidayMode !== undefined ? updatedFields.holidayMode : holidayMode,
        start_date: updatedFields.holidayMode !== undefined 
          ? (updatedFields.holidayMode ? updatedFields.holidayStartDate : null)
          : (holidayMode ? holidayStartDate : null),
        end_date: updatedFields.holidayMode !== undefined 
          ? (updatedFields.holidayMode ? updatedFields.holidayEndDate : null)
          : (holidayMode ? holidayEndDate : null),
        reason: updatedFields.holidayMode !== undefined 
          ? (updatedFields.holidayMode ? (updatedFields.holidayReason || holidayReason) : null)
          : (holidayMode ? holidayReason : null),
      },
    };

    setIsLoadingState(true);
    postSettings(payload, {
      onSuccess: () => {
        refetch();
        Alert.alert('Success', 'Shop settings saved successfully!');
      },
      onError: (err: any) => {
        Alert.alert('Error', err.message || 'Failed to save settings');
      },
      onSettled: () => {
        setIsLoadingState(false);
      }
    });
  };

  const selectDate = (dateString: string) => {
    if (!tempStartDate || (tempStartDate && tempEndDate)) {
      setTempStartDate(dateString);
      setTempEndDate('');
    } else if (dateString < tempStartDate) {
      setTempStartDate(dateString);
      setTempEndDate('');
    } else {
      setTempEndDate(dateString);
    }
  };

  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};
    getDateRange(tempStartDate, tempEndDate).forEach((date, index, range) => {
      marks[date] = {
        color: purpleTheme.primary,
        textColor: '#FFFFFF',
        startingDay: index === 0,
        endingDay: index === range.length - 1,
      };
    });

    if (tempStartDate && !marks[tempStartDate]) {
      marks[tempStartDate] = {
        startingDay: true,
        endingDay: true,
        color: purpleTheme.primary,
        textColor: '#FFFFFF',
      };
    }
    return marks;
  }, [tempEndDate, tempStartDate]);

  const handleHolidayToggle = (val: boolean) => {
    if (val) {
      // Prompt selection dates
      setTempStartDate(holidayStartDate || '');
      setTempEndDate(holidayEndDate || '');
      setTempReason(holidayReason || 'Emergency Holiday');
      setCalendarOpen(true);
    } else {
      // Direct disable
      saveSettingsPayload({
        holidayMode: false,
        holidayStartDate: null,
        holidayEndDate: null,
        holidayReason: null,
      });
    }
  };

  const confirmHolidaySelection = () => {
    if (!tempStartDate || !tempEndDate) {
      Alert.alert('Selection Required', 'Please select both start date and end date from the calendar.');
      return;
    }
    setCalendarOpen(false);
    saveSettingsPayload({
      holidayMode: true,
      holidayStartDate: tempStartDate,
      holidayEndDate: tempEndDate,
      holidayReason: tempReason,
    });
  };

  const settingsItems: SettingRow[] = [
    {
      id: '1',
      label: 'Shop Timing',
      value: `${openingTime} - ${closingTime}`,
      icon: 'clock-o',
      route: 'BarberShopTimingEdit',
    },
    {
      id: '2',
      label: 'Slot Duration',
      value: `${slotDuration} Min`,
      icon: 'hourglass-half',
    },
    {
      id: '3',
      label: 'Break Time',
      value: `${lunchStartTime} - ${lunchEndTime}`,
      icon: 'coffee',
    },
    {
      id: '4',
      label: 'Holiday Mode',
      value: holidayMode ? `Enabled (${holidayStartDate} to ${holidayEndDate})` : 'Manage holidays',
      icon: 'plane',
      isSwitch: true,
    },
    {
      id: '5',
      label: 'Advance Booking',
      value: 'Allowed slots: 30 days',
      icon: 'calendar-o',
    },
  ];

  const handleRowPress = (row: SettingRow) => {
    if (row.isSwitch) return;
    if (row.id === '2') {
      // Slot selection modal
      setSlotModalOpen(true);
    } else if (row.id === '3') {
      // Break time modal
      setTempLunchStart(lunchStartTime || '01:00 PM');
      setTempLunchEnd(lunchEndTime || '02:00 PM');
      setBreakModalOpen(true);
    } else if (row.route) {
      navigation.navigate(row.route);
    } else {
      Alert.alert(row.label, `Configure ${row.label} value.`);
    }
  };

  const selectSlotValue = (val: number) => {
    setSlotModalOpen(false);
    saveSettingsPayload({ slotDuration: val });
  };

  const confirmBreakSelection = () => {
    setBreakModalOpen(false);
    saveSettingsPayload({
      lunchStartTime: tempLunchStart,
      lunchEndTime: tempLunchEnd,
    });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.canvas }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.line }]}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={18} color={colors.ink} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.ink }]}>Shop Settings</Text>

        <View style={{ width: 36 }} />
      </View>

      {/* Settings list scroll */}
      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.line }]}>
          {settingsItems.map((item, index) => {
            const isLast = index === settingsItems.length - 1;
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.rowItem,
                  { borderBottomColor: colors.line },
                  !isLast && { borderBottomWidth: 1 }
                ]}
                activeOpacity={item.isSwitch ? 1 : 0.85}
                onPress={() => handleRowPress(item)}
              >
                {/* Left Icon */}
                <View style={[styles.iconBox, { backgroundColor: purpleTheme.activeBg }]}>
                  <Icon name={item.icon} size={15} color={purpleTheme.primary} />
                </View>

                {/* Copy Labels */}
                <View style={styles.copyCol}>
                  <Text style={[styles.rowLabel, { color: colors.ink }]}>{item.label}</Text>
                  <Text style={[styles.rowValue, { color: colors.muted }]}>{item.value}</Text>
                </View>

                {/* Right Action */}
                {item.isSwitch ? (
                  <Switch
                    value={holidayMode}
                    onValueChange={handleHolidayToggle}
                    thumbColor="#FFFFFF"
                    trackColor={{ false: colors.line, true: purpleTheme.primary }}
                  />
                ) : (
                  <Icon name="chevron-right" size={12} color={colors.muted} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Calendar picker sheet modal */}
      <Modal
        visible={calendarOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setCalendarOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalSheet, { backgroundColor: colors.surface }]}>
            <View style={styles.sheetHeader}>
              <Text style={[styles.sheetTitle, { color: colors.ink }]}>Emergency Holiday Dates</Text>
              <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: colors.canvas }]}
                onPress={() => setCalendarOpen(false)}
              >
                <Icon name="close" size={16} color={colors.ink} />
              </TouchableOpacity>
            </View>

            <TextInput
              value={tempReason}
              onChangeText={setTempReason}
              placeholder="Holiday Reason"
              placeholderTextColor={colors.muted}
              style={[styles.modalInput, { backgroundColor: colors.canvas, color: colors.ink, borderColor: colors.line }]}
            />

            <Calendar
              markingType="period"
              markedDates={markedDates}
              onDayPress={day => selectDate(day.dateString)}
              theme={{
                todayTextColor: purpleTheme.primary,
                selectedDayBackgroundColor: purpleTheme.primary,
                arrowColor: purpleTheme.primary,
                textDayFontWeight: '700',
                textMonthFontWeight: '900',
                calendarBackground: colors.surface,
                dayTextColor: colors.ink,
                monthTextColor: colors.ink,
              }}
            />

            <Text style={[styles.calendarHint, { color: colors.muted }]}>
              {tempStartDate ? `Selected Start: ${tempStartDate}` : 'Select start date from calendar'}
              {tempEndDate ? `\nSelected End: ${tempEndDate}` : '\nSelect end date from calendar'}
            </Text>

            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: purpleTheme.primary }]}
              onPress={confirmHolidaySelection}
            >
              <Text style={styles.submitBtnText}>Confirm Holiday</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Slot selection bottom modal */}
      <Modal
        visible={slotModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setSlotModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalSheet, { backgroundColor: colors.surface }]}>
            <View style={styles.sheetHeader}>
              <Text style={[styles.sheetTitle, { color: colors.ink }]}>Select Slot Duration</Text>
              <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: colors.canvas }]}
                onPress={() => setSlotModalOpen(false)}
              >
                <Icon name="close" size={16} color={colors.ink} />
              </TouchableOpacity>
            </View>

            <View style={styles.slotOptionsWrapper}>
              {([15, 30, 45, 60, 90, 120] as const).map(option => {
                const isSelected = slotDuration === option;
                return (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.slotOptionItem,
                      { borderColor: colors.line },
                      isSelected && { backgroundColor: purpleTheme.primary }
                    ]}
                    onPress={() => selectSlotValue(option)}
                  >
                    <Text style={[
                      styles.slotOptionText,
                      { color: isSelected ? '#FFFFFF' : colors.ink }
                    ]}>
                      {option} Minutes
                    </Text>
                    {isSelected && <Icon name="check" size={14} color="#FFFFFF" />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>

      {/* Break Time bottom modal */}
      <Modal
        visible={breakModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setBreakModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalSheet, { backgroundColor: colors.surface }]}>
            <View style={styles.sheetHeader}>
              <Text style={[styles.sheetTitle, { color: colors.ink }]}>Select Break Time</Text>
              <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: colors.canvas }]}
                onPress={() => setBreakModalOpen(false)}
              >
                <Icon name="close" size={16} color={colors.ink} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 300 }}>
              <Text style={[styles.modalLabel, { color: colors.muted }]}>Break Start Time</Text>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={timeOptions}
                keyExtractor={item => `start_${item}`}
                contentContainerStyle={{ gap: 8, paddingBottom: 12 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.timeChip,
                      { backgroundColor: colors.canvas, borderColor: colors.line },
                      tempLunchStart === item && { backgroundColor: purpleTheme.primary }
                    ]}
                    onPress={() => setTempLunchStart(item)}
                  >
                    <Text style={[styles.timeChipText, { color: tempLunchStart === item ? '#FFFFFF' : colors.ink }]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />

              <View style={{ height: 12 }} />

              <Text style={[styles.modalLabel, { color: colors.muted }]}>Break End Time</Text>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={timeOptions}
                keyExtractor={item => `end_${item}`}
                contentContainerStyle={{ gap: 8, paddingBottom: 16 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.timeChip,
                      { backgroundColor: colors.canvas, borderColor: colors.line },
                      tempLunchEnd === item && { backgroundColor: purpleTheme.primary }
                    ]}
                    onPress={() => setTempLunchEnd(item)}
                  >
                    <Text style={[styles.timeChipText, { color: tempLunchEnd === item ? '#FFFFFF' : colors.ink }]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </ScrollView>

            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: purpleTheme.primary }]}
              onPress={confirmBreakSelection}
            >
              <Text style={styles.submitBtnText}>Save Break Time</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Loading Overlay */}
      {(isLoading || isLoadingState) && (
        <View style={styles.loaderContainer}>
          <View style={[styles.loaderBox, { backgroundColor: colors.surface }]}>
            <ActivityIndicator size="large" color={purpleTheme.primary} />
            <Text style={[styles.loaderText, { color: colors.ink }]}>Updating Settings...</Text>
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
    borderRadius: 24,
    paddingHorizontal: 8,
    ...premiumShadow,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  copyCol: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  rowValue: {
    fontSize: 12.5,
    marginTop: 4,
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
  modalInput: {
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 14,
  },
  calendarHint: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  submitBtn: {
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    ...premiumShadow,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  slotOptionsWrapper: {
    gap: 8,
  },
  slotOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  slotOptionText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  timeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  timeChipText: {
    fontSize: 13,
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

export default BarberShopSettings;
