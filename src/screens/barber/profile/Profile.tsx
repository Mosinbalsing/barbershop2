
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import { fetchApi } from '../../../Api/http_services';
import { apiPath } from '../../../environment/environment_urls';
import { getData, removeData } from '../../../helper/storage';
import { useNavigation } from '@react-navigation/native';
import Loader from '../../../shared/components/Loader';

const PROFILE_HEADER_HEIGHT = 220;

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completion, setCompletion] = useState(80); // Example: 80% completed
  const [imageScale] = useState(new Animated.Value(1));

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const token = await getData('access_token');
      const res = await fetchApi('GET', apiPath.auth.profile, token);
      console.log('Profile Response:', res);  
      if (res && res.status !== false) {
        setProfile(res.data || res);
      } else {
        setError(res?.message || 'Failed to load profile');
      }
    } catch (e) {
      setError('Network error');
    }
    setLoading(false);
  };


  const handleLogout = async () => {
    // Remove all local data (clear MMKV storage)
    if (global && global.storage && typeof global.storage.clearAll === 'function') {
      global.storage.clearAll();
    } else if (typeof removeData === 'function') {
      // Remove common keys (add more if needed)
      await removeData('access_token');
      await removeData('refresh_token');
      await removeData('user_role');
      await removeData('SelectedLanguage');
      // Add any other keys you use for auth/profile
    }
    // Navigate to LoginScreen
    navigation.reset({
      index: 0,
      routes: [{ name: 'LoginScreen' }],
    });
  };

  const handleEdit = () => {
    // TODO: Open edit profile form
  };

  const handleImagePress = () => {
    Animated.sequence([
      Animated.spring(imageScale, { toValue: 1.1, useNativeDriver: true }),
      Animated.spring(imageScale, { toValue: 1, useNativeDriver: true }),
    ]).start();
    // TODO: Open image picker
  };

  // Placeholder for profile data structure
  const profileData = profile || {
    name: 'John Barber',
    email: 'john@barber.com',
    mobile: '+1234567890',
    shopName: 'Gold Scissors',
    shopAddress: '123 Main St, City',
    shopDescription: 'Premium barber shop with 5 years experience.',
    experience: '5 years',
    specialization: ['Haircut', 'Beard', 'Styling'],
    openTime: '10:00',
    closeTime: '20:00',
    weeklyHoliday: 'Sunday',
    slotDuration: '30 min',
    bookings: 120,
    customers: 80,
    earnings: '$2,500',
    verified: true,
    social: { instagram: '', whatsapp: '' },
    profileImage: require('../../../assets/images/PNG/logo-light.png'),
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#181818' }}>
      <StatusBar barStyle="light-content" />
      <Loader loading={loading} />
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* Gradient Header */}
        <LinearGradient
          colors={["#232526", "#FFD700"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Animated.View style={[styles.profileImageWrapper, { transform: [{ scale: imageScale }] }]}> 
              <TouchableOpacity onPress={handleImagePress} activeOpacity={0.8}>
                <Image source={profileData.profileImage} style={styles.profileImage} />
                {profileData.verified && (
                  <View style={styles.verifiedBadge}>
                    <Icon name="check-circle" size={22} color="#4CAF50" />
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
            <Text style={styles.name}>{profileData.name}</Text>
            <Text style={styles.shopName}>{profileData.shopName}</Text>
            {/* Rating (future) */}
            {/* <Text style={styles.rating}>⭐ 4.8</Text> */}
          </View>
          {/* Profile Completion */}
          <View style={styles.completionBarWrapper}>
            <View style={styles.completionBarBg}>
              <View style={[styles.completionBar, { width: `${completion}%` }]} />
            </View>
            <Text style={styles.completionText}>{completion}% Profile Completed</Text>
          </View>
        </LinearGradient>

        {/* Glassmorphism Cards */}
        <View style={styles.card}>
          <SectionDivider title="Basic Details" onEdit={handleEdit} />
          <ProfileRow label="Name" value={profileData.name} />
          <ProfileRow label="Email" value={profileData.email} />
          <ProfileRow label="Mobile" value={profileData.mobile} />
          <ProfileRow label="Shop Address" value={profileData.shopAddress} />
        </View>

        <View style={styles.card}>
          <SectionDivider title="Shop Information" onEdit={handleEdit} />
          <ProfileRow label="Shop Name" value={profileData.shopName} />
          <ProfileRow label="Description" value={profileData.shopDescription} />
          <ProfileRow label="Experience" value={profileData.experience} />
          <ProfileRow label="Specialization" value={profileData.specialization.join(', ')} />
        </View>

        <View style={styles.card}>
          <SectionDivider title="Working Info" onEdit={handleEdit} />
          <ProfileRow label="Open Time" value={profileData.openTime} />
          <ProfileRow label="Close Time" value={profileData.closeTime} />
          <ProfileRow label="Weekly Holiday" value={profileData.weeklyHoliday} />
          <ProfileRow label="Slot Duration" value={profileData.slotDuration} />
        </View>

        {/* Stats Section */}
        <View style={styles.card}>
          <SectionDivider title="Stats" />
          <View style={styles.statsRow}>
            <StatBox icon="calendar" label="Bookings" value={profileData.bookings} />
            <StatBox icon="users" label="Customers" value={profileData.customers} />
            <StatBox icon="dollar" label="Earnings" value={profileData.earnings} />
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Icon name="sign-out" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const SectionDivider = ({ title, onEdit }) => (
  <View style={styles.sectionDivider}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {onEdit && (
      <TouchableOpacity onPress={onEdit}>
        <Icon name="pencil" size={18} color="#FFD700" style={{ marginLeft: 8 }} />
      </TouchableOpacity>
    )}
  </View>
);

const ProfileRow = ({ label, value }) => (
  <View style={styles.profileRow}>
    <Text style={styles.profileLabel}>{label}</Text>
    <Text style={styles.profileValue}>{value}</Text>
  </View>
);

const StatBox = ({ icon, label, value }) => (
  <View style={styles.statBox}>
    <Icon name={icon} size={22} color="#FFD700" style={{ marginBottom: 4 }} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  header: {
    height: PROFILE_HEADER_HEIGHT,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 16,
    justifyContent: 'flex-end',
    paddingBottom: 16,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: 8,
  },
  profileImageWrapper: {
    marginTop: -60,
    marginBottom: 8,
    borderRadius: 60,
    overflow: 'visible',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 4,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FFD700',
    backgroundColor: '#fff',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 2,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  shopName: {
    fontSize: 16,
    color: '#FFD700',
    marginBottom: 2,
  },
  completionBarWrapper: {
    alignItems: 'center',
    marginTop: 8,
  },
  completionBarBg: {
    width: 180,
    height: 8,
    backgroundColor: '#333',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 2,
  },
  completionBar: {
    height: 8,
    backgroundColor: '#FFD700',
    borderRadius: 8,
  },
  completionText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
  },
  card: {
    backgroundColor: 'rgba(30,30,30,0.7)',
    borderRadius: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backdropFilter: 'blur(8px)', // Glassmorphism
  },
  sectionDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
    letterSpacing: 0.5,
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingVertical: 2,
  },
  profileLabel: {
    color: '#bbb',
    fontSize: 15,
    fontWeight: '500',
  },
  profileValue: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    maxWidth: '60%',
    textAlign: 'right',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    marginHorizontal: 4,
    paddingVertical: 12,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#232526',
    borderRadius: 24,
    marginHorizontal: 80,
    marginTop: 24,
    paddingVertical: 12,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default Profile;
