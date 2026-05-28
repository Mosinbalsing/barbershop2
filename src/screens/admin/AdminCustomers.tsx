import React, { useState, useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { usePremiumTheme, premiumShadow } from '../../shared/theme/premiumTheme';

type CustomerItem = {
  id: string;
  name: string;
  phone: string;
  totalBookings: number;
  avatar: string;
  totalSpent: string;
  memberSince: string;
  email: string;
  gender: string;
  dob: string;
  address: string;
};

const INITIAL_MOCK_CUSTOMERS: CustomerItem[] = [
  {
    id: '1',
    name: 'Rahul Verma',
    phone: '9876543210',
    totalBookings: 8,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    totalSpent: '₹2,394',
    memberSince: '12 Jan 2025',
    email: 'rahulverma@gmail.com',
    gender: 'Male',
    dob: '12 May 1995',
    address: '12, MG Road, Indore, M.P.',
  },
  {
    id: '2',
    name: 'Amit Kumar',
    phone: '9123456780',
    totalBookings: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    totalSpent: '₹1,249',
    memberSince: '20 Jan 2025',
    email: 'amit.kumar@gmail.com',
    gender: 'Male',
    dob: '10 Aug 1993',
    address: '45, Ring Road, Indore, M.P.',
  },
  {
    id: '3',
    name: 'Vikram Singh',
    phone: '9888776655',
    totalBookings: 6,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    totalSpent: '₹1,849',
    memberSince: '18 Jan 2025',
    email: 'vikram.singh@gmail.com',
    gender: 'Male',
    dob: '05 May 1992',
    address: '78, Airport Road, Indore, M.P.',
  },
  {
    id: '4',
    name: 'Rohit Sharma',
    phone: '8877665544',
    totalBookings: 4,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    totalSpent: '₹949',
    memberSince: '02 Feb 2025',
    email: 'rohit.sharma@gmail.com',
    gender: 'Male',
    dob: '22 Dec 1996',
    address: '90, Palasia Area, Indore, M.P.',
  },
  {
    id: '5',
    name: 'Manish Patel',
    phone: '7766554433',
    totalBookings: 7,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
    totalSpent: '₹2,099',
    memberSince: '05 Feb 2025',
    email: 'manish.patel@gmail.com',
    gender: 'Male',
    dob: '14 Nov 1994',
    address: '112, Vijay Nagar, Indore, M.P.',
  },
];

const AdminCustomers = () => {
  const { colors, mode } = usePremiumTheme();
  
  const brownTheme = {
    primary: '#683E26',
    activeBg: mode === 'dark' ? '#3A281E' : '#F5F1ED',
  };

  const styles = useMemo(() => createStyles(colors, mode, brownTheme), [colors, mode]);

  // Main customer list states
  const [customersList, setCustomersList] = useState<CustomerItem[]>(INITIAL_MOCK_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState('');

  // Subview flow controller state: 'list' | 'details' | 'edit' | 'bookings' | 'transactions' | 'notes' | 'delete'
  const [currentView, setCurrentView] = useState<'list' | 'details' | 'edit' | 'bookings' | 'transactions' | 'notes' | 'delete'>('list');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerItem | null>(null);

  // Form states for editing
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editGender, setEditGender] = useState('');
  const [editDob, setEditDob] = useState('');
  const [editAddress, setEditAddress] = useState('');

  // Customer Notes list
  const [mockNotes, setMockNotes] = useState<Array<{ date: string; text: string }>>([
    { date: '09 May 2025, 04:45 PM', text: 'Prefers less scalp massage.' },
    { date: '10 May 2025, 02:18 PM', text: 'Regular customer, good feedback.' }
  ]);
  const [newNoteText, setNewNoteText] = useState('');

  // Customer bookings segments state: 'All' | 'Completed' | 'Cancelled'
  const [bookingSegment, setBookingSegment] = useState<'All' | 'Completed' | 'Cancelled'>('All');

  // Customer transaction timeline log
  const [mockTransactions] = useState([
    { date: '20 May 2025', service: 'Haircut & Beard Trim', price: '₹299', status: 'Paid' },
    { date: '18 May 2025', service: 'Hair Spa', price: '₹499', status: 'Paid' },
    { date: '13 May 2025', service: 'Haircut', price: '₹149', status: 'Paid' }
  ]);

  const filteredCustomers = useMemo(() => {
    return customersList.filter(c => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return c.name.toLowerCase().includes(query) || c.phone.includes(query);
      }
      return true;
    });
  }, [searchQuery, customersList]);

  // Click selectors and actions
  const handleOpenCustomerDetails = (customer: CustomerItem) => {
    setSelectedCustomer(customer);
    setCurrentView('details');
  };

  const handleOpenEditCustomer = () => {
    if (selectedCustomer) {
      setEditName(selectedCustomer.name);
      setEditPhone(selectedCustomer.phone);
      setEditEmail(selectedCustomer.email);
      setEditGender(selectedCustomer.gender);
      setEditDob(selectedCustomer.dob);
      setEditAddress(selectedCustomer.address);
      setCurrentView('edit');
    }
  };

  const handleSaveCustomerChanges = () => {
    if (!editName.trim() || !editPhone.trim()) {
      Alert.alert('Required Info', 'Name and Phone number are required.');
      return;
    }

    if (selectedCustomer) {
      const updated = customersList.map(c => {
        if (c.id === selectedCustomer.id) {
          const newObj = {
            ...c,
            name: editName,
            phone: editPhone,
            email: editEmail,
            gender: editGender,
            dob: editDob,
            address: editAddress
          };
          setSelectedCustomer(newObj);
          return newObj;
        }
        return c;
      });
      setCustomersList(updated);
      Alert.alert('Details Saved', 'Customer details saved successfully.');
      setCurrentView('details');
    }
  };

  const handleAddNote = () => {
    if (!newNoteText.trim()) return;
    const dateStr = new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setMockNotes([{ date: dateStr, text: newNoteText.trim() }, ...mockNotes]);
    setNewNoteText('');
    Alert.alert('Note Saved', 'Special note added successfully.');
  };

  const handleDeleteCustomer = () => {
    if (selectedCustomer) {
      const updated = customersList.filter(c => c.id !== selectedCustomer.id);
      setCustomersList(updated);
      Alert.alert('Client Removed', `Customer ${selectedCustomer.name} has been removed from database.`);
      setSelectedCustomer(null);
      setCurrentView('list');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ==================== VIEW 1: CUSTOMERS LIST PORTAL ==================== */}
      {currentView === 'list' && (
        <View style={{ flex: 1 }}>
          {/* Header */}
         

          {/* Search Input Card */}
          <View style={styles.searchWrapper}>
            <View style={styles.searchBox}>
              <Icon name="search" size={13} color={colors.muted} style={styles.searchIcon} />
              <TextInput
                placeholder="Search customers..."
                placeholderTextColor={colors.muted}
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchInput}
              />
              <TouchableOpacity style={styles.filterBtn}>
                <Icon name="sliders" size={15} color={colors.ink} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Scroll List */}
          <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
            {filteredCustomers.length === 0 ? (
              <View style={styles.emptyState}>
                <Icon name="users" size={42} color={colors.muted} />
                <Text style={styles.emptyText}>No customers found</Text>
              </View>
            ) : (
              filteredCustomers.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.customerCard}
                  activeOpacity={0.85}
                  onPress={() => handleOpenCustomerDetails(item)}
                >
                  <Image source={{ uri: item.avatar }} style={styles.avatar} />
                  
                  <View style={styles.infoWrapper}>
                    <Text style={styles.nameText}>{item.name}</Text>
                    <Text style={styles.phoneText}>{item.phone}</Text>
                    <Text style={styles.bookingCountText}>
                      Total Bookings: <Text style={{ color: colors.ink, fontWeight: 'bold' }}>{item.totalBookings}</Text>
                    </Text>
                  </View>

                  <Icon name="chevron-right" size={11} color={colors.muted} style={styles.chevron} />
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      )}

      {/* ==================== VIEW 2: CUSTOMER DETAILS SHEET ==================== */}
      {currentView === 'details' && selectedCustomer && (
        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={() => setCurrentView('list')} style={styles.floatingBackBtn}>
            <Icon name="arrow-left" size={16} color={colors.ink} />
          </TouchableOpacity>
          

          <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
            {/* Portrait profile header */}
            <View style={styles.profileHeaderBox}>
              <Image source={{ uri: selectedCustomer.avatar }} style={styles.detailsAvatarFrame} />
              <Text style={styles.detailsNameText}>{selectedCustomer.name}</Text>
              <Text style={styles.detailsPhoneText}>{selectedCustomer.phone}</Text>
            </View>

            {/* Metric statistics blocks */}
            <View style={styles.detailsMetricsStrip}>
              <View style={styles.detailsMetricBox}>
                <Text style={styles.detailsMetricCountVal}>{selectedCustomer.totalBookings}</Text>
                <Text style={styles.detailsMetricLabel}>Total Bookings</Text>
              </View>

              <View style={styles.detailsMetricBox}>
                <Text style={styles.detailsMetricCountVal}>{selectedCustomer.totalSpent}</Text>
                <Text style={styles.detailsMetricLabel}>Total Spent</Text>
              </View>

              <View style={styles.detailsMetricBox}>
                <Text style={[styles.detailsMetricCountVal, { fontSize: 13, paddingVertical: 2 }]}>
                  {selectedCustomer.memberSince}
                </Text>
                <Text style={styles.detailsMetricLabel}>Member Since</Text>
              </View>
            </View>

            {/* Personal information sheet */}
            <Text style={styles.formSectionHeading}>Personal Information</Text>
            
            <View style={styles.personalSpecCard}>
              <View style={styles.specLineRow}>
                <Text style={styles.specLabel}>Email</Text>
                <Text style={styles.specValue}>{selectedCustomer.email}</Text>
              </View>

              <View style={styles.specDivider} />

              <View style={styles.specLineRow}>
                <Text style={styles.specLabel}>Gender</Text>
                <Text style={styles.specValue}>{selectedCustomer.gender}</Text>
              </View>

              <View style={styles.specDivider} />

              <View style={styles.specLineRow}>
                <Text style={styles.specLabel}>Date of Birth</Text>
                <Text style={styles.specValue}>{selectedCustomer.dob}</Text>
              </View>

              <View style={styles.specDivider} />

              <View style={[styles.specLineRow, { flexDirection: 'column', alignItems: 'flex-start' }]}>
                <Text style={[styles.specLabel, { marginBottom: 6 }]}>Address</Text>
                <Text style={styles.specNotesText}>{selectedCustomer.address}</Text>
              </View>
            </View>

            {/* Options CTAs list grid */}
            <TouchableOpacity style={styles.ctaRowBtn} onPress={handleOpenEditCustomer}>
              <Icon name="pencil" size={14} color="#683E26" style={{ marginRight: 12 }} />
              <Text style={styles.ctaRowBtnText}>Edit Customer</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.ctaRowBtn} onPress={() => setCurrentView('bookings')}>
              <Icon name="calendar" size={14} color="#683E26" style={{ marginRight: 12 }} />
              <Text style={styles.ctaRowBtnText}>Customer Bookings</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.ctaRowBtn} onPress={() => setCurrentView('transactions')}>
              <Icon name="credit-card" size={14} color="#683E26" style={{ marginRight: 12 }} />
              <Text style={styles.ctaRowBtnText}>Customer Transactions</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.ctaRowBtn} onPress={() => setCurrentView('notes')}>
              <Icon name="commenting-o" size={14} color="#683E26" style={{ marginRight: 12 }} />
              <Text style={styles.ctaRowBtnText}>Customer Notes</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.ctaRowBtn, { borderBottomWidth: 0 }]} onPress={() => setCurrentView('delete')}>
              <Icon name="trash-o" size={14} color="#EF4444" style={{ marginRight: 12 }} />
              <Text style={[styles.ctaRowBtnText, { color: '#EF4444' }]}>Delete Customer</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      {/* ==================== VIEW 3: EDIT CUSTOMER DETAILS ==================== */}
      {currentView === 'edit' && selectedCustomer && (
        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={() => setCurrentView('list')} style={styles.floatingBackBtn}>
            <Icon name="arrow-left" size={16} color={colors.ink} />
          </TouchableOpacity>

          <ScrollView contentContainerStyle={{ padding: 18 }}>
            <Text style={styles.formLabel}>Customer Name</Text>
            <TextInput
              style={styles.formInput}
              value={editName}
              onChangeText={setEditName}
            />

            <Text style={styles.formLabel}>Mobile Number</Text>
            <TextInput
              style={styles.formInput}
              value={editPhone}
              onChangeText={setEditPhone}
              keyboardType="phone-pad"
            />

            <Text style={styles.formLabel}>Email Address</Text>
            <TextInput
              style={styles.formInput}
              value={editEmail}
              onChangeText={setEditEmail}
              keyboardType="email-address"
            />

            <Text style={styles.formLabel}>Gender</Text>
            <View style={styles.genderDropdownSim}>
              <Text style={{ fontSize: 14, color: colors.ink }}>{editGender}</Text>
              <TouchableOpacity onPress={() => {
                Alert.alert('Gender Selector', 'Choose Gender', [
                  { text: 'Male', onPress: () => setEditGender('Male') },
                  { text: 'Female', onPress: () => setEditGender('Female') },
                ]);
              }}>
                <Icon name="chevron-down" size={12} color={colors.ink} />
              </TouchableOpacity>
            </View>

            <Text style={styles.formLabel}>Date of Birth</Text>
            <TextInput
              style={styles.formInput}
              value={editDob}
              onChangeText={setEditDob}
            />

            <Text style={styles.formLabel}>Home Address</Text>
            <TextInput
              style={styles.formInput}
              value={editAddress}
              onChangeText={setEditAddress}
              multiline
            />

            <TouchableOpacity style={styles.formSubmitBtn} onPress={handleSaveCustomerChanges}>
              <Text style={styles.formSubmitBtnText}>Save Changes</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      {/* ==================== VIEW 4: CUSTOMER BOOKINGS LIST ==================== */}
      {currentView === 'bookings' && selectedCustomer && (
        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={() => setCurrentView('list')} style={styles.floatingBackBtn}>
            <Icon name="arrow-left" size={16} color={colors.ink} />
          </TouchableOpacity>

          {/* Segment Selector tabs */}
          <View style={styles.bookingTabsRow}>
            {(['All', 'Completed', 'Cancelled'] as const).map(tab => {
              const isActive = bookingSegment === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  style={[styles.bookingTabBtn, isActive && styles.bookingTabBtnActive]}
                  onPress={() => setBookingSegment(tab)}
                >
                  <Text style={[styles.bookingTabBtnLabel, isActive && styles.bookingTabBtnLabelActive]}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <ScrollView contentContainerStyle={{ padding: 18 }} showsVerticalScrollIndicator={false}>
            {[
              { date: '20 May 2025, 10:00 AM', service: 'Haircut & Beard Trim', price: '₹299', status: 'Completed' },
              { date: '18 May 2025, 05:30 PM', service: 'Hair Spa', price: '₹499', status: 'Completed' },
              { date: '15 May 2025, 11:00 AM', service: 'Haircut', price: '₹149', status: 'Cancelled' }
            ]
              .filter(b => bookingSegment === 'All' || b.status === bookingSegment)
              .map((b, idx) => (
                <View key={idx} style={styles.historyBookingCard}>
                  <View>
                    <Text style={styles.historyBookingDate}>{b.date}</Text>
                    <Text style={styles.historyBookingService}>{b.service}</Text>
                    <Text style={styles.historyBookingPrice}>{b.price}</Text>
                  </View>

                  <View style={[
                    styles.statusPillSmall,
                    b.status === 'Completed' ? styles.statusPillSmallRead : styles.statusPillSmallNew
                  ]}>
                    <Text style={[
                      styles.statusPillSmallLabel,
                      b.status === 'Completed' ? styles.statusPillSmallLabelRead : styles.statusPillSmallLabelNew
                    ]}>
                      {b.status}
                    </Text>
                  </View>
                </View>
              ))}
          </ScrollView>
        </View>
      )}

      {/* ==================== VIEW 5: CUSTOMER TRANSACTIONS LOG ==================== */}
      {currentView === 'transactions' && selectedCustomer && (
        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={() => setCurrentView('list')} style={styles.floatingBackBtn}>
            <Icon name="arrow-left" size={16} color={colors.ink} />
          </TouchableOpacity>

          <ScrollView contentContainerStyle={{ padding: 18 }} showsVerticalScrollIndicator={false}>
            <Text style={styles.formSectionHeading}>All Transactions</Text>

            {mockTransactions.map((txn, idx) => (
              <View key={idx} style={styles.detailsTxnCard}>
                <View>
                  <Text style={styles.detailsTxnDate}>{txn.date}</Text>
                  <Text style={styles.detailsTxnService}>{txn.service}</Text>
                  <Text style={styles.detailsTxnStatus}>Method: Cash at Shop</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.detailsTxnPrice}>{txn.price}</Text>
                  <View style={styles.paidBadgeDot}>
                    <Text style={styles.paidBadgeText}>Paid</Text>
                  </View>
                </View>
              </View>
            ))}

            <View style={styles.txnTotalSumFooterCard}>
              <Text style={styles.txnTotalLabel}>Total spent</Text>
              <Text style={styles.txnTotalVal}>{selectedCustomer.totalSpent}</Text>
            </View>
          </ScrollView>
        </View>
      )}

      {/* ==================== VIEW 6: CUSTOMER NOTES ==================== */}
      {currentView === 'notes' && selectedCustomer && (
        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={() => setCurrentView('list')} style={styles.floatingBackBtn}>
            <Icon name="arrow-left" size={16} color={colors.ink} />
          </TouchableOpacity>

          <ScrollView contentContainerStyle={{ padding: 18 }} showsVerticalScrollIndicator={false}>
            {/* Add note card */}
            <Text style={styles.formSectionHeading}>Add Note</Text>
            
            <View style={styles.noteInputCardOuter}>
              <TextInput
                style={styles.noteTextInputArea}
                placeholder="Write a note..."
                placeholderTextColor={colors.muted}
                value={newNoteText}
                onChangeText={setNewNoteText}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
              <TouchableOpacity style={styles.addNoteBtn} onPress={handleAddNote}>
                <Text style={styles.addNoteBtnText}>Add Note</Text>
              </TouchableOpacity>
            </View>

            {/* List notes */}
            <Text style={styles.formSectionHeading}>Special Requests Log</Text>
            {mockNotes.map((note, idx) => (
              <View key={idx} style={styles.detailsNoteCard}>
                <Text style={styles.noteCardDate}>{note.date}</Text>
                <Text style={styles.noteCardText}>{note.text}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* ==================== VIEW 7: DELETE CUSTOMER OVERLAY ==================== */}
      {currentView === 'delete' && selectedCustomer && (
        <View style={styles.deleteOverlayBackdrop}>
          <TouchableOpacity onPress={() => setCurrentView('list')} style={styles.floatingBackBtn}>
            <Icon name="arrow-left" size={16} color={colors.ink} />
          </TouchableOpacity>
          <View style={styles.deleteCardBox}>
            <View style={styles.deleteIconCircle}>
              <Icon name="trash" size={24} color="#EF4444" />
            </View>

            <Text style={styles.deleteConfirmTitle}>Delete Customer</Text>
            <Text style={styles.deleteConfirmSub}>Are you sure you want to delete this customer? This action cannot be undone.</Text>

            <TouchableOpacity style={styles.deleteConfirmBtn} onPress={handleDeleteCustomer}>
              <Text style={styles.deleteConfirmBtnLabel}>Delete</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteCancelBtn} onPress={() => setCurrentView('details')}>
              <Text style={styles.deleteCancelBtnLabel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const createStyles = (
  colors: ReturnType<typeof usePremiumTheme>['colors'],
  mode: string,
  brown: { primary: string; activeBg: string }
) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.canvas,
      position: 'relative',
    },
    floatingBackBtn: {
      position: 'absolute',
      top: 12,
      left: 16,
      zIndex: 20,
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.line,
      ...premiumShadow,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 14,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.line,
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
      color: colors.ink,
    },
    searchWrapper: {
      padding: 12,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.line,
    },
    searchBox: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.line,
      backgroundColor: colors.canvas,
      borderRadius: 20,
      paddingHorizontal: 12,
      height: 40,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 14,
      paddingVertical: 0,
      color: colors.ink,
    },
    filterBtn: {
      paddingLeft: 8,
    },
    listContent: {
      padding: 16,
      paddingBottom: 80,
    },
    emptyState: {
      paddingVertical: 80,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyText: {
      fontSize: 14,
      color: colors.muted,
      marginTop: 10,
    },
    customerCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.line,
      borderRadius: 18,
      padding: 12,
      marginBottom: 12,
      ...premiumShadow,
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: '#ECECF3',
    },
    infoWrapper: {
      flex: 1,
      marginLeft: 14,
      justifyContent: 'center',
    },
    nameText: {
      fontSize: 15,
      fontWeight: 'bold',
      color: colors.ink,
    },
    phoneText: {
      fontSize: 12,
      color: colors.muted,
      marginTop: 2,
    },
    bookingCountText: {
      fontSize: 12,
      color: colors.muted,
      marginTop: 3,
    },
    chevron: {
      marginLeft: 8,
    },
    profileHeaderBox: {
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 22,
      paddingVertical: 20,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: colors.line,
      marginBottom: 16,
      ...premiumShadow,
    },
    detailsAvatarFrame: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: '#E5E7EB',
    },
    detailsNameText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.ink,
      marginTop: 10,
    },
    detailsPhoneText: {
      fontSize: 12.5,
      color: colors.muted,
      marginTop: 2,
    },
    detailsMetricsStrip: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: 20,
    },
    detailsMetricBox: {
      flex: 1,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.line,
      borderRadius: 16,
      paddingVertical: 12,
      alignItems: 'center',
      ...premiumShadow,
    },
    detailsMetricCountVal: {
      fontSize: 15,
      fontWeight: 'bold',
      color: '#683E26',
    },
    detailsMetricLabel: {
      fontSize: 10,
      color: colors.muted,
      marginTop: 4,
      textAlign: 'center',
    },
    formSectionHeading: {
      fontSize: 12,
      fontWeight: 'bold',
      color: colors.muted,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginTop: 12,
      marginBottom: 10,
    },
    personalSpecCard: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.line,
      marginBottom: 16,
      ...premiumShadow,
    },
    specLineRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 8,
    },
    specDivider: {
      height: 1,
      backgroundColor: colors.line,
      marginVertical: 4,
    },
    specLabel: {
      fontSize: 13,
      color: colors.muted,
      fontWeight: '500',
    },
    specValue: {
      fontSize: 13.5,
      fontWeight: '600',
      color: colors.ink,
    },
    specNotesText: {
      fontSize: 13.5,
      color: colors.ink,
      lineHeight: 18,
    },
    ctaRowBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      paddingVertical: 13,
      paddingHorizontal: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.line,
    },
    ctaRowBtnText: {
      fontSize: 14.5,
      fontWeight: '600',
      color: colors.ink,
    },
    formLabel: {
      fontSize: 13,
      fontWeight: 'bold',
      color: colors.muted,
      marginBottom: 6,
      marginTop: 10,
    },
    formInput: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.line,
      borderRadius: 12,
      padding: 12,
      fontSize: 14,
      color: colors.ink,
      marginBottom: 14,
    },
    genderDropdownSim: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.line,
      borderRadius: 12,
      padding: 12,
      marginBottom: 14,
    },
    formSubmitBtn: {
      backgroundColor: '#683E26',
      borderRadius: 20,
      paddingVertical: 14,
      alignItems: 'center',
      marginTop: 10,
      ...premiumShadow,
    },
    formSubmitBtnText: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: 'bold',
    },
    bookingTabsRow: {
      flexDirection: 'row',
      padding: 12,
      gap: 10,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.line,
    },
    bookingTabBtn: {
      backgroundColor: colors.canvas,
      borderRadius: 14,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderWidth: 1,
      borderColor: colors.line,
    },
    bookingTabBtnActive: {
      backgroundColor: '#683E26' + '15',
      borderColor: '#683E26',
    },
    bookingTabBtnLabel: {
      fontSize: 12,
      color: colors.muted,
    },
    bookingTabBtnLabelActive: {
      color: '#683E26',
      fontWeight: 'bold',
    },
    historyBookingCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 14,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.line,
      ...premiumShadow,
    },
    historyBookingDate: {
      fontSize: 11.5,
      color: colors.muted,
    },
    historyBookingService: {
      fontSize: 14.5,
      fontWeight: 'bold',
      color: colors.ink,
      marginTop: 2,
    },
    historyBookingPrice: {
      fontSize: 13.5,
      fontWeight: 'bold',
      color: colors.ink,
      marginTop: 4,
    },
    statusPillSmall: {
      borderRadius: 6,
      paddingHorizontal: 6,
      paddingVertical: 2,
    },
    statusPillSmallNew: {
      backgroundColor: '#FEE2E2',
    },
    statusPillSmallRead: {
      backgroundColor: '#EAFBF6',
    },
    statusPillSmallLabel: {
      fontSize: 10,
      fontWeight: 'bold',
    },
    statusPillSmallLabelNew: {
      color: '#EF4444',
    },
    statusPillSmallLabelRead: {
      color: '#10B981',
    },
    detailsTxnCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.surface,
      borderRadius: 14,
      padding: 12,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.line,
    },
    detailsTxnDate: {
      fontSize: 11,
      color: colors.muted,
    },
    detailsTxnService: {
      fontSize: 14,
      fontWeight: 'bold',
      color: colors.ink,
      marginTop: 2,
    },
    detailsTxnStatus: {
      fontSize: 11.5,
      color: colors.muted,
      marginTop: 2,
    },
    detailsTxnPrice: {
      fontSize: 14.5,
      fontWeight: 'bold',
      color: '#10B981',
    },
    paidBadgeDot: {
      backgroundColor: '#EAFBF6',
      borderRadius: 6,
      paddingHorizontal: 6,
      paddingVertical: 2,
      marginTop: 4,
    },
    paidBadgeText: {
      fontSize: 9,
      fontWeight: 'bold',
      color: '#10B981',
    },
    txnTotalSumFooterCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.line,
      paddingVertical: 14,
      marginTop: 10,
    },
    txnTotalLabel: {
      fontSize: 13.5,
      color: colors.muted,
      fontWeight: '500',
    },
    txnTotalVal: {
      fontSize: 19,
      fontWeight: 'bold',
      color: colors.ink,
    },
    noteInputCardOuter: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.line,
      borderRadius: 16,
      padding: 12,
      marginBottom: 16,
      ...premiumShadow,
    },
    noteTextInputArea: {
      fontSize: 13.5,
      color: colors.ink,
      height: 60,
      backgroundColor: colors.canvas,
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    addNoteBtn: {
      backgroundColor: '#683E26',
      borderRadius: 12,
      paddingVertical: 8,
      alignItems: 'center',
      marginTop: 10,
    },
    addNoteBtnText: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: 'bold',
    },
    detailsNoteCard: {
      backgroundColor: colors.surface,
      borderRadius: 14,
      padding: 12,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.line,
    },
    noteCardDate: {
      fontSize: 11,
      color: colors.muted,
      fontWeight: 'bold',
    },
    noteCardText: {
      fontSize: 13,
      color: colors.ink,
      marginTop: 4,
      lineHeight: 18,
    },
    deleteOverlayBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    deleteCardBox: {
      backgroundColor: colors.surface,
      borderRadius: 24,
      padding: 24,
      width: '80%',
      alignItems: 'center',
      ...premiumShadow,
    },
    deleteIconCircle: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: '#FEE2E2',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 14,
    },
    deleteConfirmTitle: {
      fontSize: 17,
      fontWeight: 'bold',
      color: colors.ink,
    },
    deleteConfirmSub: {
      fontSize: 12.5,
      color: colors.muted,
      textAlign: 'center',
      marginTop: 6,
      lineHeight: 18,
      marginBottom: 20,
    },
    deleteConfirmBtn: {
      backgroundColor: '#EF4444',
      borderRadius: 18,
      width: '100%',
      paddingVertical: 12,
      alignItems: 'center',
      marginBottom: 10,
      ...premiumShadow,
    },
    deleteConfirmBtnLabel: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: 'bold',
    },
    deleteCancelBtn: {
      borderRadius: 18,
      width: '100%',
      paddingVertical: 12,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.line,
    },
    deleteCancelBtnLabel: {
      color: colors.ink,
      fontSize: 14,
      fontWeight: 'bold',
    },
  });

export default AdminCustomers;
