import { useNavigation, NavigationProp } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CheckIcon from 'react-native-vector-icons/Ionicons';

import { fetchApi } from '../../../Api/http_services';
import { apiPath } from '../../../environment/environment_urls';
import { getData, removeData, storeData } from '../../../helper/storage';
import Loader from '../../../shared/components/Loader';

/* ================= TYPES ================= */

type LoginDataType = {
  mobile_no: string;
  password: string;
};

type LoginResponseType = {
  access_token?: string;
  refresh_token?: string;
  role_name?: string;
  user_id?: string;
  assigned?: any;
  user_name?: string;
  status?: boolean;
  message?: string;
};

type RootStackParamList = {
  SuperAdminTabs: undefined;
  AdminTabs: undefined;
  VolunteerTabs: undefined;
  PhoneNoS: undefined;
  RegisterScreen: undefined;
};

/* ================= COMPONENT ================= */

export default function LoginScreen() {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const [loginData, setLoginData] = useState<LoginDataType>({
    mobile_no: '',
    password: '',
  });

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigateByRole = (roleName: string): void => {
    const role = roleName?.toLowerCase()?.trim();

    if (role === 'superadmin') {
      navigation.reset({
        index: 0,
        routes: [{ name: 'SuperAdminTabs' }],
      });
    } else if (role === 'barber') {
      navigation.reset({
        index: 0,
        routes: [{ name: 'AdminTabs' }],
      });
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: 'VolunteerTabs' }],
      });
    }
  };

  const handleLogin = async (): Promise<void> => {
    setIsLoading(true);

    try {
      const login_Res: LoginResponseType = await fetchApi(
        'POST',
        apiPath?.auth?.login,
        null,
        false,
        loginData,
        false,
        'application/json',
      );
      console.log("this is login_Res",login_Res);
      
      const isLoginSuccess =
        Boolean(login_Res?.access_token) || login_Res?.status === true;

      if (!isLoginSuccess) {
        Alert.alert('Error', login_Res?.message || 'Login Failed');
        return;
      }

      // Remember Me
      if (rememberMe) {
        await storeData('remember_login', loginData);
      } else {
        await removeData('remember_login');
      }

      // Save tokens
      if (login_Res?.access_token) {
        await storeData('access_token', login_Res.access_token);
        await storeData('refresh_token', login_Res.refresh_token);
        await storeData('user_role', login_Res.role_name);
        await storeData('user_id', login_Res.user_id);
        await storeData('assigned', login_Res.assigned);
        await storeData('user_name', login_Res.user_name);
      }

      if (!login_Res?.role_name) {
        Alert.alert('Error', 'Role not found in login response');
        return;
      }

      navigateByRole(login_Res.role_name);
    } catch (error) {
      console.warn('LOGIN ERROR 👉', error);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadSavedCredentials = async (): Promise<void> => {
      try {
        const savedData = await getData('remember_login');
        if (savedData) {
          setLoginData(savedData as LoginDataType);
          setRememberMe(true);
        }
      } catch (error) {
        console.log('Error loading saved login:', error);
      }
    };

    loadSavedCredentials();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Login</Text>

      <Text style={styles.label}>Mobile Number</Text>
      <TextInput
        style={[styles.input, { color: 'black' }]}
        placeholder="Enter your mobile number"
        placeholderTextColor="gray"
        keyboardType="numeric"
        value={loginData.mobile_no}
        onChangeText={(text: string) =>
          setLoginData({ ...loginData, mobile_no: text })
        }
      />

      <Text style={styles.label}>Password *</Text>
      <View
        style={[
          styles.passContainer,
          Platform.OS === 'ios' && { paddingVertical: 10 },
        ]}
      >
        <TextInput
          style={[styles.passInput, { color: 'black' }]}
          secureTextEntry={!passwordVisible}
          placeholderTextColor="gray"
          placeholder="Enter your password"
          value={loginData.password}
          onChangeText={(text: string) =>
            setLoginData({ ...loginData, password: text })
          }
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
          <Icon
            name={passwordVisible ? 'eye' : 'eye-off'}
            size={22}
            color="#555"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.rememberRow}>
        <TouchableOpacity
          style={styles.rememberMe}
          onPress={() => setRememberMe(!rememberMe)}
        >
          <Icon
            name={rememberMe ? 'checkbox-outline' : 'square-outline'}
            size={20}
            color="#F08000"
          />
          <Text style={styles.link}>Remember Me</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('PhoneNoS')}>
          <Text style={styles.link}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 5 }}>
        <Text style={styles.footer}>Don’t have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
          <Text style={styles.link}>Register Now!</Text>
        </TouchableOpacity>
      </View>

      <Loader loading={isLoading} />
    </ScrollView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    padding: 25,
    paddingBottom: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30,
    color: '#0F2C4A',
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
  },
  passContainer: {
    borderWidth: 1,
    borderColor: '#F08000',
    borderRadius: 6,
    paddingHorizontal: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  passInput: {
    flex: 1,
    marginRight: 10,
  },
  button: {
    backgroundColor: '#F08000',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    textAlign: 'center',
    color: '#444',
  },
  link: {
    color: '#F08000',
    fontWeight: '600',
  },
  rememberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
