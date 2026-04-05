
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { fetchApi } from '../../../Api/http_services';
import { apiPath } from '../../../environment/environment_urls';
import Loader from '../../../shared/components/Loader';


const ForgetPass = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Send OTP
  const handleSendOtp = async () => {
    if (!mobile || mobile.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetchApi(
        'POST',
        apiPath.auth.sendResetOtp,
        null,
        false,
        { mobile_no: mobile },
        false,
        'application/json',
      );
      if (res?.status === false) {
        Alert.alert('Error', res?.message || 'Failed to send OTP');
      } else {
        setStep(2);
        Alert.alert('Success', 'OTP sent to your mobile number');
      }
    } catch (e) {
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Validate OTP (optional, can skip to step 3)
  const handleOtpNext = () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter the OTP');
      return;
    }
    setStep(3);
  };

  // Step 3: Reset Password
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please enter all password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetchApi(
        'POST',
        apiPath.auth.resetPassword,
        null,
        false,
        {
          mobile_no: mobile,
          otp: otp,
          new_password: newPassword,
          confirm_password: confirmPassword,
        },
        false,
        'application/json',
      );
      if (res?.status === false) {
        Alert.alert('Error', res?.message || 'Failed to reset password');
      } else {
        Alert.alert('Success', 'Password reset successful!', [
          {
            text: 'OK',
            onPress: () => navigation.reset({ index: 0, routes: [{ name: 'LoginScreen' }] })
          }
        ]);
        setStep(1);
        setMobile('');
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (e) {
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.header}>Reset Password</Text>

        <View style={styles.inputSection}>
          {step === 1 && (
            <>
              <Text style={styles.label}>Mobile Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your mobile number"
                placeholderTextColor="gray"
                keyboardType="numeric"
                value={mobile}
                maxLength={10}
                onChangeText={setMobile}
              />
            </>
          )}
          {step === 2 && (
            <>
              <Text style={styles.label}>Enter OTP</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter OTP"
                placeholderTextColor="gray"
                keyboardType="numeric"
                value={otp}
                onChangeText={setOtp}
              />
            </>
          )}
          {step === 3 && (
            <>
              <Text style={styles.label}>New Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter new password"
                placeholderTextColor="gray"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm new password"
                placeholderTextColor="gray"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </>
          )}
        </View>

        <View style={styles.buttonSection}>
          {step === 1 && (
            <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
              <Text style={styles.buttonText}>Send OTP</Text>
            </TouchableOpacity>
          )}
          {step === 2 && (
            <TouchableOpacity style={styles.button} onPress={handleOtpNext}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          )}
          {step === 3 && (
            <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
              <Text style={styles.buttonText}>Reset Password</Text>
            </TouchableOpacity>
          )}
        </View>
        <Loader loading={isLoading} />
      </View>
    </KeyboardAvoidingView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30,
    color: '#0F2C4A',
    marginTop: 20,
  },
  inputSection: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  buttonSection: {
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#F08000',
    padding: 12,
    borderRadius: 6,
    marginBottom: 15,
    backgroundColor: '#fff',
    color: 'black',
  },
  button: {
    backgroundColor: '#F08000',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default ForgetPass;
