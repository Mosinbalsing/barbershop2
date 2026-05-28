import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Typography } from '../../../shared/components/Typography';
import { Header } from '../../../shared/components/Header';
import { Icon } from '../../../shared/components/Icon';
import { usePremiumTheme, premiumShadow } from '../../../shared/theme/premiumTheme';

const WhyChooseUs = () => {
  const { colors } = usePremiumTheme();

  const highlights = [
    {
      id: '1',
      title: 'Hygienic Tools',
      desc: 'We maintain 100% hygiene and clean tools. Every instrument is fully sanitized before and after each service to guarantee your health and safety.',
      icon: 'shield-checkmark-outline',
    },
    {
      id: '2',
      title: 'Quality Products',
      desc: 'We use premium quality products for the best care. Our styling gels, shampoos, and beard oils are carefully selected from organic premium brands.',
      icon: 'sparkles-outline',
    },
    {
      id: '3',
      title: 'Expert Service',
      desc: 'Our barber is experienced and skilled. With over 10+ years of professional experience, we give you the style that best defines you.',
      icon: 'ribbon-outline',
    },
    {
      id: '4',
      title: 'On-time Service',
      desc: 'We value your time and ensure on-time service. We adhere strictly to schedules so you never have to wait in line. Walk in, look best, walk out!',
      icon: 'alarm-outline',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.canvas }]}>
      <Header title="Why Choose Us?" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {highlights.map((item) => (
          <View key={item.id} style={[styles.card, { backgroundColor: colors.surface }, premiumShadow]}>
            <View style={[styles.iconContainer, { backgroundColor: colors.softPrimary }]}>
              <Icon name={item.icon} size={28} color="primary" />
            </View>
            <View style={styles.textContainer}>
              <Typography variant="body" weight="bold" style={styles.title}>
                {item.title}
              </Typography>
              <Typography variant="caption" color="muted" style={styles.desc}>
                {item.desc}
              </Typography>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16, gap: 16 },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 18,
    padding: 20,
    gap: 16,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontSize: 16,
  },
  desc: {
    lineHeight: 20,
  },
});

export default WhyChooseUs;
