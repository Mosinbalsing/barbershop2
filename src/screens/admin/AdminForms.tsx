import React, { useState, useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { usePremiumTheme, premiumShadow } from '../../shared/theme/premiumTheme';

type FormItem = {
  id: string;
  formType: 'Contact Us Form' | 'Partnership Inquiry' | 'General Query' | 'Feedback Form' | 'Service Inquiry';
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  subject: string;
  message: string;
  date: string;
  time: string;
  status: 'New' | 'Read';
};

const MOCK_FORMS: FormItem[] = [
  {
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
  },
  {
    id: 'F102',
    formType: 'Partnership Inquiry',
    senderName: 'Amit Kumar',
    senderEmail: 'amit.kumar@company.com',
    senderPhone: '9123456780',
    subject: 'Barber Collaboration Offer',
    message: 'We are interested in collaborating with Barobar Shop as a supplier.',
    date: '20 May 2025',
    time: '03:15 PM',
    status: 'New',
  },
  {
    id: 'F103',
    formType: 'General Query',
    senderName: 'Vikram Singh',
    senderEmail: 'vikram.singh@gmail.com',
    senderPhone: '9888776655',
    subject: 'Work hours query',
    message: 'What are your operational hours during public holidays?',
    date: '19 May 2025',
    time: '11:20 AM',
    status: 'Read',
  },
  {
    id: 'F104',
    formType: 'Feedback Form',
    senderName: 'Manish Patel',
    senderEmail: 'manish.patel@gmail.com',
    senderPhone: '7766554433',
    subject: 'Amazing haircut experience',
    message: 'The beard styling and precision haircut was highly satisfying. Will visit again!',
    date: '19 May 2025',
    time: '10:05 AM',
    status: 'Read',
  },
  {
    id: 'F105',
    formType: 'Service Inquiry',
    senderName: 'Rohit Sharma',
    senderEmail: 'rohit.shave@gmail.com',
    senderPhone: '8877665544',
    subject: 'Pricing for wedding packages',
    message: 'Could you share groom hair and groom package pricing in detail?',
    date: '18 May 2025',
    time: '06:45 PM',
    status: 'Read',
  },
];

const AdminForms = () => {
  const { colors, mode } = usePremiumTheme();
  const navigation = useNavigation<any>();

  const brownTheme = {
    primary: '#683E26',
    activeBg: mode === 'dark' ? '#3A281E' : '#F5F1ED',
  };

  const [activeSegment, setActiveSegment] = useState<'All' | 'New' | 'Read'>('All');

  const filteredForms = useMemo(() => {
    return MOCK_FORMS.filter(f => {
      if (activeSegment !== 'All' && f.status !== activeSegment) {
        return false;
      }
      return true;
    });
  }, [activeSegment]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.canvas }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.line }]}>
        <TouchableOpacity style={styles.headerBtn}>
          <Icon name="bars" size={18} color={colors.ink} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.ink }]}>Forms / Submissions</Text>

        <View style={{ width: 36 }} />
      </View>

      {/* Horizontal Segments Control */}
      <View style={[styles.segmentContainer, { backgroundColor: colors.surface, borderBottomColor: colors.line }]}>
        {[
          { key: 'All', label: `All (${MOCK_FORMS.length})` },
          { key: 'New', label: `New (${MOCK_FORMS.filter(f => f.status === 'New').length})` },
          { key: 'Read', label: `Read (${MOCK_FORMS.filter(f => f.status === 'Read').length})` },
        ].map(seg => {
          const isActive = activeSegment === seg.key;
          return (
            <TouchableOpacity
              key={seg.key}
              onPress={() => setActiveSegment(seg.key as any)}
              style={[
                styles.segmentItem,
                isActive && { borderBottomColor: brownTheme.primary }
              ]}
            >
              <Text style={[
                styles.segmentText,
                isActive ? { color: colors.ink, fontWeight: 'bold' } : { color: colors.muted }
              ]}>
                {seg.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Scrollable list */}
      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {filteredForms.map(item => {
          const isNew = item.status === 'New';
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.formCard, { backgroundColor: colors.surface, borderColor: colors.line }]}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('AdminFormDetails', { form: item })}
            >
              <View style={styles.cardRow}>
                {/* Form Icon Badge */}
                <View style={[styles.iconBox, { backgroundColor: brownTheme.activeBg }]}>
                  <Icon name="envelope-open-o" size={16} color={brownTheme.primary} />
                </View>

                {/* Middle Info Column */}
                <View style={styles.cardInfo}>
                  <Text style={[styles.formTypeText, { color: colors.ink }]}>{item.formType}</Text>
                  <Text style={[styles.senderNameText, { color: colors.ink }]}>{item.senderName}</Text>
                  <Text style={[styles.dateTimeText, { color: colors.muted }]}>
                    {item.date}, {item.time}
                  </Text>
                </View>

                {/* Right Status Badge */}
                <View style={[
                  styles.statusBadge,
                  isNew ? { backgroundColor: '#FFEED6' } : { backgroundColor: colors.canvas }
                ]}>
                  <Text style={[
                    styles.statusBadgeText,
                    isNew ? { color: '#F59E0B' } : { color: colors.muted }
                  ]}>
                    {item.status}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
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
  segmentContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingHorizontal: 16,
  },
  segmentItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  formCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
    ...premiumShadow,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    flex: 1,
    marginLeft: 14,
  },
  formTypeText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  senderNameText: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  dateTimeText: {
    fontSize: 11,
    marginTop: 2,
  },
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
});

export default AdminForms;
