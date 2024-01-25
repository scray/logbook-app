// Import necessary modules and components
import React, { useContext, useEffect, useState } from "react";
import { Platform, View, Text, Pressable } from "react-native";
import * as Location from "expo-location";

// Import components and utilities
import Map from "../components/map/Map";
import VehiclePopup from "../components/tourManagement/VehiclePopup"; // Import the VehiclePopup component
import { showToast } from "../components/util/Toast";

// Import context, models, and API functions
import { Context } from "../components/profile/UserID";
import getStyles from "../styles/styles";
import Tour from "../model/Tour";
import Coordinates from "../model/Coordinates";
import { createTour, createWaypoint } from "../api/tourManagement";

// Define the type for a vehicle
interface Vehicle {
	id: number;
	name: string;
}

export default function StartTour() {
	// Define state variables using the 'useState' hook
	const [runningTour, setRunningTour] = useState<Tour>(); // Stores information about the currently running tour
	const [permissionGranted, setPermissionGranted] = useState(false); // Stores whether location permissions are granted
	const [startTime, setStartTime] = useState(0); // Stores the start time of the tour
	const [currentTime, setCurrentTime] = useState(0); // Stores the current time
	const [isVehiclePopupVisible, setIsVehiclePopupVisible] = useState(false); // State for VehiclePopup visibility
	const { userId, theme } = useContext(Context); // Accessing user-related information from context
	const [state, setState] = useState("start"); // Stores the state of the tour (start or stop)
	const styles = getStyles(theme); // Fetching styles based on the theme

	// Handle vehicle selection
	const handleVehicleSelection = (vehicle: Vehicle) => {
		setIsVehiclePopupVisible(false);
		// Pass the selected vehicle to handleStartTour
		handleStartTour(vehicle);
	};

	// Start the tour
	async function handleStartTour(selectedVehicle: Vehicle): Promise<boolean> {
		// Ensure a vehicle is selected
		if (!selectedVehicle) {
			showToast("Please select a vehicle.");
			return false;
		}

		if (!permissionGranted) {
			showToast("Please grant location permissions.");
      if (Platform.OS === "android") {
        requestLocationPermissions();
      } // Requesting location permissions specifically for Android
			return false;
		}

		console.log("Starting tour with vehicle:", selectedVehicle);
		try {
			const tour = await createTour(userId); // Creating a new tour using an API function
			setRunningTour(tour);
			showToast("Created a new tour for " + userId);
			captureWaypoint(); // Capturing the initial waypoint
			setStartTime(Date.now());
			setState("stop");
			return true;
		} catch (error) {
			showToast((error as Error).message);
			setRunningTour(undefined);
			return false;
		}
	}

	// Stop the tour
	function handleStopTour() {
		setRunningTour(undefined);
	}

	// Request location permissions on Android
	useEffect(() => {
		if (Platform.OS === "android") {
			requestLocationPermissions(); // Requesting location permissions when the component mounts
		} else {
      setPermissionGranted(true); // Granting permissions for iOS and web (TODO: implement iOS and web versions)
    }
	}, []);

	async function requestLocationPermissions() {
		let isMounted = true;
		const foregroundStatus = await Location.requestForegroundPermissionsAsync(); // Request foreground location permissions
		if (foregroundStatus.status === "granted") {
			const backgroundStatus = await Location.requestBackgroundPermissionsAsync(); // Request background location permissions
			if (isMounted && backgroundStatus.status === "granted") {
				setPermissionGranted(true);
			}
		}
		return () => (isMounted = false); // Cleanup function to prevent memory leaks
	}

	// Capture waypoints at regular intervals
	useEffect(() => {
		if (runningTour) {
			const interval = setInterval(captureWaypoint, 10000); // Capture waypoints every 10 seconds
			return () => clearInterval(interval); // Cleanup function to clear the interval
		}
	}, [runningTour]);

	async function captureWaypoint() {
		try {
			const location = await Location.getCurrentPositionAsync(); // Get the current device location
			if (runningTour) {
				const waypoint = new Coordinates(location.coords.latitude, location.coords.longitude, location.timestamp);
				const wp = await createWaypoint(runningTour, waypoint); // Create a new waypoint using an API function
				setRunningTour({ ...runningTour, waypoints: [...runningTour.waypoints, wp] });
			}
		} catch (error) {
			showToast("Error capturing waypoint: " + (error as Error).message);
		}
	}

	// Update the current time at regular intervals
	useEffect(() => {
		const interval = setInterval(() => setCurrentTime(Date.now()), 100); // Update the current time every 100 milliseconds
		return () => clearInterval(interval); // Cleanup function to clear the interval
	}, []);

	// Format elapsed time as a string
	function getFormattedTimeString(elapsedTime: number) {
		const hours = Math.floor(elapsedTime / (1000 * 60 * 60)) % 24;
		const minutes = Math.floor((elapsedTime / 60000) % 60);
		const seconds = Math.floor((elapsedTime / 1000) % 60);
		const milliseconds = Math.floor((elapsedTime % 1000) / 100);
		return `${hours}:${minutes}:${seconds}.${milliseconds}`;
	}

	// Toggle the tour button
	async function toggleButton(): Promise<void> {
		if (state === "start") {
			// Open the vehicle popup when starting the tour
			setIsVehiclePopupVisible(true);
		} else {
			setState("start");
			console.log("Stop recording tour");
			// If stopping the tour, handle it here or call another function as needed
			handleStopTour();
		}
	}

	return (
		<View style={styles.starttour_container}>
			<Text style={styles.starttour_text}>
				{runningTour ? getFormattedTimeString(currentTime - startTime) : "Press the button to start or stop a tour"}
			</Text>
			<View style={styles.starttour_mapContainer}>
				{runningTour ? (
					<Map
						selectedTour={runningTour}
						size={50}
					/>
				) : null}
			</View>
			<View style={styles.starttour_buttonContainer}>
				<Pressable
					style={styles.starttour_startButton}
					onPress={toggleButton}>
					<Text style={styles.starttour_startButtonText}>{state.toUpperCase()}</Text>
				</Pressable>
			</View>
			<VehiclePopup
				visible={isVehiclePopupVisible}
				onClose={() => setIsVehiclePopupVisible(false)}
				onSelectVehicle={(vehicle) => {
					handleVehicleSelection(vehicle); // Call handleVehicleSelection when a vehicle is selected
				}}
			/>
		</View>
	);
}
