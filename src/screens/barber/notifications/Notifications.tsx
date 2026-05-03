import { useNavigation } from '@react-navigation/native';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { PremiumHeader } from '../../../shared/components/PremiumScaffold';
import { premiumShadow, premiumSpacing, usePremiumTheme } from '../../../shared/theme/premiumTheme';

const notifications = [
  { id: '1', title: 'New booking received', body: 'Michael Johnson booked Haircut at 10:30 AM.', time: '2 min ago', icon: 'calendar-check-o' },
  { id: '2', title: 'Emergency holiday active', body: 'Bookings are paused for your selected dates.', time: '1 hr ago', icon: 'exclamation-circle' },
  { id: '3', title: 'Service updated', body: 'Hair Spa duration was updated to 20 min.', time: 'Yesterday', icon: 'scissors' },
];

const Notifications = () => {
  const navigation = useNavigation();
  const { colors } = usePremiumTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.screen}>
      <PremiumHeader
        eyebrow="Updates"
        title="Notifications"
        subtitle="Booking, shop, and service alerts."
        right={
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="angle-left" size={24} color={colors.primary} />
          </TouchableOpacity>
        }
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {notifications.map(item => (
          <View key={item.id} style={styles.card}>
            <View style={styles.iconCircle}>
              <Icon name={item.icon} size={18} color={colors.primary} />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.body}>{item.body}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const createStyles = (colors: ReturnType<typeof usePremiumTheme>['colors']) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { padding: premiumSpacing.screen, paddingTop: 0, paddingBottom: 100 },
  backButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', ...premiumShadow },
  card: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: 18, padding: 15, marginBottom: 12, borderWidth: 1, borderColor: colors.line, ...premiumShadow },
  iconCircle: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.softPrimary },
  cardText: { flex: 1, marginLeft: 12 },
  title: { color: colors.ink, fontSize: 15, fontWeight: '900' },
  body: { color: colors.muted, fontSize: 13, lineHeight: 18, marginTop: 4 },
  time: { color: colors.primary, fontSize: 12, fontWeight: '900', marginTop: 8 },
});

export default Notifications;
