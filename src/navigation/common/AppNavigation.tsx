import { StyleSheet } from "react-native";
import React from "react";
import{createNativeStackNavigator} from "@react-navigation/native-stack";
import LoginScreen from "../../screens/auth/login/LoginScreen";
import Admin from "../../screens/admin/Admin";
import BarberDashboard from "../../screens/barber/dashboard/BarberDashboard";
import RegisterScreen from "../../screens/auth/register/RegisterScreen";
import AdminBottomTabs from "../admin/AdminBottomTabs";
const AppNavigation = () => {
    const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator initialRouteName="LoginScreen"
      screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="admin" component={Admin} />
        <Stack.Screen name="barberDashboard" component={BarberDashboard} />
        <Stack.Screen name="SuperAdminTabs" component={AdminBottomTabs} />
      </Stack.Navigator>
  )
}

export default AppNavigation
