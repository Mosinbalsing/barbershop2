import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { usePremiumTheme, premiumShadow } from '../../../shared/theme/premiumTheme';

const BarberCreateCoupon = () => {
  const { colors, mode } = usePremiumTheme();
  const navigation = useNavigation();

  const purpleTheme = {
    primary: '#6D4CF3',
  };

  const [couponCode, setCouponCode] = useState('');
  const [discountType, setDiscountType] = useState<'% Discount' | 'Flat Discount'>('% Discount');
  const [discountValue, setDiscountValue] = useState('');
  const [minOrder, setMinOrder] = useState('');
  const [validTill, setValidTill] = useState('31 May 2025');

  const handleCreateCoupon = () => {
    if (!couponCode.trim() || !discountValue.trim()) {
      Alert.alert('Missing Fields', 'Please enter coupon code and discount value.');
      return;
    }

    Alert.alert('Coupon Created', `Promo code ${couponCode.toUpperCase()} created successfully!`, [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
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

          <Text style={[styles.headerTitle, { color: colors.ink }]}>Create Coupon</Text>

          <View style={{ width: 36 }} />
        </View>

        <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
          {/* Coupon Fields Form */}
          <View style={[styles.formCard, { backgroundColor: colors.surface, borderColor: colors.line }]}>
            
            {/* Coupon Code Input */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, { color: colors.muted }]}>Coupon Code</Text>
              <TextInput
                style={[styles.inputField, { color: colors.ink, borderColor: colors.line }]}
                placeholder="Enter coupon code"
                placeholderTextColor={colors.muted}
                value={couponCode}
                onChangeText={setCouponCode}
                autoCapitalize="characters"
              />
            </View>

            {/* Discount Type Radio Selectors */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, { color: colors.muted }]}>Discount Type</Text>
              <View style={styles.radioRow}>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    discountType === '% Discount' ? { backgroundColor: purpleTheme.primary } : { backgroundColor: colors.canvas, borderColor: colors.line, borderWidth: 1 }
                  ]}
                  onPress={() => setDiscountType('% Discount')}
                >
                  <Text style={[
                    styles.radioText,
                    discountType === '% Discount' ? { color: '#FFFFFF' } : { color: colors.muted }
                  ]}>
                    % Discount
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    discountType === 'Flat Discount' ? { backgroundColor: purpleTheme.primary } : { backgroundColor: colors.canvas, borderColor: colors.line, borderWidth: 1 }
                  ]}
                  onPress={() => setDiscountType('Flat Discount')}
                >
                  <Text style={[
                    styles.radioText,
                    discountType === 'Flat Discount' ? { color: '#FFFFFF' } : { color: colors.muted }
                  ]}>
                    Flat Discount
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Discount Value */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, { color: colors.muted }]}>Discount Value</Text>
              <TextInput
                style={[styles.inputField, { color: colors.ink, borderColor: colors.line }]}
                placeholder={discountType === '% Discount' ? 'Enter discount % (e.g. 20)' : 'Enter flat amount ₹ (e.g. 100)'}
                placeholderTextColor={colors.muted}
                value={discountValue}
                onChangeText={setDiscountValue}
                keyboardType="numeric"
              />
            </View>

            {/* Min Order Value */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, { color: colors.muted }]}>Min. Order Value (Optional)</Text>
              <TextInput
                style={[styles.inputField, { color: colors.ink, borderColor: colors.line }]}
                placeholder="Enter minimum amount"
                placeholderTextColor={colors.muted}
                value={minOrder}
                onChangeText={setMinOrder}
                keyboardType="numeric"
              />
            </View>

            {/* Valid Till Date */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, { color: colors.muted }]}>Valid Till</Text>
              <TouchableOpacity
                style={[styles.dateSelector, { backgroundColor: colors.canvas, borderColor: colors.line }]}
                onPress={() => Alert.alert('Valid Till', 'Pick expiration calendar date.')}
              >
                <Text style={[styles.dateValueText, { color: colors.ink }]}>{validTill}</Text>
                <Icon name="calendar" size={14} color={colors.ink} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Action button */}
          <TouchableOpacity
            style={[styles.createBtn, { backgroundColor: purpleTheme.primary }]}
            onPress={handleCreateCoupon}
          >
            <Text style={styles.createBtnText}>Create Coupon</Text>
          </TouchableOpacity>
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
    textAlign: 'center',
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  formCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 16,
    marginBottom: 24,
    ...premiumShadow,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  inputField: {
    borderWidth: 1,
    borderRadius: 14,
    height: 44,
    paddingHorizontal: 12,
    fontSize: 14,
    fontWeight: '600',
  },
  radioRow: {
    flexDirection: 'row',
    gap: 10,
  },
  radioButton: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 14,
    height: 44,
    paddingHorizontal: 12,
  },
  dateValueText: {
    fontSize: 14,
    fontWeight: '600',
  },
  createBtn: {
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    ...premiumShadow,
    marginTop: 8,
  },
  createBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BarberCreateCoupon;
