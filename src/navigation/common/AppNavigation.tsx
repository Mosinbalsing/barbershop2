import { StyleSheet } from "react-native";
import React from "react";
import{createNativeStackNavigator} from "@react-navigation/native-stack";
import LoginScreen from "../../screens/auth/login/LoginScreen";
const AppNavigation = () => {
    const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator initialRouteName="LoginScreen"
      screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
      </Stack.Navigator>
  )
}

export default AppNavigation
