import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useRoute } from '@react-navigation/native';
import { usePremiumTheme, premiumShadow } from '../../shared/theme/premiumTheme';

const AdminReplyEmail = () => {
  const { colors, mode } = usePremiumTheme();
  const navigation = useNavigation();
  const route = useRoute<any>();

  // Fetch prefilled data or fallbacks
  const prefilledEmail = route.params?.form?.senderEmail || 'rahulverma@gmail.com';
  const prefilledSubject = route.params?.form?.subject || 'Query about services';

  const [toEmail, setToEmail] = useState(prefilledEmail);
  const [subject, setSubject] = useState(`Re: ${prefilledSubject}`);
  const [message, setMessage] = useState(
    `Hi Rahul,\n\nThank you for reaching out!\nWe have received your query. Our team will get back to you soon.\n\nRegards,\nBaroBar Shop Team`
  );
  
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const brownTheme = {
    primary: '#683E26',
    activeBg: mode === 'dark' ? '#3A281E' : '#F5F1ED',
  };

  const handleSendEmail = () => {
    if (!message.trim()) {
      Alert.alert('Empty Message', 'Please write a message response.');
      return;
    }
    
    setIsSending(true);
    setIsSent(false);

    // Simulate sending email through EmailJS
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      Alert.alert('Email Sent', 'The response email has been sent successfully using EmailJS!');
    }, 1500);
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

          <Text style={[styles.headerTitle, { color: colors.ink }]}>Reply via Email</Text>

          <View style={{ width: 36 }} />
        </View>

        <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
          {/* Inputs card */}
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.line }]}>
            {/* To Row */}
            <View style={styles.inputRow}>
              <Text style={[styles.inputLabel, { color: colors.muted }]}>To</Text>
              <TextInput
                style={[styles.inputField, { color: colors.ink }]}
                value={toEmail}
                onChangeText={setToEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={[styles.lineDivider, { backgroundColor: colors.line }]} />

            {/* Subject Row */}
            <View style={styles.inputRow}>
              <Text style={[styles.inputLabel, { color: colors.muted }]}>Subject</Text>
              <TextInput
                style={[styles.inputField, { color: colors.ink }]}
                value={subject}
                onChangeText={setSubject}
              />
            </View>
          </View>

          {/* Message Area */}
          <Text style={[styles.messageHeading, { color: colors.muted }]}>Message</Text>
          <View style={[styles.textareaWrapper, { backgroundColor: colors.surface, borderColor: colors.line }]}>
            <TextInput
              style={[styles.textarea, { color: colors.ink }]}
              value={message}
              onChangeText={setMessage}
              multiline
              textAlignVertical="top"
              numberOfLines={8}
            />
          </View>

          {/* Action button */}
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={[
                styles.sendBtn,
                { backgroundColor: brownTheme.primary },
                isSending && { opacity: 0.8 }
              ]}
              disabled={isSending}
              onPress={handleSendEmail}
            >
              {isSending ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <View style={styles.buttonTextRow}>
                  <Icon name="paper-plane" size={14} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={styles.sendBtnText}>Send Email</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Sent using EmailJS Feedback */}
            {isSent && (
              <View style={styles.feedbackRow}>
                <Text style={styles.feedbackText}>Sent using EmailJS ✅</Text>
              </View>
            )}
          </View>
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
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 16,
    marginBottom: 20,
    ...premiumShadow,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  inputLabel: {
    width: 70,
    fontSize: 14,
    fontWeight: '600',
  },
  inputField: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
    fontWeight: '600',
  },
  lineDivider: {
    height: 1,
  },
  messageHeading: {
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 8,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  textareaWrapper: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 16,
    height: 180,
    marginBottom: 24,
    ...premiumShadow,
  },
  textarea: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  actionContainer: {
    alignItems: 'center',
  },
  sendBtn: {
    width: '100%',
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    ...premiumShadow,
  },
  buttonTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sendBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  feedbackRow: {
    marginTop: 10,
  },
  feedbackText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#10B981',
  },
});

export default AdminReplyEmail;
