import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { usePremiumTheme, premiumShadow } from '../../../shared/theme/premiumTheme';

type PaymentRow = {
  method: string;
  amount: string;
  percent: string;
  color: string;
};

const BarberRevenueReport = () => {
  const { colors, mode } = usePremiumTheme();
  const navigation = useNavigation();

  const purpleTheme = {
    primary: '#6D4CF3',
  };

  const paymentMethods: PaymentRow[] = [
    { method: 'Cash', amount: '₹20,000', percent: '41%', color: '#10B981' },
    { method: 'UPI', amount: '₹18,000', percent: '37%', color: '#F59E0B' },
    { method: 'Card', amount: '₹10,750', percent: '22%', color: '#2563EB' },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.canvas }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.line }]}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={18} color={colors.ink} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.ink }]}>Revenue Report</Text>

        <TouchableOpacity style={[styles.dropdownRow, { backgroundColor: colors.canvas, borderColor: colors.line }]}>
          <Text style={[styles.dropdownText, { color: colors.ink }]}>This Month</Text>
          <Icon name="chevron-down" size={10} color={colors.ink} style={{ marginLeft: 6 }} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {/* Total Revenue Box */}
        <View style={styles.revenueHeaderCard}>
          <Text style={[styles.revLabel, { color: colors.muted }]}>Total Revenue</Text>
          <Text style={[styles.revVal, { color: colors.ink }]}>₹48,750</Text>
          <View style={styles.percentageRow}>
            <Icon name="arrow-up" size={12} color="#10B981" />
            <Text style={styles.percentageText}>+25% <Text style={{ fontWeight: 'normal' }}>vs last month</Text></Text>
          </View>
        </View>

        {/* Custom Bar Chart Card */}
        <View style={[styles.chartCard, { backgroundColor: colors.surface, borderColor: colors.line }]}>
          <View style={styles.barGrid}>
            {/* Visual grid line horizontal markers */}
            <View style={[styles.horizontalMarkerLine, { bottom: '25%', backgroundColor: colors.line }]} />
            <View style={[styles.horizontalMarkerLine, { bottom: '50%', backgroundColor: colors.line }]} />
            <View style={[styles.horizontalMarkerLine, { bottom: '75%', backgroundColor: colors.line }]} />

            {/* Vertical Bars */}
            <View style={styles.barItem}>
              <View style={[styles.barFill, { height: '52%', backgroundColor: purpleTheme.primary }]} />
              <Text style={[styles.barLabel, { color: colors.muted }]}>1 May</Text>
            </View>

            <View style={styles.barItem}>
              <View style={[styles.barFill, { height: '78%', backgroundColor: purpleTheme.primary }]} />
              <Text style={[styles.barLabel, { color: colors.muted }]}>8 May</Text>
            </View>

            <View style={styles.barItem}>
              <View style={[styles.barFill, { height: '62%', backgroundColor: purpleTheme.primary }]} />
              <Text style={[styles.barLabel, { color: colors.muted }]}>15 May</Text>
            </View>

            <View style={styles.barItem}>
              <View style={[styles.barFill, { height: '88%', backgroundColor: purpleTheme.primary }]} />
              <Text style={[styles.barLabel, { color: colors.muted }]}>22 May</Text>
            </View>

            <View style={styles.barItem}>
              <View style={[styles.barFill, { height: '94%', backgroundColor: purpleTheme.primary }]} />
              <Text style={[styles.barLabel, { color: colors.muted }]}>31 May</Text>
            </View>
          </View>
        </View>

        {/* Payment Methods Section */}
        <Text style={[styles.sectionTitle, { color: colors.muted }]}>Payment Methods</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.line }]}>
          {paymentMethods.map((pm, idx) => {
            const isLast = idx === paymentMethods.length - 1;
            return (
              <View
                key={pm.method}
                style={[
                  styles.paymentRow,
                  { borderBottomColor: colors.line },
                  !isLast && { borderBottomWidth: 1 }
                ]}
              >
                {/* Method Name & Amount */}
                <View style={styles.methodInfoCol}>
                  <Text style={[styles.methodName, { color: colors.ink }]}>{pm.method}</Text>
                  <Text style={[styles.methodAmount, { color: colors.ink }]}>{pm.amount}</Text>
                  <Text style={[styles.methodPercent, { color: colors.muted }]}>{pm.percent}</Text>
                </View>

                {/* Progress bar line */}
                <View style={[styles.progressBarTrack, { backgroundColor: colors.canvas }]}>
                  <View style={[styles.progressBarFill, { width: pm.percent as any, backgroundColor: pm.color }]} />
                </View>
              </View>
            );
          })}
        </View>
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
  dropdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  dropdownText: {
    fontSize: 12,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  revenueHeaderCard: {
    alignItems: 'center',
    marginVertical: 16,
  },
  revLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  revVal: {
    fontSize: 34,
    fontWeight: '900',
    marginTop: 6,
  },
  percentageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  percentageText: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  chartCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 16,
    height: 180,
    marginBottom: 24,
    ...premiumShadow,
  },
  barGrid: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    position: 'relative',
    paddingTop: 10,
  },
  horizontalMarkerLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    opacity: 0.1,
  },
  barItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  barFill: {
    width: 22,
    borderRadius: 6,
  },
  barLabel: {
    fontSize: 9.5,
    fontWeight: '600',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginLeft: 8,
    marginBottom: 8,
  },
  card: {
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    ...premiumShadow,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  methodInfoCol: {
    width: '42%',
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  methodName: {
    fontSize: 14,
    fontWeight: 'bold',
    minWidth: 42,
  },
  methodAmount: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  methodPercent: {
    fontSize: 11,
  },
  progressBarTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
});

export default BarberRevenueReport;
