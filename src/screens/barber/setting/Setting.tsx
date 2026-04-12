import React, { useState, useRef } from 'react';
import { Calendar } from 'react-native-calendars';
import {
  View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Animated, Platform, ToastAndroid, Appearance
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const SLOT_OPTIONS = [30, 60, 90];

const getDefaultState = () => ({
  holidays: [],
  openTime: '10:00',
  closeTime: '18:00',
  slot: 30,
  emergency: false,
  emergencyDates: [],
  emergencyMsg: 'Shop closed due to emergency',
});

const Setting = () => {
  // Theme
  const colorScheme = Appearance.getColorScheme();
  const isDark = colorScheme === 'dark';
  // State
  const [state, setState] = useState(getDefaultState());
  const [expanded, setExpanded] = useState({
    holiday: true,
    timing: true,
    slot: true,
    emergency: true,
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  // Animation refs
  const anims = {
    holiday: useRef(new Animated.Value(1)).current,
    timing: useRef(new Animated.Value(1)).current,
    slot: useRef(new Animated.Value(1)).current,
    emergency: useRef(new Animated.Value(1)).current,
  };

  // Section expand/collapse
  const toggleSection = (key) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
    Animated.timing(anims[key], {
      toValue: expanded[key] ? 0 : 1,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  // Holiday select
  const toggleHoliday = (day) => {
    setState(s => {
      const holidays = s.holidays.includes(day)
        ? s.holidays.filter(d => d !== day)
        : [...s.holidays, day];
      return { ...s, holidays };
    });
  };

  // Time picker placeholder
  const pickTime = (key) => {
    // Replace with real time picker
    const newTime = key === 'openTime' ? '09:00' : '19:00';
    setState(s => ({ ...s, [key]: newTime }));
  };

  // Slot select
  const selectSlot = (val) => setState(s => ({ ...s, slot: val }));

  // Emergency toggle
  const toggleEmergency = () => setState(s => ({ ...s, emergency: !s.emergency }));

  // Emergency date picker logic (single or range)
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMode, setCalendarMode] = useState('single'); // 'single' or 'range'
  const pickEmergencyDate = () => {
    setShowCalendar(true);
  };
  // Calendar selection logic using react-native-calendars
  const [range, setRange] = useState({});
  const handleCalendarSelect = (day) => {
    if (calendarMode === 'single') {
      setState(s => ({ ...s, emergencyDates: [day.dateString] }));
      setShowCalendar(false);
    } else {
      // Range selection logic
      if (!range.startDate || (range.startDate && range.endDate)) {
        setRange({ startDate: day.dateString, endDate: null });
      } else if (range.startDate && !range.endDate) {
        if (day.dateString > range.startDate) {
          setRange({ startDate: range.startDate, endDate: day.dateString });
          setState(s => ({ ...s, emergencyDates: [range.startDate, day.dateString] }));
          setShowCalendar(false);
        } else {
          setRange({ startDate: day.dateString, endDate: null });
        }
      }
    }
  };
  // Marked dates for range
  let markedDates = {};
  if (calendarMode === 'range' && range.startDate) {
    markedDates[range.startDate] = { startingDay: true, color: '#1976D2', textColor: '#fff' };
    if (range.endDate) {
      let start = new Date(range.startDate);
      let end = new Date(range.endDate);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const ds = d.toISOString().split('T')[0];
        markedDates[ds] = {
          color: '#90caf9',
          textColor: '#fff',
          ...(ds === range.startDate && { startingDay: true }),
          ...(ds === range.endDate && { endingDay: true }),
        };
      }
    }
  }
  const clearEmergencyDates = () => setState(s => ({ ...s, emergencyDates: [] }));

  // Reset
  const reset = () => {
    setState(getDefaultState());
    setErrors({});
    setToast('Reset to default');
  };

  // Validation
  const validate = () => {
    let err = {};
    if (state.holidays.length === 0) err.holidays = 'Select at least one day';
    if (state.closeTime <= state.openTime) err.timing = 'Invalid time range';
    return err;
  };

  // Save
  const save = () => {
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length > 0) {
      setToast('❌ Please fix errors');
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setToast('✅ Settings Saved');
    }, 1000);
  };

  // Toast auto-hide
  React.useEffect(() => {
    if (toast) {
      if (Platform.OS === 'android') ToastAndroid.show(toast, ToastAndroid.SHORT);
      setTimeout(() => setToast(''), 1500);
    }
  }, [toast]);

  // Slot preview
  const slotPreview = () => {
    const start = state.openTime;
    const end = state.closeTime;
    return `Generated Slots: ${start} – ${end}`;
  };

  // Emergency banner
  const renderEmergencyBanner = () => (
    state.emergency && (
      <View style={styles.banner}><Text style={styles.bannerText}>Shop is currently closed</Text></View>
    )
  );

  // Section card
  const Section = ({ title, icon, children, expandedKey }) => (
    <View style={styles.card}>
      <TouchableOpacity style={styles.cardHeader} onPress={() => toggleSection(expandedKey)}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name={icon} size={18} color={isDark ? '#FFD700' : '#1976D2'} style={{ marginRight: 8 }} />
          <Text style={[styles.cardTitle, isDark && { color: '#FFD700' }]}>{title}</Text>
        </View>
        <Icon name={expanded[expandedKey] ? 'chevron-up' : 'chevron-down'} size={16} color="#888" />
      </TouchableOpacity>
      <Animated.View style={{ height: expanded[expandedKey] ? 'auto' : 0, overflow: 'hidden', opacity: anims[expandedKey] }}>
        {expanded[expandedKey] && children}
      </Animated.View>
    </View>
  );

  // Main render
  return (
    <View style={[styles.container, isDark && { backgroundColor: '#181A20' }]}> 
      {renderEmergencyBanner()}
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {/* Holiday Section */}
        <Section title="Weekly Holiday" icon="calendar" expandedKey="holiday">
          <View style={styles.rowWrap}>
            {WEEK_DAYS.map(day => (
              <TouchableOpacity
                key={day}
                style={[styles.chip, state.holidays.includes(day) && styles.chipActive]}
                onPress={() => toggleHoliday(day)}
              >
                <Text style={[styles.chipText, state.holidays.includes(day) && styles.chipTextActive]}>{day}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.holidays && <Text style={styles.error}>{errors.holidays}</Text>}
        </Section>
        {/* Timing Section */}
        <Section title="Shop Timing" icon="clock-o" expandedKey="timing">
          <View style={styles.rowBetween}>
            <TouchableOpacity style={styles.timeBtn} onPress={() => pickTime('openTime')}>
              <Icon name="clock-o" size={16} color="#1976D2" />
              <Text style={styles.timeBtnText}>Open: {state.openTime}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.timeBtn} onPress={() => pickTime('closeTime')}>
              <Icon name="clock-o" size={16} color="#D11A2A" />
              <Text style={styles.timeBtnText}>Close: {state.closeTime}</Text>
            </TouchableOpacity>
          </View>
          {errors.timing && <Text style={styles.error}>{errors.timing}</Text>}
        </Section>
        {/* Slot Section */}
        <Section title="Slot Duration" icon="hourglass" expandedKey="slot">
          <View style={styles.rowWrap}>
            {SLOT_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt}
                style={[styles.chip, state.slot === opt && styles.chipActive]}
                onPress={() => selectSlot(opt)}
              >
                <Text style={[styles.chipText, state.slot === opt && styles.chipTextActive]}>{opt === 30 ? '30 min' : opt === 60 ? '1 hour' : '1.5 hour'}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.preview}>{slotPreview()}</Text>
        </Section>
        {/* Emergency Section */}
        <Section title="Emergency Holiday" icon="exclamation-triangle" expandedKey="emergency">
          <View style={styles.rowBetween}>
            <Text style={styles.label}>Emergency Holiday</Text>
            <Switch value={state.emergency} onValueChange={toggleEmergency} thumbColor={state.emergency ? '#D11A2A' : '#ccc'} trackColor={{ true: '#FFD700', false: '#ccc' }} />
          </View>
          {state.emergency && (
            <>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                <TouchableOpacity style={styles.dateBtn} onPress={() => { setCalendarMode('single'); pickEmergencyDate(); }}>
                  <Icon name="calendar" size={16} color="#1976D2" />
                  <Text style={styles.dateBtnText}>Select Date</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dateBtn} onPress={() => { setCalendarMode('range'); pickEmergencyDate(); }}>
                  <Icon name="calendar" size={16} color="#1976D2" />
                  <Text style={styles.dateBtnText}>Select Range</Text>
                </TouchableOpacity>
                {state.emergencyDates.length > 0 && (
                  <TouchableOpacity style={[styles.dateBtn, { backgroundColor: '#FFD700' }]} onPress={clearEmergencyDates}>
                    <Icon name="times" size={14} color="#23232A" />
                    <Text style={[styles.dateBtnText, { color: '#23232A' }]}>Clear</Text>
                  </TouchableOpacity>
                )}
              </View>
              {/* Show selected date/range */}
              {state.emergencyDates.length === 1 && (
                <Text style={styles.emergencyMsg}>Closed on: {state.emergencyDates[0]}</Text>
              )}
              {state.emergencyDates.length === 2 && (
                <Text style={styles.emergencyMsg}>Closed from: {state.emergencyDates[0]} to {state.emergencyDates[1]}</Text>
              )}
              <Text style={styles.emergencyMsg}>{state.emergencyMsg}</Text>
              {/* ...existing code... */}
            </>
          )}
          
        </Section>
        {/* Reset Button */}
        <TouchableOpacity style={styles.resetBtn} onPress={reset}>
          <Icon name="undo" size={16} color="#1976D2" />
          <Text style={styles.resetBtnText}>Reset to Default</Text>
        </TouchableOpacity>
      </ScrollView>
      {/* Calendar picker placeholder (root level, not clipped) */}
      {showCalendar && (
        <View style={styles.calendarModal}>
          <Text style={{ color: '#23232A', fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>Select {calendarMode === 'single' ? 'Date' : 'Range'}</Text>
          <Calendar
            markingType={calendarMode === 'range' ? 'period' : undefined}
            markedDates={calendarMode === 'range' ? markedDates : undefined}
            onDayPress={handleCalendarSelect}
            enableSwipeMonths
          />
          <TouchableOpacity style={styles.dateBtn} onPress={() => { setShowCalendar(false); setRange({}); }}>
            <Text style={styles.dateBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* Sticky Save Button */}
      <View style={styles.stickySave}>
        <TouchableOpacity style={styles.saveBtn} onPress={save} disabled={saving}>
          <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save Settings'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    calendarModal: {
            position: 'absolute',
            left: 20,
            right: 20,
            top: 60,
            backgroundColor: '#fff',
            borderRadius: 16,
            padding: 20,
            elevation: 8,
            alignItems: 'center',
            zIndex: 10,
            borderWidth: 1,
            borderColor: '#1976D2',
          },
  container: { flex: 1, backgroundColor: '#F7F7F7' },
  card: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 18, padding: 16, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: '#23232A' },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 },
  chip: { backgroundColor: '#eee', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 7, marginRight: 8, marginBottom: 8 },
  chipActive: { backgroundColor: '#1976D2' },
  chipText: { color: '#888', fontWeight: '600', fontSize: 15 },
  chipTextActive: { color: '#fff', fontWeight: 'bold' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  timeBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f4f6fa', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, marginRight: 8 },
  timeBtnText: { color: '#23232A', fontWeight: '600', fontSize: 15, marginLeft: 6 },
  label: { color: '#23232A', fontWeight: '600', fontSize: 15 },
  preview: { color: '#1976D2', fontWeight: '600', fontSize: 14, marginTop: 8 },
  error: { color: '#D11A2A', fontSize: 13, marginTop: 4 },
  stickySave: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#fff', padding: 16, borderTopWidth: 1, borderTopColor: '#eee', elevation: 8 },
  saveBtn: { backgroundColor: '#1976D2', borderRadius: 16, paddingVertical: 14, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 17 },
  resetBtn: { flexDirection: 'row', alignItems: 'center', alignSelf: 'center', marginTop: 10 },
  resetBtnText: { color: '#1976D2', fontWeight: 'bold', fontSize: 15, marginLeft: 6 },
  banner: { backgroundColor: '#D11A2A', padding: 10, alignItems: 'center' },
  bannerText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  dateBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f4f6fa', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, marginTop: 10, marginBottom: 6 },
  dateBtnText: { color: '#1976D2', fontWeight: '600', fontSize: 15, marginLeft: 6 },
  emergencyMsg: { color: '#D11A2A', fontWeight: 'bold', fontSize: 15, marginTop: 8 },
});

export default Setting;
