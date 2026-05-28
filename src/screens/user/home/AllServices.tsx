import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Typography } from '../../../shared/components/Typography';
import { Header } from '../../../shared/components/Header';
import { Icon } from '../../../shared/components/Icon';
import { usePremiumTheme, premiumShadow } from '../../../shared/theme/premiumTheme';
import { useNavigation } from '@react-navigation/native';

interface Service {
  id: string;
  title: string;
  duration: string;
  price: string;
  iconName: string;
}

const AllServices = () => {
  const { colors } = usePremiumTheme();
  const navigation = useNavigation<any>();

  const services: Service[] = [
    { id: '1', title: 'Haircut', duration: '30 mins', price: '₹299', iconName: 'cut-outline' },
    { id: '2', title: 'Beard Trim', duration: '20 mins', price: '₹199', iconName: 'person-outline' },
    { id: '3', title: 'Shave', duration: '15 mins', price: '₹149', iconName: 'water-outline' },
    { id: '4', title: 'Hair Spa', duration: '45 mins', price: '₹499', iconName: 'color-wand-outline' },
    { id: '5', title: 'Hair Color', duration: '60 mins', price: '₹999', iconName: 'color-palette-outline' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.canvas }]}>
      <Header title="All Services" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.listCard, { backgroundColor: colors.surface }, premiumShadow]}>
          {services.map((service, index) => (
            <TouchableOpacity
              key={service.id}
              onPress={() => navigation.navigate('ServiceDetails', { service })}
              style={[
                styles.serviceRow,
                { borderBottomColor: colors.line, borderBottomWidth: index === services.length - 1 ? 0 : 1 }
              ]}
            >
              {/* Left icon wrapper */}
              <View style={[styles.iconWrapper, { backgroundColor: colors.canvas }]}>
                <Icon name={service.iconName} size={22} color="ink" />
              </View>
              
              {/* Center info */}
              <View style={styles.serviceInfo}>
                <Typography variant="body" weight="bold">{service.title}</Typography>
                <Typography variant="caption" color="muted">{service.duration} • {service.price}</Typography>
              </View>
              
              {/* Right Book button */}
              <TouchableOpacity
                onPress={() => navigation.navigate('ServiceDetails', { service })}
                style={[styles.bookBtn, { backgroundColor: colors.ink }]}
              >
                <Typography variant="label" weight="bold" color="surface">Book</Typography>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16 },
  listCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  serviceInfo: { flex: 1 },
  bookBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AllServices;
