import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { usePremiumTheme } from '../theme/premiumTheme';

type PopupVariant = 'success' | 'error';

type AnimatedStatusPopupProps = {
  visible: boolean;
  title: string;
  message: string;
  variant: PopupVariant;
  onClose: () => void;
  autoCloseMs?: number;
};

type AnimatedConfirmPopupProps = {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
};

const usePopupAnimation = (visible: boolean) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(26)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: visible ? 1 : 0,
        duration: visible ? 240 : 190,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: visible ? 0 : 26,
        useNativeDriver: true,
        damping: 17,
        stiffness: 210,
        mass: 0.75,
      }),
    ]).start();
  }, [opacity, translateY, visible]);

  return { opacity, translateY };
};

export const AnimatedStatusPopup = ({
  visible,
  title,
  message,
  variant,
  onClose,
  autoCloseMs = 1900,
}: AnimatedStatusPopupProps) => {
  const { colors } = usePremiumTheme();
  const { opacity, translateY } = usePopupAnimation(visible);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(onClose, autoCloseMs);
    return () => clearTimeout(timer);
  }, [autoCloseMs, onClose, visible]);

  const isSuccess = variant === 'success';
  const iconName = isSuccess ? 'check-circle' : 'times-circle';
  const accent = isSuccess ? colors.secondary : '#FF6F8B';

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <Animated.View style={[styles.backdrop, { opacity }]}>
        <Pressable style={styles.backdropTapArea} onPress={onClose} />
        <Animated.View
          style={[
            styles.popupCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.line,
              transform: [{ translateY }],
            },
          ]}
        >
          <View style={[styles.iconWrap, { backgroundColor: `${accent}20` }]}>
            <Icon name={iconName} size={24} color={accent} />
          </View>
          <Text style={[styles.title, { color: colors.ink }]}>{title}</Text>
          <Text style={[styles.message, { color: colors.muted }]}>{message}</Text>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export const AnimatedConfirmPopup = ({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}: AnimatedConfirmPopupProps) => {
  const { colors } = usePremiumTheme();
  const { opacity, translateY } = usePopupAnimation(visible);

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onCancel}>
      <Animated.View style={[styles.backdrop, { opacity }]}>
        <Pressable style={styles.backdropTapArea} onPress={onCancel} />
        <Animated.View
          style={[
            styles.popupCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.line,
              transform: [{ translateY }],
            },
          ]}
        >
          <View style={[styles.iconWrap, { backgroundColor: `${colors.primary}22` }]}>
            <Icon name="question-circle" size={24} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.ink }]}>{title}</Text>
          <Text style={[styles.message, { color: colors.muted }]}>{message}</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton, { borderColor: colors.line }]}
              onPress={onCancel}
            >
              <Text style={[styles.cancelText, { color: colors.ink }]}>{cancelText}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.confirmButton, { backgroundColor: colors.primary }]}
              onPress={onConfirm}
            >
              <Text style={styles.confirmText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(16,18,24,0.4)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  backdropTapArea: {
    ...StyleSheet.absoluteFillObject,
  },
  popupCard: {
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 16,
    alignItems: 'center',
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
  },
  message: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
    width: '100%',
  },
  actionButton: {
    flex: 1,
    borderRadius: 14,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderWidth: 1,
  },
  confirmButton: {
    borderWidth: 0,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '800',
  },
  confirmText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
