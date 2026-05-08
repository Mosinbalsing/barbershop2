import React from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { PremiumHeader } from '../../shared/components/PremiumScaffold';
import { premiumColors, premiumShadow, premiumSpacing } from '../../shared/theme/premiumTheme';

const barbers = ['Oliver Thompson', 'Liam Walker', 'William Wilson', 'Ethan James'];

const BarbersAdmin = () => (
  <View style={styles.screen}>
    <PremiumHeader eyebrow="Team" title="Barbers" subtitle="Monitor active barbers and daily capacity." />
    <FlatList
      data={barbers}
      keyExtractor={item => item}
      contentContainerStyle={styles.list}
      renderItem={({ item, index }) => (
        <View style={styles.card}>
          <Image source={require('../../assets/images/PNG/logo-light.png')} style={styles.avatar} />
          <View style={styles.info}>
            <Text style={styles.name}>{item}</Text>
            <Text style={styles.meta}>{index + 3} appointments today</Text>
          </View>
          <View style={styles.status}><Text style={styles.statusText}>Active</Text></View>
        </View>
      )}
    />
  </View>
);

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: premiumColors.canvas },
  list: { padding: premiumSpacing.screen, paddingTop: 0, paddingBottom: 112 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: premiumColors.surface, borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: premiumColors.line, ...premiumShadow },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: premiumColors.softPrimary },
  info: { flex: 1, marginLeft: 13 },
  name: { color: premiumColors.ink, fontSize: 16, fontWeight: '900' },
  meta: { color: premiumColors.muted, fontSize: 13, marginTop: 4 },
  status: { backgroundColor: premiumColors.softSecondary, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6 },
  statusText: { color: premiumColors.secondary, fontWeight: '900', fontSize: 11 },
});

export default BarbersAdmin;
