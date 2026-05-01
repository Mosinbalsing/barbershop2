import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MetricCard, PremiumHeader } from '../../../shared/components/PremiumScaffold';
import { premiumColors, premiumShadow, premiumSpacing } from '../../../shared/theme/premiumTheme';

const Profile = () => {
  return (
    <View style={styles.screen}>
      <PremiumHeader eyebrow="Account" title="Profile" subtitle="Your public barber profile and performance." />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <Image source={require('../../../assets/images/PNG/logo-light.png')} style={styles.avatar} />
          <Text style={styles.name}>Shoyeb Khan</Text>
          <Text style={styles.role}>Senior Barber, New York</Text>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionButton}><Icon name="phone" size={15} color={premiumColors.primary} /><Text style={styles.actionText}>Call</Text></TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}><Icon name="comment-o" size={15} color={premiumColors.primary} /><Text style={styles.actionText}>Message</Text></TouchableOpacity>
          </View>
        </View>
        <View style={styles.metrics}>
          <MetricCard label="Rating" value="4.9" detail="Customer score" />
          <MetricCard label="Bookings" value="2K" detail="All time" tone="secondary" />
        </View>
        {['Hair & Beard Cut', 'Hair Blonde', 'Full Body Massage'].map((item, index) => (
          <View key={item} style={styles.serviceRow}>
            <View>
              <Text style={styles.serviceName}>{item}</Text>
              <Text style={styles.serviceTime}>{index === 1 ? '30 Min' : '40 Min'}</Text>
            </View>
            <Text style={styles.servicePrice}>${index === 0 ? '50' : index === 1 ? '30' : '70'}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: premiumColors.canvas },
  content: { padding: premiumSpacing.screen, paddingTop: 0, paddingBottom: 112 },
  profileCard: { alignItems: 'center', backgroundColor: premiumColors.surface, borderRadius: 24, padding: 22, borderWidth: 1, borderColor: premiumColors.line, ...premiumShadow },
  avatar: { width: 108, height: 108, borderRadius: 54, backgroundColor: premiumColors.softPrimary },
  name: { color: premiumColors.ink, fontSize: 24, fontWeight: '900', marginTop: 16 },
  role: { color: premiumColors.muted, fontSize: 14, marginTop: 5 },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 18 },
  actionButton: { flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: premiumColors.softPrimary, borderRadius: 15, paddingHorizontal: 16, paddingVertical: 10 },
  actionText: { color: premiumColors.primary, fontWeight: '900' },
  metrics: { flexDirection: 'row', gap: 10, marginTop: 14, marginBottom: 14 },
  serviceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: premiumColors.surface, borderRadius: 18, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: premiumColors.line },
  serviceName: { color: premiumColors.ink, fontSize: 15, fontWeight: '900' },
  serviceTime: { color: premiumColors.muted, fontSize: 12, marginTop: 4 },
  servicePrice: { color: premiumColors.primary, fontSize: 16, fontWeight: '900' },
});

export default Profile;
