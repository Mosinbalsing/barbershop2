import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { MetricCard, PremiumHeader } from '../../shared/components/PremiumScaffold';
import { premiumColors, premiumShadow, premiumSpacing } from '../../shared/theme/premiumTheme';

const AdminDashboard = () => {
  return (
    <View style={styles.screen}>
      <PremiumHeader eyebrow="Admin panel" title="Dashboard" subtitle="Bookings, customers, and barber performance at a glance." />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.metrics}>
          <MetricCard label="Total Booking" value="2K" detail="+8% this week" />
          <MetricCard label="Customers" value="896" detail="Active users" tone="secondary" />
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Today's Schedule</Text>
          <Text style={styles.bigValue}>6</Text>
          <Text style={styles.detail}>Appointments booked for active barbers.</Text>
          <View style={styles.progressTrack}><View style={styles.progressFill} /></View>
        </View>
        <View style={styles.metrics}>
          <MetricCard label="Retention" value="12%" detail="Past 90 days" />
          <MetricCard label="Productivity" value="45%" detail="Past 90 days" tone="secondary" />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: premiumColors.canvas },
  content: { padding: premiumSpacing.screen, paddingTop: 0, paddingBottom: 112 },
  metrics: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  card: { backgroundColor: premiumColors.surface, borderRadius: 22, padding: 18, marginBottom: 14, borderWidth: 1, borderColor: premiumColors.line, ...premiumShadow },
  cardTitle: { color: premiumColors.ink, fontSize: 18, fontWeight: '900' },
  bigValue: { color: premiumColors.ink, fontSize: 42, fontWeight: '900', marginTop: 12 },
  detail: { color: premiumColors.muted, fontSize: 13, marginTop: 4 },
  progressTrack: { height: 8, borderRadius: 4, backgroundColor: premiumColors.softPrimary, marginTop: 18, overflow: 'hidden' },
  progressFill: { width: '78%', height: '100%', borderRadius: 4, backgroundColor: premiumColors.primary },
});

export default AdminDashboard;
