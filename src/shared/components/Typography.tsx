import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { usePremiumTheme } from '../theme/premiumTheme';

export interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'label';
  color?: 'ink' | 'muted' | 'primary' | 'secondary' | 'surface' | 'nav' | 'error';
  align?: 'left' | 'center' | 'right' | 'justify';
  weight?: 'normal' | '500' | '600' | 'bold';
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  color = 'ink',
  align = 'left',
  weight,
  style,
  children,
  ...props
}) => {
  const { colors } = usePremiumTheme();
  
  // Custom error color mapping since premiumTheme doesn't have it explicitly
  const textColor = color === 'error' ? '#FF4B4B' : colors[color];

  return (
    <Text
      style={[
        styles[variant],
        { color: textColor, textAlign: align },
        weight && { fontWeight: weight },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  h1: { fontSize: 32, fontWeight: 'bold' },
  h2: { fontSize: 24, fontWeight: 'bold' },
  h3: { fontSize: 20, fontWeight: '600' },
  h4: { fontSize: 18, fontWeight: '600' },
  body: { fontSize: 16, fontWeight: '400' },
  caption: { fontSize: 14, fontWeight: '400' },
  label: { fontSize: 12, fontWeight: '500' },
});
