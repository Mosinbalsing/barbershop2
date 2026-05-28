import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Typography } from '../../../shared/components/Typography';
import { Header } from '../../../shared/components/Header';
import { Icon } from '../../../shared/components/Icon';
import { usePremiumTheme, premiumSpacing, premiumShadow } from '../../../shared/theme/premiumTheme';
import { useNavigation } from '@react-navigation/native';

// Simple mock clipboard helper
const copyToClipboard = (text: string) => {
  Alert.alert('Copied', `"${text}" copied to clipboard successfully!`);
};

export interface Coupon {
  id: string;
  badge: string; // e.g. "20% OFF" or "₹100 OFF"
  title: string;
  subtitle: string;
  validity: string;
  code: string;
  terms: string[];
}

const MyCoupons = () => {
  const { colors } = usePremiumTheme();
  const navigation = useNavigation<any>();

  const [activeTab, setActiveTab] = useState<'Available' | 'Used'>('Available');

  const availableCoupons: Coupon[] = [
    {
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
    },
    {
      id: '2',
      badge: '10% OFF',
      title: 'Flat 10% OFF',
      subtitle: 'On Hair Spa',
      validity: 'Valid till 15 Jun 2025',
      code: 'SPA10',
      terms: [
        'Valid only on Hair Spa service',
        'No minimum bill value',
        'One time use per customer'
      ]
    },
    {
      id: '3',
      badge: '₹100 OFF',
      title: 'Flat ₹100 OFF',
      subtitle: 'On minimum booking',
      validity: 'Valid till 30 Jun 2025',
      code: 'WELCOME100',
      terms: [
        'Valid on any barbershop service',
        'Minimum booking value ₹300 required',
        'Only applicable on first appointment'
      ]
    }
  ];

  const usedCoupons: Coupon[] = [
    {
      id: '4',
      badge: '50% OFF',
      title: 'First booking 50% OFF',
      subtitle: 'On all services',
      validity: 'Used on 12 Jan 2025',
      code: 'FIRST50',
      terms: []
    }
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.canvas }]}>
      <Header title="My Coupons" showBack />

      {/* Segmented Control */}
      <View style={[styles.tabBarContainer, { backgroundColor: colors.surface, borderColor: colors.line }]}>
        {['Available', 'Used'].map((tab) => {
          const isSelected = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab as any)}
              style={[
                styles.tabButton,
                isSelected && { backgroundColor: colors.primary }
              ]}
            >
              <Typography
                variant="caption"
                weight="bold"
                style={{ color: isSelected ? colors.surface : colors.muted }}
              >
                {tab}
              </Typography>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Coupon Scroll list */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'Available' ? (
          availableCoupons.map((coupon) => (
            <TouchableOpacity
              key={coupon.id}
              onPress={() => navigation.navigate('CouponDetails', { coupon })}
              style={[styles.couponTicket, { backgroundColor: colors.surface }, premiumShadow]}
            >
              {/* Left Badge Block */}
              <View style={[styles.ticketBadgeBlock, { borderRightColor: colors.line }]}>
                <Typography variant="label" color="muted" style={styles.uppercase}>FLAT</Typography>
                <Typography variant="h3" weight="bold" color="primary" style={styles.badgeText}>
                  {coupon.badge}
                </Typography>
                <Typography variant="label" color="muted" style={styles.uppercase}>OFF</Typography>
              </View>

              {/* Middle content */}
              <View style={styles.ticketContent}>
                <Typography variant="body" weight="bold">{coupon.title}</Typography>
                <Typography variant="caption" color="muted" style={styles.subtitleText}>{coupon.subtitle}</Typography>
                <Typography variant="label" color="muted">{coupon.validity}</Typography>
              </View>

              {/* Right Code and copy button */}
              <View style={styles.ticketRight}>
                <Typography variant="caption" weight="bold" color="primary" style={[styles.codeBox, { backgroundColor: colors.softPrimary }]}>
                  {coupon.code}
                </Typography>
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation(); // prevent tapping card
                    copyToClipboard(coupon.code);
                  }}
                  style={styles.copyBtn}
                >
                  <Icon name="copy-outline" size={18} color="muted" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          usedCoupons.map((coupon) => (
            <View
              key={coupon.id}
              style={[styles.couponTicket, styles.usedTicket, { backgroundColor: colors.surface }]}
            >
              {/* Left Badge Block */}
              <View style={[styles.ticketBadgeBlock, { borderRightColor: colors.line, opacity: 0.5 }]}>
                <Typography variant="label" color="muted" style={styles.uppercase}>FLAT</Typography>
                <Typography variant="h3" weight="bold" style={styles.badgeText}>
                  {coupon.badge}
                </Typography>
                <Typography variant="label" color="muted" style={styles.uppercase}>OFF</Typography>
              </View>

              {/* Middle content */}
              <View style={[styles.ticketContent, { opacity: 0.5 }]}>
                <Typography variant="body" weight="bold">{coupon.title}</Typography>
                <Typography variant="caption" color="muted" style={styles.subtitleText}>{coupon.subtitle}</Typography>
                <Typography variant="label" color="muted">{coupon.validity}</Typography>
              </View>

              {/* Right Code indicator */}
              <View style={[styles.ticketRight, { opacity: 0.5 }]}>
                <Typography variant="caption" weight="bold" style={[styles.codeBox, { backgroundColor: colors.line }]}>
                  {coupon.code}
                </Typography>
              </View>
            </View>
          ))
        )}

        {activeTab === 'Used' && usedCoupons.length === 0 && (
          <View style={styles.emptyState}>
            <Icon name="ticket-outline" size={48} color="muted" />
            <Typography variant="body" color="muted">No used coupons found.</Typography>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 4,
    borderRadius: 14,
    borderWidth: 1,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: { padding: 16, gap: 16 },
  couponTicket: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    overflow: 'hidden',
    minHeight: 100,
    position: 'relative',
  },
  usedTicket: {
    borderWidth: 1.5,
    borderColor: '#ECECF3',
  },
  ticketBadgeBlock: {
    width: 90,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderStyle: 'dashed',
    paddingVertical: 16,
  },
  badgeText: {
    fontSize: 16,
    marginVertical: 2,
    textAlign: 'center',
  },
  uppercase: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  ticketContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  subtitleText: {
    marginVertical: 4,
  },
  ticketRight: {
    alignItems: 'center',
    paddingRight: 16,
    gap: 8,
  },
  codeBox: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  copyBtn: {
    padding: 6,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: 12,
  },
});

export default MyCoupons;
