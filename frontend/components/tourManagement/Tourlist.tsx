// Import necessary modules and components
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import Tour from "../../model/Tour";
import { tours as tourList, updateTourList } from "../../api/tourManagement";
import React, { useContext, useEffect, useState } from "react";
import Map from "../map/Map";
import { Ionicons, Fontisto } from "@expo/vector-icons";
import { Context } from "../profile/UserID";
import * as Location from "expo-location";
import { showToast } from "../util/Toast";
import getStyles from "../../styles/styles";

// Define an interface for location details
interface location {
	city: string | null;
	district: string | null;
	streetNumber: string | null;
	street: string | null;
	region: string | null;
	subregion: string | null;
	country: string | null;
	postalCode: string | null;
	name: string | null;
	isoCountryCode: string | null;
	timezone: string | null;
}

// Define the Tourlist component
export default function Tourlist({
	currentTour,
	setCurrentTour,
}: {
	currentTour: Tour | undefined;
	setCurrentTour: (tour: Tour | undefined) => void;
}) {
	// Initialize state variables for tours, current theme, and styles
	const [tours, setTours] = useState<Tour[]>(tourList);

	// Access user context to manage user-related data
	const { userId, theme } = useContext(Context);

	// Initialize a flag to track if the component is mounted
	const [isMounted, setIsMounted] = useState(true);

	// Dynamic styles based on the current theme
	const styles = getStyles(theme);

	// Define date format options
	const options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
	};

	// Use the useEffect hook to set isMounted to false when the component unmounts
	useEffect(() => {
		return () => setIsMounted(false);
	}, []);

	// Use the useEffect hook to periodically refresh the tour list
	useEffect(() => {
		refreshTourList();
		const interval = setInterval(() => {
			refreshTourList();
		}, 10000);
		return () => clearInterval(interval);
	}, []);

	// Function to refresh the tour list
	function refreshTourList() {
		if (isMounted) {
			if (userId) {
				updateTourList(userId)
					.then((r) => {
						showToast("Tourlist updated for User ID " + userId);
						console.log("The component is mounted");
						setTours(tourList.reverse());
						console.log("The component is STILL mounted");
					})
					.catch((error) => {
						showToast(error.message);
					});
			} else {
				showToast("No User ID provided! " + userId);
			}
		}
	}

	// Initialize start and end locations
	const [startLocation, setStartLocation] = useState<location>();
	const [endLocation, setEndLocation] = useState<location>();

	// Function to load a selected tour and its start and end locations
	async function LoadTour(selectedTour: Tour) {
		setCurrentTour(selectedTour);
		const startLocation = await getLocation(selectedTour.waypoints[0].latitude, selectedTour.waypoints[0].longitude);
		if (startLocation && startLocation[0]) setStartLocation(startLocation[0]);
		const endLocation = await getLocation(
			selectedTour.waypoints[selectedTour.waypoints.length - 1].latitude,
			selectedTour.waypoints[selectedTour.waypoints.length - 1].longitude
		);
		if (endLocation && endLocation[0]) setEndLocation(endLocation[0]);
	}

	// Function to get location details based on latitude and longitude
	const getLocation = async (latitude: number, longitude: number) => {
		return await Location.reverseGeocodeAsync({ latitude: latitude, longitude: longitude }).then((location) => {
			if (location) return location;
		});
	};

	// Render the Tourlist component
	return (
		<View style={styles.tourlist_tourlistContainer}>
			{currentTour && currentTour.waypoints && currentTour.waypoints.length >= 1 ? (
				<View style={styles.tourlist_detailedTourContainer}>
					<View style={styles.tourlist_detailContainer}>
						<TouchableOpacity onPress={() => setCurrentTour(undefined)}>
							<Ionicons
								style={styles.tourlist_text}
								name="backspace-outline"
								size={40}
							/>
						</TouchableOpacity>
						<Text style={styles.tourlist_detailText}> {"Tour ID: " + currentTour.tourId} </Text>
						<Text style={styles.tourlist_detailText}> {"User ID: " + currentTour.userId} </Text>
						<Text style={styles.tourlist_detailText}>
							{" "}
							{startLocation?.street + " " + startLocation?.streetNumber + ", " + startLocation?.city + " " + startLocation?.country}
						</Text>
						<Text style={styles.tourlist_detailText}>
							{" "}
							{endLocation?.street + " " + endLocation?.streetNumber + ", " + endLocation?.city + " " + endLocation?.country}
						</Text>
						<Text style={styles.tourlist_detailText}>
							{" "}
							{"Time: " +
								new Date(currentTour.waypoints[0].timestamp).toLocaleDateString("de-DE", options) +
								" - " +
								new Date(currentTour.waypoints[currentTour.waypoints.length - 1].timestamp).toLocaleDateString("de-DE", options)}{" "}
						</Text>
					</View>
					<Map
						selectedTour={currentTour}
						size={52}
					/>
				</View>
			) : (
				<View style={styles.tourlist_tourlistContainer}>
					<View style={styles.tourlist_container}>
						<Text style={[styles.tourlist_headline, styles.tourlist_text]}>Tours: </Text>
						<TouchableOpacity
							onPress={() => {
								refreshTourList();
							}}
							style={styles.tourlist_refreshButtonContainer}>
							<Ionicons
								name="ios-refresh"
								size={28}
								color="#fff"
							/>
						</TouchableOpacity>
					</View>
					<ScrollView style={styles.tourlist_scrollView}>
						{tours &&
							tours.map((tour, index) => {
								if (tour.waypoints && tour.waypoints.length >= 1) {
									let date1 = new Date(tour.waypoints[0].timestamp).toLocaleString("de-DE", options);
									let date2 = new Date(tour.waypoints[tour.waypoints.length - 1].timestamp).toLocaleString("de-DE", options);
									return (
										<TouchableOpacity
											key={index}
											style={styles.tourlist_buttonContainer}
											onPress={() => {
												LoadTour(tour);
											}}>
											<Text style={[styles.tourlist_tourId, styles.tourlist_text]}> {tour.tourId}</Text>
											<View style={styles.tourlist_buttonTextContainer}>
												{" "}
												<Text style={[styles.tourlist_buttonText, styles.tourlist_text]}>{date1}</Text>
												<Text style={[styles.tourlist_buttonText, styles.tourlist_text]}>{date2}</Text>
											</View>
											<Fontisto
												style={styles.tourlist_text}
												name="arrow-v"
												size={28}
												color="black"
											/>
										</TouchableOpacity>
									);
								}
							})}
					</ScrollView>
				</View>
			)}
		</View>
	);
}
