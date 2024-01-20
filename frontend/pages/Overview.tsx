// Import necessary modules and components
import { View } from 'react-native';
import TourManagementMenu from '../components/tourManagement/TourManagementMenu';
import Wallet from './Wallet';
import NavigationBar from '../components/navigationBar/navigationBar';
import { useContext, useState } from "react";
import getStyles from '../styles/styles';
import { Context } from '../components/profile/UserID';

// Define the Overview component
export default function Overview() {
    // Initialize state variables for the current page and current theme
    const [currentPage, setCurrentPage] = useState("starttour"); // Default page
    const { theme } = useContext(Context);

    // Get dynamic styles based on the current theme
    const styles = getStyles(theme);

    // Function to render the appropriate page based on the current page state
    const LoadPage = () => {
        switch (currentPage) {
            case "starttour":
            case "tourmanagement":
                return <TourManagementMenu loadPage={currentPage} />; // Render TourManagementMenu for "starttour" and "tourmanagement" pages
            case "wallet":
                return <Wallet />; // Render Wallet for the "wallet" page
            default:
                return <TourManagementMenu loadPage={currentPage} />; // Default to TourManagementMenu for unknown pages
        }
    }

    // Render the Overview component
    return (
        <View style={styles.overview_container}>
            <NavigationBar currentPage = {currentPage} setCurrentPage = {setCurrentPage}/>
            <View style={styles.overview_containerInner}>
                <LoadPage/>
            </View>
        </View>
    );
}
