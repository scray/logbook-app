// Define the 'Theme' interface to specify the structure of theme objects
export interface Theme {
	primary: string;
	secondary: string;
	tertiary: string;
	textVehicle: string;
	button1: string;
	button2: string;
	button3: string;
	fontColor: string;
	navFontColor: string;
	titleColor: string;
	backgroundGradient: string[];
	background: string;
	innerBackground: string;
	contentBackground: string;
	input: string;
}

// These theme objects provide color values that can be used for consistent styling throughout the application.
// Themes allow users to switch between different visual styles, such as light and dark themes, for a personalized user experience.

// Define a 'lightTheme' object that adheres to the 'Theme' interface
export const lightTheme: Theme = {
	primary: "#08AEA7",
	secondary: "#0092C8",
	tertiary: "#ccc",
	textVehicle: "#1D1D1D",
	button1: "#00a897",
	button2: "#FFFFFF",
	button3: "#AD4109",
	fontColor: "#1e1e1e",
	navFontColor: "#C1BDBD",
	titleColor: "#1D1D1D",
	backgroundGradient: ["#a3ffd6", "#ffffff", "#84dcc6"],
	background: "#F6F6F6",
	innerBackground: "#F0F4F3",
	contentBackground: "#FFFFFF",
	input: "#FFFFFF",
};

// Define a 'darkTheme' object that adheres to the 'Theme' interface
export const darkTheme: Theme = {
	primary: "#08AEA7",
	secondary: "#0092C8",
	tertiary: "#ccc",
	textVehicle: "#FFFFFF",
	button1: "#2ec2b3",
	button2: "#FFFFFF",
	button3: "#AD4109",
	fontColor: "#C1BDBD",
	navFontColor: "#C1BDBD",
	titleColor: "#C1BDBD",
	backgroundGradient: ["#27365d", "#1e2a4a", "#1e2a4a"],
	background: "#141414",
	innerBackground: "#1e1e1e",
	contentBackground: "#333333",
	input: "#1e1e1e",
};
