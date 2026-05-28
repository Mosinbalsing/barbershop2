import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { fetchApi } from "../../../Api/http_services";
import { apiPath } from "../../../environment/environment_urls";
import { usePremiumTheme, premiumSpacing, premiumShadow } from "../../../shared/theme/premiumTheme";
import { Typography } from "../../../shared/components/Typography";
import { Button } from "../../../shared/components/Button";

export default function RegisterScreen() {
  const { colors, mode } = usePremiumTheme();
  const inputTextColor = mode === 'dark' ? '#FFFFFF' : '#111111';
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  // Eye toggles
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  // Stepper & OTP state
  const [currentStep, setCurrentStep] = useState(1);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // Core Form Data (API bound)
  const [ResigerData, setRegisterData] = useState({
    first_name: "",
    last_name: "",
    mobile_no: "",
    password: "",
    confirm_password: "",
    otp: "",
  });
  
  const [submitError, setSubmitError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // Timer countdown state (Step 2)
  const [countdown, setCountdown] = useState(90); // 01:30 = 90 seconds
  const timerRef = useRef<any>(null);
  
  // OTP input hidden ref
  const otpInputRef = useRef<TextInput>(null);

  // Countdown timer trigger
  useEffect(() => {
    if (currentStep === 2 && otpSent) {
      setCountdown(90);
      if (timerRef.current) clearInterval(timerRef.current);
      
      timerRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentStep, otpSent]);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const isValidPassword = (pwd: any) => {
    if (!pwd) return false;
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-_=\[\]{};:'"\\|,.<>\/?]).{8,}$/;
    return regex.test(pwd);
  };

  const isValidMobile = (mobile: any) => /^\d{10}$/.test(mobile || "");

  // API Call: Send OTP
  const handleSendOtp = async () => {
    setSubmitError("");

    if (!ResigerData?.first_name?.trim() || !ResigerData?.last_name?.trim()) {
      Alert.alert("Error", "Please enter first name and last name");
      return;
    }

    if (!isValidMobile(ResigerData?.mobile_no)) {
      Alert.alert("Error", "Please enter valid 10-digit mobile number");
      return;
    }

    setOtpLoading(true);
    try {
      const otpRes = await fetchApi(
        "POST",
        apiPath?.auth?.sendotp,
        null,
        false,
        { mobile_no: ResigerData?.mobile_no },
        false,
        "application/json"
      );

      const isOtpSuccess =
        otpRes?.status === true ||
        (otpRes && otpRes?.status !== false && !otpRes?.http_status);

      if (!isOtpSuccess) {
        setSubmitError(otpRes?.message || "Failed to send OTP");
        return;
      }

      setOtpSent(true);
      setCurrentStep(2);
      Alert.alert("Success", otpRes?.message || "OTP sent successfully");
    } catch {
      setSubmitError("Failed to send OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  // API Call: Final registration
  const handleRegistration = async () => {
    setSubmitError("");

    if (!isValidMobile(ResigerData?.mobile_no)) {
      setSubmitError("Please enter valid 10-digit mobile number");
      return;
    }

    if (!otpSent) {
      setSubmitError("Please send OTP first");
      return;
    }

    if (!/^\d{6}$/.test(ResigerData?.otp || "")) {
      setSubmitError("Please enter valid 6-digit OTP");
      return;
    }

    if (!isValidPassword(ResigerData?.password)) return;
    if (ResigerData?.password !== ResigerData?.confirm_password) return;

    const payload = {
      first_name: ResigerData?.first_name,
      last_name: ResigerData?.last_name,
      mobile_no: ResigerData?.mobile_no,
      password: ResigerData?.password,
      confirm_password: ResigerData?.confirm_password,
      otp: ResigerData?.otp,
    };

    console.log("Registration Data:", payload);
    try {
      const reg_Res = await fetchApi(
        "POST",
        apiPath?.auth?.register,
        null, // token
        false, // isForm
        payload, // body
        false, // resType (json or blob)
        "application/json"
      );
      console.log("register res", reg_Res);
      if (reg_Res?.status) {
        handleRegistrationSuccess();
      } else {
        setSubmitError(reg_Res?.message || "Registration Failed");
      }
    } catch {
      setSubmitError("Registration Failed");
    }
  };

  const handleRegistrationSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      // Navigate to LoginScreen with auto-fill data
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'LoginScreen',
            params: {
              mobile_no: ResigerData?.mobile_no,
              password: ResigerData?.password,
            },
          },
        ],
      });
    }, 900);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.canvas }]}>
      {/* Header back row */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => currentStep === 2 ? setCurrentStep(1) : navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color="ink" />
        </TouchableOpacity>
        <Typography variant="h3" weight="bold" style={styles.headerTitle}>Register</Typography>
        <View style={{ width: 32 }} /> {/* balance center */}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Custom Stepper Line nodes exactly matching mockup */}
        <View style={styles.stepperWrapper}>
          <View style={styles.stepCircleContainer}>
            <View style={[
              styles.stepCircle,
              { backgroundColor: colors.primary, borderColor: colors.primary },
              currentStep === 2 && { backgroundColor: colors.primary, borderColor: colors.primary }
            ]}>
              {currentStep === 2 ? (
                <Icon name="checkmark" size={14} color="surface" />
              ) : (
                <Typography variant="caption" color="surface" weight="bold">1</Typography>
              )}
            </View>
            <Typography variant="caption" color={currentStep === 1 ? 'ink' : 'muted'} weight="600" style={styles.stepLabel}>Details</Typography>
          </View>
          
          <View style={[styles.stepLine, { backgroundColor: currentStep === 2 ? colors.primary : colors.line }]} />

          <View style={styles.stepCircleContainer}>
            <View style={[
              styles.stepCircle,
              { backgroundColor: colors.surface, borderColor: colors.line, borderWidth: 1.5 },
              currentStep === 2 && { backgroundColor: colors.primary, borderColor: colors.primary, borderWidth: 0 }
            ]}>
              <Typography variant="caption" color={currentStep === 2 ? 'surface' : 'muted'} weight="bold">2</Typography>
            </View>
            <Typography variant="caption" color={currentStep === 2 ? 'ink' : 'muted'} weight="600" style={styles.stepLabel}>Verify & Password</Typography>
          </View>
        </View>

        {/* STEP 1: Let's get your details */}
        {currentStep === 1 && (
          <View style={[styles.formCard, { backgroundColor: colors.surface }, premiumShadow]}>
            {/* Top avatar graphic */}
            <View style={styles.avatarSection}>
              <View style={[styles.circleAvatarBg, { backgroundColor: colors.softPrimary }]}>
                <Icon name="person-outline" size={32} color="primary" />
              </View>
              <Typography variant="h3" weight="bold" align="center" style={styles.cardTitle}>
                Let's get your details
              </Typography>
              <Typography variant="caption" color="muted" align="center" style={styles.cardSubtitle}>
                Please enter your details to continue
              </Typography>
            </View>

            {/* Inputs list */}
            <View style={styles.fieldsContainer}>
              {/* First Name */}
              <View style={styles.fieldGroup}>
                <Typography variant="label" color="muted" style={styles.fieldLabel}>First Name</Typography>
                <View style={[styles.inputContainer, { borderColor: colors.line }]}>
                  <Icon name="person-outline" size={18} color="muted" style={styles.inputLeftIcon} />
                  <TextInput
                    style={[styles.textInput, { color: inputTextColor }]}
                    placeholder="Enter your first name"
                    placeholderTextColor={colors.muted}
                    value={ResigerData?.first_name}
                    onChangeText={(text) =>
                      setRegisterData({ ...ResigerData, first_name: text })
                    }
                  />
                </View>
              </View>

              {/* Last Name */}
              <View style={styles.fieldGroup}>
                <Typography variant="label" color="muted" style={styles.fieldLabel}>Last Name</Typography>
                <View style={[styles.inputContainer, { borderColor: colors.line }]}>
                  <Icon name="person-outline" size={18} color="muted" style={styles.inputLeftIcon} />
                  <TextInput
                    style={[styles.textInput, { color: inputTextColor }]}
                    placeholder="Enter your last name"
                    placeholderTextColor={colors.muted}
                    value={ResigerData?.last_name}
                    onChangeText={(text) =>
                      setRegisterData({ ...ResigerData, last_name: text })
                    }
                  />
                </View>
              </View>

              {/* Mobile Number */}
              <View style={styles.fieldGroup}>
                <Typography variant="label" color="muted" style={styles.fieldLabel}>Mobile Number</Typography>
                <View style={[styles.inputContainer, { borderColor: colors.line }]}>
                  <Icon name="call-outline" size={18} color="muted" style={styles.inputLeftIcon} />
                  <TextInput
                    style={[styles.textInput, { color: inputTextColor }]}
                    placeholder="Enter your mobile number"
                    keyboardType="number-pad"
                    maxLength={10}
                    placeholderTextColor={colors.muted}
                    value={ResigerData?.mobile_no}
                    onChangeText={(text) => {
                      const digitsOnly = text.replace(/\D/g, "").slice(0, 10);
                      const isMobileChanged = digitsOnly !== ResigerData?.mobile_no;

                      setRegisterData({
                        ...ResigerData,
                        mobile_no: digitsOnly,
                        otp: isMobileChanged ? "" : ResigerData?.otp,
                        password: isMobileChanged ? "" : ResigerData?.password,
                        confirm_password: isMobileChanged ? "" : ResigerData?.confirm_password,
                      });

                      if (isMobileChanged || digitsOnly.length !== 10) {
                        setOtpSent(false);
                      }
                    }}
                  />
                </View>
              </View>

              {/* Send OTP button */}
              <Button
                title={otpLoading ? "Sending OTP..." : otpSent ? "Resend OTP" : "Send OTP"}
                size="large"
                onPress={handleSendOtp}
                disabled={otpLoading}
                style={styles.actionBtn}
              />

              {/* Privacy Shield note */}
              <View style={styles.shieldRow}>
                <Icon name="shield-checkmark-outline" size={16} color="muted" />
                <Typography variant="label" color="muted" style={styles.shieldText}>
                  We will never share your information with anyone.
                </Typography>
              </View>
            </View>
          </View>
        )}

        {/* STEP 2: Verify & Password */}
        {currentStep === 2 && (
          <View style={[styles.formCard, { backgroundColor: colors.surface }, premiumShadow]}>
            {/* Top lock graphic */}
            <View style={styles.avatarSection}>
              <View style={[styles.circleAvatarBg, { backgroundColor: colors.softPrimary }]}>
                <Icon name="lock-closed-outline" size={32} color="primary" />
              </View>
              <Typography variant="h3" weight="bold" align="center" style={styles.cardTitle}>
                Verify & secure your account
              </Typography>
              <Typography variant="caption" color="muted" align="center" style={styles.cardSubtitle}>
                Enter the OTP sent to your mobile number
              </Typography>
              
              {/* Phone display & change number link */}
              <View style={styles.phoneChangeRow}>
                <Typography variant="caption" weight="600" color="ink">
                  +91 {ResigerData?.mobile_no.replace(/(\d{5})(\d{5})/, '$1 $2')}
                </Typography>
                <TouchableOpacity onPress={() => setCurrentStep(1)}>
                  <Typography variant="caption" color="primary" weight="bold" style={{ marginLeft: 8 }}>
                    Change
                  </Typography>
                </TouchableOpacity>
              </View>
            </View>

            {/* Fields container */}
            <View style={styles.fieldsContainer}>
              <Typography variant="label" color="muted" style={styles.fieldLabel}>OTP</Typography>
              
              {/* Custom 6-digit squares backed by a hidden overlay TextInput */}
              <TouchableOpacity activeOpacity={1} onPress={() => otpInputRef.current?.focus()} style={styles.otpGridContainer}>
                {[0, 1, 2, 3, 4, 5].map((index) => {
                  const digit = ResigerData?.otp[index] || "";
                  const isFocused = ResigerData?.otp.length === index;
                  return (
                    <View
                      key={index}
                      style={[
                        styles.otpSquareBox,
                        { borderColor: colors.line, backgroundColor: colors.canvas },
                        isFocused && { borderColor: colors.primary, borderWidth: 1.5 }
                      ]}
                    >
                      <Typography variant="h3" weight="bold" color="ink">{digit}</Typography>
                    </View>
                  );
                })}
              </TouchableOpacity>
              
              {/* Invisible absolute textinput trigger */}
              <TextInput
                ref={otpInputRef}
                value={ResigerData?.otp}
                onChangeText={(text) =>
                  setRegisterData({ ...ResigerData, otp: text.replace(/\D/g, "").slice(0, 6) })
                }
                keyboardType="numeric"
                maxLength={6}
                style={styles.hiddenTextInput}
              />

              {/* Countdown expiration & Resend links */}
              <View style={styles.timerRow}>
                <Typography variant="caption" color="muted">
                  OTP will expire in <Typography variant="caption" color="primary" weight="bold">{formatTimer(countdown)}</Typography>
                </Typography>
                <TouchableOpacity disabled={countdown > 0} onPress={handleSendOtp}>
                  <Typography variant="caption" color={countdown === 0 ? 'primary' : 'muted'} weight="bold">
                    Resend OTP
                  </Typography>
                </TouchableOpacity>
              </View>

              {/* Password */}
              <View style={styles.fieldGroup}>
                <Typography variant="label" color="muted" style={styles.fieldLabel}>Password</Typography>
                <View style={[
                  styles.inputContainer,
                  { borderColor: colors.line },
                  ResigerData?.password?.length > 0 && !isValidPassword(ResigerData?.password) && { borderColor: '#FF4B4B' }
                ]}>
                  <Icon name="lock-closed-outline" size={18} color="muted" style={styles.inputLeftIcon} />
                  <TextInput
                    style={[styles.textInput, { color: inputTextColor }]}
                    placeholder="Enter password"
                    placeholderTextColor={colors.muted}
                    secureTextEntry={!passwordVisible}
                    value={ResigerData?.password}
                    onChangeText={(text) =>
                      setRegisterData({ ...ResigerData, password: text })
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
                {ResigerData?.password?.length > 0 && !isValidPassword(ResigerData?.password) && (
                  <Typography variant="label" color="error" style={styles.hintText}>
                    Must be 8+ chars, include uppercase, number, and special character.
                  </Typography>
                )}
              </View>

              {/* Confirm Password */}
              <View style={styles.fieldGroup}>
                <Typography variant="label" color="muted" style={styles.fieldLabel}>Confirm Password</Typography>
                <View style={[
                  styles.inputContainer,
                  { borderColor: colors.line },
                  ResigerData?.confirm_password?.length > 0 && (ResigerData?.password !== ResigerData?.confirm_password) && { borderColor: '#FF4B4B' }
                ]}>
                  <Icon name="lock-closed-outline" size={18} color="muted" style={styles.inputLeftIcon} />
                  <TextInput
                    style={[styles.textInput, { color: inputTextColor }]}
                    placeholder="Confirm password"
                    placeholderTextColor={colors.muted}
                    secureTextEntry={!confirmVisible}
                    value={ResigerData?.confirm_password}
                    onChangeText={(text) =>
                      setRegisterData({ ...ResigerData, confirm_password: text })
                    }
                  />
                  <TouchableOpacity onPress={() => setConfirmVisible(!confirmVisible)} style={styles.eyeBtn}>
                    <Icon
                      name={confirmVisible ? 'eye-outline' : 'eye-off-outline'}
                      size={20}
                      color="muted"
                    />
                  </TouchableOpacity>
                </View>
                {ResigerData?.confirm_password?.length > 0 && (ResigerData?.password !== ResigerData?.confirm_password) && (
                  <Typography variant="label" color="error" style={styles.hintText}>
                    Passwords do not match.
                  </Typography>
                )}
              </View>

              {/* Create Account button */}
              <Button
                title="Create Account"
                size="large"
                onPress={handleRegistration}
                disabled={!otpSent || !/^\d{6}$/.test(ResigerData?.otp || "") || !isValidPassword(ResigerData?.password) || ResigerData?.password !== ResigerData?.confirm_password}
                style={[
                  styles.actionBtn,
                  (!otpSent || !/^\d{6}$/.test(ResigerData?.otp || "") || !isValidPassword(ResigerData?.password) || ResigerData?.password !== ResigerData?.confirm_password) && { backgroundColor: colors.line }
                ]}
              />
            </View>
          </View>
        )}

        {/* Footer Navigation Link */}
        <View style={styles.footerRow}>
          <Typography variant="caption" color="muted">Already have an account?</Typography>
          <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
            <Typography variant="caption" color="primary" weight="bold" style={styles.loginLinkText}>Login</Typography>
          </TouchableOpacity>
        </View>

        {submitError ? (
          <Typography variant="caption" color="error" align="center" style={styles.submitErrorText}>
            {submitError}
          </Typography>
        ) : null}

      </ScrollView>

      {/* Success Modal */}
      <Modal
        visible={showSuccess}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccess(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
            <Typography variant="body" weight="bold" align="center" style={styles.modalTitle}>Success</Typography>
            <Typography variant="caption" color="muted" align="center" style={styles.modalMessage}>
              Account created successfully.
            </Typography>
            <TouchableOpacity
              style={[styles.modalOkBtn, { backgroundColor: colors.primary }]}
              onPress={() => {
                setShowSuccess(false);
                handleRegistrationSuccess();
              }}
            >
              <Typography variant="body" color="surface" weight="bold">OK</Typography>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 8,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 20 },
  scrollContent: {
    padding: 24,
    paddingTop: 12,
  },
  stepperWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  stepCircleContainer: {
    alignItems: 'center',
    width: 90,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    zIndex: 2,
  },
  stepLabel: {
    fontSize: 10,
    textAlign: 'center',
  },
  stepLine: {
    flex: 1,
    height: 2,
    marginTop: 13,
    marginHorizontal: -12,
    zIndex: 1,
  },
  formCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  circleAvatarBg: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  phoneChangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  fieldsContainer: {
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
    borderWidth: 1.5,
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
  actionBtn: {
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  shieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    gap: 8,
  },
  shieldText: {
    fontSize: 11,
  },
  
  // Custom square OTP styles
  otpGridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  otpSquareBox: {
    width: '14.5%',
    height: 50,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hiddenTextInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
    zIndex: -1,
  },
  timerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  hintText: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
    paddingHorizontal: 4,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    gap: 6,
  },
  loginLinkText: {
    fontSize: 13,
  },
  submitErrorText: {
    marginBottom: 16,
  },

  // Modal Backdrop Success
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(16, 18, 24, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 6,
  },
  modalMessage: {
    fontSize: 13,
    marginBottom: 20,
  },
  modalOkBtn: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
