import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { premiumColors, premiumSpacing } from '../theme/premiumTheme';

type PremiumHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
};

export const PremiumHeader = ({ eyebrow, title, subtitle, right }: PremiumHeaderProps) => (
  <View style={styles.header}>
    <View style={styles.headerText}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
    {right}
  </View>
);

type MetricCardProps = {
  label: string;
  value: string;
  detail?: string;
  tone?: 'primary' | 'secondary';
};

export const MetricCard = ({ label, value, detail, tone = 'primary' }: MetricCardProps) => (
  <View style={[styles.metricCard, tone === 'secondary' && styles.metricCardSecondary]}>
    <Text style={styles.metricLabel}>{label}</Text>
    <Text style={styles.metricValue}>{value}</Text>
    {detail ? <Text style={styles.metricDetail}>{detail}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: premiumSpacing.screen,
    paddingTop: 22,
    paddingBottom: 14,
  },
  headerText: {
    flex: 1,
    paddingRight: 12,
  },
  eyebrow: {
    color: premiumColors.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0,
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  title: {
    color: premiumColors.ink,
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    color: premiumColors.muted,
    fontSize: 14,
    marginTop: 5,
  },
  metricCard: {
    flex: 1,
    minHeight: 116,
    borderRadius: premiumSpacing.cardRadius,
    backgroundColor: premiumColors.surface,
    borderWidth: 1,
    borderColor: premiumColors.line,
    padding: 16,
  },
  metricCardSecondary: {
    backgroundColor: premiumColors.softSecondary,
    borderColor: premiumColors.secondary,
  },
  metricLabel: {
    color: premiumColors.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  metricValue: {
    color: premiumColors.ink,
    fontSize: 26,
    fontWeight: '800',
    marginTop: 12,
  },
  metricDetail: {
    color: premiumColors.primary,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 8,
  },
});
