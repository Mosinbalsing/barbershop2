import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Typography } from '../../../shared/components/Typography';
import { Header } from '../../../shared/components/Header';
import { Icon } from '../../../shared/components/Icon';
import { Button } from '../../../shared/components/Button';
import { usePremiumTheme, premiumSpacing, premiumShadow } from '../../../shared/theme/premiumTheme';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Coupon } from './MyCoupons';

const copyToClipboard = (text: string) => {
  Alert.alert('Copied', `"${text}" copied to clipboard successfully!`);
};

const CouponDetails = () => {
  const { colors } = usePremiumTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  // Extract coupon passed from MyCoupons list, fallback to default
  const coupon: Coupon = route.params?.coupon || {
    id: '1',
    badge: '20% OFF',
    title: 'Flat 20% OFF',
    subtitle: 'On all services',
    validity: 'Valid till 31 May 2025',
    code: 'SAVE20',
    terms: [
      'Valid on all services',
      'Minimum bill ₹500',
      'Not valid with other offers',
      'One time use per customer'
    ]
  };

  const handleUseNow = () => {
    Alert.alert(
      'Apply Coupon',
      `Coupon code "${coupon.code}" has been selected! Redirecting to booking flow to apply it.`,
      [
        {
          text: 'Use Now',
          onPress: () => {
            navigation.navigate('user', { screen: 'Bookings' });
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.canvas }]}>
      <Header title="Coupon Details" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Main visual coupon card */}
        <View style={[styles.couponVisualCard, { backgroundColor: colors.surface }, premiumShadow]}>
          <View style={[styles.ticketBadgeBlock, { backgroundColor: colors.softPrimary }]}>
            <Typography variant="label" color="primary" style={styles.uppercase}>FLAT</Typography>
            <Typography variant="h2" weight="bold" color="primary" style={styles.badgeText}>
              {coupon.badge}
            </Typography>
            <Typography variant="label" color="primary" style={styles.uppercase}>OFF</Typography>
          </View>
          
          <View style={styles.couponCardInfo}>
            <Typography variant="h3" weight="bold">{coupon.title}</Typography>
            <Typography variant="body" color="muted" style={styles.subtitleText}>
              {coupon.subtitle}
            </Typography>
            <Typography variant="caption" color="muted">
              {coupon.validity}
            </Typography>
          </View>
        </View>

        {/* Coupon Code copy box */}
        <View style={[styles.codeBoxContainer, { backgroundColor: colors.surface }, premiumShadow]}>
          <Typography variant="caption" color="muted">Coupon Code</Typography>
          <View style={[styles.codeBoxRow, { backgroundColor: colors.canvas, borderColor: colors.line }]}>
            <Typography variant="body" weight="bold" color="primary" style={styles.codeText}>
              {coupon.code}
            </Typography>
            <TouchableOpacity onPress={() => copyToClipboard(coupon.code)} style={styles.copyIconButton}>
              <Icon name="copy-outline" size={20} color="primary" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Terms and Conditions */}
        {coupon.terms && coupon.terms.length > 0 && (
          <View style={[styles.termsContainer, { backgroundColor: colors.surface }, premiumShadow]}>
            <Typography variant="body" weight="bold" style={styles.termsTitle}>Terms & Conditions</Typography>
            
            <View style={styles.termsList}>
              {coupon.terms.map((term, index) => (
                <View key={index} style={styles.termRow}>
                  <View style={[styles.bulletPoint, { backgroundColor: colors.primary }]} />
                  <Typography variant="caption" color="ink" style={styles.termText}>
                    {term}
                  </Typography>
                </View>
              ))}
            </View>
          </View>
        )}

      </ScrollView>

      {/* Use Now Action Button */}
      <View style={[styles.footer, { backgroundColor: colors.canvas }]}>
        <Button
          title="Use Now"
          size="large"
          onPress={handleUseNow}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16, gap: 16 },
  couponVisualCard: {
    flexDirection: 'row',
    borderRadius: 16,
    overflow: 'hidden',
    minHeight: 120,
  },
  ticketBadgeBlock: {
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  badgeText: {
    marginVertical: 4,
    textAlign: 'center',
  },
  uppercase: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  couponCardInfo: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  subtitleText: {
    marginVertical: 6,
  },
  codeBoxContainer: {
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  codeBoxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 16,
  },
  codeText: {
    fontSize: 16,
    letterSpacing: 1,
  },
  copyIconButton: {
    padding: 8,
  },
  termsContainer: {
    borderRadius: 16,
    padding: 18,
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
  bulletPoint: {
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

export default CouponDetails;
