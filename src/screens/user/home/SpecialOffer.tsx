import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Typography } from '../../../shared/components/Typography';
import { Header } from '../../../shared/components/Header';
import { Icon } from '../../../shared/components/Icon';
import { Button } from '../../../shared/components/Button';
import { usePremiumTheme, premiumShadow } from '../../../shared/theme/premiumTheme';
import { useNavigation } from '@react-navigation/native';

const copyToClipboard = (text: string) => {
  Alert.alert('Copied', `"${text}" copied to clipboard successfully!`);
};

const SpecialOffer = () => {
  const { colors } = usePremiumTheme();
  const navigation = useNavigation<any>();

  const handleBookNow = () => {
    navigation.navigate('user', { screen: 'Bookings' });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.canvas }]}>
      <Header title="Special Offer" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Main visual discount card */}
        <View style={[styles.visualCard, { backgroundColor: colors.ink }]}>
          <Typography variant="h1" color="surface" weight="bold" style={styles.badgeText}>
            FLAT 20% OFF
          </Typography>
          <Typography variant="body" color="muted" weight="600" style={styles.subtitle}>
            On All Services
          </Typography>
          
          {/* Coupon Code copy box */}
          <View style={styles.couponCodeRow}>
            <Typography variant="caption" color="muted">Use Code: </Typography>
            <TouchableOpacity onPress={() => copyToClipboard('SAVE20')} style={[styles.codeBox, { backgroundColor: colors.surface }]}>
              <Typography variant="body" weight="bold" color="primary">SAVE20</Typography>
              <Icon name="copy-outline" size={14} color="primary" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>
          
          <Typography variant="label" color="muted" style={styles.validity}>
            Valid till 31 May 2025
          </Typography>
        </View>

        {/* Terms and conditions */}
        <View style={[styles.termsCard, { backgroundColor: colors.surface }, premiumShadow]}>
          <Typography variant="body" weight="bold" style={styles.termsTitle}>Terms & Conditions</Typography>
          
          <View style={styles.termsList}>
            <View style={styles.termRow}>
              <View style={[styles.bullet, { backgroundColor: colors.primary }]} />
              <Typography variant="caption" color="ink" style={styles.termText}>Valid on all services</Typography>
            </View>

            <View style={styles.termRow}>
              <View style={[styles.bullet, { backgroundColor: colors.primary }]} />
              <Typography variant="caption" color="ink" style={styles.termText}>Minimum bill ₹500</Typography>
            </View>

            <View style={styles.termRow}>
              <View style={[styles.bullet, { backgroundColor: colors.primary }]} />
              <Typography variant="caption" color="ink" style={styles.termText}>Not valid with other offers</Typography>
            </View>

            <View style={styles.termRow}>
              <View style={[styles.bullet, { backgroundColor: colors.primary }]} />
              <Typography variant="caption" color="ink" style={styles.termText}>One time use per customer</Typography>
            </View>
          </View>
        </View>

      </ScrollView>

      {/* Book Now Button Footer */}
      <View style={[styles.footer, { backgroundColor: colors.canvas }]}>
        <Button
          title="Book Now"
          size="large"
          onPress={handleBookNow}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16, gap: 16 },
  visualCard: {
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 28,
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 20,
  },
  couponCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  codeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 6,
  },
  validity: {
    fontSize: 11,
  },
  termsCard: {
    borderRadius: 16,
    padding: 20,
  },
  termsTitle: {
    marginBottom: 16,
  },
  termsList: {
    gap: 12,
  },
  termRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 12,
  },
  termText: {
    flex: 1,
    lineHeight: 18,
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

export default SpecialOffer;
