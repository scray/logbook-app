// Import necessary modules and dependencies
import Geocoder from "react-native-geocoding"; // A library for geocoding and reverse geocoding
import * as Location from "expo-location"; // An Expo library for managing location services
import { apikey } from "./../credentials"; // Import an API key for accessing location services

// Define an asynchronous function named 'ConvertCoorToAdr' to convert coordinates to an address
export default async function ConvertCoorToAdr(longitude: number, latitude: number) {
	// Set the Google API key for Location service using the provided 'apikey'
	Location.setGoogleApiKey(apikey);

	// Log a message to indicate that the function is executing
	console.log("!!!!!!!!!!!");

	// Use Expo's Location library to perform reverse geocoding and retrieve an address
	let address = await Location.reverseGeocodeAsync({ latitude, longitude });

	// Log the retrieved address (This may contain multiple components like street, city, etc.)
	console.log("!!!!!!!!!!!" + address);

	// Initialize the Geocoder library with the provided 'apikey' and set the language to German ('de')
	Geocoder.init(apikey, { language: "de" });

	// Use the Geocoder library to convert coordinates to an address asynchronously
	return await Geocoder.from(longitude, latitude)
		.then((json) => {
			// Extract and return the short name of the first address component (e.g., street name)
			return JSON.stringify(json.results[0].address_components[0].short_name);
		})
		.catch((error) => {
			// Handle any errors that occur during the conversion process
			console.warn(error);
			return "error"; // Return an "error" message in case of an error
		});
}
