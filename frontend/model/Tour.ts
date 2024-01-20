// Import necessary modules and components
import Coordinates from "./Coordinates";

// Define an interface named 'Tour' to represent tour-related data
interface Tour {
	userId: string; // A string representing the user ID associated with the tour
	tourId: string; // A string representing the unique identifier of the tour
	waypoints: Array<Coordinates>; // An array of 'Coordinates' representing the waypoints or locations of the tour
}

// Export the 'Tour' interface for use in other parts of the application
export default Tour;
