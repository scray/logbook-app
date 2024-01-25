// Import necessary modules from external libraries and files
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { darkTheme, lightTheme, Theme } from "./styles/theme"; // Import Theme type
import { useEffect, useState } from "react";
import { Context, getUserId, getTheme, storeTheme } from './components/profile/UserID';
import getStyles from './styles/styles';
import Overview from './pages/Overview';
import Wallet from './pages/Wallet';
import NavigationBar from './components/navigationBar/navigationBar';
import StartTour from './pages/StartTour';

// TODO: ADD i18n to App with settings in Wallet

// Define the main function of the application
export default function App() {
    // Initialize state variables for user ID and current theme
    const [userId, setUserId] = useState(""); // User ID
    const [currentPage, setCurrentPage] = useState("starttour"); // Default page
    const [currentTheme, setCurrentTheme] = useState(lightTheme); // Current theme
    const styles = getStyles(currentTheme); // Get styles based on the current theme

    // Use the useEffect hook to run code after the component mounts
    useEffect(() => {
        // Create an asynchronous function to fetch user ID and theme
        (async () => {
            // Fetch user ID from storage
            await getUserId().then((value) => {
                console.log("Loading user id " + value); // Log user ID for debugging
                if (value) {
                    setUserId(value); // Set the user ID in the state if it exists
                }
            })

            // Fetch theme from storage
            await getTheme().then((value) => {
                console.log("Loading theme " + value + ""); // Log theme for debugging
                // Set the current theme based on the stored value
                setCurrentTheme(value === "darkTheme" ? darkTheme : lightTheme);
            })
        })()
    }, []);

    // Define a function to set the theme
    const setTheme = async (theme: Theme) => {
        // Store the selected theme in AsyncStorage
        await storeTheme(theme === darkTheme ? "darkTheme" : "lightTheme");
        setCurrentTheme(theme); // Set the current theme in the state
    };

    // Function to render the appropriate page based on the current page state
    const LoadPage = () => {
        switch (currentPage) {
            case "starttour":
                return <StartTour/>; // Render StartTour for the "starttour" page
            case "overview":
                return <Overview/>; // Render overview for the "overview" page
            case "wallet":
                return <Wallet/>; // Render Wallet for the "wallet" page
            default:
                return <StartTour/>; // Default to TourManagementMenu for unknown pages
        }
    }

    // Return the main application structure
    return (
        <Context.Provider value={{ userId, setUserId, theme: currentTheme, setTheme }}>
                <View style={styles.app_container}>
                        <NavigationBar currentPage = {currentPage} setCurrentPage = {setCurrentPage}/>
                        <View style={styles.app_containerInner}>
                            <LoadPage/>
                        </View>
                        <StatusBar style="auto"/>
                </View>
        </Context.Provider>
    );
}
