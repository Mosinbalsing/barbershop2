import { useNavigation, NavigationProp, useRoute, RouteProp } from '@react-navigation/native';
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
import { fetchApi } from '../../../Api/http_services';
import { apiPath } from '../../../environment/environment_urls';
import { getData, removeData, storeData } from '../../../helper/storage';
import Loader from '../../../shared/components/Loader';
import { Typography } from '../../../shared/components/Typography';
import { usePremiumTheme, premiumShadow } from '../../../shared/theme/premiumTheme';

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
  LoginScreen?: { mobile_no?: string; password?: string };
  barber: undefined;
  user: undefined;
  forgetPass: undefined;
};

/* ================= COMPONENT ================= */

export default function LoginScreen() {
  const { colors, mode } = usePremiumTheme();
  const inputTextColor = mode === 'dark' ? '#FFFFFF' : '#111111';
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const [loginData, setLoginData] = useState<LoginDataType>({
    mobile_no: '',
    password: '',
  });

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'LoginScreen'>>();

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
        routes: [{ name: 'barber' }],
      });
    } else if (role === 'user' || role === 'customer') {
      navigation.reset({
        index: 0,
        routes: [{ name: 'user' }],
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
      console.log("this is login_Res", login_Res);
      
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
        // Check if coming from RegisterScreen with auto-fill data
        if (route.params?.mobile_no && route.params?.password) {
          setLoginData({
            mobile_no: route.params.mobile_no,
            password: route.params.password,
          });
          return;
        }

        // Otherwise load saved credentials from remember me
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
  }, [route.params]);

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.canvas }]} showsVerticalScrollIndicator={false}>
      {/* Visual Mockup Brand Logo Header */}
      <View style={styles.brandContainer}>
        <View style={[styles.outerLogoRing, { borderColor: colors.primary }]}>
          <View style={[styles.innerLogoRing, { borderColor: colors.line, backgroundColor: colors.softPrimary }]}>
            <Icon name="cut-outline" size={32} color="primary" />
            <Text style={[styles.logoText, { color: colors.primary }]}>BAROBAR</Text>
            <Text style={[styles.logoSubtext, { color: colors.muted }]}>— EST. 2024 —</Text>
          </View>
        </View>
        <Typography variant="h2" weight="bold" align="center" style={styles.welcomeTitle}>
          Welcome Back!
        </Typography>
        <Typography variant="caption" color="muted" align="center" style={styles.welcomeSubtitle}>
          Login to continue your grooming experience
        </Typography>
      </View>

      {/* Form Fields Container */}
      <View style={styles.formContainer}>
        {/* Mobile Number Field */}
        <View style={styles.fieldGroup}>
          <Typography variant="label" color="muted" style={styles.fieldLabel}>Mobile Number</Typography>
          <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.line }]}>
            <Icon name="call-outline" size={20} color="muted" style={styles.inputLeftIcon} />
            <TextInput
              style={[styles.textInput, { color: inputTextColor }]}
              placeholder="Enter your mobile number"
              placeholderTextColor={colors.muted}
              keyboardType="numeric"
              value={loginData.mobile_no}
              onChangeText={(text: string) =>
                setLoginData({ ...loginData, mobile_no: text })
              }
            />
          </View>
        </View>

        {/* Password Field */}
        <View style={styles.fieldGroup}>
          <Typography variant="label" color="muted" style={styles.fieldLabel}>Password</Typography>
          <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.line }]}>
            <Icon name="lock-closed-outline" size={20} color="muted" style={styles.inputLeftIcon} />
            <TextInput
              style={[styles.textInput, { color: inputTextColor }]}
              secureTextEntry={!passwordVisible}
              placeholderTextColor={colors.muted}
              placeholder="Enter your password"
              value={loginData.password}
              onChangeText={(text: string) =>
                setLoginData({ ...loginData, password: text })
              }
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.eyeBtn}>
              <Icon
                name={passwordVisible ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color="muted"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Remember Me & Forgot Password Row */}
        <View style={styles.rememberRow}>
          <TouchableOpacity
            style={styles.rememberMeClickable}
            onPress={() => setRememberMe(!rememberMe)}
          >
            <View style={[
              styles.checkbox,
              { borderColor: colors.muted },
              rememberMe && { backgroundColor: colors.primary, borderColor: colors.primary }
            ]}>
              {rememberMe && <Icon name="checkmark" size={12} color="surface" />}
            </View>
            <Typography variant="caption" color="muted" style={styles.rememberText}>Remember Me</Typography>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('forgetPass')}>
            <Typography variant="caption" color="primary" weight="bold">Forgot Password?</Typography>
          </TouchableOpacity>
        </View>

        {/* Main Solid Login Button */}
        <TouchableOpacity style={[styles.loginBtn, { backgroundColor: colors.primary }]} onPress={handleLogin}>
          <Typography variant="body" color="surface" weight="bold">Login</Typography>
        </TouchableOpacity>

        {/* or continue with Divider */}
        <View style={styles.dividerRow}>
          <View style={[styles.dividerLine, { backgroundColor: colors.line }]} />
          <Typography variant="label" color="muted" style={styles.dividerText}>or continue with</Typography>
          <View style={[styles.dividerLine, { backgroundColor: colors.line }]} />
        </View>

        {/* Social Options Row */}
        <View style={styles.socialRow}>
          <TouchableOpacity style={[styles.socialBtn, { backgroundColor: colors.surface, borderColor: colors.line }]}>
            <Icon name="logo-google" size={20} color="error" />
            <Typography variant="caption" weight="600" style={styles.socialBtnText}>Google</Typography>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.socialBtn, { backgroundColor: colors.surface, borderColor: colors.line }]}>
            <Icon name="logo-facebook" size={20} color="primary" />
            <Typography variant="caption" weight="600" style={styles.socialBtnText}>Facebook</Typography>
          </TouchableOpacity>
        </View>

        {/* Footer Register Navigation Link */}
        <View style={styles.footerRow}>
          <Typography variant="caption" color="muted">Don't have an account?</Typography>
          <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
            <Typography variant="caption" color="primary" weight="bold" style={styles.registerLinkText}>Register</Typography>
          </TouchableOpacity>
        </View>
      </View>

      <Loader loading={isLoading} />
    </ScrollView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 70 : 40,
    flexGrow: 1,
    justifyContent: 'center',
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 36,
  },
  outerLogoRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  innerLogoRing: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginTop: 4,
  },
  logoSubtext: {
    fontSize: 7,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  welcomeTitle: {
    fontSize: 22,
    marginBottom: 6,
  },
  welcomeSubtitle: {
    fontSize: 13,
    maxWidth: '80%',
    lineHeight: 18,
  },
  formContainer: {
    gap: 16,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontWeight: '600',
    fontSize: 13,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  inputLeftIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontSize: 15,
  },
  eyeBtn: {
    padding: 6,
  },
  rememberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 10,
  },
  rememberMeClickable: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rememberText: {
    fontSize: 13,
  },
  loginBtn: {
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 11,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    gap: 8,
  },
  socialBtnText: {
    fontSize: 13,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  registerLinkText: {
    fontSize: 13,
  },
});
