// Import necessary modules and components
import { createContext } from "react";
import { Appearance } from "react-native";
import UserContext from "../../api/userContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from "../../styles/theme";
import { showToast } from "../util/Toast";



// Function to save a user's ID to device storage (AsyncStorage)
export const storeUserId = async (value: string) => {
  try {
    // Store the user's ID with the key "userId" in AsyncStorage
    await AsyncStorage.setItem("userId", value).then(() => {
      // Display a short Android toast message indicating the successful save
      showToast("UserId " + value + " has been saved!");
    });
  } catch (e) {
    // Handle any errors that may occur during the storage operation
    console.error(e);
  }
}

// Function to retrieve a user's ID from device storage (AsyncStorage)
export const getUserId = async () => {
  try {
    // Retrieve the user's ID associated with the key "userId" from AsyncStorage
    return await AsyncStorage.getItem("userId").then((userId) => {
      // Display a short Android toast message indicating the successful load
      showToast("Loaded User ID " + userId + " from storage! ");
      // Return the retrieved user ID
      return userId;
    });
  } catch(e) {
    // Handle any errors that may occur during the retrieval operation
    console.error(e);
    // Return an empty string in case of an error
    return "";
  }
}

// Function to save a user's theme to device storage (AsyncStorage)
export const storeTheme = async (value: string) => {
  try {
    // Store the user's theme with the key "theme" in AsyncStorage
    await AsyncStorage.setItem("theme", value).then(() => {
      // Display a short Android toast message indicating the successful save
      showToast("Theme " + value + " has been saved!");
    });
  } catch (e) {
    // Handle any errors that may occur during the storage operation
    console.error(e);
  }
}

// Function to retrieve a user's theme from device storage (AsyncStorage)
export const getTheme = async () => {
  try {
    // Retrieve the user's theme associated with the key "theme" from AsyncStorage
    return await AsyncStorage.getItem("theme").then((theme) => {
      // Display a short Android toast message indicating the successful load
      showToast("Loaded Theme " + theme + " from storage! ");
      // Return the retrieved theme
      return theme;
    });
  } catch(e) {
    // Handle any errors that may occur during the retrieval operation
    console.error(e);
    // Return lightTheme in case of an error
    return "";
  }
}

// Create a context for user-related data
export const Context = createContext<UserContext>({
  userId: "",
  setUserId: (value) => {},
  theme: lightTheme || (Appearance.getColorScheme() === 'dark' ? darkTheme : lightTheme),
  setTheme: async (value) => {}
});
