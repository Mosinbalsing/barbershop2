import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { usePremiumTheme } from '../theme/premiumTheme';
import { Typography } from './Typography';
import { Icon } from './Icon';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface HeaderProps {
  title?: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
  leftElement?: React.ReactNode;
  transparent?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  rightElement,
  leftElement,
  transparent = false,
}) => {
  const { colors } = usePremiumTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: transparent ? 'transparent' : colors.canvas }]}>
      <View style={styles.left}>
        {showBack ? (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
            <Icon name="arrow-back" size={24} color="ink" />
          </TouchableOpacity>
        ) : (
          leftElement
        )}
      </View>

      <View style={styles.center}>
        {title && (
          <Typography variant="h4" color="ink" align="center">
            {title}
          </Typography>
        )}
      </View>

      <View style={styles.right}>
        {rightElement}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  left: { flex: 1, alignItems: 'flex-start' },
  center: { flex: 2, alignItems: 'center' },
  right: { flex: 1, alignItems: 'flex-end' },
  iconButton: { padding: 4 },
});
