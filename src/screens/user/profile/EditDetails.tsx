import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Typography } from '../../../shared/components/Typography';
import { Header } from '../../../shared/components/Header';
import { Icon } from '../../../shared/components/Icon';
import { Button } from '../../../shared/components/Button';
import { usePremiumTheme, premiumSpacing } from '../../../shared/theme/premiumTheme';
import { useNavigation } from '@react-navigation/native';

const EditDetails = () => {
  const { colors } = usePremiumTheme();
  const navigation = useNavigation<any>();

  // Form State
  const [name, setName] = useState('Rahul Sharma');
  const [mobile, setMobile] = useState('9876543210');
  const [email, setEmail] = useState('rahul.sharma@gmail.com');
  const [gender, setGender] = useState('Male');
  const [dob, setDob] = useState('15 May 1998');
  const [address, setAddress] = useState('123, Green Street, Indore, Madhya Pradesh - 452001');

  const handleSaveChanges = () => {
    if (!name.trim() || !mobile.trim() || !email.trim()) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
    
    // Simulate API call and pop up success dialog
    Alert.alert(
      'Profile Updated',
      'Your profile details have been saved successfully!',
      [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('PersonalDetails');
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.canvas }]}>
      <Header title="Edit Details" showBack />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.formContainer}>
          {/* Full Name */}
          <View style={styles.fieldGroup}>
            <Typography variant="label" color="muted" style={styles.fieldLabel}>Full Name</Typography>
            <TextInput
              value={name}
              onChangeText={setName}
              style={[
                styles.textInput,
                { backgroundColor: colors.surface, borderColor: colors.line, color: colors.ink }
              ]}
              placeholder="Enter your full name"
              placeholderTextColor={colors.muted}
            />
          </View>

          {/* Mobile Number */}
          <View style={styles.fieldGroup}>
            <Typography variant="label" color="muted" style={styles.fieldLabel}>Mobile Number</Typography>
            <TextInput
              value={mobile}
              onChangeText={setMobile}
              style={[
                styles.textInput,
                { backgroundColor: colors.surface, borderColor: colors.line, color: colors.ink }
              ]}
              keyboardType="phone-pad"
              placeholder="Enter mobile number"
              placeholderTextColor={colors.muted}
            />
          </View>

          {/* Email Address */}
          <View style={styles.fieldGroup}>
            <Typography variant="label" color="muted" style={styles.fieldLabel}>Email Address</Typography>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={[
                styles.textInput,
                { backgroundColor: colors.surface, borderColor: colors.line, color: colors.ink }
              ]}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="Enter email address"
              placeholderTextColor={colors.muted}
            />
          </View>

          {/* Gender (Custom dropdown button) */}
          <View style={styles.fieldGroup}>
            <Typography variant="label" color="muted" style={styles.fieldLabel}>Gender</Typography>
            <TouchableOpacity
              onPress={() => {
                Alert.alert('Select Gender', 'Choose your gender', [
                  { text: 'Male', onPress: () => setGender('Male') },
                  { text: 'Female', onPress: () => setGender('Female') },
                  { text: 'Other', onPress: () => setGender('Other') },
                ]);
              }}
              style={[
                styles.dropdownTrigger,
                { backgroundColor: colors.surface, borderColor: colors.line }
              ]}
            >
              <Typography variant="body" color="ink">{gender}</Typography>
              <Icon name="chevron-down" size={18} color="muted" />
            </TouchableOpacity>
          </View>

          {/* Date of Birth */}
          <View style={styles.fieldGroup}>
            <Typography variant="label" color="muted" style={styles.fieldLabel}>Date of Birth</Typography>
            <TouchableOpacity
              onPress={() => {
                Alert.alert('Select Date', 'Open calendar selector (Simulation)');
              }}
              style={[
                styles.dropdownTrigger,
                { backgroundColor: colors.surface, borderColor: colors.line }
              ]}
            >
              <Typography variant="body" color="ink">{dob}</Typography>
              <Icon name="calendar-outline" size={18} color="muted" />
            </TouchableOpacity>
          </View>

          {/* Address */}
          <View style={styles.fieldGroup}>
            <Typography variant="label" color="muted" style={styles.fieldLabel}>Address</Typography>
            <TextInput
              value={address}
              onChangeText={setAddress}
              multiline
              numberOfLines={3}
              style={[
                styles.textInput,
                styles.textArea,
                { backgroundColor: colors.surface, borderColor: colors.line, color: colors.ink }
              ]}
              placeholder="Enter your address"
              placeholderTextColor={colors.muted}
            />
          </View>
        </View>

      </ScrollView>

      {/* Footer Save Button */}
      <View style={[styles.footer, { backgroundColor: colors.canvas }]}>
        <Button
          title="Save Changes"
          size="large"
          onPress={handleSaveChanges}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 100 },
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
  textInput: {
    height: 52,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 52,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  textArea: {
    height: 90,
    paddingTop: 12,
    paddingBottom: 12,
    textAlignVertical: 'top',
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

export default EditDetails;
