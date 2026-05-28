import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { usePremiumTheme, premiumShadow } from '../../../shared/theme/premiumTheme';

const { width } = Dimensions.get('window');

type MetricItem = {
  label: string;
  value: string;
  percent: string;
  iconBg: string;
};

const BarberReports = () => {
  const { colors, mode } = usePremiumTheme();
  const navigation = useNavigation<any>();

  const purpleTheme = {
    primary: '#6D4CF3',
    activeBg: mode === 'dark' ? 'rgba(109, 76, 243, 0.25)' : 'rgba(109, 76, 243, 0.12)',
  };

  const metrics: MetricItem[] = [
    {
      label: 'Total Revenue',
      value: '₹48,750',
      percent: '+25%',
      iconBg: mode === 'dark' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)',
    },
    {
      label: 'Total Bookings',
      value: '128',
      percent: '+16%',
      iconBg: mode === 'dark' ? 'rgba(109, 76, 243, 0.2)' : 'rgba(109, 76, 243, 0.1)',
    },
    {
      label: 'New Customers',
      value: '86',
      percent: '+20%',
      iconBg: mode === 'dark' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)',
    },
    {
      label: 'Completed',
      value: '102',
      percent: '+15%',
      iconBg: mode === 'dark' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.1)',
    },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.canvas }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.line }]}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={18} color={colors.ink} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.ink }]}>Reports Overview</Text>

        <TouchableOpacity style={[styles.dropdownRow, { backgroundColor: colors.canvas, borderColor: colors.line }]}>
          <Text style={[styles.dropdownText, { color: colors.ink }]}>This Month</Text>
          <Icon name="chevron-down" size={10} color={colors.ink} style={{ marginLeft: 6 }} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {/* Metrics Grid */}
        <View style={styles.metricsGrid}>
          {metrics.map(m => (
            <TouchableOpacity
              key={m.label}
              style={[styles.metricCard, { backgroundColor: colors.surface, borderColor: colors.line }]}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('BarberRevenueReport')}
            >
              <Text style={[styles.metricLabel, { color: colors.muted }]}>{m.label}</Text>
              <View style={styles.valueRow}>
                <Text style={[styles.metricValue, { color: colors.ink }]}>{m.value}</Text>
                <Text style={styles.percentText}>{m.percent}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Spline spline chart Card */}
        <View style={[styles.chartCard, { backgroundColor: colors.surface, borderColor: colors.line }]}>
          <Text style={[styles.chartTitleText, { color: colors.ink }]}>Revenue Overview</Text>

          {/* Spline curve visual rendering */}
          <View style={styles.chartPlaceholder}>
            {/* Horizontal grid lines */}
            <View style={[styles.gridLineHorizontal, { top: '25%', backgroundColor: colors.line }]} />
            <View style={[styles.gridLineHorizontal, { top: '50%', backgroundColor: colors.line }]} />
            <View style={[styles.gridLineHorizontal, { top: '75%', backgroundColor: colors.line }]} />

            {/* Spline curve rendering */}
            <View style={styles.curveWrapper}>
              <View style={[styles.chartDot, { left: '10%', top: '70%', backgroundColor: purpleTheme.primary }]} />
              <View style={[styles.chartDot, { left: '32%', top: '48%', backgroundColor: purpleTheme.primary }]} />
              <View style={[styles.chartDot, { left: '54%', top: '58%', backgroundColor: purpleTheme.primary }]} />
              <View style={[styles.chartDot, { left: '76%', top: '52%', backgroundColor: purpleTheme.primary }]} />
              <View style={[styles.chartDot, { left: '92%', top: '32%', backgroundColor: purpleTheme.primary }]} />
              
              {/* Line connectors */}
              <View style={[styles.lineSegment, { left: '10%', top: '59%', width: '22%', height: 2, backgroundColor: purpleTheme.primary, transform: [{ rotate: '-32deg' }] }]} />
              <View style={[styles.lineSegment, { left: '32%', top: '53%', width: '22%', height: 2, backgroundColor: purpleTheme.primary, transform: [{ rotate: '18deg' }] }]} />
              <View style={[styles.lineSegment, { left: '54%', top: '55%', width: '22%', height: 2, backgroundColor: purpleTheme.primary, transform: [{ rotate: '-10deg' }] }]} />
              <View style={[styles.lineSegment, { left: '76%', top: '42%', width: '16%', height: 2, backgroundColor: purpleTheme.primary, transform: [{ rotate: '-38deg' }] }]} />
            </View>
          </View>

          {/* X axis labels */}
          <View style={styles.xAxisLabels}>
            <Text style={[styles.xAxisText, { color: colors.muted }]}>1 May</Text>
            <Text style={[styles.xAxisText, { color: colors.muted }]}>8 May</Text>
            <Text style={[styles.xAxisText, { color: colors.muted }]}>15 May</Text>
            <Text style={[styles.xAxisText, { color: colors.muted }]}>22 May</Text>
            <Text style={[styles.xAxisText, { color: colors.muted }]}>31 May</Text>
          </View>
        </View>

        {/* View Detail Report Link CTA */}
        <TouchableOpacity
          style={[styles.detailBtn, { backgroundColor: purpleTheme.primary }]}
          onPress={() => navigation.navigate('BarberRevenueReport')}
        >
          <Text style={styles.detailBtnText}>View Detailed Report</Text>
        </TouchableOpacity>
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
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
    marginBottom: 20,
  },
  metricCard: {
    width: (width - 44) / 2,
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    ...premiumShadow,
  },
  metricLabel: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  percentText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: 'bold',
  },
  chartCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 16,
    marginBottom: 24,
    ...premiumShadow,
  },
  chartTitleText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chartPlaceholder: {
    height: 120,
    position: 'relative',
    marginBottom: 10,
  },
  gridLineHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    opacity: 0.1,
  },
  curveWrapper: {
    ...StyleSheet.absoluteFillObject,
  },
  chartDot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    zIndex: 2,
  },
  lineSegment: {
    position: 'absolute',
    zIndex: 1,
  },
  xAxisLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  xAxisText: {
    fontSize: 10,
    fontWeight: '600',
  },
  detailBtn: {
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    ...premiumShadow,
  },
  detailBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BarberReports;
