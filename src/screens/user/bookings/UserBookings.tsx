import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Typography } from '../../../shared/components/Typography';
import { Header } from '../../../shared/components/Header';
import { Button } from '../../../shared/components/Button';
import { Icon } from '../../../shared/components/Icon';
import { usePremiumTheme, premiumSpacing, premiumShadow } from '../../../shared/theme/premiumTheme';
import { useNavigation, useRoute } from '@react-navigation/native';

interface Service {
  id: string;
  title: string;
  duration: string;
  price: string;
  iconName: string;
}

interface BookingDate {
  dayName: string;
  dayNumber: string;
  monthName: string;
  year: string;
  fullString: string;
}

interface Booking {
  id: string;
  service: Service;
  dateString: string;
  time: string;
  price: string;
  paymentMethod: string;
  status: 'Confirmed' | 'Cancelled';
  dayNumber: number;
}

type BookingStep =
  | 'select_service'      // 1. Select Service
  | 'select_date_time'     // 2. Select Date & Time
  | 'review_booking'       // 3. Review Booking
  | 'confirm_booking'      // 4. Confirm Booking
  | 'booking_confirmed'    // 5. Booking Confirmed
  | 'calendar_view'        // 6. Calendar View (My Bookings)
  | 'booking_details';     // 7. Booking Details

const UserBookings = () => {
  const { colors, mode } = usePremiumTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  // State
  const [step, setStep] = useState<BookingStep>('select_service');
  const [selectedService, setSelectedService] = useState<Service>({
    id: '1',
    title: 'Haircut',
    duration: '30 mins',
    price: '₹299',
    iconName: 'cut-outline'
  });

  // Dynamic focus reaction to home quick service selections
  React.useEffect(() => {
    if (route.params?.preselectedService) {
      setSelectedService(route.params.preselectedService);
      setStep('select_date_time');
      
      // Reset params so they do not trigger again
      navigation.setParams({ preselectedService: undefined });
    }
  }, [route.params?.preselectedService]);
  
  // Mock Dates for May 2025 to match PNG
  const mockDates: BookingDate[] = [
    { dayName: 'Sun', dayNumber: '18', monthName: 'May', year: '2025', fullString: 'Sun, 18 May 2025' },
    { dayName: 'Mon', dayNumber: '19', monthName: 'May', year: '2025', fullString: 'Mon, 19 May 2025' },
    { dayName: 'Tue', dayNumber: '20', monthName: 'May', year: '2025', fullString: 'Tue, 20 May 2025' },
    { dayName: 'Wed', dayNumber: '21', monthName: 'May', year: '2025', fullString: 'Wed, 21 May 2025' },
    { dayName: 'Thu', dayNumber: '22', monthName: 'May', year: '2025', fullString: 'Thu, 22 May 2025' },
    { dayName: 'Fri', dayNumber: '23', monthName: 'May', year: '2025', fullString: 'Fri, 23 May 2025' },
    { dayName: 'Sat', dayNumber: '24', monthName: 'May', year: '2025', fullString: 'Sat, 24 May 2025' },
  ];

  const [selectedDate, setSelectedDate] = useState<BookingDate>(mockDates[1]); // Monday 19th May selected by default
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('04:30 PM'); // 04:30 PM selected by default
  const [paymentMethod, setPaymentMethod] = useState<'Cash at Shop' | 'UPI' | 'Card'>('Cash at Shop');
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  
  // Store completed bookings dynamically
  const [bookingsList, setBookingsList] = useState<Booking[]>([
    {
      id: '#B202505190001',
      service: { id: '1', title: 'Haircut', duration: '30 mins', price: '₹299', iconName: 'cut-outline' },
      dateString: 'Mon, 19 May 2025',
      time: '04:30 PM',
      price: '₹299',
      paymentMethod: 'Cash at Shop',
      status: 'Confirmed',
      dayNumber: 19,
    }
  ]);
  const [selectedCalendarBooking, setSelectedCalendarBooking] = useState<Booking | null>(bookingsList[0]);

  const services: Service[] = [
    { id: '1', title: 'Haircut', duration: '30 mins', price: '₹299', iconName: 'cut-outline' },
    { id: '2', title: 'Beard Trim', duration: '20 mins', price: '₹199', iconName: 'person-outline' },
    { id: '3', title: 'Shave', duration: '15 mins', price: '₹149', iconName: 'water-outline' },
    { id: '4', title: 'Hair Spa', duration: '45 mins', price: '₹499', iconName: 'color-wand-outline' },
    { id: '5', title: 'Hair Color', duration: '60 mins', price: '₹999', iconName: 'color-palette-outline' },
  ];

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM',
    '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '01:00 PM',
    '04:00 PM', '04:30 PM', '05:00 PM',
    '05:30 PM', '06:00 PM', '06:30 PM',
    '07:00 PM', '07:30 PM', '08:00 PM',
  ];

  // Calendar view days (May 2025 grid - exact match)
  const calendarDays = [
    { day: 27, isCurrentMonth: false },
    { day: 28, isCurrentMonth: false },
    { day: 29, isCurrentMonth: false },
    { day: 30, isCurrentMonth: false },
    { day: 1, isCurrentMonth: true },
    { day: 2, isCurrentMonth: true },
    { day: 3, isCurrentMonth: true },
    { day: 4, isCurrentMonth: true },
    { day: 5, isCurrentMonth: true },
    { day: 6, isCurrentMonth: true },
    { day: 7, isCurrentMonth: true },
    { day: 8, isCurrentMonth: true },
    { day: 9, isCurrentMonth: true },
    { day: 10, isCurrentMonth: true },
    { day: 11, isCurrentMonth: true },
    { day: 12, isCurrentMonth: true },
    { day: 13, isCurrentMonth: true },
    { day: 14, isCurrentMonth: true },
    { day: 15, isCurrentMonth: true },
    { day: 16, isCurrentMonth: true },
    { day: 17, isCurrentMonth: true },
    { day: 18, isCurrentMonth: true },
    { day: 19, isCurrentMonth: true }, // May 19
    { day: 20, isCurrentMonth: true },
    { day: 21, isCurrentMonth: true },
    { day: 22, isCurrentMonth: true },
    { day: 23, isCurrentMonth: true },
    { day: 24, isCurrentMonth: true },
    { day: 25, isCurrentMonth: true },
    { day: 26, isCurrentMonth: true },
    { day: 27, isCurrentMonth: true },
    { day: 28, isCurrentMonth: true },
    { day: 29, isCurrentMonth: true },
    { day: 30, isCurrentMonth: true },
    { day: 31, isCurrentMonth: true },
  ];

  // Create appointment handler
  const handleConfirmBooking = () => {
    const bookingId = `#B202505${selectedDate.dayNumber}${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: Booking = {
      id: bookingId,
      service: selectedService,
      dateString: selectedDate.fullString,
      time: selectedTimeSlot,
      price: selectedService.price,
      paymentMethod: paymentMethod,
      status: 'Confirmed',
      dayNumber: parseInt(selectedDate.dayNumber, 10),
    };

    setBookingsList(prev => [...prev, newBooking]);
    setCreatedBooking(newBooking);
    setSelectedCalendarBooking(newBooking);
    setStep('booking_confirmed');
  };

  // Cancel appointment handler
  const handleCancelBooking = (bookingId: string) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this appointment?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            const updated = bookingsList.map(b => 
              b.id === bookingId ? { ...b, status: 'Cancelled' as const } : b
            );
            setBookingsList(updated);
            
            // Sync active details states
            if (createdBooking?.id === bookingId) {
              setCreatedBooking(prev => prev ? { ...prev, status: 'Cancelled' } : null);
            }
            if (selectedCalendarBooking?.id === bookingId) {
              setSelectedCalendarBooking(prev => prev ? { ...prev, status: 'Cancelled' } : null);
            }
          }
        }
      ]
    );
  };

  // Header wrapper with custom navigation flow
  const renderHeader = () => {
    let title = "Book Appointment";
    let showBackOverride = false;
    let onBackPress = () => {};
    let rightEl: React.ReactNode = undefined;

    if (step === 'select_service') {
      title = "Book Appointment";
      showBackOverride = true; // goes back via default router
      rightEl = (
        <TouchableOpacity onPress={() => setStep('select_date_time')} style={styles.navHeaderBtn}>
          <Icon name="chevron-forward" size={24} color="ink" />
        </TouchableOpacity>
      );
    } else if (step === 'select_date_time') {
      title = "Book Appointment";
      onBackPress = () => setStep('select_service');
      rightEl = (
        <TouchableOpacity onPress={() => setStep('review_booking')} style={styles.navHeaderBtn}>
          <Icon name="chevron-forward" size={24} color="ink" />
        </TouchableOpacity>
      );
    } else if (step === 'review_booking') {
      title = "Book Appointment";
      onBackPress = () => setStep('select_date_time');
      rightEl = (
        <TouchableOpacity onPress={() => setStep('confirm_booking')} style={styles.navHeaderBtn}>
          <Icon name="chevron-forward" size={24} color="ink" />
        </TouchableOpacity>
      );
    } else if (step === 'confirm_booking') {
      title = "Book Appointment";
      onBackPress = () => setStep('review_booking');
    } else if (step === 'booking_confirmed') {
      title = "Booking Confirmed";
    } else if (step === 'calendar_view') {
      title = "My Bookings";
      onBackPress = () => setStep('select_service');
      rightEl = (
        <TouchableOpacity style={styles.navHeaderBtn}>
          <Icon name="calendar-outline" size={24} color="ink" />
        </TouchableOpacity>
      );
    } else if (step === 'booking_details') {
      title = "Booking Details";
      onBackPress = () => setStep('calendar_view');
    }

    return (
      <Header
        title={title}
        showBack={showBackOverride && step === 'select_service'}
        leftElement={
          !showBackOverride && step !== 'booking_confirmed' ? (
            <TouchableOpacity onPress={onBackPress} style={styles.navHeaderBtn}>
              <Icon name="arrow-back" size={24} color="ink" />
            </TouchableOpacity>
          ) : undefined
        }
        rightElement={rightEl}
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.canvas }]}>
      {renderHeader()}
      
      {/* 4-Step Stepper (Shown only during the wizard steps) */}
      {(step === 'select_service' || step === 'select_date_time' || step === 'review_booking' || step === 'confirm_booking') && (
        <View style={styles.stepperContainer}>
          {/* Step 1 */}
          <View style={styles.step}>
            <View style={[styles.stepCircle, { 
              backgroundColor: step === 'select_service' ? colors.primary : colors.softPrimary,
              borderColor: step === 'select_service' ? colors.primary : 'transparent',
              borderWidth: step === 'select_service' ? 2 : 0
            }]}>
              <Typography variant="caption" color={step === 'select_service' ? 'surface' : 'primary'} weight="bold">1</Typography>
            </View>
            <Typography variant="caption" color={step === 'select_service' ? 'ink' : 'muted'} style={styles.stepText}>Service</Typography>
          </View>
          <View style={[styles.stepLine, { backgroundColor: step !== 'select_service' ? colors.primary : colors.line }]} />
          
          {/* Step 2 */}
          <View style={styles.step}>
            <View style={[styles.stepCircle, { 
              backgroundColor: step === 'select_date_time' ? colors.primary : (step === 'review_booking' || step === 'confirm_booking' ? colors.softPrimary : colors.surface),
              borderColor: step === 'select_date_time' ? colors.primary : colors.line,
              borderWidth: (step === 'review_booking' || step === 'confirm_booking') ? 0 : 1
            }]}>
              <Typography variant="caption" color={step === 'select_date_time' ? 'surface' : (step === 'review_booking' || step === 'confirm_booking' ? 'primary' : 'muted')} weight="bold">2</Typography>
            </View>
            <Typography variant="caption" color={step === 'select_date_time' ? 'ink' : 'muted'} style={styles.stepText}>DateTime</Typography>
          </View>
          <View style={[styles.stepLine, { backgroundColor: (step === 'review_booking' || step === 'confirm_booking') ? colors.primary : colors.line }]} />
          
          {/* Step 3 */}
          <View style={styles.step}>
            <View style={[styles.stepCircle, { 
              backgroundColor: step === 'review_booking' ? colors.primary : (step === 'confirm_booking' ? colors.softPrimary : colors.surface),
              borderColor: step === 'review_booking' ? colors.primary : colors.line,
              borderWidth: step === 'confirm_booking' ? 0 : 1
            }]}>
              <Typography variant="caption" color={step === 'review_booking' ? 'surface' : (step === 'confirm_booking' ? 'primary' : 'muted')} weight="bold">3</Typography>
            </View>
            <Typography variant="caption" color={step === 'review_booking' ? 'ink' : 'muted'} style={styles.stepText}>Review</Typography>
          </View>
          <View style={[styles.stepLine, { backgroundColor: step === 'confirm_booking' ? colors.primary : colors.line }]} />
          
          {/* Step 4 */}
          <View style={styles.step}>
            <View style={[styles.stepCircle, { 
              backgroundColor: step === 'confirm_booking' ? colors.primary : colors.surface,
              borderColor: step === 'confirm_booking' ? colors.primary : colors.line,
              borderWidth: 1
            }]}>
              <Typography variant="caption" color={step === 'confirm_booking' ? 'surface' : 'muted'} weight="bold">4</Typography>
            </View>
            <Typography variant="caption" color={step === 'confirm_booking' ? 'ink' : 'muted'} style={styles.stepText}>Confirm</Typography>
          </View>
        </View>
      )}

      {/* Main Content Area */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* STEP 1: SELECT SERVICE */}
        {step === 'select_service' && (
          <View>
            <Typography variant="h4" weight="bold" style={styles.sectionTitle}>Select Service</Typography>
            
            <View style={[styles.servicesCard, { backgroundColor: colors.surface }, premiumShadow]}>
              {services.map((service, index) => {
                const isSelected = selectedService.id === service.id;
                return (
                  <TouchableOpacity
                    key={service.id}
                    onPress={() => setSelectedService(service)}
                    style={[
                      styles.serviceItemRow,
                      { borderBottomColor: colors.line, borderBottomWidth: index === services.length - 1 ? 0 : 1 },
                      isSelected && { borderColor: colors.primary, borderWidth: 2, borderRadius: 12, margin: -1 }
                    ]}
                  >
                    <View style={[styles.serviceIconWrapper, { backgroundColor: isSelected ? colors.softPrimary : colors.canvas }]}>
                      <Icon name={service.iconName} size={24} color={isSelected ? 'primary' : 'ink'} />
                    </View>
                    
                    <View style={styles.serviceContent}>
                      <Typography variant="body" weight="600" color={isSelected ? 'primary' : 'ink'}>
                        {service.title}
                      </Typography>
                      <Typography variant="caption" color="muted">
                        {service.duration}
                      </Typography>
                    </View>
                    
                    <View style={styles.serviceRight}>
                      {isSelected ? (
                        <View style={[styles.checkmarkCircle, { backgroundColor: colors.primary }]}>
                          <Icon name="checkmark" size={14} color="surface" />
                        </View>
                      ) : (
                        <Typography variant="body" weight="bold">{service.price}</Typography>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* STEP 2: SELECT DATE & TIME */}
        {step === 'select_date_time' && (
          <View>
            <View style={styles.rowHeader}>
              <Typography variant="h4" weight="bold">Select Date</Typography>
              <Icon name="calendar-outline" size={20} color="primary" />
            </View>
            
            {/* Horizontal Calendar */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalCalendar}>
              {mockDates.map((d) => {
                const isSelected = selectedDate.fullString === d.fullString;
                return (
                  <TouchableOpacity
                    key={d.fullString}
                    onPress={() => setSelectedDate(d)}
                    style={[
                      styles.calendarCard,
                      { backgroundColor: colors.surface, borderColor: colors.line },
                      isSelected && { backgroundColor: colors.primary, borderColor: colors.primary }
                    ]}
                  >
                    <Typography variant="label" color={isSelected ? 'surface' : 'muted'} style={styles.uppercase}>
                      {d.monthName}
                    </Typography>
                    <Typography variant="caption" color={isSelected ? 'surface' : 'muted'} weight="600" style={styles.calendarDayName}>
                      {d.dayName}
                    </Typography>
                    <Typography variant="h3" color={isSelected ? 'surface' : 'ink'} weight="bold">
                      {d.dayNumber}
                    </Typography>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            
            <Typography variant="h4" weight="bold" style={styles.timeSectionTitle}>Select Time</Typography>
            
            {/* Grid of Time Slots */}
            <View style={styles.timeGrid}>
              {timeSlots.map((slot) => {
                const isSelected = selectedTimeSlot === slot;
                return (
                  <TouchableOpacity
                    key={slot}
                    onPress={() => setSelectedTimeSlot(slot)}
                    style={[
                      styles.timeItem,
                      { backgroundColor: colors.surface, borderColor: colors.line },
                      isSelected && { backgroundColor: colors.softPrimary, borderColor: colors.primary }
                    ]}
                  >
                    <Typography
                      variant="caption"
                      color={isSelected ? 'primary' : 'ink'}
                      weight={isSelected ? 'bold' : 'normal'}
                    >
                      {slot}
                    </Typography>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* STEP 3: REVIEW BOOKING */}
        {step === 'review_booking' && (
          <View>
            <Typography variant="h4" weight="bold" style={styles.sectionTitle}>Booking Summary</Typography>
            
            <View style={[styles.summaryCard, { backgroundColor: colors.surface }, premiumShadow]}>
              {/* Service Detail */}
              <View style={[styles.summaryRow, { borderBottomColor: colors.line }]}>
                <View style={styles.summaryLeft}>
                  <Icon name={selectedService.iconName} size={22} color="primary" />
                  <Typography variant="body" color="muted" style={styles.summaryLabel}>Service</Typography>
                </View>
                <Typography variant="body" weight="bold">{selectedService.title}</Typography>
              </View>
              
              {/* Duration Detail */}
              <View style={[styles.summaryRow, { borderBottomColor: colors.line }]}>
                <View style={styles.summaryLeft}>
                  <Icon name="time-outline" size={22} color="primary" />
                  <Typography variant="body" color="muted" style={styles.summaryLabel}>Duration</Typography>
                </View>
                <Typography variant="body" weight="bold">{selectedService.duration}</Typography>
              </View>
              
              {/* Date Detail */}
              <View style={[styles.summaryRow, { borderBottomColor: colors.line }]}>
                <View style={styles.summaryLeft}>
                  <Icon name="calendar-outline" size={22} color="primary" />
                  <Typography variant="body" color="muted" style={styles.summaryLabel}>Date</Typography>
                </View>
                <Typography variant="body" weight="bold">{selectedDate.fullString}</Typography>
              </View>
              
              {/* Time Detail */}
              <View style={[styles.summaryRow, { borderBottomColor: colors.line }]}>
                <View style={styles.summaryLeft}>
                  <Icon name="time-outline" size={22} color="primary" />
                  <Typography variant="body" color="muted" style={styles.summaryLabel}>Time</Typography>
                </View>
                <Typography variant="body" weight="bold">{selectedTimeSlot}</Typography>
              </View>
              
              {/* Price Detail */}
              <View style={[styles.summaryRow, { borderBottomWidth: 0 }]}>
                <View style={styles.summaryLeft}>
                  <Icon name="card-outline" size={22} color="primary" />
                  <Typography variant="body" color="muted" style={styles.summaryLabel}>Price</Typography>
                </View>
                <Typography variant="body" weight="bold" color="primary">{selectedService.price}</Typography>
              </View>
            </View>
          </View>
        )}

        {/* STEP 4: CONFIRM BOOKING */}
        {step === 'confirm_booking' && (
          <View>
            {/* Visual calendar check graphic */}
            <View style={styles.illustrationContainer}>
              <View style={[styles.circleBg, { backgroundColor: colors.softPrimary }]}>
                <Icon name="calendar" size={48} color="primary" />
                <View style={[styles.checkmarkCircleBadge, { backgroundColor: '#10B981' }]}>
                  <Icon name="checkmark" size={14} color="surface" />
                </View>
              </View>
              <Typography variant="h3" weight="bold" style={styles.confirmTitle}>Confirm Your Booking</Typography>
              <Typography variant="caption" color="muted" align="center" style={styles.confirmSubtitle}>
                Please confirm your appointment to complete the booking.
              </Typography>
            </View>
            
            {/* Total Amount Box */}
            <View style={[styles.amountBox, { backgroundColor: colors.surface, borderColor: colors.line }]}>
              <Typography variant="body" color="muted">Total Amount</Typography>
              <Typography variant="h3" weight="bold" color="primary">{selectedService.price}</Typography>
            </View>
            
            <Typography variant="h4" weight="bold" style={styles.paymentSectionTitle}>Payment Method</Typography>
            
            {/* Radio Selectors for Payment Methods */}
            <TouchableOpacity
              onPress={() => setPaymentMethod('Cash at Shop')}
              style={[
                styles.paymentRow,
                { backgroundColor: colors.surface, borderColor: paymentMethod === 'Cash at Shop' ? colors.primary : colors.line }
              ]}
            >
              <View style={styles.paymentLeft}>
                <Icon name="cash-outline" size={24} color="ink" />
                <Typography variant="body" weight="500">Cash at Shop</Typography>
              </View>
              <View style={[styles.radioCircle, { borderColor: paymentMethod === 'Cash at Shop' ? colors.primary : colors.muted }]}>
                {paymentMethod === 'Cash at Shop' && <View style={[styles.radioDot, { backgroundColor: colors.primary }]} />}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setPaymentMethod('UPI')}
              style={[
                styles.paymentRow,
                { backgroundColor: colors.surface, borderColor: paymentMethod === 'UPI' ? colors.primary : colors.line }
              ]}
            >
              <View style={styles.paymentLeft}>
                <Icon name="phone-portrait-outline" size={24} color="ink" />
                <Typography variant="body" weight="500">UPI</Typography>
              </View>
              <View style={[styles.radioCircle, { borderColor: paymentMethod === 'UPI' ? colors.primary : colors.muted }]}>
                {paymentMethod === 'UPI' && <View style={[styles.radioDot, { backgroundColor: colors.primary }]} />}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setPaymentMethod('Card')}
              style={[
                styles.paymentRow,
                { backgroundColor: colors.surface, borderColor: paymentMethod === 'Card' ? colors.primary : colors.line }
              ]}
            >
              <View style={styles.paymentLeft}>
                <Icon name="card-outline" size={24} color="ink" />
                <Typography variant="body" weight="500">Card</Typography>
              </View>
              <View style={[styles.radioCircle, { borderColor: paymentMethod === 'Card' ? colors.primary : colors.muted }]}>
                {paymentMethod === 'Card' && <View style={[styles.radioDot, { backgroundColor: colors.primary }]} />}
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 5: BOOKING CONFIRMED */}
        {step === 'booking_confirmed' && createdBooking && (
          <View>
            <View style={styles.successIconContainer}>
              <View style={[styles.successOuterCircle, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                <View style={[styles.successInnerCircle, { backgroundColor: '#10B981' }]}>
                  <Icon name="checkmark" size={36} color="surface" />
                </View>
              </View>
              <Typography variant="h2" weight="bold" style={styles.successTitle}>Booking Confirmed!</Typography>
              <Typography variant="caption" color="muted" align="center" style={styles.successSubtitle}>
                Your appointment has been successfully booked.
              </Typography>
            </View>
            
            {/* Receipt Summary Card */}
            <View style={[styles.receiptCard, { backgroundColor: colors.surface }, premiumShadow]}>
              <View style={styles.receiptRow}>
                <Typography variant="caption" color="muted">Booking ID</Typography>
                <Typography variant="body" weight="bold">{createdBooking.id}</Typography>
              </View>
              
              <View style={styles.receiptRow}>
                <Typography variant="caption" color="muted">Service</Typography>
                <Typography variant="body" weight="bold">{createdBooking.service.title}</Typography>
              </View>
              
              <View style={styles.receiptRow}>
                <Typography variant="caption" color="muted">Date</Typography>
                <Typography variant="body" weight="bold">{createdBooking.dateString}</Typography>
              </View>
              
              <View style={styles.receiptRow}>
                <Typography variant="caption" color="muted">Time</Typography>
                <Typography variant="body" weight="bold">{createdBooking.time}</Typography>
              </View>
              
              <View style={[styles.receiptRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
                <Typography variant="caption" color="muted">Amount</Typography>
                <Typography variant="body" weight="bold" color="primary">{createdBooking.price}</Typography>
              </View>
            </View>

            <View style={styles.successActions}>
              <Button
                title="View My Bookings"
                onPress={() => setStep('calendar_view')}
                style={styles.successPrimaryBtn}
              />
              <Button
                title="Go to Home"
                variant="outline"
                onPress={() => {
                  setStep('select_service');
                  navigation.navigate('Home');
                }}
                style={styles.successOutlineBtn}
              />
            </View>
          </View>
        )}

        {/* STEP 6: CALENDAR VIEW */}
        {step === 'calendar_view' && (
          <View>
            {/* Month Switcher Header */}
            <View style={styles.monthHeaderRow}>
              <TouchableOpacity style={styles.iconMonthBtn}>
                <Icon name="chevron-back" size={20} color="ink" />
              </TouchableOpacity>
              <Typography variant="h3" weight="bold">May 2025</Typography>
              <TouchableOpacity style={styles.iconMonthBtn}>
                <Icon name="chevron-forward" size={20} color="ink" />
              </TouchableOpacity>
            </View>
            
            {/* Calendar Grid (May 2025) */}
            <View style={[styles.calendarContainer, { backgroundColor: colors.surface, borderColor: colors.line }]}>
              {/* Day Headers */}
              <View style={styles.calendarDayHeaders}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <Typography key={day} variant="caption" color="muted" align="center" weight="600" style={styles.calendarHeaderCell}>
                    {day}
                  </Typography>
                ))}
              </View>
              
              {/* Day Grid */}
              <View style={styles.calendarDayGrid}>
                {calendarDays.map((d, index) => {
                  // Check if day has a booking
                  const bookingForDay = bookingsList.find(b => b.dayNumber === d.day && d.isCurrentMonth);
                  const isBooked = !!bookingForDay;
                  
                  return (
                    <TouchableOpacity
                      key={index}
                      disabled={!d.isCurrentMonth}
                      onPress={() => {
                        if (bookingForDay) {
                          setSelectedCalendarBooking(bookingForDay);
                        } else {
                          setSelectedCalendarBooking(null);
                        }
                      }}
                      style={styles.calendarDayCell}
                    >
                      <View style={[
                        styles.calendarDayCircle,
                        !d.isCurrentMonth && { opacity: 0.3 },
                        isBooked && { backgroundColor: colors.ink } // mockup uses dark circle around booked date
                      ]}>
                        <Typography
                          variant="caption"
                          color={isBooked ? 'surface' : 'ink'}
                          weight={isBooked ? 'bold' : 'normal'}
                        >
                          {d.day}
                        </Typography>
                      </View>
                      
                      {/* Optional little dot underneath for dynamic user bookings */}
                      {isBooked && (
                        <View style={[styles.bookingIndicatorDot, { backgroundColor: colors.primary }]} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <Typography variant="h4" weight="bold" style={styles.upcomingTitle}>Upcoming Appointment</Typography>

            {/* Selected Calendar Day Booking */}
            {selectedCalendarBooking ? (
              <TouchableOpacity
                onPress={() => setStep('booking_details')}
                style={[styles.upcomingCard, { backgroundColor: colors.surface }, premiumShadow]}
              >
                <View style={[styles.upcomingIconWrapper, { backgroundColor: colors.softPrimary }]}>
                  <Icon name={selectedCalendarBooking.service.iconName} size={24} color="primary" />
                </View>
                
                <View style={styles.upcomingInfo}>
                  <Typography variant="body" weight="bold">{selectedCalendarBooking.service.title}</Typography>
                  <Typography variant="caption" color="muted">
                    {selectedCalendarBooking.dateString} • {selectedCalendarBooking.time}
                  </Typography>
                  <Typography variant="body" weight="bold" color="primary" style={styles.upcomingPrice}>
                    {selectedCalendarBooking.price}
                  </Typography>
                </View>
                
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: selectedCalendarBooking.status === 'Confirmed' ? '#D1FAE5' : colors.line }
                ]}>
                  <Typography
                    variant="label"
                    weight="bold"
                    style={{ color: selectedCalendarBooking.status === 'Confirmed' ? '#10B981' : colors.muted }}
                  >
                    {selectedCalendarBooking.status}
                  </Typography>
                </View>
              </TouchableOpacity>
            ) : (
              <View style={[styles.emptyStateCard, { backgroundColor: colors.surface }]}>
                <Icon name="calendar-outline" size={32} color="muted" />
                <Typography variant="body" color="muted" style={styles.emptyText}>No appointment on this date.</Typography>
                <Button title="Book New Slot" size="small" onPress={() => setStep('select_service')} />
              </View>
            )}
          </View>
        )}

        {/* STEP 7: BOOKING DETAILS */}
        {step === 'booking_details' && selectedCalendarBooking && (
          <View>
            {/* Status Pill Card */}
            <View style={[styles.detailsCard, { backgroundColor: colors.surface }, premiumShadow]}>
              <View style={styles.detailsRowHeader}>
                <Icon name={selectedCalendarBooking.service.iconName} size={28} color="primary" />
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: selectedCalendarBooking.status === 'Confirmed' ? '#D1FAE5' : 'rgba(239, 68, 68, 0.1)' }
                ]}>
                  <Typography
                    variant="label"
                    weight="bold"
                    style={{ color: selectedCalendarBooking.status === 'Confirmed' ? '#10B981' : '#EF4444' }}
                  >
                    {selectedCalendarBooking.status}
                  </Typography>
                </View>
              </View>
              
              <Typography variant="h3" weight="bold" style={styles.detailsServiceName}>
                {selectedCalendarBooking.service.title}
              </Typography>
              <Typography variant="caption" color="muted">
                {selectedCalendarBooking.service.duration} • {selectedCalendarBooking.price}
              </Typography>
            </View>
            
            {/* Details Table */}
            <View style={[styles.receiptCard, { backgroundColor: colors.surface }, premiumShadow]}>
              <View style={styles.receiptRow}>
                <Typography variant="caption" color="muted">Booking ID</Typography>
                <Typography variant="body" weight="bold">{selectedCalendarBooking.id}</Typography>
              </View>
              
              <View style={styles.receiptRow}>
                <Typography variant="caption" color="muted">Date</Typography>
                <Typography variant="body" weight="bold">{selectedCalendarBooking.dateString}</Typography>
              </View>
              
              <View style={styles.receiptRow}>
                <Typography variant="caption" color="muted">Time</Typography>
                <Typography variant="body" weight="bold">{selectedCalendarBooking.time}</Typography>
              </View>
              
              <View style={styles.receiptRow}>
                <Typography variant="caption" color="muted">Payment Method</Typography>
                <Typography variant="body" weight="bold">{selectedCalendarBooking.paymentMethod}</Typography>
              </View>
              
              <View style={[styles.receiptRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
                <Typography variant="caption" color="muted">Status</Typography>
                <Typography
                  variant="body"
                  weight="bold"
                  style={{ color: selectedCalendarBooking.status === 'Confirmed' ? '#10B981' : '#EF4444' }}
                >
                  {selectedCalendarBooking.status}
                </Typography>
              </View>
            </View>

            {/* Cancel booking action */}
            {selectedCalendarBooking.status === 'Confirmed' && (
              <TouchableOpacity
                onPress={() => handleCancelBooking(selectedCalendarBooking.id)}
                style={[styles.cancelBtn, { borderColor: '#EF4444' }]}
              >
                <Typography variant="body" weight="bold" style={{ color: '#EF4444' }}>
                  Cancel Booking
                </Typography>
              </TouchableOpacity>
            )}
          </View>
        )}

      </ScrollView>

      {/* Persistent Button Footer for Step 1, 2, 3 */}
      {(step === 'select_service' || step === 'select_date_time' || step === 'review_booking') && (
        <View style={[styles.footer, { backgroundColor: colors.canvas }]}>
          <Button
            title="Next"
            size="large"
            onPress={() => {
              if (step === 'select_service') setStep('select_date_time');
              else if (step === 'select_date_time') setStep('review_booking');
              else if (step === 'review_booking') setStep('confirm_booking');
            }}
          />
        </View>
      )}

      {/* Custom Button Footer for Step 4 (Confirm Booking) */}
      {step === 'confirm_booking' && (
        <View style={[styles.footer, { backgroundColor: colors.canvas }]}>
          <Button
            title="Confirm Booking"
            size="large"
            onPress={handleConfirmBooking}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  navHeaderBtn: { padding: 4 },
  
  // Stepper styles
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  step: { 
    alignItems: 'center', 
    width: 60,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    zIndex: 2,
  },
  stepText: { 
    fontSize: 10,
    textAlign: 'center',
  },
  stepLine: {
    flex: 1,
    height: 2,
    marginTop: 13,
    marginHorizontal: -12,
    zIndex: 1,
  },
  
  scrollContent: { padding: 16, paddingBottom: 110 },
  sectionTitle: { marginBottom: 16 },
  
  // Service list styling (Step 1)
  servicesCard: {
    borderRadius: premiumSpacing.cardRadius,
    overflow: 'hidden',
  },
  serviceItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  serviceIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  serviceContent: { flex: 1 },
  serviceRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkmarkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Date and Time picker styling (Step 2)
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  horizontalCalendar: {
    paddingVertical: 4,
    paddingRight: 16,
    gap: 12,
  },
  calendarCard: {
    width: 65,
    height: 90,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  calendarDayName: {
    marginVertical: 4,
  },
  uppercase: {
    textTransform: 'uppercase',
  },
  timeSectionTitle: {
    marginTop: 24,
    marginBottom: 16,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  timeItem: {
    width: '31%',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 8,
  },
  
  // Review page styling (Step 3)
  summaryCard: {
    borderRadius: premiumSpacing.cardRadius,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  summaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryLabel: {
    marginLeft: 12,
    fontSize: 15,
  },
  
  // Confirm page styling (Step 4)
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  circleBg: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 16,
  },
  checkmarkCircleBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  confirmTitle: {
    marginBottom: 8,
  },
  confirmSubtitle: {
    maxWidth: '80%',
    lineHeight: 18,
  },
  amountBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  paymentSectionTitle: {
    marginBottom: 16,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  
  // Booking confirmed styling (Step 5)
  successIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  successOuterCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successInnerCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    marginBottom: 8,
  },
  successSubtitle: {
    maxWidth: '85%',
    lineHeight: 18,
  },
  receiptCard: {
    borderRadius: premiumSpacing.cardRadius,
    padding: 20,
    marginBottom: 24,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(236, 236, 243, 0.5)',
  },
  successActions: {
    gap: 12,
  },
  successPrimaryBtn: {
    width: '100%',
  },
  successOutlineBtn: {
    width: '100%',
  },
  
  // Calendar View styling (Step 6)
  monthHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  iconMonthBtn: {
    padding: 8,
  },
  calendarContainer: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  calendarDayHeaders: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  calendarHeaderCell: {
    width: '14.28%',
  },
  calendarDayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 10,
  },
  calendarDayCell: {
    width: '14.28%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  calendarDayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookingIndicatorDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    bottom: 0,
  },
  upcomingTitle: {
    marginBottom: 12,
  },
  upcomingCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  upcomingIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  upcomingInfo: { flex: 1 },
  upcomingPrice: { marginTop: 4 },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  emptyStateCard: {
    padding: 24,
    alignItems: 'center',
    borderRadius: 16,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    marginBottom: 8,
  },
  
  // Booking details styling (Step 7)
  detailsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  detailsRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailsServiceName: {
    marginBottom: 4,
  },
  cancelBtn: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32, // for safe area
  },
});

export default UserBookings;
