export const apiPath = {
  auth: {
    login: "api/auth/login/",
    sendotp: "api/auth/send-otp/",
    register: "api/auth/register/",
    profile: "api/auth/profile/",
    refreshtoken: 'api/auth/refresh/',
    resetPassword: 'api/auth/reset-password/',
    sendResetOtp: 'api/auth/send-reset-otp/'

  },
  services: {
    list: "api/services/",
    add: "api/services/add/",
    update: "api/services/update/:id/",
    delete: "api/services/delete/:id/",
  },

  settings: {
    get: "api/settings/",
    save: "api/settings/save/",
  },

  emergencyholiday: {
    list: "api/settings/emergency-holiday/",
    delete: "api/settings/emergency-holiday/:id/",
  },
}
