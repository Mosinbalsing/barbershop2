import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
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
import { premiumColors, premiumShadow, usePremiumTheme, zIndices } from "../../../shared/theme/premiumTheme";

export default function RegisterScreen() {
  const { mode } = usePremiumTheme();
  const inputTextColor = mode === 'dark' ? '#FFFFFF' : '#111111';
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
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

  const isValidPassword = (pwd:any) => {
    if (!pwd) return false;
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-_=\[\]{};:'"\\|,.<>\/?]).{8,}$/;
    return regex.test(pwd);
  };

  const isValidMobile = (mobile:any) => /^\d{10}$/.test(mobile || "");

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
    const reg_Res = await fetchApi(
      "POST",
      apiPath?.auth?.register,
      null, // token
      false, // isForm
      payload, // body
      false, // resType (json or blob)
      "application/json"
    );
    console.log("register res", reg_Res)
    if (reg_Res?.status) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigation.reset({ index: 0, routes: [{ name: "LoginScreen" }] });
      }, 900);
    } else {
      setSubmitError(reg_Res?.message || "Registration Failed");
    }
  }
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.brandCard}>
        <Text style={styles.kicker}>Barbershop admin</Text>
        <Text style={styles.header}>Register</Text>
        <Text style={styles.subHeader}>Create your shop account and start managing premium bookings.</Text>
      </View>

      <View style={styles.stepperRow}>
        <View style={[styles.stepItem, currentStep === 1 ? styles.stepItemActive : null]}>
          <Text style={[styles.stepText, currentStep === 1 ? styles.stepTextActive : null]}>1. Details</Text>
        </View>
        <View style={[styles.stepItem, currentStep === 2 ? styles.stepItemActive : null]}>
          <Text style={[styles.stepText, currentStep === 2 ? styles.stepTextActive : null]}>2. Verify & Password</Text>
        </View>
      </View>

      {currentStep === 1 && (
        <>
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={[styles.input, { color: inputTextColor }]}
                placeholder="First Name"
                placeholderTextColor={premiumColors.muted}
                value={ResigerData?.first_name}
                onChangeText={(text) =>
                  setRegisterData({ ...ResigerData, first_name: text })
                }
              />
            </View>

            <View style={styles.halfInput}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={[styles.input, { color: inputTextColor }]}
                placeholder="Last Name"
                placeholderTextColor={premiumColors.muted}
                value={ResigerData?.last_name}
                onChangeText={(text) =>
                  setRegisterData({ ...ResigerData, last_name: text })
                }
              />
            </View>
          </View>

          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            style={[styles.input, { color: inputTextColor }]}
            placeholder="Mobile Number"
            keyboardType="number-pad"
            maxLength={10}
            placeholderTextColor={premiumColors.muted}
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
                setCurrentStep(1);
              }
            }}
          />

          {isValidMobile(ResigerData?.mobile_no) && (
            <TouchableOpacity
              style={[styles.button, { marginTop: -2 }]}
              onPress={handleSendOtp}
              disabled={otpLoading}
            >
              <Text style={styles.buttonText}>{otpLoading ? "Sending OTP..." : otpSent ? "Resend OTP" : "Send OTP"}</Text>
            </TouchableOpacity>
          )}
        </>
      )}

    

      {currentStep === 2 && otpSent && (
        <>
          <TouchableOpacity
            style={styles.changeNumberBtn}
            onPress={() => setCurrentStep(1)}
          >
            <Text style={styles.changeNumberText}>Change Mobile Number</Text>
          </TouchableOpacity>

          <Text style={styles.label}>OTP</Text>
          <TextInput
            style={[styles.input, { color: inputTextColor }]}
            placeholder="Enter 6-digit OTP"
            placeholderTextColor={premiumColors.muted}
            keyboardType="number-pad"
            maxLength={6}
            value={ResigerData?.otp}
            onChangeText={(text) =>
              setRegisterData({ ...ResigerData, otp: text.replace(/\D/g, "").slice(0, 6) })
            }
          />

          {/* Password */}
          <Text style={styles.label}>Password</Text>
          <View style={[
            styles.passContainer,
            ResigerData?.password?.length > 0 && !isValidPassword(ResigerData?.password)
              ? { borderColor: premiumColors.primary }
              : null,
          ]}>
            <TextInput
              style={[styles.passInput, { color: inputTextColor }, Platform.OS === "ios" && { paddingVertical: 11 }]}
              placeholder="Enter Password"
              placeholderTextColor={premiumColors.muted}
              secureTextEntry={!passwordVisible}
              value={ResigerData?.password}
              onChangeText={(text) =>
                setRegisterData({ ...ResigerData, password: text })
              }
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
              <Icon
                name={passwordVisible ? "eye" : "eye-off"}
                size={22}
                color={premiumColors.primary}
              />
            </TouchableOpacity>
          </View>
          <Text style={[
            styles.hint,
            ResigerData?.password?.length > 0 && !isValidPassword(ResigerData?.password)
              ? { color: premiumColors.primary }
              : null,
          ]}>Must be 8+ chars, include uppercase, number, and special character.</Text>

          {/* Confirm Password */}
          <Text style={styles.label}>Confirm Password</Text>
          <View style={[
            styles.passContainer,
            ResigerData?.confirm_password?.length > 0 && (ResigerData?.password !== ResigerData?.confirm_password)
              ? { borderColor: premiumColors.primary }
              : null,
          ]}>
            <TextInput
              style={[styles.passInput, { color: inputTextColor }, Platform.OS === "ios" && { paddingVertical: 11 }]}
              placeholderTextColor={premiumColors.muted}
              placeholder="Confirm Password"
              secureTextEntry={!confirmVisible}
              value={ResigerData?.confirm_password}
              onChangeText={(text) =>
                setRegisterData({ ...ResigerData, confirm_password: text })
              }
            />
            <TouchableOpacity onPress={() => setConfirmVisible(!confirmVisible)}>
              <Icon
                name={confirmVisible ? "eye" : "eye-off"}
                size={22}
                color={premiumColors.primary}
              />
            </TouchableOpacity>
          </View>
          {ResigerData?.confirm_password?.length > 0 && (ResigerData?.password !== ResigerData?.confirm_password) ? (
            <Text style={[styles.hint, { color: premiumColors.primary }]}>Passwords do not match.</Text>
          ) : null}
        </>
      )}

<View style={{ flex:1, justifyContent: "flex-end" }}>
   {/* Button */}
      {currentStep === 2 && (
        <TouchableOpacity
          style={[
            styles.button,
            (!otpSent || !/^\d{6}$/.test(ResigerData?.otp || "") || !isValidPassword(ResigerData?.password) || ResigerData?.password !== ResigerData?.confirm_password)
              ? { backgroundColor: premiumColors.line }
              : null,
          ]}
          disabled={!otpSent || !/^\d{6}$/.test(ResigerData?.otp || "") || !isValidPassword(ResigerData?.password) || ResigerData?.password !== ResigerData?.confirm_password}
          onPress={handleRegistration}
        >
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>
      )}
      <View style={{ flexDirection: "row", justifyContent: "center", gap: 5 }}>
        <Text style={styles.footer}>
          Already have an account?
          {/* <Text style={styles.link}> Login!</Text> */}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
          <Text style={styles.link}>Login!</Text>
        </TouchableOpacity>
      </View>
</View>
     

      {submitError ? (
        <Text style={{ color: premiumColors.primary, textAlign: 'center' }}>{submitError}</Text>
      ) : null}
      <Modal
        visible={showSuccess}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccess(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Success</Text>
            <Text style={styles.modalMessage}>Account created successfully.</Text>
            <TouchableOpacity
              style={[styles.button, { alignSelf: 'stretch', marginTop: 10 }]}
              onPress={() => { setShowSuccess(false); 
                navigation.reset({ index: 0, routes: [{ name: "LoginScreen" }] });
             }}
            >
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    paddingBottom: 40,
    backgroundColor: premiumColors.canvas,
    flexGrow: 1,
  },
  brandCard: {
    backgroundColor: premiumColors.surface,
    borderRadius: 24,
    padding: 22,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: premiumColors.line,
    ...premiumShadow,
  },
  kicker: {
    color: premiumColors.primary,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    marginBottom: 8,
  },

  header: {
    fontSize: 34,
    fontWeight: "900",
    marginBottom: 8,
    color: premiumColors.ink,
  },
  subHeader: {
    color: premiumColors.muted,
    fontSize: 14,
    lineHeight: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
    color: premiumColors.ink,
  },

  input: {
    borderWidth: 1,
    borderColor: premiumColors.line,
    padding: 12,
    borderRadius: 14,
    marginBottom: 15,
    backgroundColor: premiumColors.surface,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  halfInput: {
    width: "48%",
  },

  stepperRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  stepItem: {
    flex: 1,
    borderWidth: 1,
    borderColor: premiumColors.line,
    borderRadius: 16,
    paddingVertical: 8,
    alignItems: "center",
    backgroundColor: premiumColors.surface,
  },
  stepItemActive: {
    borderColor: premiumColors.primary,
    backgroundColor: premiumColors.primary,
  },
  stepText: {
    color: premiumColors.muted,
    fontWeight: "600",
    fontSize: 12,
  },
  stepTextActive: {
    color: "#fff",
  },
  changeNumberBtn: {
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  changeNumberText: {
    color: premiumColors.primary,
    fontWeight: "600",
  },

  dropdownCompact: {
    borderWidth: 1,
    borderColor: premiumColors.line,
    borderRadius: 14,
    padding: 12,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    color: "black",
  },

  passContainer: {
    borderWidth: 1,
    borderColor: premiumColors.line,
    borderRadius: 14,
    paddingHorizontal: 12,
    // paddingVertical: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    color: "black",
  },

  passInput: {
    flex: 1,
    marginRight: 10,
    color: "black",
  },

  hint: {
    color: premiumColors.muted,
    fontSize: 12,
    marginBottom: 15,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: premiumColors.surface,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: premiumColors.ink,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 14,
    color: premiumColors.muted,
    textAlign: 'center',
    marginBottom: 8,
  },

  button: {
    backgroundColor: premiumColors.primary,
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: "center",
    marginVertical: 20,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  footer: {
    textAlign: "center",
    color: premiumColors.muted,
  },

  link: {
    color: premiumColors.primary,
    fontWeight: "900",
  },
  // drop doown style

  pickerWrapper: {
    borderWidth: 0.8,
    borderColor: premiumColors.line,
    borderRadius: 5,
    // paddingHorizontal: 10,
    // backgroundColor: "#FFF5EB",
    overflow: "hidden", // important on Android
    // marginVertical: 10,
    height: 42,
  },
  dropdown: {
    height: 45,
    borderColor: premiumColors.line,

    borderWidth: 0.2,
    // borderRadius:10,
    paddingHorizontal: 8,
    color: "black",
  },
  icon: {
    marginRight: 5,
  },
  dropdownlabel: {
    color: "black",
    position: "absolute",
    backgroundColor: premiumColors.primary,
    left: 22,
    top: 8,
    zIndex: zIndices.dropdown,
    paddingHorizontal: 8,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 14,
    paddingHorizontal: 6,
    color: premiumColors.ink,
  },
  iconStyle: {
    width: 20,
    height: 20,
    color: "white",
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
