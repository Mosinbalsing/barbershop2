import React, { useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/FontAwesome';
import { PremiumHeader } from '../../../shared/components/PremiumScaffold';
import {
  premiumShadow,
  premiumSpacing,
  usePremiumTheme,
} from '../../../shared/theme/premiumTheme';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const slots = [30, 45, 60];
const customMinuteOptions = [10, 15, 20, 25, 35, 40, 50, 55, 75, 90, 120];

const timeOptions = Array.from({ length: 48 }, (_, index) => {
  const hour24 = Math.floor(index / 2);
  const minute = index % 2 === 0 ? '00' : '30';
  const period = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 % 12 || 12;

  return `${hour12.toString().padStart(2, '0')}:${minute} ${period}`;
});

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

const Setting = () => {
  const { colors: premiumColors } = usePremiumTheme();
  const styles = useMemo(() => createStyles(premiumColors), [premiumColors]);
  const [openingTime, setOpeningTime] = useState('09:00 AM');
  const [closingTime, setClosingTime] = useState('07:00 PM');
  const [holiday, setHoliday] = useState('Sun');
  const [slot, setSlot] = useState(30);
  const [customSlot, setCustomSlot] = useState<number | null>(null);
  const [emergency, setEmergency] = useState(false);
  const [holidayReason, setHolidayReason] = useState('Emergency holiday');
  const [holidayStartDate, setHolidayStartDate] = useState('');
  const [holidayEndDate, setHolidayEndDate] = useState('');
  const [activeDateField, setActiveDateField] = useState<'start' | 'end'>(
    'start',
  );
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [payloadPreview, setPayloadPreview] = useState('');

  const activeSlot = customSlot || slot;

  const markedDates = useMemo(() => {
    const marks: Record<string, object> = {};

    getDateRange(holidayStartDate, holidayEndDate).forEach(
      (date, index, range) => {
        marks[date] = {
          color: premiumColors.primary,
          textColor: premiumColors.surface,
          startingDay: index === 0,
          endingDay: index === range.length - 1,
        };
      },
    );

    if (holidayStartDate && !marks[holidayStartDate]) {
      marks[holidayStartDate] = {
        startingDay: true,
        endingDay: true,
        color: premiumColors.primary,
        textColor: premiumColors.surface,
      };
    }

    return marks;
  }, [holidayEndDate, holidayStartDate, premiumColors]);

  const openCalendar = (field: 'start' | 'end') => {
    setActiveDateField(field);
    setCalendarOpen(true);
  };

  const selectDate = (dateString: string) => {
    if (activeDateField === 'start') {
      setHolidayStartDate(dateString);
      if (holidayEndDate && dateString > holidayEndDate) {
        setHolidayEndDate('');
      }
      setActiveDateField('end');
      return;
    }

    if (holidayStartDate && dateString < holidayStartDate) {
      setHolidayStartDate(dateString);
      setHolidayEndDate('');
      setActiveDateField('end');
      return;
    }

    setHolidayEndDate(dateString);
    setCalendarOpen(false);
  };

  const saveSettings = () => {
    if (!openingTime.trim() || !closingTime.trim()) {
      Alert.alert('Missing time', 'Please enter opening and closing time.');
      return;
    }

    if (!activeSlot || activeSlot <= 0) {
      Alert.alert('Invalid slot', 'Please enter a valid slot duration.');
      return;
    }

    if (emergency && (!holidayStartDate || !holidayEndDate)) {
      Alert.alert('Holiday dates', 'Please select start date and end date.');
      return;
    }

    const payload = {
      working_hours: {
        opening_time: openingTime.trim(),
        closing_time: closingTime.trim(),
      },
      weekly_holiday: holiday,
      slot_duration_minutes: activeSlot,
      emergency_holiday: {
        enabled: emergency,
        start_date: emergency ? holidayStartDate : null,
        end_date: emergency ? holidayEndDate : null,
        reason: emergency ? holidayReason.trim() : null,
      },
    };

    const jsonPayload = JSON.stringify(payload, null, 2);
    setPayloadPreview(jsonPayload);
    console.log('settings payload', payload);
    Alert.alert('JSON generated', 'Settings payload is ready to send backend.');
  };

  return (
    <View style={styles.screen}>
      <PremiumHeader
        eyebrow="Shop control"
        title="Settings"
        subtitle="Tune availability, slots, and daily operations."
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.banner}>
          <View style={styles.bannerTextBlock}>
            <Text style={styles.bannerLabel}>Working hours</Text>
            <Text style={styles.bannerValue}>
              {openingTime || '--'} - {closingTime || '--'}
            </Text>
          </View>
          <Icon name="clock-o" size={28} color={premiumColors.secondary} />
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Working Hours</Text>
            <Icon name="pencil" size={17} color={premiumColors.primary} />
          </View>
          <Text style={styles.label}>Start Time</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.selectorTrack}
          >
            {timeOptions.map(time => (
              <TouchableOpacity
                key={`start-${time}`}
                style={[
                  styles.selectorChip,
                  openingTime === time && styles.selectorChipActive,
                ]}
                onPress={() => setOpeningTime(time)}
              >
                <Text
                  style={[
                    styles.selectorText,
                    openingTime === time && styles.selectorTextActive,
                  ]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.label}>End Time</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.selectorTrack}
          >
            {timeOptions.map(time => (
              <TouchableOpacity
                key={`end-${time}`}
                style={[
                  styles.selectorChip,
                  closingTime === time && styles.selectorChipActive,
                ]}
                onPress={() => setClosingTime(time)}
              >
                <Text
                  style={[
                    styles.selectorText,
                    closingTime === time && styles.selectorTextActive,
                  ]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Weekly Holiday</Text>
            <Icon name="calendar-o" size={18} color={premiumColors.primary} />
          </View>
          <View style={styles.wrap}>
            {days.map(day => (
              <TouchableOpacity
                key={day}
                style={[styles.chip, holiday === day && styles.chipActive]}
                onPress={() => setHoliday(day)}
              >
                <Text
                  style={[
                    styles.chipText,
                    holiday === day && styles.chipTextActive,
                  ]}
                >
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Slot Duration</Text>
            <Icon name="hourglass-o" size={18} color={premiumColors.primary} />
          </View>
          <View style={styles.wrap}>
            {slots.map(item => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.chip,
                  customSlot === null && slot === item && styles.chipActive,
                ]}
                onPress={() => {
                  setSlot(item);
                  setCustomSlot(null);
                }}
              >
                <Text
                  style={[
                    styles.chipText,
                    customSlot === null &&
                      slot === item &&
                      styles.chipTextActive,
                  ]}
                >
                  {item} min
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.label}>Custom Minutes</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.selectorTrack}
          >
            {customMinuteOptions.map(minutes => (
              <TouchableOpacity
                key={minutes}
                style={[
                  styles.selectorChip,
                  customSlot === minutes && styles.selectorChipActive,
                ]}
                onPress={() => setCustomSlot(minutes)}
              >
                <Text
                  style={[
                    styles.selectorText,
                    customSlot === minutes && styles.selectorTextActive,
                  ]}
                >
                  {minutes} min
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Text style={styles.helper}>
            Generated slots will follow your active working hours.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.switchRow}>
            <View style={styles.switchTextBlock}>
              <Text style={styles.cardTitle}>Emergency Holiday</Text>
              <Text style={styles.helper}>
                Pause new bookings for a selected date range.
              </Text>
            </View>
            <Switch
              value={emergency}
              onValueChange={setEmergency}
              thumbColor={premiumColors.surface}
              trackColor={{
                false: premiumColors.line,
                true: premiumColors.secondary,
              }}
            />
          </View>
          {emergency ? (
            <View style={styles.emergencyBox}>
              <Text style={styles.label}>Reason</Text>
              <TextInput
                value={holidayReason}
                onChangeText={setHolidayReason}
                placeholder="Reason"
                placeholderTextColor={premiumColors.muted}
                style={styles.input}
              />
              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => openCalendar('start')}
                >
                  <Text style={styles.dateLabel}>Start Date</Text>
                  <Text style={styles.dateValue}>
                    {holidayStartDate || 'Select date'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => openCalendar('end')}
                >
                  <Text style={styles.dateLabel}>End Date</Text>
                  <Text style={styles.dateValue}>
                    {holidayEndDate || 'Select date'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
          <Text style={styles.saveButtonText}>Save Settings</Text>
        </TouchableOpacity>

        {payloadPreview ? (
          <View style={styles.previewCard}>
            <Text style={styles.previewTitle}>Backend JSON</Text>
            <Text style={styles.previewText}>{payloadPreview}</Text>
          </View>
        ) : null}
      </ScrollView>

      <Modal
        visible={calendarOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setCalendarOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.calendarSheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>
                Select {activeDateField === 'start' ? 'Start Date' : 'End Date'}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setCalendarOpen(false)}
              >
                <Icon name="close" size={18} color={premiumColors.ink} />
              </TouchableOpacity>
            </View>
            <Calendar
              markingType="period"
              markedDates={markedDates}
              onDayPress={day => selectDate(day.dateString)}
              theme={{
                todayTextColor: premiumColors.primary,
                selectedDayBackgroundColor: premiumColors.primary,
                arrowColor: premiumColors.primary,
                textDayFontWeight: '700',
                textMonthFontWeight: '900',
              }}
            />
            <Text style={styles.calendarHint}>
              Tap start date first, then tap end date.
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const createStyles = (premiumColors: ReturnType<typeof usePremiumTheme>['colors']) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: premiumColors.canvas },
  content: { padding: premiumSpacing.screen, paddingTop: 0, paddingBottom: 92 },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: premiumColors.ink,
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
  },
  bannerTextBlock: { flex: 1, paddingRight: 12 },
  bannerLabel: { color: '#D8D7DD', fontSize: 13, fontWeight: '700' },
  bannerValue: {
    color: premiumColors.surface,
    fontSize: 20,
    fontWeight: '900',
    marginTop: 6,
  },
  card: {
    backgroundColor: premiumColors.surface,
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: premiumColors.line,
    ...premiumShadow,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  cardTitle: { color: premiumColors.ink, fontSize: 18, fontWeight: '900' },
  row: { flexDirection: 'row', gap: 10 },
  fieldHalf: { flex: 1 },
  label: {
    color: premiumColors.ink,
    fontSize: 13,
    fontWeight: '900',
    marginBottom: 8,
    marginTop: 4,
  },
  input: {
    backgroundColor: premiumColors.canvas,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: premiumColors.line,
    color: premiumColors.ink,
    paddingHorizontal: 13,
    paddingVertical: 11,
    marginBottom: 10,
  },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  selectorTrack: {
    gap: 8,
    paddingBottom: 10,
  },
  selectorChip: {
    minWidth: 86,
    alignItems: 'center',
    backgroundColor: premiumColors.canvas,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: premiumColors.line,
  },
  selectorChipActive: {
    backgroundColor: premiumColors.primary,
    borderColor: premiumColors.primary,
  },
  selectorText: {
    color: premiumColors.muted,
    fontSize: 13,
    fontWeight: '900',
  },
  selectorTextActive: { color: premiumColors.surface },
  chip: {
    minWidth: 54,
    alignItems: 'center',
    backgroundColor: premiumColors.canvas,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: premiumColors.line,
  },
  chipActive: {
    backgroundColor: premiumColors.primary,
    borderColor: premiumColors.primary,
  },
  chipText: { color: premiumColors.muted, fontSize: 13, fontWeight: '900' },
  chipTextActive: { color: premiumColors.surface },
  helper: {
    color: premiumColors.muted,
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  switchTextBlock: { flex: 1 },
  emergencyBox: {
    backgroundColor: premiumColors.softPrimary,
    borderRadius: 14,
    padding: 12,
    marginTop: 14,
  },
  dateButton: {
    flex: 1,
    backgroundColor: premiumColors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: premiumColors.line,
    padding: 12,
  },
  dateLabel: {
    color: premiumColors.muted,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 6,
  },
  dateValue: { color: premiumColors.ink, fontSize: 13, fontWeight: '900' },
  saveButton: {
    backgroundColor: premiumColors.primary,
    borderRadius: 18,
    alignItems: 'center',
    paddingVertical: 15,
    marginTop: 4,
  },
  saveButtonText: {
    color: premiumColors.surface,
    fontSize: 16,
    fontWeight: '900',
  },
  previewCard: {
    backgroundColor: premiumColors.ink,
    borderRadius: 18,
    padding: 14,
    marginTop: 14,
  },
  previewTitle: {
    color: premiumColors.secondary,
    fontSize: 13,
    fontWeight: '900',
    marginBottom: 8,
  },
  previewText: { color: premiumColors.surface, fontSize: 12, lineHeight: 18 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(32,35,42,0.42)',
    justifyContent: 'flex-end',
  },
  calendarSheet: {
    backgroundColor: premiumColors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sheetTitle: { color: premiumColors.ink, fontSize: 18, fontWeight: '900' },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: premiumColors.canvas,
  },
  calendarHint: {
    color: premiumColors.muted,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default Setting;
