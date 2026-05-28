import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { usePremiumTheme } from '../theme/premiumTheme';

export interface IconProps {
  name: string;
  size?: number;
  color?: 'ink' | 'muted' | 'primary' | 'secondary' | 'surface' | 'nav' | 'error';
  style?: any;
}

export const Icon: React.FC<IconProps> = ({ name, size = 24, color = 'ink', style }) => {
  const { colors } = usePremiumTheme();
  const iconColor = color === 'error' ? '#FF4B4B' : colors[color];

  return <Ionicons name={name} size={size} color={iconColor} style={style} />;
};
