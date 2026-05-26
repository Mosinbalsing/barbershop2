export const apiPath = {
  auth: {
    login: 'api/auth/login/',
    sendotp: 'api/auth/send-otp/',
    register: 'api/auth/register/',
    profile: 'api/auth/profile/',
    refreshtoken: 'api/auth/refresh/',
    resetPassword: 'api/auth/reset-password/',
    sendResetOtp: 'api/auth/send-reset-otp/',
  },
  profiles:{
    owner:'/api/auth/owner-profile/',
    customer:'/api/auth/customer-profile/',
  },
  barberDashboard: 'api/bookings/home-dashboard/',

  booking: {
    owner: {
      available_slots: 'api/bookings/get-available-slots/',
      available_dates: 'api/bookings/get-available-dates/',
      add_online_bookings: 'api/bookings/add-online-booking/',
      add_offline_bookings: 'api/bookings/add-offline-booking/',
      owner_bookings: 'api/bookings/get-owner-bookings/',
    },
    customer: {
      customer_bookings: 'api/bookings/get-customer-bookings/',
      cancel_booking: 'api/bookings/cancel-booking/:id/',
    },
  },
  services: {
    list: 'api/services/',
    add: 'api/services/add/',
    update: 'api/services/update/:id/',
    delete: 'api/services/delete/:id/',

    add_category: 'api/services/categories/add/',
    delete_category: 'api/services/categories/delete/:id/',
  },

  settings: {
    get: 'api/settings/',
    save: 'api/settings/save/',
  },

  emergencyholiday: {
    list: 'api/settings/emergency-holiday/',
    delete: 'api/settings/emergency-holiday/:id/',
  },
};
