import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useMemo } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { PremiumHeader } from '../../../shared/components/PremiumScaffold';
import { premiumShadow, premiumSpacing, usePremiumTheme } from '../../../shared/theme/premiumTheme';

type Booking = {
  date: string;
  time: string;
  name: string;
  service: string;
  id: string;
  duration: string;
  status: string;
};

type RouteParams = {
  BookingDetails: {
    booking: Booking;
  };
};

const BookingDetails = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams, 'BookingDetails'>>();
  const { colors } = usePremiumTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const booking = route.params?.booking;

  return (
    <View style={styles.screen}>
      <PremiumHeader
        eyebrow="Booking"
        title="Booking Details"
        subtitle={booking?.id || 'Customer appointment'}
        right={
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="angle-left" size={24} color={colors.primary} />
          </TouchableOpacity>
        }
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <Image source={require('../../../assets/images/PNG/logo-light.png')} style={styles.avatar} />
          <Text style={styles.name}>{booking?.name}</Text>
          <Text style={styles.service}>{booking?.service}</Text>
          <View style={[styles.statusBadge, booking?.status === 'Success' && styles.statusSuccess]}>
            <Text style={[styles.statusText, booking?.status === 'Success' && styles.statusSuccessText]}>
              {booking?.status}
            </Text>
          </View>
        </View>

        {[
          ['Date', booking?.date],
          ['Time', booking?.time],
          ['Duration', booking?.duration],
          ['Booking ID', booking?.id],
        ].map(([label, value]) => (
          <View key={label} style={styles.detailRow}>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text style={styles.detailValue}>{value}</Text>
          </View>
        ))}

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.secondaryButton}>
            <Icon name="phone" size={15} color={colors.primary} />
            <Text style={styles.secondaryButtonText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryButton}>
            <Icon name="check" size={15} color={colors.surface} />
            <Text style={styles.primaryButtonText}>Mark Done</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const createStyles = (colors: ReturnType<typeof usePremiumTheme>['colors']) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { padding: premiumSpacing.screen, paddingTop: 0, paddingBottom: 100 },
  backButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', ...premiumShadow },
  profileCard: { alignItems: 'center', backgroundColor: colors.surface, borderRadius: 24, padding: 22, borderWidth: 1, borderColor: colors.line, marginBottom: 14, ...premiumShadow },
  avatar: { width: 92, height: 92, borderRadius: 46, backgroundColor: colors.softPrimary },
  name: { color: colors.ink, fontSize: 24, fontWeight: '900', marginTop: 14 },
  service: { color: colors.muted, fontSize: 14, fontWeight: '700', marginTop: 5 },
  statusBadge: { backgroundColor: colors.softPrimary, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 7, marginTop: 14 },
  statusSuccess: { backgroundColor: colors.softSecondary },
  statusText: { color: colors.primary, fontSize: 12, fontWeight: '900' },
  statusSuccessText: { color: colors.secondary },
  detailRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.surface, borderRadius: 16, padding: 15, marginBottom: 10, borderWidth: 1, borderColor: colors.line },
  detailLabel: { color: colors.muted, fontSize: 13, fontWeight: '800' },
  detailValue: { color: colors.ink, fontSize: 14, fontWeight: '900' },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
  secondaryButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.softPrimary, borderRadius: 16, paddingVertical: 14 },
  secondaryButtonText: { color: colors.primary, fontWeight: '900' },
  primaryButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.primary, borderRadius: 16, paddingVertical: 14 },
  primaryButtonText: { color: colors.surface, fontWeight: '900' },
});

export default BookingDetails;
