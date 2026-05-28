import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Typography } from '../../../shared/components/Typography';
import { Icon } from '../../../shared/components/Icon';
import { usePremiumTheme } from '../../../shared/theme/premiumTheme';

export interface MenuItemProps {
  title: string;
  iconName: string;
  onPress?: () => void;
  isDestructive?: boolean;
}

export const MenuItem: React.FC<MenuItemProps> = ({ title, iconName, onPress, isDestructive }) => {
  const { colors } = usePremiumTheme();

  return (
    <TouchableOpacity style={[styles.container, { borderBottomColor: colors.line }]} onPress={onPress}>
      <View style={styles.left}>
        <Icon name={iconName} size={24} color={isDestructive ? 'error' : 'ink'} />
        <Typography variant="body" color={isDestructive ? 'error' : 'ink'} style={styles.title}>
          {title}
        </Typography>
      </View>
      <Icon name="chevron-forward" size={20} color="muted" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    marginLeft: 16,
    fontWeight: '500',
  },
});
