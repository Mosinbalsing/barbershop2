import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View, Dimensions, Platform } from 'react-native';
import { usePremiumTheme, premiumShadow } from '../theme/premiumTheme';
import { Typography } from './Typography';
import { Icon } from './Icon';
import { notificationService } from '../../helper/notificationService';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export const NotificationBanner = () => {
  const { colors } = usePremiumTheme();
  const insets = useSafeAreaInsets();
  
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  
  const slideAnim = useRef(new Animated.Value(-150)).current;
  const timeoutRef = useRef<any>(null);

  useEffect(() => {
    const unsubscribe = notificationService.subscribe((newTitle, newMessage) => {
      setTitle(newTitle);
      setMessage(newMessage);
      setVisible(true);

      // Reset animation value
      slideAnim.setValue(-150);

      // Slide Down
      Animated.spring(slideAnim, {
        toValue: insets.top > 0 ? insets.top + 8 : 16,
        useNativeDriver: true,
        damping: 15,
        stiffness: 120,
      }).start();

      // Auto close after 4 seconds
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        handleDismiss();
      }, 4000);
    });

    return () => {
      unsubscribe();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [insets.top, slideAnim]);

  const handleDismiss = () => {
    Animated.timing(slideAnim, {
      toValue: -150,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
    });
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.bannerContainer,
        premiumShadow,
        {
          backgroundColor: colors.surface,
          borderColor: colors.line,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity activeOpacity={0.9} onPress={handleDismiss} style={styles.contentRow}>
        {/* App Icon Circle */}
        <View style={[styles.iconWrapper, { backgroundColor: colors.softPrimary }]}>
          <Icon name="scissors" size={16} color="primary" />
        </View>
        
        {/* Text Area */}
        <View style={styles.textContainer}>
          <View style={styles.headerRow}>
            <Typography variant="caption" weight="bold" color="primary">Barobar Shop</Typography>
            <Typography variant="label" color="muted">now</Typography>
          </View>
          <Typography variant="caption" weight="600" color="ink" numberOfLines={1} style={styles.titleText}>
            {title}
          </Typography>
          <Typography variant="caption" color="muted" numberOfLines={2} style={styles.messageText}>
            {message}
          </Typography>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    position: 'absolute',
    top: 0,
    left: 12,
    right: 12,
    zIndex: 9999999,
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 14,
    elevation: 10,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  titleText: {
    fontSize: 13,
  },
  messageText: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 1,
  },
});
