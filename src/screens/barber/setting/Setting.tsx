import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { PremiumHeader } from '../../../shared/components/PremiumScaffold';
import { premiumColors, premiumShadow, premiumSpacing } from '../../../shared/theme/premiumTheme';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const slots = [30, 45, 60];

const Setting = () => {
  const [holiday, setHoliday] = useState('Sun');
  const [slot, setSlot] = useState(30);
  const [emergency, setEmergency] = useState(false);

  return (
    <View style={styles.screen}>
      <PremiumHeader eyebrow="Shop control" title="Settings" subtitle="Tune availability, slots, and daily operations." />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.banner}>
          <View>
            <Text style={styles.bannerLabel}>Working hours</Text>
            <Text style={styles.bannerValue}>09:00 AM - 07:00 PM</Text>
          </View>
          <Icon name="clock-o" size={28} color={premiumColors.secondary} />
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Weekly Holiday</Text>
            <Icon name="calendar-o" size={18} color={premiumColors.primary} />
          </View>
          <View style={styles.wrap}>
            {days.map(day => (
              <TouchableOpacity key={day} style={[styles.chip, holiday === day && styles.chipActive]} onPress={() => setHoliday(day)}>
                <Text style={[styles.chipText, holiday === day && styles.chipTextActive]}>{day}</Text>
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
              <TouchableOpacity key={item} style={[styles.chip, slot === item && styles.chipActive]} onPress={() => setSlot(item)}>
                <Text style={[styles.chipText, slot === item && styles.chipTextActive]}>{item} min</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.helper}>Generated slots will follow your active working hours.</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.switchRow}>
            <View>
              <Text style={styles.cardTitle}>Emergency Holiday</Text>
              <Text style={styles.helper}>Pause new bookings instantly.</Text>
            </View>
            <Switch
              value={emergency}
              onValueChange={setEmergency}
              thumbColor={premiumColors.surface}
              trackColor={{ false: premiumColors.line, true: premiumColors.secondary }}
            />
          </View>
          {emergency ? (
            <View style={styles.emergencyBox}>
              <Text style={styles.emergencyText}>Shop is marked unavailable until you turn this off.</Text>
            </View>
          ) : null}
        </View>

        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Settings</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: premiumColors.canvas },
  content: { padding: premiumSpacing.screen, paddingTop: 0, paddingBottom: 112 },
  banner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: premiumColors.ink, borderRadius: 22, padding: 18, marginBottom: 14 },
  bannerLabel: { color: '#D8D7DD', fontSize: 13, fontWeight: '700' },
  bannerValue: { color: premiumColors.surface, fontSize: 20, fontWeight: '900', marginTop: 6 },
  card: { backgroundColor: premiumColors.surface, borderRadius: 20, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: premiumColors.line, ...premiumShadow },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  cardTitle: { color: premiumColors.ink, fontSize: 18, fontWeight: '900' },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { minWidth: 54, alignItems: 'center', backgroundColor: premiumColors.canvas, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: premiumColors.line },
  chipActive: { backgroundColor: premiumColors.primary, borderColor: premiumColors.primary },
  chipText: { color: premiumColors.muted, fontSize: 13, fontWeight: '900' },
  chipTextActive: { color: premiumColors.surface },
  helper: { color: premiumColors.muted, fontSize: 13, marginTop: 12, lineHeight: 18 },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  emergencyBox: { backgroundColor: premiumColors.softPrimary, borderRadius: 14, padding: 12, marginTop: 14 },
  emergencyText: { color: premiumColors.primary, fontWeight: '800', lineHeight: 19 },
  saveButton: { backgroundColor: premiumColors.primary, borderRadius: 18, alignItems: 'center', paddingVertical: 15, marginTop: 4 },
  saveButtonText: { color: premiumColors.surface, fontSize: 16, fontWeight: '900' },
});

export default Setting;
