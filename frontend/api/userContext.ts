// Import necessary modules and components
import { Theme } from "../styles/theme";

// Define the 'UserContext' interface
export default interface UserContext {
	userId: string; // A string representing the user's ID
	setUserId: React.Dispatch<React.SetStateAction<string>>; // A function to set the user's ID
	theme: Theme; // A 'Theme' object representing the current theme
	setTheme: (theme: Theme) => Promise<void>; // An asynchronous function to set the theme
}
