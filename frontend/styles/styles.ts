// Import necessary functions and components
import { StyleSheet } from "react-native";
import { Theme } from "./theme";

// Define getStyles function, which takes a theme and an optional page parameter
const getStyles = (theme: Theme, page: string = "") =>
	StyleSheet.create({
		// App.tsx styles
		app_container: {
			flex: 1,
			width: "100%",
			height: "100%",
			maxHeight: "100%",
			flexDirection: "row",
			backgroundColor: theme.background,
			color: theme.fontColor,
		},
		// Overview.tsx styles
		overview_container: {
			flex: 1,
			width: "100%",
			flexDirection: "row",
			backgroundColor: theme.background,
		},
		overview_containerInner: {
			backgroundColor: theme.background,
			flex: 1,
			marginTop: 32,
			marginRight: 32,
			marginBottom: 32,
			paddingLeft: 32,
			paddingTop: 32,
			paddingRight: 32,
			borderRadius: 25,
			flexDirection: "row",
		},
		// Wallet.tsx styles
		wallet_container: {
			flex: 1,
			width: "100%",
			paddingLeft: 340,
			paddingTop: 32,
		},
		wallet_containerInner: {
			backgroundColor: theme.innerBackground,
			flex: 1,
			marginTop: 32,
			marginRight: 32,
			marginBottom: 32,
			paddingLeft: 32,
			paddingTop: 32,
			paddingRight: 32,
			borderRadius: 25,
			flexDirection: "row",
			shadowOpacity: 0.1,
			shadowOffset: { width: 1, height: 1 },
			shadowRadius: 5,
		},
		wallet_containerInner2: {
			flex: 1,
			flexDirection: "column",
		},
		wallet_containerContent: {
			backgroundColor: theme.contentBackground,
			paddingLeft: 28,
			paddingBottom: 28,
			paddingTop: 28,
			paddingRight: 28,
			marginRight: 20,
			marginBottom: 28,
			borderRadius: 25,
			justifyContent: "space-evenly",
			position: "relative",
			shadowOpacity: 0.1,
			shadowOffset: { width: 1, height: 1 },
			shadowRadius: 5,
		},
		wallet_innerContainerContent: {
			flexDirection: "row",
			justifyContent: "space-evenly",
			marginBottom: 2,
		},
		wallet_title: {
			fontSize: 38,
			fontWeight: "700",
			textAlign: "left",
			color: theme.titleColor,
		},
		wallet_inputContainer: {
			flex: 1,
			width: 280,
			justifyContent: "flex-end",
		},
		wallet_label: {
			fontSize: 18,
			marginRight: 10,
			color: theme.fontColor,
		},
		wallet_input: {
			padding: 10,
			borderWidth: 1,
			borderColor: theme.primary,
			borderRadius: 10,
			fontSize: 14,
			color: theme.fontColor,
			backgroundColor: theme.input,
		},
		wallet_saveButton: {
			backgroundColor: theme.primary,
			borderRadius: 10,
			paddingVertical: 10,
			paddingHorizontal: 20,
			marginTop: 12,
			width: 280,
			justifyContent: "flex-end",
		},
		wallet_saveButtonTitle: {
			color: theme.button2,
			fontSize: 16,
			fontWeight: "600",
			textAlign: "center",
		},
		wallet_userTitle: {
			color: theme.fontColor,
			fontSize: 24,
			fontWeight: "700",
			textAlign: "center",
			paddingTop: 18,
		},
		wallet_blockTitle: {
			marginLeft: 10,
			marginBottom: 10,
			color: theme.primary,
			fontSize: 24,
			fontWeight: "700",
			textAlign: "center",
		},
		wallet_settingRow: {
			flexDirection: "row",
			justifyContent: "space-between",
			marginVertical: 10,
		},
		wallet_settingText: {
			color: theme.titleColor,
			fontSize: 18,
		},
		wallet_text: {
			// paddingRight  : 24,
			fontSize: 16,
			textAlign: "center",
			color: theme.fontColor,
		},
		wallet_numberStyle: {
			fontSize: 48,
			color: theme.secondary,
			fontWeight: "700",
			textAlign: "center",
		},
		wallet_picker: {
			width: "100%",
			flexDirection: "row",
		},
		wallet_horizontalLine: {
			borderBottomColor: theme.navFontColor,
			borderBottomWidth: 2,
			marginVertical: 10,
			textAlign: "center",
			width: 82,
		},
		// Tourlist.tsx styles
		tourlist_tourlistContainer: {
			flex: 1,
			alignItems: "center",
			justifyContent: "center",
			overflow: "hidden",
			maxHeight: "80vh",
		},
		tourlist_container: {
			flexDirection: "row",
			padding: 10,
			alignItems: "center",
			borderRadius: 10,
			borderWidth: 2,
			marginRight: "auto",
			backgroundColor: theme.contentBackground,
		},
		tourlist_headline: {
			fontSize: 30,
		},
		tourlist_scrollView: {
			flex: 1,
			width: "100%",
			maxHeight: "100%",
		},
		tourlist_buttonContainer: {
			flex: 1,
			flexDirection: "row",
			width: "100%",
			padding: 10,
			marginVertical: 5,
			alignItems: "center",
			borderRadius: 10,
			borderWidth: 2,
			backgroundColor: theme.contentBackground,
		},
		tourlist_tourId: {
			fontSize: 20,
			paddingRight: 2,
			marginRight: 10,
			fontWeight: "bold",
		},
		tourlist_text: {
			color: theme.fontColor,
		},
		tourlist_buttonTextContainer: {
			flex: 1,
			marginLeft: 10, // Adjust the margin as needed
			justifyContent: "center", // Vertically center the text
		},
		tourlist_buttonText: {
			fontSize: 18,
			color: theme.fontColor,
		},
		tourlist_refreshButtonContainer: {
			backgroundColor: theme.primary,
			borderRadius: 20,
			padding: 10,
			alignItems: "center",
			justifyContent: "center",
		},
		tourlist_detailedTourContainer: {
			maxHeight: "100%",
			maxWidth: "100%",
			padding: 10,
		},
		tourlist_detailContainer: {
			maxWidth: "95%",
		},
		tourlist_adressContainer: {
			flex: 1,
			flexDirection: "row",
		},
		tourlist_detailText: {
			fontSize: 18,
			borderBottomWidth: 1,
			paddingBottom: 5,
			paddingLeft: 2,
		},
		// TourManagementMenu.tsx styles
		tourmanagement_tourlistContainer: {
			flex: 1,
			alignItems: "center",
			justifyContent: "center",
			padding: 10,
		},
		tourmanagement_text: {
			textAlign: "center",
			fontSize: 26,
			fontWeight: "500",
			color: theme.fontColor,
		},
		tourmanagement_mapContainer: {
			padding: 30,
		},
		// TourStartButton.tsx styles
		tourstart_container: {
			alignItems: "center",
			justifyContent: "center",
		},
		tourstart_startButton: {
			backgroundColor: theme.primary,
			padding: 10,
			borderRadius: 10,
			width: 280,
		},
		tourstart_startButtonText: {
			color: theme.button2,
			fontSize: 16,
			fontWeight: "600",
			textAlign: "center",
		},
		// navigationBar.tsx styles
		nav_container: {
			width: 300,
			backgroundColor: theme.innerBackground,
			position: "absolute",
			left: 0,
			top: 0,
			height: "100%",
			zIndex: 2,
			flexDirection: "column",
			justifyContent: "flex-end",
			paddingLeft: 60,
			paddingBottom: 100,
			shadowOpacity: 0.1,
			shadowOffset: { width: 1, height: 1 },
			shadowRadius: 5,
		},
		nav_photo: {
			width: 176.49,
			height: 112.44,
			marginBottom: 240,
		},
		nav_navItem: {
			flexDirection: "row",
			alignItems: "center",
			padding: 10,
			fontSize: 18,
			fontWeight: "600",
		},
		nav_btnText: {
			marginLeft: 10,
			color: theme.secondary,
			fontSize: 18,
			fontWeight: "600",
		},
		nav_btn1: {
			color: page === "starttour" ? theme.primary : theme.navFontColor,
		},
		nav_btn2: {
			color: page === "tourmanagment" ? theme.primary : theme.navFontColor,
		},
		nav_btn3: {
			color: page === "wallet" ? theme.primary : theme.navFontColor,
		},
		// ProfilePicture.tsx
		profile_image: {
			width: 100,
			height: 100,
			borderRadius: 200,
		},
	});

// Export the getStyles function for use in other parts of the application
export default getStyles;
