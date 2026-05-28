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
import { useNavigation } from '@react-navigation/native';
import { usePremiumTheme, premiumShadow } from '../../../shared/theme/premiumTheme';

type SupportItem = {
  id: string;
  label: string;
  subLabel: string;
  icon: string;
  route?: string;
};

const BarberHelpSupport = () => {
  const { colors, mode } = usePremiumTheme();
  const navigation = useNavigation<any>();

  const purpleTheme = {
    primary: '#6D4CF3',
    activeBg: mode === 'dark' ? 'rgba(109, 76, 243, 0.25)' : 'rgba(109, 76, 243, 0.12)',
  };

  const supportItems: SupportItem[] = [
    {
      id: '1',
      label: 'FAQs',
      subLabel: 'Find answers to common questions',
      icon: 'file-text-o',
    },
    {
      id: '2',
      label: 'Contact Support',
      subLabel: 'Call or email our support team',
      icon: 'phone',
    },
    {
      id: '3',
      label: 'Chat Support',
      subLabel: 'Chat with our support executive',
      icon: 'commenting-o',
      route: 'BarberChatSupport',
    },
    {
      id: '4',
      label: 'Report an issue',
      subLabel: 'Report app or booking issues',
      icon: 'exclamation-triangle',
    },
  ];

  const handleRowPress = (item: SupportItem) => {
    if (item.route) {
      navigation.navigate(item.route);
    } else {
      Alert.alert(item.label, `Accessing ${item.label} portal.`);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.canvas }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.line }]}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={18} color={colors.ink} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.ink }]}>Help & Support</Text>

        <View style={{ width: 36 }} />
      </View>

      {/* Support lists */}
      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.line }]}>
          {supportItems.map((item, index) => {
            const isLast = index === supportItems.length - 1;
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.rowItem,
                  { borderBottomColor: colors.line },
                  !isLast && { borderBottomWidth: 1 }
                ]}
                activeOpacity={0.85}
                onPress={() => handleRowPress(item)}
              >
                {/* Left Icon wrapper */}
                <View style={[styles.iconBox, { backgroundColor: purpleTheme.activeBg }]}>
                  <Icon name={item.icon} size={15} color={purpleTheme.primary} />
                </View>

                {/* Info Text Block */}
                <View style={styles.copyCol}>
                  <Text style={[styles.itemLabel, { color: colors.ink }]}>{item.label}</Text>
                  <Text style={[styles.itemSubText, { color: colors.muted }]}>{item.subLabel}</Text>
                </View>

                {/* Right Arrow */}
                <Icon name="chevron-right" size={12} color={colors.muted} />
              </TouchableOpacity>
            );
          })}
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
    textAlign: 'center',
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 8,
    ...premiumShadow,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  copyCol: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  itemSubText: {
    fontSize: 11.5,
    marginTop: 3,
  },
});

export default BarberHelpSupport;
