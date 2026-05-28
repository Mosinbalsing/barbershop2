import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { usePremiumTheme, premiumShadow } from '../../../shared/theme/premiumTheme';

const BarberProfileView = () => {
  const { colors, mode } = usePremiumTheme();
  const navigation = useNavigation<any>();

  const purpleTheme = {
    primary: '#6D4CF3',
  };

  const profileRows = [
    { label: 'Name', value: 'Rahul Verma' },
    { label: 'Phone Number', value: '98765-43210' },
    { label: 'Shop Name', value: 'The Classic Cuts' },
    { label: 'Email', value: 'rahulverma@gmail.com' },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.canvas }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.line }]}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={18} color={colors.ink} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.ink }]}>Profile</Text>

        <TouchableOpacity 
          style={styles.headerBtn}
          onPress={() => navigation.navigate('BarberProfileEdit')}
        >
          <Icon name="pencil" size={18} color={colors.ink} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {/* Avatar cluster */}
        <View style={styles.avatarWrapper}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' }}
            style={styles.avatar}
          />
        </View>

        {/* Profile Info Details List */}
        <View style={[styles.detailsCard, { backgroundColor: colors.surface, borderColor: colors.line }]}>
          {profileRows.map((row, idx) => {
            const isLast = idx === profileRows.length - 1;
            return (
              <View
                key={row.label}
                style={[
                  styles.rowItem,
                  { borderBottomColor: colors.line },
                  !isLast && { borderBottomWidth: 1 }
                ]}
              >
                <Text style={[styles.rowLabel, { color: colors.muted }]}>{row.label}</Text>
                <Text style={[styles.rowValue, { color: colors.ink }]}>{row.value}</Text>
              </View>
            );
          })}
        </View>

        {/* Edit Button CTA */}
        <TouchableOpacity
          style={[styles.editBtn, { backgroundColor: purpleTheme.primary }]}
          onPress={() => navigation.navigate('BarberProfileEdit')}
        >
          <Text style={styles.editBtnText}>Edit Profile</Text>
        </TouchableOpacity>
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
    textAlign: 'center',
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  avatarWrapper: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#ECECF3',
  },
  detailsCard: {
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 16,
    marginBottom: 24,
    ...premiumShadow,
  },
  rowItem: {
    paddingVertical: 14,
  },
  rowLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  rowValue: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 4,
  },
  editBtn: {
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    ...premiumShadow,
  },
  editBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BarberProfileView;
