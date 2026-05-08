import React from "react";
import{createNativeStackNavigator} from "@react-navigation/native-stack";
import LoginScreen from "../../screens/auth/login/LoginScreen";
import RegisterScreen from "../../screens/auth/register/RegisterScreen";
import AdminBottomTabs from "../admin/AdminBottomTabs";
import BarberBottomTabs from "../barber/BarberBottomTabs";
import ForgetPass from "../../screens/auth/forget/ForgetPass";
import SplashScreen from "../../screens/auth/splash/SplashScreen";
import BookingDetails from "../../screens/barber/bookings/BookingDetails";
import Notifications from "../../screens/barber/notifications/Notifications";
const AppNavigation = () => {
    const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator initialRouteName="SplashScreen"
      screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="SuperAdminTabs" component={AdminBottomTabs} />
        <Stack.Screen name="barber" component={BarberBottomTabs} />
        <Stack.Screen name="BookingDetails" component={BookingDetails} />
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="forgetPass" component={ForgetPass} />
      </Stack.Navigator>
  )
}

export default AppNavigation
