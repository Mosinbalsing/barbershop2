import React, { useState, useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { usePremiumTheme, premiumShadow } from '../../../shared/theme/premiumTheme';

type CouponItem = {
  id: string;
  code: string;
  desc: string;
  validTill: string;
  active: boolean;
};

const MOCK_COUPONS: CouponItem[] = [
  {
    id: '1',
    code: 'SUMMER20',
    desc: '20% OFF up to ₹100',
    validTill: 'valid till 31 May 2025',
    active: true,
  },
  {
    id: '2',
    code: 'NEWUSER15',
    desc: '15% OFF for New Users',
    validTill: 'valid till 15 Jun 2025',
    active: true,
  },
  {
    id: '3',
    code: 'FLAT100',
    desc: 'Flat ₹100 OFF above ₹499',
    validTill: 'valid till 30 Jun 2025',
    active: true,
  },
  {
    id: '4',
    code: 'WINTER30',
    desc: '30% OFF up to ₹150',
    validTill: 'Expired 10 Jan 2025',
    active: false,
  },
];

const BarberCoupons = () => {
  const { colors, mode } = usePremiumTheme();
  const navigation = useNavigation<any>();

  const purpleTheme = {
    primary: '#6D4CF3',
    activeBg: mode === 'dark' ? '#3A281E' : '#F5F1ED',
  };

  const [activeSegment, setActiveSegment] = useState<'Active' | 'Inactive'>('Active');
  
  // Toggling states locally
  const [couponsList, setCouponsList] = useState<CouponItem[]>(MOCK_COUPONS);

  const toggleCouponSwitch = (id: string) => {
    const updated = couponsList.map(item => 
      item.id === id ? { ...item, active: !item.active } : item
    );
    setCouponsList(updated);
  };

  const filteredCoupons = useMemo(() => {
    return couponsList.filter(c => {
      if (activeSegment === 'Active') return c.active;
      return !c.active;
    });
  }, [activeSegment, couponsList]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.canvas }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.line }]}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={18} color={colors.ink} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.ink }]}>Coupons</Text>

        <TouchableOpacity 
          style={styles.headerBtn}
          onPress={() => navigation.navigate('BarberCreateCoupon')}
        >
          <Icon name="plus" size={18} color={colors.ink} />
        </TouchableOpacity>
      </View>

      {/* Segment tabs */}
      <View style={[styles.segmentContainer, { backgroundColor: colors.surface, borderBottomColor: colors.line }]}>
        {[
          { key: 'Active', label: `Active (${couponsList.filter(c => c.active).length})` },
          { key: 'Inactive', label: `Inactive (${couponsList.filter(c => !c.active).length})` },
        ].map(seg => {
          const isActive = activeSegment === seg.key;
          return (
            <TouchableOpacity
              key={seg.key}
              style={[styles.segmentItem, isActive && { borderBottomColor: purpleTheme.primary }]}
              onPress={() => setActiveSegment(seg.key as any)}
            >
              <Text style={[
                styles.segmentText,
                isActive ? { color: colors.ink, fontWeight: 'bold' } : { color: colors.muted }
              ]}>
                {seg.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Coupons scroll list */}
      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {filteredCoupons.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="tags" size={42} color={colors.muted} />
            <Text style={[styles.emptyText, { color: colors.muted }]}>No coupons listed</Text>
          </View>
        ) : (
          filteredCoupons.map(item => (
            <View
              key={item.id}
              style={[styles.couponCard, { backgroundColor: colors.surface, borderColor: colors.line }]}
            >
              <View style={styles.cardRow}>
                {/* Details info column */}
                <View style={styles.detailsCol}>
                  <Text style={[styles.codeText, { color: colors.ink }]}>{item.code}</Text>
                  <Text style={[styles.descText, { color: colors.muted }]}>{item.desc}</Text>
                  <Text style={[styles.validText, { color: colors.muted }]}>{item.validTill}</Text>
                </View>

                {/* Toggle switch on right */}
                <Switch
                  value={item.active}
                  onValueChange={() => toggleCouponSwitch(item.id)}
                  thumbColor="#FFFFFF"
                  trackColor={{ false: colors.line, true: purpleTheme.primary }}
                />
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  segmentContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingHorizontal: 16,
  },
  segmentItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  emptyState: {
    paddingVertical: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    marginTop: 10,
  },
  couponCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    ...premiumShadow,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailsCol: {
    flex: 1,
    paddingRight: 12,
  },
  codeText: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  descText: {
    fontSize: 12.5,
    marginTop: 3,
  },
  validText: {
    fontSize: 11,
    marginTop: 4,
  },
});

export default BarberCoupons;
