import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Typography } from '../../../shared/components/Typography';
import { Header } from '../../../shared/components/Header';
import { Icon } from '../../../shared/components/Icon';
import { Button } from '../../../shared/components/Button';
import { usePremiumTheme, premiumSpacing, premiumShadow } from '../../../shared/theme/premiumTheme';
import { useNavigation } from '@react-navigation/native';

const PersonalDetails = () => {
  const { colors } = usePremiumTheme();
  const navigation = useNavigation<any>();

  return (
    <View style={[styles.container, { backgroundColor: colors.canvas }]}>
      <Header title="Personal Details" showBack />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Profile Avatar with edit badge */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: colors.softPrimary }]}>
              <Icon name="person" size={56} color="primary" />
            </View>
            <View style={[styles.editBadge, { backgroundColor: colors.surface }]}>
              <Icon name="camera-outline" size={16} color="ink" />
            </View>
          </View>
        </View>

        {/* View Fields Container */}
        <View style={styles.formContainer}>
          {/* Full Name */}
          <View style={styles.fieldGroup}>
            <Typography variant="label" color="muted" style={styles.fieldLabel}>Full Name</Typography>
            <View style={[styles.readOnlyInput, { backgroundColor: colors.surface, borderColor: colors.line }]}>
              <Typography variant="body" color="ink">Rahul Sharma</Typography>
            </View>
          </View>

          {/* Mobile Number */}
          <View style={styles.fieldGroup}>
            <Typography variant="label" color="muted" style={styles.fieldLabel}>Mobile Number</Typography>
            <View style={[styles.readOnlyInput, { backgroundColor: colors.surface, borderColor: colors.line }]}>
              <Typography variant="body" color="ink">9876543210</Typography>
            </View>
          </View>

          {/* Email Address */}
          <View style={styles.fieldGroup}>
            <Typography variant="label" color="muted" style={styles.fieldLabel}>Email Address</Typography>
            <View style={[styles.readOnlyInput, { backgroundColor: colors.surface, borderColor: colors.line }]}>
              <Typography variant="body" color="ink">rahul.sharma@gmail.com</Typography>
            </View>
          </View>

          {/* Gender */}
          <View style={styles.fieldGroup}>
            <Typography variant="label" color="muted" style={styles.fieldLabel}>Gender</Typography>
            <View style={[styles.readOnlyInput, { backgroundColor: colors.surface, borderColor: colors.line }]}>
              <Typography variant="body" color="ink">Male</Typography>
              <Icon name="chevron-down" size={18} color="muted" />
            </View>
          </View>

          {/* Date of Birth */}
          <View style={styles.fieldGroup}>
            <Typography variant="label" color="muted" style={styles.fieldLabel}>Date of Birth</Typography>
            <View style={[styles.readOnlyInput, { backgroundColor: colors.surface, borderColor: colors.line }]}>
              <Typography variant="body" color="ink">15 May 1998</Typography>
              <Icon name="calendar-outline" size={18} color="muted" />
            </View>
          </View>

          {/* Address */}
          <View style={styles.fieldGroup}>
            <Typography variant="label" color="muted" style={styles.fieldLabel}>Address</Typography>
            <View style={[styles.readOnlyInput, styles.addressInput, { backgroundColor: colors.surface, borderColor: colors.line }]}>
              <Typography variant="body" color="ink" style={styles.addressText}>
                123, Green Street, Indore, Madhya Pradesh - 452001
              </Typography>
            </View>
          </View>
        </View>

      </ScrollView>

      {/* Footer Update Button */}
      <View style={[styles.footer, { backgroundColor: colors.canvas }]}>
        <Button
          title="Update Details"
          size="large"
          onPress={() => navigation.navigate('EditDetails')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 100 },
  avatarSection: {
    alignItems: 'center',
    marginVertical: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  formContainer: {
    gap: 16,
    marginTop: 8,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontWeight: '600',
    fontSize: 13,
  },
  readOnlyInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 52,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  addressInput: {
    height: 'auto',
    minHeight: 70,
    paddingVertical: 12,
  },
  addressText: {
    lineHeight: 20,
    flex: 1,
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

export default PersonalDetails;
