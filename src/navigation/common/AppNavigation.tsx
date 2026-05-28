import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../../screens/auth/login/LoginScreen";
import RegisterScreen from "../../screens/auth/register/RegisterScreen";
import AdminBottomTabs from "../admin/AdminBottomTabs";
import BarberBottomTabs from "../barber/BarberBottomTabs";
import UserBottomTabs from "../UserBottomTabs";
import ForgetPass from "../../screens/auth/forget/ForgetPass";
import SplashScreen from "../../screens/auth/splash/SplashScreen";
import BookingDetails from "../../screens/barber/bookings/BookingDetails";
import Notifications from "../../screens/barber/notifications/Notifications";
import ForgetPassScreen from "../../screens/auth/forget/ForgetPass";

// Profile Modular Screens
import PersonalDetails from "../../screens/user/profile/PersonalDetails";
import EditDetails from "../../screens/user/profile/EditDetails";
import MyBookingsHistory from "../../screens/user/profile/MyBookingsHistory";
import MyCoupons from "../../screens/user/profile/MyCoupons";
import CouponDetails from "../../screens/user/profile/CouponDetails";
import NotificationSettings from "../../screens/user/profile/NotificationSettings";
import HelpSupport from "../../screens/user/profile/HelpSupport";
import SupportChat from "../../screens/user/profile/SupportChat";

// Home Modular Screens
import SearchService from "../../screens/user/home/SearchService";
import AllServices from "../../screens/user/home/AllServices";
import AppointmentDetails from "../../screens/user/home/AppointmentDetails";
import NotificationsList from "../../screens/user/home/NotificationsList";
import WhyChooseUs from "../../screens/user/home/WhyChooseUs";
import SpecialOffer from "../../screens/user/home/SpecialOffer";
import ServiceDetails from "../../screens/user/home/ServiceDetails";

const AppNavigation = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      <Stack.Screen name="SuperAdminTabs" component={AdminBottomTabs} />
      <Stack.Screen name="barber" component={BarberBottomTabs} />
      <Stack.Screen name="user" component={UserBottomTabs} />
      <Stack.Screen name="BookingDetails" component={BookingDetails} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="forgetPass" component={ForgetPass} />
      
      {/* Profile sub-routes */}
      <Stack.Screen name="PersonalDetails" component={PersonalDetails} />
      <Stack.Screen name="EditDetails" component={EditDetails} />
      <Stack.Screen name="MyBookingsHistory" component={MyBookingsHistory} />
      <Stack.Screen name="MyCoupons" component={MyCoupons} />
      <Stack.Screen name="CouponDetails" component={CouponDetails} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettings} />
      <Stack.Screen name="HelpSupport" component={HelpSupport} />
      <Stack.Screen name="SupportChat" component={SupportChat} />

      {/* Home sub-routes */}
      <Stack.Screen name="SearchService" component={SearchService} />
      <Stack.Screen name="AllServices" component={AllServices} />
      <Stack.Screen name="AppointmentDetails" component={AppointmentDetails} />
      <Stack.Screen name="NotificationsList" component={NotificationsList} />
      <Stack.Screen name="WhyChooseUs" component={WhyChooseUs} />
      <Stack.Screen name="SpecialOffer" component={SpecialOffer} />
      <Stack.Screen name="ServiceDetails" component={ServiceDetails} />
    </Stack.Navigator>
  )
}

export default AppNavigation;
