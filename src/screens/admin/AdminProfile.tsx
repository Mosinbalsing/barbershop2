import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { PremiumHeader } from '../../shared/components/PremiumScaffold';
import { premiumColors, premiumShadow, premiumSpacing } from '../../shared/theme/premiumTheme';

const AdminProfile = () => (
  <View style={styles.screen}>
    <PremiumHeader eyebrow="Admin" title="Profile" subtitle="Workspace access and account preferences." />
    <View style={styles.content}>
      <View style={styles.card}>
        <View style={styles.avatar}><Icon name="user" size={34} color={premiumColors.primary} /></View>
        <Text style={styles.name}>Barbershop Admin</Text>
        <Text style={styles.meta}>admin@barbershop.app</Text>
      </View>
      {['Notifications', 'Security', 'Workspace'].map(item => (
        <View key={item} style={styles.row}>
          <Text style={styles.rowText}>{item}</Text>
          <Icon name="chevron-right" size={14} color={premiumColors.primary} />
        </View>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: premiumColors.canvas },
  content: { padding: premiumSpacing.screen, paddingTop: 0, paddingBottom: 112 },
  card: { alignItems: 'center', backgroundColor: premiumColors.surface, borderRadius: 24, padding: 24, marginBottom: 14, borderWidth: 1, borderColor: premiumColors.line, ...premiumShadow },
  avatar: { width: 88, height: 88, borderRadius: 44, backgroundColor: premiumColors.softPrimary, alignItems: 'center', justifyContent: 'center' },
  name: { color: premiumColors.ink, fontSize: 22, fontWeight: '900', marginTop: 16 },
  meta: { color: premiumColors.muted, marginTop: 5 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: premiumColors.surface, borderRadius: 18, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: premiumColors.line },
  rowText: { color: premiumColors.ink, fontSize: 15, fontWeight: '900' },
});

export default AdminProfile;
