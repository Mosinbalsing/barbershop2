import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useRoute } from '@react-navigation/native';
import { usePremiumTheme, premiumShadow } from '../../shared/theme/premiumTheme';

type FormItem = {
  id: string;
  formType: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  subject: string;
  message: string;
  date: string;
  time: string;
  status: 'New' | 'Read';
};

const AdminFormDetails = () => {
  const { colors, mode } = usePremiumTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  // Fetch routing param or default
  const formItem: FormItem = route.params?.form || {
    id: 'F101',
    formType: 'Contact Us Form',
    senderName: 'Rahul Verma',
    senderEmail: 'rahulverma@gmail.com',
    senderPhone: '9876543210',
    subject: 'Query about services',
    message: 'I would like to know more about your premium services and packages.',
    date: '20 May 2025',
    time: '04:30 PM',
    status: 'New',
  };

  const brownTheme = {
    primary: '#683E26',
    activeBg: mode === 'dark' ? '#3A281E' : '#F5F1ED',
  };

  const detailsList = [
    { label: 'Name', value: formItem.senderName },
    { label: 'Email', value: formItem.senderEmail },
    { label: 'Phone', value: formItem.senderPhone },
    { label: 'Subject', value: formItem.subject },
    { label: 'Message', value: formItem.message, isMultiLine: true },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.canvas }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.line }]}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={18} color={colors.ink} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.ink }]}>Form Details</Text>

        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {/* Form Title & Date Header Card */}
        <View style={[styles.cardHeader, { backgroundColor: colors.surface, borderColor: colors.line }]}>
          <View style={styles.headerRow}>
            <View style={[styles.iconBox, { backgroundColor: brownTheme.activeBg }]}>
              <Icon name="envelope-open-o" size={18} color={brownTheme.primary} />
            </View>
            <View style={styles.headerTitles}>
              <Text style={[styles.formTitleText, { color: colors.ink }]}>{formItem.formType}</Text>
              <Text style={[styles.formDateText, { color: colors.muted }]}>
                {formItem.date}, {formItem.time}
              </Text>
            </View>
            {formItem.status === 'New' && (
              <View style={[styles.newBadge, { backgroundColor: '#FFEED6' }]}>
                <Text style={[styles.newBadgeText, { color: '#F59E0B' }]}>{formItem.status}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Sender details list */}
        <View style={[styles.detailsContainer, { backgroundColor: colors.surface, borderColor: colors.line }]}>
          {detailsList.map((item, idx) => {
            const isLast = idx === detailsList.length - 1;
            return (
              <View
                key={item.label}
                style={[
                  styles.detailRow,
                  { borderBottomColor: colors.line },
                  !isLast && { borderBottomWidth: 1 },
                  item.isMultiLine && styles.multiLineRow
                ]}
              >
                <Text style={[styles.rowLabel, { color: colors.muted }]}>{item.label}</Text>
                <Text style={[
                  styles.rowValue,
                  { color: colors.ink },
                  item.isMultiLine && styles.multiLineValue
                ]}>
                  {item.value}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Action buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.replyBtn, { backgroundColor: brownTheme.primary }]}
            onPress={() => navigation.navigate('AdminReplyEmail', { form: formItem })}
          >
            <Text style={styles.replyText}>Reply via Email</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => Alert.alert('Delete Submission', 'Are you sure you want to delete this submission?')}
          >
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  cardHeader: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 16,
    marginBottom: 16,
    ...premiumShadow,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitles: {
    flex: 1,
    marginLeft: 14,
  },
  formTitleText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  formDateText: {
    fontSize: 12,
    marginTop: 2,
  },
  newBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  newBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  detailsContainer: {
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 16,
    marginBottom: 24,
    ...premiumShadow,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  multiLineRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  rowValue: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  multiLineValue: {
    textAlign: 'left',
    marginTop: 6,
    lineHeight: 20,
    fontWeight: 'normal',
  },
  buttonRow: {
    gap: 12,
  },
  replyBtn: {
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    ...premiumShadow,
  },
  replyText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteBtn: {
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  deleteText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdminFormDetails;
