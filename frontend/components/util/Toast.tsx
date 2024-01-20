// Import necessary modules and dependencies
import { Platform, ToastAndroid } from "react-native";

// Function to show a toast message, conditionally for Android
export const showToast = (message: string) => {
    if (Platform.OS === 'android') {
      // Use ToastAndroid for Android
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      // Provide an alternative for web or other platforms (e.g., alert)

      //alert(message);
    }
  };