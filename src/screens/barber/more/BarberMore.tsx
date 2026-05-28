import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { usePremiumTheme, premiumShadow } from '../../../shared/theme/premiumTheme';
import { removeData } from '../../../helper/storage';

type MenuItem = {
  id: string;
  label: string;
  subLabel: string;
  icon: string;
  route?: string;
  isLogout?: boolean;
  badgeCount?: number;
};

const MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    label: 'Profile',
    subLabel: 'Manage your profile details',
    icon: 'user-o',
    route: 'BarberProfileView',
  },
  {
    id: '2',
    label: 'Notifications',
    subLabel: 'View all notifications',
    icon: 'bell-o',
    route: 'BarberNotifications',
    badgeCount: 5,
  },
  {
    id: '3',
    label: 'Shop Settings',
    subLabel: 'Manage shop timings & slots',
    icon: 'cog',
    route: 'BarberShopSettings',
  },
  {
    id: '4',
    label: 'Coupons & Offers',
    subLabel: 'Create and manage offers',
    icon: 'tag',
    route: 'BarberCoupons',
  },
  {
    id: '5',
    label: 'Reports & Analytics',
    subLabel: 'View business reports',
    icon: 'line-chart',
    route: 'BarberReports',
  },
  {
    id: '6',
    label: 'Help & Support',
    subLabel: 'FAQs and support',
    icon: 'question-circle-o',
    route: 'BarberHelpSupport',
  },
  {
    id: '7',
    label: 'Logout',
    subLabel: 'Logout from account',
    icon: 'sign-out',
    isLogout: true,
  },
];

const BarberMore = () => {
  const { colors, mode, setMode } = usePremiumTheme();
  const navigation = useNavigation<any>();

  // Unified royal purple theme matching the mockup
  const purpleTheme = {
    primary: '#6D4CF3',
    activeBg: mode === 'dark' ? 'rgba(109, 76, 243, 0.25)' : 'rgba(109, 76, 243, 0.12)',
  };

  const styles = createStyles(colors, mode, purpleTheme);

  const handleLogout = async () => {
    Alert.alert(
      'Logout Account',
      'Are you sure you want to logout? You will need to login again to access your account.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await removeData('access_token');
            await removeData('refresh_token');
            await removeData('user_role');
            await removeData('user_id');
            await removeData('assigned');
            await removeData('user_name');

            navigation.reset({
              index: 0,
              routes: [{ name: 'LoginScreen' }],
            });
          },
        },
      ]
    );
  };

  const handleItemPress = (item: MenuItem) => {
    if (item.isLogout) {
      handleLogout();
    } else if (item.route) {
      navigation.navigate(item.route);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.canvas }]}>

      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card Block */}
        <View style={[styles.profileCard, { backgroundColor: colors.surface, borderColor: colors.line }]}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' }}
            style={styles.avatar}
          />
          <Text style={[styles.profileName, { color: colors.ink }]}>Rahul Verma</Text>
          <Text style={[styles.profileShop, { color: colors.muted }]}>The Classic Cuts</Text>
          
          <TouchableOpacity
            style={[styles.viewProfileBtn, { borderColor: purpleTheme.primary }]}
            onPress={() => navigation.navigate('BarberProfileView')}
          >
            <Text style={[styles.viewProfileText, { color: purpleTheme.primary }]}>View Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Setting options lists */}
        <View style={[styles.menuWrapper, { backgroundColor: colors.surface, borderColor: colors.line }]}>
          {MENU_ITEMS.map((item, index) => {
            const isLast = index === MENU_ITEMS.length - 1;

            if (item.isLogout) {
              return (
                <React.Fragment key={item.id}>
                  {/* Custom Appearance Row */}
                  <View style={[styles.appearanceRow, { borderBottomColor: colors.line, borderBottomWidth: 1 }]}>
                    <View style={styles.appearanceLeft}>
                      <View style={[styles.iconBox, { backgroundColor: purpleTheme.activeBg }]}>
                        <Icon name="paint-brush" size={16} color={purpleTheme.primary} />
                      </View>
                      <View style={styles.textBlock}>
                        <Text style={[styles.itemLabel, { color: colors.ink }]}>Appearance</Text>
                        <Text style={[styles.itemSubLabel, { color: colors.muted }]}>Choose theme style</Text>
                      </View>
                    </View>

                    <View style={[styles.segmented, { backgroundColor: colors.canvas, borderColor: colors.line }]}>
                      {([
                        { label: 'Light', value: 'light', icon: 'sun-o' },
                        { label: 'Dark', value: 'dark', icon: 'moon-o' },
                        { label: 'System', value: 'system', icon: 'desktop' },
                      ] as const).map(opt => {
                        const active = mode === opt.value;
                        return (
                          <TouchableOpacity
                            key={opt.value}
                            style={[
                              styles.segment,
                              active && { backgroundColor: purpleTheme.primary }
                            ]}
                            onPress={() => setMode(opt.value)}
                          >
                            <Icon name={opt.icon} size={13} color={active ? '#FFFFFF' : colors.muted} />
                            <Text style={[
                              styles.segmentText,
                              active ? { color: '#FFFFFF', fontWeight: 'bold' } : { color: colors.muted }
                            ]}>
                              {opt.label}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>

                  {/* Logout Row */}
                  <TouchableOpacity
                    style={[styles.menuItem]}
                    activeOpacity={0.85}
                    onPress={() => handleItemPress(item)}
                  >
                    {/* Left Icon */}
                    <View style={[
                      styles.iconBox,
                      { backgroundColor: 'rgba(239, 68, 68, 0.1)' }
                    ]}>
                      <Icon
                        name={item.icon}
                        size={16}
                        color="#EF4444"
                      />
                    </View>

                    {/* Text Block */}
                    <View style={styles.textBlock}>
                      <Text style={[styles.itemLabel, { color: '#EF4444' }]}>
                        {item.label}
                      </Text>
                      <Text style={[styles.itemSubLabel, { color: colors.muted }]}>
                        {item.subLabel}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </React.Fragment>
              );
            }

            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.menuItem,
                  { borderBottomColor: colors.line },
                  !isLast && { borderBottomWidth: 1 }
                ]}
                activeOpacity={0.85}
                onPress={() => handleItemPress(item)}
              >
                {/* Left Icon */}
                <View style={[
                  styles.iconBox,
                  { backgroundColor: purpleTheme.activeBg }
                ]}>
                  <Icon
                    name={item.icon}
                    size={16}
                    color={purpleTheme.primary}
                  />
                </View>

                {/* Text Block */}
                <View style={styles.textBlock}>
                  <Text style={[styles.itemLabel, { color: colors.ink }]}>
                    {item.label}
                  </Text>
                  <Text style={[styles.itemSubLabel, { color: colors.muted }]}>
                    {item.subLabel}
                  </Text>
                </View>

                {/* Right Badge / Arrow */}
                {item.badgeCount ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.badgeCount}</Text>
                  </View>
                ) : null}

                {!item.isLogout && (
                  <Icon name="chevron-right" size={12} color={colors.muted} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (
  colors: ReturnType<typeof usePremiumTheme>['colors'],
  mode: string,
  theme: { primary: string; activeBg: string }
) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
    },
    headerTitle: {
      fontSize: 19,
      fontWeight: 'bold',
      textAlign: 'center',
      flex: 1,
    },
    listContent: {
      padding: 16,
      paddingBottom: 90,
    },
    profileCard: {
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 24,
      paddingVertical: 22,
      marginBottom: 16,
      ...premiumShadow,
    },
    avatar: {
      width: 76,
      height: 76,
      borderRadius: 38,
      backgroundColor: '#ECECF3',
    },
    profileName: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 10,
    },
    profileShop: {
      fontSize: 13,
      marginTop: 4,
    },
    viewProfileBtn: {
      borderWidth: 1,
      borderRadius: 18,
      paddingHorizontal: 20,
      paddingVertical: 8,
      marginTop: 14,
    },
    viewProfileText: {
      fontSize: 13,
      fontWeight: 'bold',
    },
    menuWrapper: {
      borderWidth: 1,
      borderRadius: 24,
      paddingHorizontal: 8,
      ...premiumShadow,
    },
    menuItem: {
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
    textBlock: {
      flex: 1,
    },
    itemLabel: {
      fontSize: 14.5,
      fontWeight: 'bold',
    },
    itemSubLabel: {
      fontSize: 11.5,
      marginTop: 3,
    },
    badge: {
      backgroundColor: '#EF4444',
      width: 18,
      height: 18,
      borderRadius: 9,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 8,
    },
    badgeText: {
      color: '#FFFFFF',
      fontSize: 10,
      fontWeight: 'bold',
    },
    appearanceRow: {
      flexDirection: 'column',
      paddingVertical: 14,
      paddingHorizontal: 10,
      gap: 12,
    },
    appearanceLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    segmented: {
      flexDirection: 'row',
      borderRadius: 14,
      padding: 4,
      borderWidth: 1,
      marginTop: 2,
    },
    segment: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      borderRadius: 11,
      paddingVertical: 8,
    },
    segmentText: {
      fontSize: 12,
      fontWeight: '600',
    },
  });

export default BarberMore;
