import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, StyleSheet, ActivityIndicator, View } from 'react-native';
import { usePremiumTheme } from '../theme/premiumTheme';
import { Typography } from './Typography';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  icon,
  style,
  disabled,
  ...props
}) => {
  const { colors } = usePremiumTheme();

  const getBackgroundColor = () => {
    if (disabled && variant !== 'text') return colors.line;
    switch (variant) {
      case 'primary': return colors.primary;
      case 'secondary': return colors.softPrimary;
      case 'outline': return 'transparent';
      case 'text': return 'transparent';
      default: return colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.muted;
    switch (variant) {
      case 'primary': return colors.surface;
      case 'secondary': return colors.primary;
      case 'outline': return colors.primary;
      case 'text': return colors.primary;
      default: return colors.surface;
    }
  };

  return (
    <TouchableOpacity
      disabled={disabled || loading}
      style={[
        styles.base,
        styles[size],
        { backgroundColor: getBackgroundColor() },
        variant === 'outline' && { borderWidth: 1, borderColor: colors.primary },
        disabled && variant === 'outline' && { borderColor: colors.line },
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Typography color="surface" weight="600" style={{ color: getTextColor() }}>
            {title}
          </Typography>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  small: { paddingVertical: 8, paddingHorizontal: 16 },
  medium: { paddingVertical: 14, paddingHorizontal: 24 },
  large: { paddingVertical: 18, paddingHorizontal: 32 },
  content: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: { marginRight: 8 },
});
