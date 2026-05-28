import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Switch } from 'react-native';
import { Typography } from '../../../shared/components/Typography';
import { Header } from '../../../shared/components/Header';
import { Icon } from '../../../shared/components/Icon';
import { Button } from '../../../shared/components/Button';
import { usePremiumTheme, premiumSpacing, premiumShadow } from '../../../shared/theme/premiumTheme';
import { notificationService } from '../../../helper/notificationService';

const NotificationSettings = () => {
  const { colors } = usePremiumTheme();

  // Switches states
  const [pushEnabled, setPushEnabled] = useState(true);
  const [bookingEnabled, setBookingEnabled] = useState(true);
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [offersEnabled, setOffersEnabled] = useState(true);
  const [generalEnabled, setGeneralEnabled] = useState(false);

  // Send Push Notification simulation trigger
  const triggerPushSimulation = () => {
    if (!pushEnabled) {
      notificationService.show(
        "Simulator Warning",
        "Push notifications are currently turned off in your preferences. Toggle it on to see push banners!"
      );
      return;
    }

    notificationService.show(
      "Reminder: Appointment Tomorrow",
      "Your appointment for Haircut & Beard Trim is tomorrow at 05:00 PM."
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.canvas }]}>
      <Header title="Notification Settings" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Toggle List Card */}
        <View style={[styles.settingsCard, { backgroundColor: colors.surface }, premiumShadow]}>
          {/* Push Notifications */}
          <View style={[styles.settingRow, { borderBottomColor: colors.line }]}>
            <View style={styles.settingInfo}>
              <Typography variant="body" weight="bold">Push Notifications</Typography>
              <Typography variant="caption" color="muted">Receive push notifications</Typography>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ false: colors.line, true: colors.primary }}
              thumbColor={colors.surface}
            />
          </View>

          {/* Booking Notifications */}
          <View style={[styles.settingRow, { borderBottomColor: colors.line }]}>
            <View style={styles.settingInfo}>
              <Typography variant="body" weight="bold">Booking Notifications</Typography>
              <Typography variant="caption" color="muted">Get booking updates</Typography>
            </View>
            <Switch
              value={bookingEnabled}
              onValueChange={setBookingEnabled}
              trackColor={{ false: colors.line, true: colors.primary }}
              thumbColor={colors.surface}
            />
          </View>

          {/* Reminder Notifications */}
          <View style={[styles.settingRow, { borderBottomColor: colors.line }]}>
            <View style={styles.settingInfo}>
              <Typography variant="body" weight="bold">Reminder Notifications</Typography>
              <Typography variant="caption" color="muted">Get appointment reminders</Typography>
            </View>
            <Switch
              value={remindersEnabled}
              onValueChange={setRemindersEnabled}
              trackColor={{ false: colors.line, true: colors.primary }}
              thumbColor={colors.surface}
            />
          </View>

          {/* Offers & Coupons */}
          <View style={[styles.settingRow, { borderBottomColor: colors.line }]}>
            <View style={styles.settingInfo}>
              <Typography variant="body" weight="bold">Offers & Coupons</Typography>
              <Typography variant="caption" color="muted">Receive offers and coupons</Typography>
            </View>
            <Switch
              value={offersEnabled}
              onValueChange={setOffersEnabled}
              trackColor={{ false: colors.line, true: colors.primary }}
              thumbColor={colors.surface}
            />
          </View>

          {/* General Updates */}
          <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
            <View style={styles.settingInfo}>
              <Typography variant="body" weight="bold">General Updates</Typography>
              <Typography variant="caption" color="muted">Important updates & news</Typography>
            </View>
            <Switch
              value={generalEnabled}
              onValueChange={setGeneralEnabled}
              trackColor={{ false: colors.line, true: colors.primary }}
              thumbColor={colors.surface}
            />
          </View>
        </View>

        {/* Informational Blue Box */}
        <View style={[styles.infoAlertBox, { backgroundColor: '#E0F2FE', borderColor: '#0284C7' }]}>
          <Icon name="information-circle-outline" size={20} color="primary" style={styles.infoIcon} />
          <Typography variant="caption" style={{ color: '#0369A1', flex: 1, lineHeight: 18 }}>
            You will still receive important alerts even if some categories are turned off.
          </Typography>
        </View>

        {/* Dynamic push simulator description */}
        <View style={styles.simulatorDescription}>
          <Typography variant="h4" weight="bold">Push Notification Simulator</Typography>
          <Typography variant="caption" color="muted" style={styles.descText}>
            Click the button below to test a live push notification. A native-style slide-down banner alert will instantly appear on the top of your screen!
          </Typography>
        </View>

      </ScrollView>

      {/* Simulator trigger button in footer */}
      <View style={[styles.footer, { backgroundColor: colors.canvas }]}>
        <Button
          title="Send Test Notification"
          size="large"
          onPress={triggerPushSimulation}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 100, gap: 16 },
  settingsCard: {
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    borderBottomWidth: 1,
  },
  settingInfo: {
    flex: 1,
    paddingRight: 16,
  },
  infoAlertBox: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  infoIcon: { marginRight: 12 },
  simulatorDescription: {
    marginTop: 16,
    gap: 8,
  },
  descText: {
    lineHeight: 18,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32,
  },
});

export default NotificationSettings;
