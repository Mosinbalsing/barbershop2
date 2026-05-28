import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Typography } from '../../../shared/components/Typography';
import { Icon } from '../../../shared/components/Icon';
import { usePremiumTheme, premiumSpacing, premiumShadow } from '../../../shared/theme/premiumTheme';

export interface ServiceItemProps {
  title: string;
  duration: string;
  price: string;
  iconName: string;
  variant?: 'grid' | 'list';
  onPress?: () => void;
  isLast?: boolean;
}

export const ServiceItem: React.FC<ServiceItemProps> = ({
  title,
  duration,
  price,
  iconName,
  variant = 'list',
  onPress,
  isLast = false,
}) => {
  const { colors } = usePremiumTheme();

  if (variant === 'grid') {
    return (
      <TouchableOpacity
        style={[styles.gridContainer, { backgroundColor: colors.surface }, premiumShadow]}
        onPress={onPress}
      >
        <Icon name={iconName} size={32} color="primary" style={styles.gridIcon} />
        <Typography variant="body" weight="600" align="center">{title}</Typography>
        <Typography variant="caption" color="muted" align="center" style={styles.spacing}>{duration}</Typography>
        <Typography variant="h4" color="ink" align="center" weight="bold">{price}</Typography>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.listContainer,
        { borderBottomColor: colors.line, borderBottomWidth: isLast ? 0 : 1 }
      ]}
      onPress={onPress}
    >
      <View style={[styles.listIconContainer, { backgroundColor: colors.canvas }]}>
        <Icon name={iconName} size={24} color="ink" />
      </View>
      <View style={styles.listContent}>
        <Typography variant="body" weight="600">{title}</Typography>
        <Typography variant="caption" color="muted">{duration}</Typography>
      </View>
      <View style={styles.listRight}>
        <Typography variant="body" weight="bold">{price}</Typography>
        <Icon name="chevron-forward" size={20} color="muted" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    width: '47%',
    padding: 16,
    borderRadius: premiumSpacing.cardRadius,
    alignItems: 'center',
    marginBottom: 16,
  },
  gridIcon: { marginBottom: 12 },
  spacing: { marginBottom: 8 },
  listContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  listIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  listContent: { flex: 1 },
  listRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
