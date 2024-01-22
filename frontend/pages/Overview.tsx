// Import necessary modules and components
import React, { useContext, useState } from "react";
import { View } from "react-native";
import Tourlist from "../components/tourManagement/Tourlist"; // Importing the Tourlist component
import Tour from "../model/Tour"; // Importing the Tour model
import getStyles from "../styles/styles"; // Importing style-related functions
import { Context } from "../components/profile/UserID"; // Importing the user context

// Define the Overview component
export default function Overview() {
	// Access the current theme from the user context
	const { theme } = useContext(Context);

	// Define a state variable to store the current tour being managed
	const [currentTour, setCurrentTour] = useState<Tour>();

	// Retrieve styles based on the current theme
	const styles = getStyles(theme);

    // Render the Overview view with styles applied
	return (
		<View style={styles.overview_tourlistContainer}>
			<Tourlist
				currentTour={currentTour}
				setCurrentTour={setCurrentTour}
			/>
		</View>
	);
}
