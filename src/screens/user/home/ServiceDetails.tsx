import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Typography } from '../../../shared/components/Typography';
import { Header } from '../../../shared/components/Header';
import { Icon } from '../../../shared/components/Icon';
import { Button } from '../../../shared/components/Button';
import { usePremiumTheme, premiumShadow } from '../../../shared/theme/premiumTheme';
import { useNavigation, useRoute } from '@react-navigation/native';

interface Service {
  id: string;
  title: string;
  duration: string;
  price: string;
  iconName: string;
}

const ServiceDetails = () => {
  const { colors } = usePremiumTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  // Extract service passed or fallback to Haircut
  const service: Service = route.params?.service || {
    id: '1',
    title: 'Haircut',
    duration: '30 mins',
    price: '₹299',
    iconName: 'cut-outline'
  };

  const handleBookService = () => {
    // Navigate directly to the Bookings wizard!
    navigation.navigate('user', {
      screen: 'Bookings',
      params: { preselectedService: service }
    });
  };

  // Dynamic inclusions based on service type
  const getInclusions = () => {
    if (service.title === 'Haircut') {
      return ['Hair Wash', 'Haircut', 'Blow Dry'];
    } else if (service.title === 'Beard Trim') {
      return ['Beard Trimming', 'Hot Towel Treatment', 'Beard Oil Styling'];
    } else if (service.title === 'Shave') {
      return ['Lather Shave', 'Blade Alignment', 'Aftershave Massage'];
    } else if (service.title === 'Hair Spa') {
      return ['Scalp Massage', 'Hair Nourishment Spa', 'Deep Conditioning'];
    }
    return ['Premium Consultation', 'Grooming Treatment', 'Styling Gel Application'];
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.canvas }]}>
      <Header title="Service Details" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Visual Graphic Header Card */}
        <View style={[styles.visualCard, { backgroundColor: colors.surface }, premiumShadow]}>
          <View style={[styles.iconCircleBg, { backgroundColor: colors.softPrimary }]}>
            <Icon name={service.iconName} size={42} color="primary" />
          </View>
          <Typography variant="h3" weight="bold" style={styles.title}>{service.title}</Typography>
          <Typography variant="caption" color="muted">
            {service.duration} • {service.price}
          </Typography>
        </View>

        {/* About this service */}
        <View style={[styles.infoCard, { backgroundColor: colors.surface }, premiumShadow]}>
          <Typography variant="body" weight="bold" style={styles.sectionTitle}>About this service</Typography>
          <Typography variant="caption" color="muted" style={styles.descText}>
            Get a professional, stylish {service.title.toLowerCase()} done by our certified grooming expert. We customize our techniques to fit your look and face shape perfectly.
          </Typography>
        </View>

        {/* Includes checklist */}
        <View style={[styles.infoCard, { backgroundColor: colors.surface }, premiumShadow]}>
          <Typography variant="body" weight="bold" style={styles.sectionTitle}>Includes</Typography>
          
          <View style={styles.checklist}>
            {getInclusions().map((item, index) => (
              <View key={index} style={styles.checkRow}>
                <View style={[styles.checkCircle, { backgroundColor: colors.softPrimary }]}>
                  <Icon name="checkmark" size={14} color="primary" />
                </View>
                <Typography variant="caption" color="ink" weight="500">
                  {item}
                </Typography>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>

      {/* Button Footer */}
      <View style={[styles.footer, { backgroundColor: colors.canvas }]}>
        <Button
          title="Book This Service"
          size="large"
          onPress={handleBookService}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16, gap: 16 },
  visualCard: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
  },
  iconCircleBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    marginBottom: 6,
  },
  infoCard: {
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
  },
  descText: {
    lineHeight: 20,
  },
  checklist: {
    gap: 12,
    marginTop: 4,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32,
  },
});

export default ServiceDetails;
