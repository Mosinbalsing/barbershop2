import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { usePremiumTheme, premiumShadow } from '../../../shared/theme/premiumTheme';

const BarberProfileEdit = () => {
  const { colors, mode } = usePremiumTheme();
  const navigation = useNavigation();

  const purpleTheme = {
    primary: '#6D4CF3',
  };

  const [name, setName] = useState('Rahul Verma');
  const [phone, setPhone] = useState('98765-43210');
  const [shopName, setShopName] = useState('The Classic Cuts');
  const [email, setEmail] = useState('rahulverma@gmail.com');

  const handleSaveChanges = () => {
    if (!name.trim() || !phone.trim() || !shopName.trim() || !email.trim()) {
      Alert.alert('Missing Fields', 'Please fill in all the profile details.');
      return;
    }

    Alert.alert('Changes Saved', 'Your profile details have been updated successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.canvas }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.line }]}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={18} color={colors.ink} />
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { color: colors.ink }]}>Edit Profile</Text>

          <View style={{ width: 36 }} />
        </View>

        <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
          {/* Edit Form */}
          <View style={[styles.formCard, { backgroundColor: colors.surface, borderColor: colors.line }]}>
            {/* Name Input */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, { color: colors.muted }]}>Name</Text>
              <TextInput
                style={[styles.inputField, { color: colors.ink, borderColor: colors.line }]}
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Phone Input */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, { color: colors.muted }]}>Phone Number</Text>
              <TextInput
                style={[styles.inputField, { color: colors.ink, borderColor: colors.line }]}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            {/* Shop Name Input */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, { color: colors.muted }]}>Shop Name</Text>
              <TextInput
                style={[styles.inputField, { color: colors.ink, borderColor: colors.line }]}
                value={shopName}
                onChangeText={setShopName}
              />
            </View>

            {/* Email Input */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, { color: colors.muted }]}>Email</Text>
              <TextInput
                style={[styles.inputField, { color: colors.ink, borderColor: colors.line }]}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Save Button CTA */}
          <TouchableOpacity
            style={[styles.saveBtn, { backgroundColor: purpleTheme.primary }]}
            onPress={handleSaveChanges}
          >
            <Text style={styles.saveBtnText}>Save Changes</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  formCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 16,
    marginBottom: 24,
    ...premiumShadow,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  inputField: {
    borderWidth: 1,
    borderRadius: 14,
    height: 44,
    paddingHorizontal: 12,
    fontSize: 14,
    fontWeight: '600',
  },
  saveBtn: {
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    ...premiumShadow,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BarberProfileEdit;
