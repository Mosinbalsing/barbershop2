import React, { useMemo } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MetricCard, PremiumHeader } from '../../../shared/components/PremiumScaffold';
import { removeData } from '../../../helper/storage';
import {
  PremiumThemeMode,
  premiumShadow,
  premiumSpacing,
  usePremiumTheme,
} from '../../../shared/theme/premiumTheme';
import { useGetProfile } from './ProfileApi';

const appearanceOptions: Array<{ label: string; value: PremiumThemeMode; icon: string }> = [
  { label: 'Light', value: 'light', icon: 'sun-o' },
  { label: 'Dark', value: 'dark', icon: 'moon-o' },
];

type RootStackParamList = {
  LoginScreen: undefined;
};

const Profile = () => {
  const { colors, mode, setMode } = usePremiumTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { data: profileData, isLoading } = useGetProfile();
  
  const profile = profileData as any || {};
  const barberName = profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : 'Barber';
  const barberRole = profile?.location || 'Professional Barber';
  const rating = profile?.rating || '4.9';
  const totalBookings = profile?.total_bookings || '2K';
  const services = profile?.services || [];

  const handleLogout = async () => {
    await removeData('access_token');
    await removeData('refresh_token');
    await removeData('user_role');
    await removeData('user_id');
    await removeData('assigned');
    await removeData('user_name');

    navigation.reset({
      index: 0,
      routes: [{ name: 'LoginScreen' }],
    });
  };

  return (
    <View style={styles.screen}>
      <PremiumHeader eyebrow="Account" title="Profile" subtitle="Your public barber profile and performance." />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <Image source={require('../../../assets/images/PNG/logo-light.png')} style={styles.avatar} />
          <Text style={styles.name}>{barberName}</Text>
          <Text style={styles.role}>{barberRole}</Text>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionButton}><Icon name="phone" size={15} color={colors.primary} /><Text style={styles.actionText}>Call</Text></TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}><Icon name="comment-o" size={15} color={colors.primary} /><Text style={styles.actionText}>Message</Text></TouchableOpacity>
          </View>
        </View>

        <View style={styles.appearanceCard}>
          <View>
            <Text style={styles.appearanceTitle}>Appearance</Text>
            <Text style={styles.appearanceSub}>Choose app theme</Text>
          </View>
          <View style={styles.segmented}>
            {appearanceOptions.map(item => {
              const active = mode === item.value;

              return (
                <TouchableOpacity
                  key={item.value}
                  style={[styles.segment, active && styles.segmentActive]}
                  onPress={() => setMode(item.value)}
                >
                  <Icon name={item.icon} size={15} color={active ? '#111111' : colors.muted} />
                  <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.metrics}>
          <MetricCard label="Rating" value={String(rating)} detail="Customer score" />
          <MetricCard label="Bookings" value={String(totalBookings)} detail="All time" tone="secondary" />
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="sign-out" size={16} color={colors.surface} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        {services.length > 0 ? (
          <>
            <Text style={[styles.name, { fontSize: 18, marginTop: 20, marginBottom: 12 }]}>Services</Text>
            {services.map((service: any, index: number) => (
              <View key={index} style={styles.serviceRow}>
                <View>
                  <Text style={styles.serviceName}>{service.name || 'Service'}</Text>
                  <Text style={styles.serviceTime}>{service.duration || '30 Min'}</Text>
                </View>
                <Text style={styles.servicePrice}>₹{service.cost || service.price || '0'}</Text>
              </View>
            ))}
          </>
        ) : (
          <View style={[styles.serviceRow, { justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={styles.serviceName}>No services added yet</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const createStyles = (colors: ReturnType<typeof usePremiumTheme>['colors']) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { padding: premiumSpacing.screen, paddingTop: 0, paddingBottom: 112 },
  profileCard: { alignItems: 'center', backgroundColor: colors.surface, borderRadius: 24, padding: 22, borderWidth: 1, borderColor: colors.line, ...premiumShadow },
  avatar: { width: 108, height: 108, borderRadius: 54, backgroundColor: colors.softPrimary },
  name: { color: colors.ink, fontSize: 24, fontWeight: '900', marginTop: 16 },
  role: { color: colors.muted, fontSize: 14, marginTop: 5 },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 18 },
  actionButton: { flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: colors.softPrimary, borderRadius: 15, paddingHorizontal: 16, paddingVertical: 10 },
  actionText: { color: colors.primary, fontWeight: '900' },
  appearanceCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, backgroundColor: colors.surface, borderRadius: 18, padding: 14, marginTop: 14, borderWidth: 1, borderColor: colors.line, ...premiumShadow },
  appearanceTitle: { color: colors.ink, fontSize: 16, fontWeight: '900' },
  appearanceSub: { color: colors.muted, fontSize: 12, fontWeight: '700', marginTop: 4 },
  segmented: { flexDirection: 'row', backgroundColor: colors.canvas, borderRadius: 14, padding: 4, borderWidth: 1, borderColor: colors.line },
  segment: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 11, paddingHorizontal: 10, paddingVertical: 8 },
  segmentActive: { backgroundColor: '#F8CB2E' },
  segmentText: { color: colors.muted, fontSize: 12, fontWeight: '900' },
  segmentTextActive: { color: '#111111' },
  metrics: { flexDirection: 'row', gap: 10, marginTop: 14, marginBottom: 14 },
  logoutButton: {
    marginBottom: 14,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    flexDirection: 'row',
    gap: 8,
  },
  logoutText: { color: colors.surface, fontSize: 14, fontWeight: '900' },
  serviceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.surface, borderRadius: 18, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: colors.line },
  serviceName: { color: colors.ink, fontSize: 15, fontWeight: '900' },
  serviceTime: { color: colors.muted, fontSize: 12, marginTop: 4 },
  servicePrice: { color: colors.primary, fontSize: 16, fontWeight: '900' },
});

export default Profile;
