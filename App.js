import { Navigation } from "react-native-navigation"

import LoginScreen from "./src/screens/LoginScreen"
import CalendarScreen from "./src/screens/CalendarScreen"
import SettingsScreen from "./src/screens/SettingsScreen"

// Register Screens
Navigation.registerComponent("tempo-mobile.LoginScreen", () => LoginScreen)
Navigation.registerComponent("tempo-mobile.CalendarScreen", () => CalendarScreen)
Navigation.registerComponent("tempo-mobile.SettingsScreen", () => SettingsScreen)

// Start a App
Navigation.startSingleScreenApp({
  screen: {
    screen: "tempo-mobile.LoginScreen",
    title: "Login"
  }
});
