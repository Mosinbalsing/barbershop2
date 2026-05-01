import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { PremiumHeader } from '../../shared/components/PremiumScaffold';
import { premiumColors, premiumShadow, premiumSpacing } from '../../shared/theme/premiumTheme';

const users = ['David Smith', 'Michael Johnson', 'Ryan Harris', 'Sophia Lee'];

const UsersAdmin = () => (
  <View style={styles.screen}>
    <PremiumHeader eyebrow="Customers" title="Users" subtitle="Recent customers and booking activity." />
    <FlatList
      data={users}
      keyExtractor={item => item}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.iconBox}><Icon name="user" size={18} color={premiumColors.primary} /></View>
          <View style={styles.info}>
            <Text style={styles.name}>{item}</Text>
            <Text style={styles.meta}>Last booking this week</Text>
          </View>
          <Text style={styles.value}>$50</Text>
        </View>
      )}
    />
  </View>
);

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: premiumColors.canvas },
  list: { padding: premiumSpacing.screen, paddingTop: 0, paddingBottom: 112 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: premiumColors.surface, borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: premiumColors.line, ...premiumShadow },
  iconBox: { width: 46, height: 46, borderRadius: 16, backgroundColor: premiumColors.softPrimary, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1, marginLeft: 13 },
  name: { color: premiumColors.ink, fontSize: 16, fontWeight: '900' },
  meta: { color: premiumColors.muted, fontSize: 13, marginTop: 4 },
  value: { color: premiumColors.primary, fontSize: 16, fontWeight: '900' },
});

export default UsersAdmin;
