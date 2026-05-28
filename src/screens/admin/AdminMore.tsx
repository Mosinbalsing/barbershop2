import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Alert,
  TextInput,
  Image,
  Switch,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { usePremiumTheme, premiumShadow } from '../../shared/theme/premiumTheme';

type MenuItem = {
  id: string;
  label: string;
  icon: string;
  badge?: string;
  isLogout?: boolean;
};

type ChatMessage = {
  sender: 'user' | 'ai';
  text: string;
};

const MENU_ITEMS: MenuItem[] = [
  { id: '1', label: 'AI Assistant', icon: 'android', badge: 'New' },
  { id: '2', label: 'Dashboard', icon: 'dashboard' },
  { id: '3', label: 'Services Management', icon: 'scissors' },
  { id: '4', label: 'Customers', icon: 'users' },
  { id: '5', label: 'Barbers', icon: 'user' },
  { id: '6', label: 'Bookings', icon: 'calendar' },
  { id: '7', label: 'Forms / Submissions', icon: 'envelope-o' },
  { id: '8', label: 'Coupons & Offers', icon: 'tags' },
  { id: '9', label: 'Payments & Transactions', icon: 'credit-card' },
  { id: '10', label: 'Reports & Analytics', icon: 'bar-chart' },
  { id: '11', label: 'Notifications', icon: 'bell-o' },
  { id: '12', label: 'Settings', icon: 'cog' },
  { id: '13', label: 'Profile', icon: 'id-card-o' },
  { id: '14', label: 'Logout', icon: 'sign-out', isLogout: true },
];

const AdminMore = () => {
  const { colors, mode, setMode } = usePremiumTheme();
  const navigation = useNavigation<any>();

  const brownTheme = {
    primary: '#683E26',
    activeBg: mode === 'dark' ? '#3A281E' : '#F5F1ED',
    canvas: colors.canvas,
    surface: colors.surface,
  };

  const styles = useMemo(() => createStyles(colors, mode, brownTheme), [colors, mode]);

  // Screen Subview Controller state: 'menu' | 'ai_assistant' | 'services' | 'barbers' | 'forms' | 'coupons' | 'payments' | 'reports' | 'notifications' | 'settings' | 'profile' | 'logout'
  const [subView, setSubView] = useState<'menu' | 'ai_assistant' | 'services' | 'barbers' | 'forms' | 'coupons' | 'payments' | 'reports' | 'notifications' | 'settings' | 'profile' | 'logout'>('menu');

  // AI Assistant Chat log states
  const [chatLog, setChatLog] = useState<ChatMessage[]>([
    { sender: 'ai', text: 'Hello Admin! Ask me anything about your barbershop business.' }
  ]);
  const [typedMessage, setTypedMessage] = useState('');

  // Services management sub-views
  const [servicesSubTab, setServicesSubTab] = useState<'index' | 'all' | 'categories' | 'add' | 'requests'>('index');
  const [mockServices, setMockServices] = useState([
    { name: 'Haircut', price: '199', category: 'Hair Care' },
    { name: 'Beard Trim', price: '100', category: 'Beard Styling' },
    { name: 'Hair Spa', price: '499', category: 'Hair Care' },
    { name: 'Hair Wash', price: '99', category: 'Hair Care' },
  ]);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState('Hair Care');

  // Barbers search states
  const [barberQuery, setBarberQuery] = useState('');
  const [mockBarbers, setMockBarbers] = useState([
    { name: 'Rahul Verma', phone: '9876543210', bookings: 45, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80' },
    { name: 'Amit Kumar', phone: '9123456780', bookings: 30, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80' },
    { name: 'Vikram Singh', phone: '9888776655', bookings: 28, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80' },
    { name: 'Rohit Sharma', phone: '8877665544', bookings: 24, avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80' }
  ]);

  // Forms / submissions tab segments
  const [activeFormTab, setActiveFormTab] = useState<'All' | 'New' | 'Read'>('All');
  const [mockInquiries, setMockInquiries] = useState([
    { id: '1', title: 'Contact Us Form', sender: 'Rahul Verma', desc: 'Rahul wants a callback regarding wedding plans.', date: '20 May 2025, 04:30 PM', status: 'New' },
    { id: '2', title: 'Partnership Inquiry', sender: 'Amit Kumar', desc: 'Amit wants to collaborate for styling catalog.', date: '20 May 2025, 02:15 PM', status: 'New' },
    { id: '3', title: 'General Query', sender: 'Vikram Singh', desc: 'Query about advance booking intervals.', date: '18 May 2025, 11:20 AM', status: 'Read' }
  ]);
  const [selectedInquiry, setSelectedInquiry] = useState<typeof mockInquiries[0] | null>(null);

  // Coupons states
  const [couponsSubView, setCouponsSubView] = useState<'index' | 'all' | 'add'>('index');
  const [mockCoupons, setMockCoupons] = useState([
    { code: 'SUMMER20', desc: '20% off on all haircuts', active: true },
    { code: 'NEWUSER15', desc: 'Flat 15% off on Hair Spa', active: true },
    { code: 'FLAT100', desc: '₹100 off on billing above ₹500', active: false },
  ]);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDesc, setNewCouponDesc] = useState('');

  // Operational settings switches
  const [settingsPush, setSettingsPush] = useState(true);
  const [settingsSMS, setSettingsSMS] = useState(false);
  const [settingsHolidayMode, setSettingsHolidayMode] = useState(false);
  const [settingsAutoBooking, setSettingsAutoBooking] = useState(true);

  // Admin profile state details
  const [profileName, setProfileName] = useState('Admin Barobar');
  const [profileEmail, setProfileEmail] = useState('admin@barobar.com');
  const [profilePhone, setProfilePhone] = useState('9876543210');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // AI Assistant triggers suggestion replies
  const handleAISuggestionClick = (question: string, type: 'bookings' | 'barbers' | 'report' | 'services') => {
    // Append User question
    const userMsg: ChatMessage = { sender: 'user', text: question };
    let aiReply = '';

    if (type === 'bookings') {
      aiReply = 'You have 23 bookings today. Completed: 15, Pending: 5, Cancelled: 3.';
    } else if (type === 'barbers') {
      aiReply = 'Top 5 barbers by revenue this month:\n1. Rahul Verma - ₹72,450\n2. Amit Kumar - ₹54,320\n3. Vikram Singh - ₹43,210\n4. Rohit Sharma - ₹24,000\n5. Manish Patel - ₹18,900';
    } else if (type === 'report') {
      aiReply = 'This Month Revenue Report:\n• Total Revenue: ₹4,87,500\n• Total Bookings: 1,286\n• Average Order Value: ₹379\n• Growth: +18% vs last month';
    } else {
      aiReply = 'Most booked services:\n1. Haircut & Beard Trim (45%)\n2. Hair Spa (28%)\n3. Hair Wash (15%)\n4. Shave & Facial (12%)';
    }

    setChatLog(prev => [...prev, userMsg]);
    setTimeout(() => {
      setChatLog(prev => [...prev, { sender: 'ai', text: aiReply }]);
    }, 450);
  };

  const handleSendTypedMessage = () => {
    if (!typedMessage.trim()) return;
    const msg = typedMessage.trim();
    setChatLog(prev => [...prev, { sender: 'user', text: msg }]);
    setTypedMessage('');

    setTimeout(() => {
      setChatLog(prev => [...prev, { sender: 'ai', text: `Got it! I am compiling analytics details about "${msg}" for your dashboard report.` }]);
    }, 500);
  };

  const handleListItemPress = (item: MenuItem) => {
    if (item.isLogout) {
      setSubView('logout');
      return;
    }

    switch (item.label) {
      case 'AI Assistant':
        setSubView('ai_assistant');
        break;
      case 'Dashboard':
        navigation.navigate('Dashboard');
        break;
      case 'Services Management':
        setServicesSubTab('index');
        setSubView('services');
        break;
      case 'Customers':
        navigation.navigate('Customers');
        break;
      case 'Barbers':
        setSubView('barbers');
        break;
      case 'Bookings':
        navigation.navigate('Bookings');
        break;
      case 'Forms / Submissions':
        setSubView('forms');
        break;
      case 'Coupons & Offers':
        setCouponsSubView('index');
        setSubView('coupons');
        break;
      case 'Payments & Transactions':
        setSubView('payments');
        break;
      case 'Reports & Analytics':
        setSubView('reports');
        break;
      case 'Notifications':
        setSubView('notifications');
        break;
      case 'Settings':
        setSubView('settings');
        break;
      case 'Profile':
        setSubView('profile');
        break;
      default:
        Alert.alert(item.label, `Manage ${item.label} details.`);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ==================== SCREEN: MENU HOME ==================== */}
      {subView === 'menu' && (
        <View style={{ flex: 1 }}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.headerBtn}>
              <Icon name="bars" size={16} color={colors.ink} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>More</Text>
            <View style={{ width: 36 }} />
          </View>

          <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
            {/* Super Admin Profile Card */}
            <View style={styles.profileCard}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=120&q=80' }}
                style={styles.profileAvatar}
              />
              <View style={styles.profileInfoWrapper}>
                <Text style={styles.profileNameText}>Admin Barobar</Text>
                <Text style={styles.profileRoleText}>Super Admin</Text>
              </View>
            </View>

            {/* Menu List Grid */}
            <View style={styles.menuContainer}>
              {MENU_ITEMS.map((item, index) => {
                const isLast = index === MENU_ITEMS.length - 1;
                
                if (item.isLogout) {
                  return (
                    <React.Fragment key={item.id}>
                      {/* Custom Appearance Row */}
                      <View style={styles.appearanceRow}>
                        <View style={styles.appearanceLeft}>
                          <View style={[styles.iconBox, { backgroundColor: brownTheme.activeBg }]}>
                            <Icon name="paint-brush" size={15} color={brownTheme.primary} />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.appearanceLabel}>Appearance</Text>
                            <Text style={styles.appearanceSubLabel}>Choose theme style</Text>
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
                                  active && { backgroundColor: brownTheme.primary }
                                ]}
                                onPress={() => setMode(opt.value)}
                              >
                                <Icon name={opt.icon} size={12} color={active ? '#FFFFFF' : colors.muted} />
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
                        style={styles.menuItem}
                        activeOpacity={0.85}
                        onPress={() => handleListItemPress(item)}
                      >
                        <View style={[styles.iconBox, { backgroundColor: '#EF444415' }]}>
                          <Icon name={item.icon} size={15} color="#EF4444" />
                        </View>
                        <Text style={[styles.menuLabel, { color: '#EF4444' }]}>{item.label}</Text>
                      </TouchableOpacity>
                    </React.Fragment>
                  );
                }

                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.menuItem, !isLast && { borderBottomWidth: 1, borderBottomColor: colors.line }]}
                    activeOpacity={0.85}
                    onPress={() => handleListItemPress(item)}
                  >
                    <View style={[styles.iconBox, { backgroundColor: brownTheme.activeBg }]}>
                      <Icon
                        name={item.icon}
                        size={15}
                        color={brownTheme.primary}
                      />
                    </View>

                    <Text style={[styles.menuLabel, { color: colors.ink }]}>
                      {item.label}
                    </Text>

                    {item.badge && (
                      <View style={styles.newBadge}>
                        <Text style={styles.newBadgeText}>{item.badge}</Text>
                      </View>
                    )}

                    {!item.isLogout && (
                      <Icon name="chevron-right" size={11} color={colors.muted} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
      )}

      {/* ==================== SCREEN: AI ASSISTANT CHATBOT ==================== */}
      {subView === 'ai_assistant' && (
        <View style={{ flex: 1 }}>
          {/* Header Only Show Back Button */}
          <View style={styles.backButtonOnlyHeader}>
            <TouchableOpacity onPress={() => setSubView('menu')} style={styles.backArrowBtn}>
              <Icon name="arrow-left" size={18} color={colors.ink} />
            </TouchableOpacity>
          </View>

          {/* Chat scrolling viewport */}
          <ScrollView
            style={{ flex: 1, padding: 16 }}
            contentContainerStyle={{ paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Robot Welcomer Portrait */}
            <View style={styles.botGreetingsCard}>
              <View style={styles.botIconCircle}>
                <Icon name="android" size={32} color="#FFFFFF" />
              </View>
              <Text style={styles.botGreetingsTitle}>Hello Admin! 👋</Text>
              <Text style={styles.botGreetingsSub}>Ask me anything about your barbershop business.</Text>
            </View>

            {/* Try Asking suggestion cards */}
            <Text style={styles.tryAskingHeading}>Try Asking</Text>
            
            <TouchableOpacity
              style={styles.suggestionBtnChip}
              onPress={() => handleAISuggestionClick('How many bookings today?', 'bookings')}
            >
              <Text style={styles.suggestionChipText}>How many bookings today?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.suggestionBtnChip}
              onPress={() => handleAISuggestionClick('Top 5 barbers by revenue?', 'barbers')}
            >
              <Text style={styles.suggestionChipText}>Top 5 barbers by revenue?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.suggestionBtnChip}
              onPress={() => handleAISuggestionClick('Monthly revenue report?', 'report')}
            >
              <Text style={styles.suggestionChipText}>Monthly revenue report?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.suggestionBtnChip}
              onPress={() => handleAISuggestionClick('Most booked services?', 'services')}
            >
              <Text style={styles.suggestionChipText}>Most booked services?</Text>
            </TouchableOpacity>

            <View style={styles.chatDividerLine} />

            {/* Chat Messages */}
            {chatLog.map((chat, idx) => {
              const isAI = chat.sender === 'ai';
              return (
                <View
                  key={idx}
                  style={[
                    styles.chatBubbleContainer,
                    isAI ? { alignSelf: 'flex-start' } : { alignSelf: 'flex-end' }
                  ]}
                >
                  <View
                    style={[
                      styles.chatBubble,
                      isAI
                        ? { backgroundColor: colors.surface, borderLeftWidth: 3, borderLeftColor: brownTheme.primary }
                        : { backgroundColor: brownTheme.primary }
                    ]}
                  >
                    <Text style={[styles.chatBubbleText, isAI ? { color: colors.ink } : { color: '#FFFFFF' }]}>
                      {chat.text}
                    </Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* Bottom Chat input box */}
          <View style={styles.chatInputContainer}>
            <TextInput
              style={styles.chatTextInput}
              placeholder="Type your question..."
              placeholderTextColor={colors.muted}
              value={typedMessage}
              onChangeText={setTypedMessage}
            />
            <TouchableOpacity style={styles.chatSendBtn} onPress={handleSendTypedMessage}>
              <Icon name="paper-plane" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ==================== SCREEN: SERVICES MANAGEMENT ==================== */}
      {subView === 'services' && (
        <View style={{ flex: 1 }}>
          {/* Header Only Show Back Button */}
          <View style={styles.backButtonOnlyHeader}>
            <TouchableOpacity onPress={() => {
              if (servicesSubTab === 'index') setSubView('menu');
              else setServicesSubTab('index');
            }} style={styles.backArrowBtn}>
              <Icon name="arrow-left" size={18} color={colors.ink} />
            </TouchableOpacity>
          </View>

          {servicesSubTab === 'index' && (
            <ScrollView contentContainerStyle={{ padding: 18 }}>
              {[
                { label: 'All Services', desc: 'Manage all services', tab: 'all' as const, icon: 'scissors' },
                { label: 'Categories', desc: 'Manage service categories', tab: 'categories' as const, icon: 'folder-open-o' },
                { label: 'Add New Service', desc: 'Add a new service', tab: 'add' as const, icon: 'plus-circle' },
                { label: 'Service Requests', desc: 'Approve / Reject services', tab: 'requests' as const, icon: 'check-square-o' }
              ].map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.serviceMgmtCardOption}
                  onPress={() => setServicesSubTab(item.tab)}
                >
                  <View style={styles.serviceMgmtLeftCol}>
                    <View style={styles.serviceMgmtIconBox}>
                      <Icon name={item.icon} size={18} color={brownTheme.primary} />
                    </View>
                    <View>
                      <Text style={styles.serviceMgmtLabelText}>{item.label}</Text>
                      <Text style={styles.serviceMgmtDescText}>{item.desc}</Text>
                    </View>
                  </View>
                  <Icon name="chevron-right" size={12} color={colors.muted} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* List of Services */}
          {servicesSubTab === 'all' && (
            <ScrollView contentContainerStyle={{ padding: 18 }}>
              <Text style={styles.innerPanelHeading}>Grooming Services</Text>
              {mockServices.map((s, idx) => (
                <View key={idx} style={styles.serviceItemRowCard}>
                  <View>
                    <Text style={styles.serviceItemNameVal}>{s.name}</Text>
                    <Text style={styles.serviceItemCatVal}>{s.category}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                    <Text style={styles.serviceItemPriceVal}>₹{s.price}</Text>
                    <TouchableOpacity onPress={() => {
                      const updated = [...mockServices];
                      updated.splice(idx, 1);
                      setMockServices(updated);
                    }}>
                      <Icon name="trash-o" size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}

          {/* Categories list */}
          {servicesSubTab === 'categories' && (
            <ScrollView contentContainerStyle={{ padding: 18 }}>
              {['Hair Care', 'Beard Styling', 'Face Treatment', 'Massage Spa'].map((cat, idx) => (
                <View key={idx} style={styles.categoryItemRowCard}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name="folder" size={16} color={brownTheme.primary} style={{ marginRight: 12 }} />
                    <Text style={styles.categoryItemNameVal}>{cat}</Text>
                  </View>
                  <Icon name="chevron-right" size={12} color={colors.muted} />
                </View>
              ))}
            </ScrollView>
          )}

          {/* Add Service form */}
          {servicesSubTab === 'add' && (
            <ScrollView contentContainerStyle={{ padding: 18 }}>
              <Text style={styles.formLabel}>Service Name</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. Charcoal Facial"
                placeholderTextColor={colors.muted}
                value={newServiceName}
                onChangeText={setNewServiceName}
              />

              <Text style={styles.formLabel}>Price (₹)</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. 299"
                placeholderTextColor={colors.muted}
                keyboardType="numeric"
                value={newServicePrice}
                onChangeText={setNewServicePrice}
              />

              <Text style={styles.formLabel}>Category</Text>
              <View style={styles.categoryDropdownSimulation}>
                <Text style={styles.categoryDropdownSelected}>{newServiceCategory}</Text>
                <TouchableOpacity onPress={() => {
                  Alert.alert('Select Category', 'Choose a category', [
                    { text: 'Hair Care', onPress: () => setNewServiceCategory('Hair Care') },
                    { text: 'Beard Styling', onPress: () => setNewServiceCategory('Beard Styling') },
                    { text: 'Face Treatment', onPress: () => setNewServiceCategory('Face Treatment') }
                  ]);
                }}>
                  <Icon name="chevron-down" size={12} color={colors.ink} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.formSubmitBtn}
                onPress={() => {
                  if (!newServiceName || !newServicePrice) {
                    Alert.alert('Missing details', 'Fill all fields.');
                    return;
                  }
                  setMockServices([...mockServices, { name: newServiceName, price: newServicePrice, category: newServiceCategory }]);
                  setNewServiceName('');
                  setNewServicePrice('');
                  Alert.alert('Success', 'Service created successfully.');
                  setServicesSubTab('all');
                }}
              >
                <Text style={styles.formSubmitBtnText}>Create Service</Text>
              </TouchableOpacity>
            </ScrollView>
          )}

          {/* Requests list */}
          {servicesSubTab === 'requests' && (
            <ScrollView contentContainerStyle={{ padding: 18 }}>
              <View style={styles.emptyStateBox}>
                <Icon name="check-square" size={32} color={colors.muted} />
                <Text style={styles.emptyStateText}>No custom service requests pending.</Text>
              </View>
            </ScrollView>
          )}
        </View>
      )}

      {/* ==================== SCREEN: BARBERS ==================== */}
      {subView === 'barbers' && (
        <View style={{ flex: 1 }}>
          {/* Header Only Show Back Button */}
          <View style={styles.backButtonOnlyHeader}>
            <TouchableOpacity onPress={() => setSubView('menu')} style={styles.backArrowBtn}>
              <Icon name="arrow-left" size={18} color={colors.ink} />
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View style={styles.searchBarWrapper}>
            <View style={styles.searchBarBox}>
              <Icon name="search" size={13} color={colors.muted} style={{ marginRight: 8 }} />
              <TextInput
                style={{ flex: 1, fontSize: 13, color: colors.ink }}
                placeholder="Search barbers..."
                placeholderTextColor={colors.muted}
                value={barberQuery}
                onChangeText={setBarberQuery}
              />
            </View>
          </View>

          <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 10 }}>
            {mockBarbers
              .filter(b => b.name.toLowerCase().includes(barberQuery.toLowerCase()))
              .map((b, idx) => (
                <View key={idx} style={styles.barberProfileRowCard}>
                  <Image source={{ uri: b.avatar }} style={styles.barberAvatarFrame} />
                  <View style={styles.barberInfoCol}>
                    <Text style={styles.barberNameText}>{b.name}</Text>
                    <Text style={styles.barberPhoneText}>{b.phone}</Text>
                    <Text style={styles.barberBookingsCountLabel}>
                      Total Bookings: <Text style={{ fontWeight: 'bold', color: colors.ink }}>{b.bookings}</Text>
                    </Text>
                  </View>
                  <Icon name="chevron-right" size={12} color={colors.muted} />
                </View>
              ))}
          </ScrollView>
        </View>
      )}

      {/* ==================== SCREEN: FORMS / SUBMISSIONS ==================== */}
      {subView === 'forms' && (
        <View style={{ flex: 1 }}>
          {/* Header Only Show Back Button */}
          <View style={styles.backButtonOnlyHeader}>
            <TouchableOpacity onPress={() => {
              if (selectedInquiry) setSelectedInquiry(null);
              else setSubView('menu');
            }} style={styles.backArrowBtn}>
              <Icon name="arrow-left" size={18} color={colors.ink} />
            </TouchableOpacity>
          </View>

          {!selectedInquiry ? (
            <View style={{ flex: 1 }}>
              {/* Tabs */}
              <View style={styles.formsTabSelectorRow}>
                {['All', 'New', 'Read'].map(tab => {
                  const isActive = activeFormTab === tab;
                  return (
                    <TouchableOpacity
                      key={tab}
                      style={[styles.formsTabBtnChip, isActive && styles.formsTabBtnChipActive]}
                      onPress={() => setActiveFormTab(tab as any)}
                    >
                      <Text style={[styles.formsTabBtnLabel, isActive && styles.formsTabBtnLabelActive]}>
                        {tab} ({tab === 'All' ? mockInquiries.length : tab === 'New' ? mockInquiries.filter(i => i.status === 'New').length : mockInquiries.filter(i => i.status === 'Read').length})
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <ScrollView contentContainerStyle={{ padding: 18 }}>
                {mockInquiries
                  .filter(i => activeFormTab === 'All' || i.status === activeFormTab)
                  .map((inq) => (
                    <TouchableOpacity
                      key={inq.id}
                      style={styles.submissionCardRow}
                      onPress={() => setSelectedInquiry(inq)}
                    >
                      <View style={styles.submissionLeftBlock}>
                        <Text style={styles.submissionTitleText}>{inq.title}</Text>
                        <Text style={styles.submissionSenderText}>{inq.sender}</Text>
                        <Text style={styles.submissionDateText}>{inq.date}</Text>
                      </View>

                      <View style={[
                        styles.statusPillSmall,
                        inq.status === 'New' ? styles.statusPillSmallNew : styles.statusPillSmallRead
                      ]}>
                        <Text style={[
                          styles.statusPillSmallLabel,
                          inq.status === 'New' ? styles.statusPillSmallLabelNew : styles.statusPillSmallLabelRead
                        ]}>
                          {inq.status}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            </View>
          ) : (
            <ScrollView contentContainerStyle={{ padding: 18 }}>
              <View style={styles.detailsInquiryCard}>
                <Text style={styles.inquiryDetailTitle}>{selectedInquiry.title}</Text>
                <Text style={styles.inquiryDetailSender}>From: {selectedInquiry.sender}</Text>
                <Text style={styles.inquiryDetailDate}>Date: {selectedInquiry.date}</Text>
                
                <View style={styles.inquiryBodyCard}>
                  <Text style={styles.inquiryBodyText}>{selectedInquiry.desc}</Text>
                </View>

                {/* Reply form */}
                <Text style={styles.formLabel}>Reply Message</Text>
                <TextInput
                  style={styles.replyTextInputArea}
                  placeholder="Type email reply to customer..."
                  placeholderTextColor={colors.muted}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />

                <TouchableOpacity
                  style={styles.replySubmitBtn}
                  onPress={() => {
                    const updated = mockInquiries.map(i => i.id === selectedInquiry.id ? { ...i, status: 'Read' } : i);
                    setMockInquiries(updated);
                    Alert.alert('Email Sent', 'Your email response has been delivered ✅');
                    setSelectedInquiry(null);
                  }}
                >
                  <Text style={styles.replySubmitBtnText}>Send Email Reply</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </View>
      )}

      {/* ==================== SCREEN: COUPONS & OFFERS ==================== */}
      {subView === 'coupons' && (
        <View style={{ flex: 1 }}>
          {/* Header Only Show Back Button */}
          <View style={styles.backButtonOnlyHeader}>
            <TouchableOpacity onPress={() => {
              if (couponsSubView === 'index') setSubView('menu');
              else setCouponsSubView('index');
            }} style={styles.backArrowBtn}>
              <Icon name="arrow-left" size={18} color={colors.ink} />
            </TouchableOpacity>
          </View>

          {couponsSubView === 'index' && (
            <ScrollView contentContainerStyle={{ padding: 18 }}>
              {[
                { label: 'All Coupons', desc: 'Manage existing coupons', tab: 'all' as const, icon: 'tags' },
                { label: 'Add Coupon', desc: 'Create new promo code', tab: 'add' as const, icon: 'plus-circle' }
              ].map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.serviceMgmtCardOption}
                  onPress={() => setCouponsSubView(item.tab)}
                >
                  <View style={styles.serviceMgmtLeftCol}>
                    <View style={styles.serviceMgmtIconBox}>
                      <Icon name={item.icon} size={18} color={brownTheme.primary} />
                    </View>
                    <View>
                      <Text style={styles.serviceMgmtLabelText}>{item.label}</Text>
                      <Text style={styles.serviceMgmtDescText}>{item.desc}</Text>
                    </View>
                  </View>
                  <Icon name="chevron-right" size={12} color={colors.muted} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {couponsSubView === 'all' && (
            <ScrollView contentContainerStyle={{ padding: 18 }}>
              <Text style={styles.innerPanelHeading}>Active Promos</Text>
              {mockCoupons.map((coupon, idx) => (
                <View key={idx} style={styles.couponRowCard}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={styles.couponCodeText}>{coupon.code}</Text>
                    <Text style={styles.couponDescText}>{coupon.desc}</Text>
                  </View>

                  <Switch
                    value={coupon.active}
                    onValueChange={(val) => {
                      const updated = [...mockCoupons];
                      updated[idx].active = val;
                      setMockCoupons(updated);
                    }}
                    trackColor={{ true: brownTheme.primary, false: colors.line }}
                    thumbColor={Platform.OS === 'android' ? '#FFFFFF' : undefined}
                  />
                </View>
              ))}
            </ScrollView>
          )}

          {couponsSubView === 'add' && (
            <ScrollView contentContainerStyle={{ padding: 18 }}>
              <Text style={styles.formLabel}>Coupon Code</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. MONSOON30"
                placeholderTextColor={colors.muted}
                value={newCouponCode}
                onChangeText={setNewCouponCode}
              />

              <Text style={styles.formLabel}>Discount Details</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. 30% off on all grooming"
                placeholderTextColor={colors.muted}
                value={newCouponDesc}
                onChangeText={setNewCouponDesc}
              />

              <TouchableOpacity
                style={styles.formSubmitBtn}
                onPress={() => {
                  if (!newCouponCode || !newCouponDesc) {
                    Alert.alert('Missing details', 'Fill all fields.');
                    return;
                  }
                  setMockCoupons([...mockCoupons, { code: newCouponCode.toUpperCase(), desc: newCouponDesc, active: true }]);
                  setNewCouponCode('');
                  setNewCouponDesc('');
                  Alert.alert('Coupon Created', 'Added to active list successfully.');
                  setCouponsSubView('all');
                }}
              >
                <Text style={styles.formSubmitBtnText}>Create Coupon</Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      )}

      {/* ==================== SCREEN: PAYMENTS & TRANSACTIONS ==================== */}
      {subView === 'payments' && (
        <View style={{ flex: 1 }}>
          {/* Header Only Show Back Button */}
          <View style={styles.backButtonOnlyHeader}>
            <TouchableOpacity onPress={() => setSubView('menu')} style={styles.backArrowBtn}>
              <Icon name="arrow-left" size={18} color={colors.ink} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ padding: 18 }} showsVerticalScrollIndicator={false}>
            {/* Overview cards */}
            <View style={styles.paymentOverviewContainer}>
              <View style={styles.paymentCardOverviewBox}>
                <Text style={styles.paymentOverviewVal}>₹ 4,87,500</Text>
                <Text style={styles.paymentOverviewLabel}>Total Received</Text>
                <Text style={styles.paymentOverviewGrowthText}>+18% Growth</Text>
              </View>

              <View style={[styles.paymentCardOverviewBox, { backgroundColor: '#EF444408', borderColor: '#EF444420' }]}>
                <Text style={[styles.paymentOverviewVal, { color: '#EF4444' }]}>₹ 24,500</Text>
                <Text style={styles.paymentOverviewLabel}>Total Refunds</Text>
                <Text style={[styles.paymentOverviewGrowthText, { color: '#EF4444' }]}>-4% Refunds</Text>
              </View>
            </View>

            <Text style={styles.innerPanelHeading}>Recent Transactions</Text>
            {[
              { client: 'Rahul Verma', service: 'Haircut', price: '299', method: 'UPI', date: 'Today, 10:00 AM' },
              { client: 'Amit Kumar', service: 'Shave', price: '149', method: 'Cash', date: 'Today, 11:30 AM' },
              { client: 'Vikram Singh', service: 'Hair Spa', price: '499', method: 'Card', date: 'Yesterday' }
            ].map((txn, idx) => (
              <View key={idx} style={styles.txnRowItem}>
                <View>
                  <Text style={styles.txnClientName}>{txn.client}</Text>
                  <Text style={styles.txnDateText}>{txn.date} • {txn.method}</Text>
                </View>
                <Text style={styles.txnPriceText}>+₹{txn.price}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* ==================== SCREEN: REPORTS & ANALYTICS ==================== */}
      {subView === 'reports' && (
        <View style={{ flex: 1 }}>
          {/* Header Only Show Back Button */}
          <View style={styles.backButtonOnlyHeader}>
            <TouchableOpacity onPress={() => setSubView('menu')} style={styles.backArrowBtn}>
              <Icon name="arrow-left" size={18} color={colors.ink} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ padding: 18 }}>
            {[
              { label: 'Sales Report', desc: 'Detailed sales financial report' },
              { label: 'Booking Report', desc: 'Detailed bookings occupancy report' },
              { label: 'Barber Performance', desc: 'Barbers rating & revenues summaries' },
              { label: 'Customer Report', desc: 'Customer analytics retention index' }
            ].map((report, idx) => (
              <TouchableOpacity key={idx} style={styles.reportRowItemBtn} onPress={() => Alert.alert(report.label, 'Downloading PDF Report file... 📂')}>
                <View style={styles.reportRowLeftCol}>
                  <View style={styles.reportIconBoxBg}>
                    <Icon name="file-text-o" size={16} color={brownTheme.primary} />
                  </View>
                  <View>
                    <Text style={styles.reportItemLabelText}>{report.label}</Text>
                    <Text style={styles.reportItemDescText}>{report.desc}</Text>
                  </View>
                </View>
                <Icon name="download" size={14} color={colors.muted} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* ==================== SCREEN: NOTIFICATIONS ==================== */}
      {subView === 'notifications' && (
        <View style={{ flex: 1 }}>
          {/* Header Only Show Back Button */}
          <View style={styles.backButtonOnlyHeader}>
            <TouchableOpacity onPress={() => setSubView('menu')} style={styles.backArrowBtn}>
              <Icon name="arrow-left" size={18} color={colors.ink} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ padding: 18 }} showsVerticalScrollIndicator={false}>
            {[
              { title: 'New Booking', desc: 'Rahul Verma booked a slot for Haircut', date: '20 May 2025, 10:00 AM', unread: true },
              { title: 'New Form Submission', desc: 'Partnership inquiry received from Amit', date: '20 May 2025, 02:15 PM', unread: true },
              { title: 'Payment Received', desc: '₹299 received from Rahul Verma', date: '18 May 2025, 10:00 AM', unread: false }
            ].map((notif, idx) => (
              <View key={idx} style={[styles.notifRowCard, notif.unread && styles.notifRowCardUnread]}>
                <View style={styles.notifHeaderRow}>
                  <Text style={styles.notifTitle}>{notif.title}</Text>
                  {notif.unread && <View style={styles.notifBadgeDot} />}
                </View>
                <Text style={styles.notifDesc}>{notif.desc}</Text>
                <Text style={styles.notifDate}>{notif.date}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* ==================== SCREEN: SETTINGS ==================== */}
      {subView === 'settings' && (
        <View style={{ flex: 1 }}>
          {/* Header Only Show Back Button */}
          <View style={styles.backButtonOnlyHeader}>
            <TouchableOpacity onPress={() => setSubView('menu')} style={styles.backArrowBtn}>
              <Icon name="arrow-left" size={18} color={colors.ink} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ padding: 18 }}>
            {[
              { label: 'Push Notifications', val: settingsPush, setVal: setSettingsPush, desc: 'Receive real-time dashboard updates' },
              { label: 'SMS Notifications', val: settingsSMS, setVal: setSettingsSMS, desc: 'Deliver booking notifications to mobile' },
              { label: 'Holiday Mode', val: settingsHolidayMode, setVal: setSettingsHolidayMode, desc: 'Lock client bookings temporarily' },
              { label: 'Auto Approve Bookings', val: settingsAutoBooking, setVal: setSettingsAutoBooking, desc: 'Immediately confirm slots' }
            ].map((setting, idx) => (
              <View key={idx} style={styles.settingSwitchRowCard}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={styles.settingSwitchTitle}>{setting.label}</Text>
                  <Text style={styles.settingSwitchDesc}>{setting.desc}</Text>
                </View>
                <Switch
                  value={setting.val}
                  onValueChange={setting.setVal}
                  trackColor={{ true: brownTheme.primary, false: colors.line }}
                />
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* ==================== SCREEN: PROFILE ==================== */}
      {subView === 'profile' && (
        <View style={{ flex: 1 }}>
          {/* Header Only Show Back Button */}
          <View style={styles.backButtonOnlyHeader}>
            <TouchableOpacity onPress={() => setSubView('menu')} style={styles.backArrowBtn}>
              <Icon name="arrow-left" size={18} color={colors.ink} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ padding: 18 }}>
            <View style={styles.profileBanner}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=120&q=80' }}
                style={styles.profileDetailAvatar}
              />
              <Text style={styles.profileDetailNameText}>{profileName}</Text>
              <Text style={styles.profileDetailRoleText}>Super Admin</Text>
            </View>

            <View style={styles.profileSpecBox}>
              <Text style={styles.formLabel}>Name</Text>
              <TextInput
                style={[styles.formInput, !isEditingProfile && { backgroundColor: colors.canvas, color: colors.muted }]}
                editable={isEditingProfile}
                value={profileName}
                onChangeText={setProfileName}
              />

              <Text style={styles.formLabel}>Email</Text>
              <TextInput
                style={[styles.formInput, !isEditingProfile && { backgroundColor: colors.canvas, color: colors.muted }]}
                editable={isEditingProfile}
                value={profileEmail}
                onChangeText={setProfileEmail}
              />

              <Text style={styles.formLabel}>Phone Number</Text>
              <TextInput
                style={[styles.formInput, !isEditingProfile && { backgroundColor: colors.canvas, color: colors.muted }]}
                editable={isEditingProfile}
                value={profilePhone}
                onChangeText={setProfilePhone}
              />

              <TouchableOpacity
                style={styles.formSubmitBtn}
                onPress={() => {
                  if (isEditingProfile) {
                    Alert.alert('Changes Saved', 'Admin details updated successfully.');
                    setIsEditingProfile(false);
                  } else {
                    setIsEditingProfile(true);
                  }
                }}
              >
                <Text style={styles.formSubmitBtnText}>
                  {isEditingProfile ? 'Save Changes' : 'Edit Profile'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      )}

      {/* ==================== SCREEN: LOGOUT OVERLAY ==================== */}
      {subView === 'logout' && (
        <View style={styles.logoutBackdropView}>
          <View style={styles.logoutOverlayCard}>
            <View style={styles.logoutIconBoxCircle}>
              <Icon name="sign-out" size={28} color="#EF4444" />
            </View>

            <Text style={styles.logoutPromptTitle}>Logout Workspace</Text>
            <Text style={styles.logoutPromptSub}>Are you sure you want to logout? You will need to login again.</Text>

            <TouchableOpacity style={styles.logoutMainBtn} onPress={() => navigation.navigate('LoginScreen')}>
              <Text style={styles.logoutMainBtnLabel}>Logout</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutCancelBtn} onPress={() => setSubView('menu')}>
              <Text style={styles.logoutCancelBtnLabel}>Cancel</Text>
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
  brown: { primary: string; activeBg: string; canvas: string; surface: string }
) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.canvas,
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
    listContent: {
      padding: 16,
      paddingBottom: 80,
    },
    profileCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 22,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.line,
      ...premiumShadow,
    },
    profileAvatar: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: '#E5E7EB',
      marginRight: 14,
    },
    profileInfoWrapper: {
      justifyContent: 'center',
    },
    profileNameText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.ink,
    },
    profileRoleText: {
      fontSize: 12,
      color: colors.muted,
      marginTop: 2,
    },
    menuContainer: {
      backgroundColor: colors.surface,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: colors.line,
      paddingHorizontal: 6,
      ...premiumShadow,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 13,
      paddingHorizontal: 10,
    },
    iconBox: {
      width: 36,
      height: 36,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 14,
    },
    menuLabel: {
      flex: 1,
      fontSize: 14.5,
      fontWeight: '600',
    },
    newBadge: {
      backgroundColor: '#EF4444',
      paddingHorizontal: 7,
      paddingVertical: 2,
      borderRadius: 8,
      marginRight: 10,
    },
    newBadgeText: {
      color: '#FFFFFF',
      fontSize: 9,
      fontWeight: 'bold',
    },
    backButtonOnlyHeader: {
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 4,
      flexDirection: 'row',
      alignItems: 'center',
    },
    backArrowBtn: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    botGreetingsCard: {
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 22,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.line,
      marginBottom: 20,
      ...premiumShadow,
    },
    botIconCircle: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: '#683E26',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    botGreetingsTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.ink,
    },
    botGreetingsSub: {
      fontSize: 12.5,
      color: colors.muted,
      textAlign: 'center',
      marginTop: 4,
      lineHeight: 18,
    },
    tryAskingHeading: {
      fontSize: 12,
      fontWeight: 'bold',
      color: colors.muted,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 10,
    },
    suggestionBtnChip: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.line,
      borderRadius: 12,
      padding: 12,
      marginBottom: 8,
    },
    suggestionChipText: {
      fontSize: 13,
      color: colors.ink,
      fontWeight: '600',
    },
    chatDividerLine: {
      height: 1,
      backgroundColor: colors.line,
      marginVertical: 16,
    },
    chatBubbleContainer: {
      marginBottom: 12,
      maxWidth: '80%',
    },
    chatBubble: {
      borderRadius: 16,
      paddingHorizontal: 14,
      paddingVertical: 10,
      ...premiumShadow,
    },
    chatBubbleText: {
      fontSize: 13.5,
      lineHeight: 18,
      fontWeight: '500',
    },
    chatInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 10,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.line,
    },
    chatTextInput: {
      flex: 1,
      backgroundColor: colors.canvas,
      borderWidth: 1,
      borderColor: colors.line,
      borderRadius: 18,
      paddingHorizontal: 14,
      paddingVertical: 8,
      fontSize: 13.5,
      color: colors.ink,
      marginRight: 10,
    },
    chatSendBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: '#683E26',
      justifyContent: 'center',
      alignItems: 'center',
    },
    serviceMgmtCardOption: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.surface,
      borderRadius: 18,
      padding: 14,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.line,
      ...premiumShadow,
    },
    serviceMgmtLeftCol: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    serviceMgmtIconBox: {
      width: 38,
      height: 38,
      borderRadius: 10,
      backgroundColor: '#683E26' + '15',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 14,
    },
    serviceMgmtLabelText: {
      fontSize: 14.5,
      fontWeight: 'bold',
      color: colors.ink,
    },
    serviceMgmtDescText: {
      fontSize: 11.5,
      color: colors.muted,
      marginTop: 2,
    },
    innerPanelHeading: {
      fontSize: 13,
      fontWeight: 'bold',
      color: colors.muted,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 12,
    },
    serviceItemRowCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 14,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.line,
    },
    serviceItemNameVal: {
      fontSize: 14.5,
      fontWeight: 'bold',
      color: colors.ink,
    },
    serviceItemCatVal: {
      fontSize: 11.5,
      color: colors.muted,
      marginTop: 2,
    },
    serviceItemPriceVal: {
      fontSize: 14,
      fontWeight: 'bold',
      color: colors.ink,
    },
    categoryItemRowCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.surface,
      borderRadius: 14,
      padding: 14,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.line,
    },
    categoryItemNameVal: {
      fontSize: 14,
      fontWeight: 'bold',
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
    categoryDropdownSimulation: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.line,
      borderRadius: 12,
      padding: 12,
      marginBottom: 20,
    },
    categoryDropdownSelected: {
      fontSize: 14,
      color: colors.ink,
      fontWeight: '500',
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
    emptyStateBox: {
      alignItems: 'center',
      paddingVertical: 60,
      justifyContent: 'center',
    },
    emptyStateText: {
      fontSize: 14,
      color: colors.muted,
      marginTop: 10,
    },
    searchBarWrapper: {
      padding: 12,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.line,
    },
    searchBarBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.canvas,
      borderWidth: 1,
      borderColor: colors.line,
      borderRadius: 18,
      paddingHorizontal: 12,
      height: 36,
    },
    barberProfileRowCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 18,
      padding: 12,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.line,
      ...premiumShadow,
    },
    barberAvatarFrame: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: '#E5E7EB',
      marginRight: 12,
    },
    barberInfoCol: {
      flex: 1,
      justifyContent: 'center',
    },
    barberNameText: {
      fontSize: 14.5,
      fontWeight: 'bold',
      color: colors.ink,
    },
    barberPhoneText: {
      fontSize: 11.5,
      color: colors.muted,
      marginTop: 1,
    },
    barberBookingsCountLabel: {
      fontSize: 11.5,
      color: colors.muted,
      marginTop: 2,
    },
    formsTabSelectorRow: {
      flexDirection: 'row',
      padding: 12,
      gap: 10,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.line,
    },
    formsTabBtnChip: {
      backgroundColor: colors.canvas,
      borderRadius: 14,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderWidth: 1,
      borderColor: colors.line,
    },
    formsTabBtnChipActive: {
      backgroundColor: '#683E26' + '15',
      borderColor: '#683E26',
    },
    formsTabBtnLabel: {
      fontSize: 12,
      color: colors.muted,
    },
    formsTabBtnLabelActive: {
      color: '#683E26',
      fontWeight: 'bold',
    },
    submissionCardRow: {
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
    submissionLeftBlock: {
      flex: 1,
      marginRight: 8,
    },
    submissionTitleText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: colors.ink,
    },
    submissionSenderText: {
      fontSize: 12.5,
      color: colors.muted,
      marginTop: 2,
    },
    submissionDateText: {
      fontSize: 11.5,
      color: colors.muted,
      marginTop: 2,
    },
    statusPillSmall: {
      borderRadius: 6,
      paddingHorizontal: 6,
      paddingVertical: 2,
    },
    statusPillSmallNew: {
      backgroundColor: '#FFFBEB',
    },
    statusPillSmallRead: {
      backgroundColor: colors.canvas,
    },
    statusPillSmallLabel: {
      fontSize: 10,
      fontWeight: 'bold',
    },
    statusPillSmallLabelNew: {
      color: '#D97706',
    },
    statusPillSmallLabelRead: {
      color: colors.muted,
    },
    detailsInquiryCard: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.line,
      ...premiumShadow,
    },
    inquiryDetailTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.ink,
    },
    inquiryDetailSender: {
      fontSize: 13,
      color: colors.muted,
      marginTop: 6,
    },
    inquiryDetailDate: {
      fontSize: 12,
      color: colors.muted,
      marginTop: 2,
    },
    inquiryBodyCard: {
      backgroundColor: colors.canvas,
      borderRadius: 12,
      padding: 12,
      marginVertical: 14,
    },
    inquiryBodyText: {
      fontSize: 13.5,
      color: colors.ink,
      lineHeight: 18,
    },
    replyTextInputArea: {
      backgroundColor: colors.canvas,
      borderWidth: 1,
      borderColor: colors.line,
      borderRadius: 12,
      padding: 10,
      fontSize: 13.5,
      color: colors.ink,
      height: 80,
      marginBottom: 16,
    },
    replySubmitBtn: {
      backgroundColor: '#683E26',
      borderRadius: 18,
      paddingVertical: 12,
      alignItems: 'center',
    },
    replySubmitBtnText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: 'bold',
    },
    couponRowCard: {
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
    couponCodeText: {
      fontSize: 15,
      fontWeight: 'bold',
      color: '#683E26',
    },
    couponDescText: {
      fontSize: 12,
      color: colors.muted,
      marginTop: 2,
    },
    paymentOverviewContainer: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: 18,
    },
    paymentCardOverviewBox: {
      flex: 1,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.line,
      borderRadius: 16,
      padding: 14,
      ...premiumShadow,
    },
    paymentOverviewVal: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#10B981',
    },
    paymentOverviewLabel: {
      fontSize: 11,
      color: colors.muted,
      marginTop: 2,
    },
    paymentOverviewGrowthText: {
      fontSize: 11,
      color: '#10B981',
      fontWeight: 'bold',
      marginTop: 4,
    },
    txnRowItem: {
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
    txnClientName: {
      fontSize: 14,
      fontWeight: 'bold',
      color: colors.ink,
    },
    txnDateText: {
      fontSize: 11.5,
      color: colors.muted,
      marginTop: 2,
    },
    txnPriceText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#10B981',
    },
    reportRowItemBtn: {
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
    reportRowLeftCol: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    reportIconBoxBg: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: '#683E26' + '12',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 14,
    },
    reportItemLabelText: {
      fontSize: 14.5,
      fontWeight: 'bold',
      color: colors.ink,
    },
    reportItemDescText: {
      fontSize: 11.5,
      color: colors.muted,
      marginTop: 2,
    },
    notifRowCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 14,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.line,
      ...premiumShadow,
    },
    notifRowCardUnread: {
      backgroundColor: '#683E26' + '05',
      borderColor: '#683E26' + '15',
    },
    notifHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    notifTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      color: colors.ink,
    },
    notifBadgeDot: {
      width: 7,
      height: 7,
      borderRadius: 3.5,
      backgroundColor: '#EF4444',
    },
    notifDesc: {
      fontSize: 12.5,
      color: colors.muted,
      marginTop: 4,
    },
    notifDate: {
      fontSize: 11,
      color: colors.muted,
      marginTop: 4,
    },
    settingSwitchRowCard: {
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
    settingSwitchTitle: {
      fontSize: 14.5,
      fontWeight: 'bold',
      color: colors.ink,
    },
    settingSwitchDesc: {
      fontSize: 11.5,
      color: colors.muted,
      marginTop: 2,
    },
    profileBanner: {
      alignItems: 'center',
      backgroundColor: '#683E26',
      borderRadius: 24,
      paddingVertical: 24,
      marginBottom: 20,
      ...premiumShadow,
    },
    profileDetailAvatar: {
      width: 64,
      height: 64,
      borderRadius: 32,
      borderWidth: 2,
      borderColor: '#FFFFFF',
      backgroundColor: '#E5E7EB',
    },
    profileDetailNameText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginTop: 10,
    },
    profileDetailRoleText: {
      fontSize: 11.5,
      color: '#F5F1ED',
      marginTop: 2,
    },
    profileSpecBox: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.line,
      ...premiumShadow,
    },
    logoutBackdropView: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoutOverlayCard: {
      backgroundColor: colors.surface,
      borderRadius: 24,
      padding: 24,
      width: '80%',
      alignItems: 'center',
      ...premiumShadow,
    },
    logoutIconBoxCircle: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: '#EF444415',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 14,
    },
    logoutPromptTitle: {
      fontSize: 17,
      fontWeight: 'bold',
      color: colors.ink,
    },
    logoutPromptSub: {
      fontSize: 12.5,
      color: colors.muted,
      textAlign: 'center',
      marginTop: 6,
      lineHeight: 18,
      marginBottom: 20,
    },
    logoutMainBtn: {
      backgroundColor: '#EF4444',
      borderRadius: 18,
      width: '100%',
      paddingVertical: 12,
      alignItems: 'center',
      marginBottom: 10,
      ...premiumShadow,
    },
    logoutMainBtnLabel: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: 'bold',
    },
    logoutCancelBtn: {
      borderRadius: 18,
      width: '100%',
      paddingVertical: 12,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.line,
    },
    logoutCancelBtnLabel: {
      color: colors.ink,
      fontSize: 14,
      fontWeight: 'bold',
    },
    appearanceRow: {
      paddingVertical: 14,
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.line,
    },
    appearanceLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    appearanceLabel: {
      fontSize: 14.5,
      fontWeight: 'bold',
      color: colors.ink,
    },
    appearanceSubLabel: {
      fontSize: 11.5,
      color: colors.muted,
      marginTop: 2,
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
      marginLeft: 4,
    },
  });

export default AdminMore;
