import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getData } from '../../../helper/storage';

const SplashScreen = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  useEffect(() => {
    const openNextScreen = async () => {
      const [accessToken, userRole] = await Promise.all([
        getData('access_token'),
        getData('user_role'),
      ]);

      const role = String(userRole || '').toLowerCase().trim();

      setTimeout(() => {
        if (accessToken && role === 'superadmin') {
          navigation.reset({ index: 0, routes: [{ name: 'SuperAdminTabs' }] });
          return;
        }

        if (accessToken && role === 'barber') {
          navigation.reset({ index: 0, routes: [{ name: 'barber' }] });
          return;
        }

        navigation.reset({ index: 0, routes: [{ name: 'LoginScreen' }] });
      }, 1200);
    };

    openNextScreen();
  }, [navigation]);

  return (
    <View style={styles.screen}>
      <View style={styles.logoMark}>
        <Icon name="scissors" size={42} color="#111111" />
      </View>
      <Text style={styles.brand}>barberit</Text>
      <Text style={styles.tagline}>Salon services in minutes</Text>
      <View style={styles.footerPill}>
        <Icon name="clock-o" size={14} color="#111111" />
        <Text style={styles.footerText}>Fast booking. Fresh cuts.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8CB2E',
    padding: 28,
  },
  logoMark: {
    width: 92,
    height: 92,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#111111',
    shadowColor: '#111111',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 6,
  },
  brand: {
    color: '#111111',
    fontSize: 46,
    fontWeight: '900',
    marginTop: 18,
    letterSpacing: 0,
  },
  tagline: {
    color: '#2A2A2A',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 4,
  },
  footerPill: {
    position: 'absolute',
    bottom: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.62)',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  footerText: {
    color: '#111111',
    fontSize: 13,
    fontWeight: '900',
  },
});

export default SplashScreen;
