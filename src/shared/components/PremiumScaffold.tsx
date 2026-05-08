import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { premiumSpacing, usePremiumTheme } from '../theme/premiumTheme';

type PremiumHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
};

export const PremiumHeader = ({ eyebrow, title, subtitle, right }: PremiumHeaderProps) => {
  const { colors } = usePremiumTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.header}>
      <View style={styles.headerText}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
};

type MetricCardProps = {
  label: string;
  value: string;
  detail?: string;
  tone?: 'primary' | 'secondary';
};

export const MetricCard = ({ label, value, detail, tone = 'primary' }: MetricCardProps) => {
  const { colors } = usePremiumTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={[styles.metricCard, tone === 'secondary' && styles.metricCardSecondary]}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      {detail ? <Text style={styles.metricDetail}>{detail}</Text> : null}
    </View>
  );
};

const createStyles = (colors: typeof import('../theme/premiumTheme').premiumColors) => StyleSheet.create({
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
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0,
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 5,
  },
  metricCard: {
    flex: 1,
    minHeight: 116,
    borderRadius: premiumSpacing.cardRadius,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 16,
  },
  metricCardSecondary: {
    backgroundColor: colors.softSecondary,
    borderColor: colors.secondary,
  },
  metricLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  metricValue: {
    color: colors.ink,
    fontSize: 26,
    fontWeight: '800',
    marginTop: 12,
  },
  metricDetail: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 8,
  },
});
