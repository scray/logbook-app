// Define a class named 'Coordinates' to represent geographic coordinates with a timestamp
export default class Coordinates {
	longitude: number; // The longitude coordinate (horizontal position on the Earth's surface)
	latitude: number; // The latitude coordinate (vertical position on the Earth's surface)
	timestamp: number; // A timestamp associated with the coordinates

	// Constructor for initializing the 'Coordinates' object with latitude, longitude, and timestamp
	public constructor(latitude: number, longitude: number, timestamp: number) {
		this.longitude = longitude; // Set the longitude coordinate
		this.latitude = latitude; // Set the latitude coordinate
		this.timestamp = timestamp; // Set the timestamp
	}

	// Method to retrieve the longitude coordinate of the 'Coordinates' object
	public getLongitude(): number {
		return this.longitude; // Return the longitude value
	}

	// Method to retrieve the latitude coordinate of the 'Coordinates' object
	public getLatitude(): number {
		return this.latitude; // Return the latitude value
	}

	// Method to retrieve the timestamp associated with the 'Coordinates' object
	public getTimestamp(): number {
		return this.timestamp; // Return the timestamp value
	}
}
