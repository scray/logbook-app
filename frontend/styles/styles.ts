// Import necessary functions and components
import { StyleSheet, Dimensions } from "react-native";
import { Theme } from "./theme";

// Get screen dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Function to scale sizes based on screen width
const scaleSize = (size: number) => (size * screenWidth) / 1600; // Base width of 1080

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
		app_containerInner: {
			backgroundColor: theme.background,
			flex: 1,
			marginTop: scaleSize(32),
			marginRight: scaleSize(32),
			marginBottom: scaleSize(32),
			paddingLeft: scaleSize(32),
			paddingTop: scaleSize(32),
			paddingRight: scaleSize(32),
			borderRadius: scaleSize(25),
			flexDirection: "row",
		},

		// Overview.tsx styles
		overview_tourlistContainer: {
			flex: 1,
			alignItems: "center",
			justifyContent: "center",
			padding: scaleSize(10),
		},
		// StartTour.tsx styles
		starttour_container: {
			flex: 1,
			alignItems: "center",
			justifyContent: "center",
			padding: scaleSize(10),
		},
		starttour_text: {
			textAlign: "center",
			fontSize: scaleSize(26),
			fontWeight: "500",
			color: theme.fontColor,
		},
		starttour_mapContainer: {
			padding: scaleSize(30),
		},
		starttour_buttonContainer: {
			alignItems: "center",
			justifyContent: "center",
		},
		starttour_startButton: {
			backgroundColor: theme.primary,
			padding: scaleSize(10),
			borderRadius: scaleSize(10),
			width: scaleSize(280),
		},
		starttour_startButtonText: {
			color: theme.button2,
			fontSize: scaleSize(16),
			fontWeight: "600",
			textAlign: "center",
		},
		// Wallet.tsx styles
		wallet_container: {
			flex: 1,
			width: "100%",
			paddingLeft: scaleSize(340),
			// paddingTop: scaleSize(32),
		},
		wallet_containerInner: {
			backgroundColor: theme.innerBackground,
			flex: 1,
			marginTop: scaleSize(32),
			marginRight: scaleSize(32),
			// marginBottom: 32,
			paddingLeft: scaleSize(32),
			paddingTop: scaleSize(32),
			paddingRight: scaleSize(32),
			borderRadius: scaleSize(25),
			flexDirection: "row",
			shadowOpacity: 0.1,
			shadowOffset: { width: 1, height: 1 },
			shadowRadius: scaleSize(5),
		},
		wallet_containerInner2: {
			flex: 1,
			flexDirection: "column",
		},
		wallet_containerContent: {
			backgroundColor: theme.contentBackground,
			paddingLeft: scaleSize(28),
			paddingBottom: scaleSize(28),
			paddingTop: scaleSize(28),
			paddingRight: scaleSize(28),
			marginRight: scaleSize(20),
			marginBottom: scaleSize(28),
			borderRadius: scaleSize(25),
			justifyContent: "space-evenly",
			position: "relative",
			shadowOpacity: 0.1,
			shadowOffset: { width: 1, height: 1 },
			shadowRadius: scaleSize(5),
		},
		wallet_innerContainerContent: {
			flexDirection: "row",
			justifyContent: "space-evenly",
			marginBottom: scaleSize(2),
		},
		wallet_title: {
			fontSize: scaleSize(38),
			fontWeight: "700",
			textAlign: "left",
			color: theme.titleColor,
		},
		wallet_inputContainer: {
			flex: 1,
			width: scaleSize(280),
			justifyContent: "flex-end",
		},
		wallet_label: {
			fontSize: scaleSize(18),
			marginRight: scaleSize(10),
			color: theme.fontColor,
		},
		wallet_input: {
			padding: scaleSize(10),
			borderWidth: 1,
			borderColor: theme.primary,
			borderRadius: scaleSize(10),
			fontSize: scaleSize(14),
			color: theme.fontColor,
			backgroundColor: theme.input,
		},
		wallet_saveButton: {
			backgroundColor: theme.primary,
			borderRadius: scaleSize(10),
			paddingVertical: scaleSize(10),
			paddingHorizontal: scaleSize(20),
			marginTop: scaleSize(12),
			width: scaleSize(280),
			justifyContent: "flex-end",
		},
		wallet_saveButtonTitle: {
			color: theme.button2,
			fontSize: scaleSize(16),
			fontWeight: "600",
			textAlign: "center",
		},
		wallet_userTitle: {
			color: theme.fontColor,
			fontSize: scaleSize(24),
			fontWeight: "700",
			textAlign: "center",
			paddingTop: scaleSize(18),
		},
		wallet_blockTitle: {
			marginLeft: scaleSize(10),
			marginBottom: scaleSize(10),
			color: theme.primary,
			fontSize: scaleSize(24),
			fontWeight: "700",
			textAlign: "center",
		},
		wallet_settingRow: {
			flexDirection: "row",
			justifyContent: "space-between",
			marginVertical: scaleSize(10),
		},
		wallet_settingText: {
			color: theme.titleColor,
			fontSize: scaleSize(18),
		},
		wallet_text: {
			fontSize: scaleSize(16),
			textAlign: "center",
			color: theme.fontColor,
		},
		wallet_numberStyle: {
			fontSize: scaleSize(48),
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
			borderBottomWidth: scaleSize(2),
			marginVertical: scaleSize(10),
			textAlign: "center",
			width: scaleSize(82),
		},
		// Tourlist.tsx styles
		tourlist_tourlistContainer: {
			flex: 1,
			alignItems: "center",
			justifyContent: "center",
			overflow: "hidden",
			maxHeight: "80vh", // vh is a relative unit, but you might need a different strategy for native mobile
		},
		tourlist_container: {
			flexDirection: "row",
			padding: scaleSize(10),
			alignItems: "center",
			borderRadius: scaleSize(10),
			borderWidth: scaleSize(2),
			marginRight: "auto",
			backgroundColor: theme.contentBackground,
		},
		tourlist_headline: {
			fontSize: scaleSize(30),
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
			padding: scaleSize(10),
			marginVertical: scaleSize(5),
			alignItems: "center",
			borderRadius: scaleSize(10),
			borderWidth: scaleSize(2),
			backgroundColor: theme.contentBackground,
		},
		tourlist_tourId: {
			fontSize: scaleSize(20),
			paddingRight: scaleSize(2),
			marginRight: scaleSize(10),
			fontWeight: "bold",
		},
		tourlist_text: {
			color: theme.fontColor,
		},
		tourlist_buttonTextContainer: {
			flex: 1,
			marginLeft: scaleSize(10),
			justifyContent: "center",
		},
		tourlist_buttonText: {
			fontSize: scaleSize(18),
			color: theme.fontColor,
		},
		tourlist_refreshButtonContainer: {
			backgroundColor: theme.primary,
			borderRadius: scaleSize(20),
			padding: scaleSize(10),
			alignItems: "center",
			justifyContent: "center",
		},
		tourlist_detailedTourContainer: {
			maxHeight: "100%",
			maxWidth: "100%",
			padding: scaleSize(10),
		},
		tourlist_detailContainer: {
			maxWidth: "95%",
		},
		tourlist_adressContainer: {
			flex: 1,
			flexDirection: "row",
		},
		tourlist_detailText: {
			fontSize: scaleSize(18),
			borderBottomWidth: scaleSize(1),
			paddingBottom: scaleSize(5),
			paddingLeft: scaleSize(2),
		},
		// navigationBar.tsx styles
		nav_container: {
			width: scaleSize(300),
			backgroundColor: theme.contentBackground,
			position: "absolute",
			left: 0,
			top: 0,
			height: "100%",
			zIndex: 2,
			flexDirection: "column",
			justifyContent: "flex-end",
			paddingLeft: scaleSize(60),
			paddingBottom: scaleSize(100),
			shadowOpacity: 0.1,
			shadowOffset: { width: 1, height: 1 },
			shadowRadius: scaleSize(5),
		},
		nav_photo: {
			width: scaleSize(176.49),
			height: scaleSize(112.44),
			marginBottom: scaleSize(240),
		},
		nav_navItem: {
			flexDirection: "row",
			alignItems: "center",
			padding: scaleSize(10),
			fontSize: scaleSize(18),
			fontWeight: "600",
		},
		nav_btnText: {
			marginLeft: scaleSize(10),
			color: theme.secondary,
			fontSize: scaleSize(18),
			fontWeight: "600",
		},
		nav_btn1: {
			color: page === "starttour" ? theme.primary : theme.navFontColor,
		},
		nav_btn2: {
			color: page === "overview" ? theme.primary : theme.navFontColor,
		},
		nav_btn3: {
			color: page === "wallet" ? theme.primary : theme.navFontColor,
		},
		// ProfilePicture.tsx
		profile_image: {
			width: scaleSize(100),
			height: scaleSize(100),
			borderRadius: scaleSize(200),
		},
		// VehiclePopup.tsx styles
		vehicles_title: {
			marginBottom: scaleSize(10),
			color: theme.primary,
			fontSize: scaleSize(24),
			fontWeight: "700",
			textAlign: "center",
		},
		vehicles_item: {
			flex: 1,
			flexDirection: "row",
			justifyContent: "space-between",
			padding: scaleSize(10),
			marginVertical: scaleSize(8),
			backgroundColor: theme.innerBackground,
			borderRadius: scaleSize(5),
			alignItems: "center",
		},
		vehicles_text: {
			fontSize: scaleSize(16),
			paddingRight: scaleSize(10),
			color: theme.textVehicle,
			fontWeight: "700",
		},
		vehicles_buttonClose: {
			backgroundColor: theme.button3,
			borderRadius: scaleSize(15),
			width: scaleSize(30),
			height: scaleSize(30),
			justifyContent: "center",
			alignContent: "center",
			padding: scaleSize(4),
			position: "absolute",
			top: scaleSize(5),
			right: scaleSize(5),
		},
		vehicles_buttonCloseText: {
			textAlign: "center",
			fontSize: scaleSize(15),
			fontWeight: "700",
			color: "white",
			fontFamily: "arial",
		},
		vehicles_buttonSubmit: {
			backgroundColor: theme.primary,
			borderRadius: scaleSize(10),
			paddingVertical: scaleSize(10),
			paddingHorizontal: scaleSize(20),
			justifyContent: "flex-end",
		},
		vehicles_buttonSubmitText: {
			color: theme.button2,
			fontSize: scaleSize(16),
			fontWeight: "600",
			textAlign: "center",
		},
		vehicles_buttonSelect: {
			backgroundColor: theme.primary,
			borderRadius: scaleSize(5),
			paddingVertical: scaleSize(10),
			paddingHorizontal: scaleSize(20),
			justifyContent: "flex-end",
		},
		vehicles_buttonSelectText: {
			color: theme.button2,
			fontSize: scaleSize(16),
			fontWeight: "600",
			textAlign: "center",
		},
		vehicles_formContainer: {
			marginTop: scaleSize(40),
			marginRight: scaleSize(100),
			alignSelf: "flex-end",
			justifyContent: "center",
			padding: scaleSize(10),
			backgroundColor: theme.contentBackground,
			borderRadius: scaleSize(15),
			width: scaleSize(350),
			height: scaleSize(680),
			shadowOpacity: 0.1,
			shadowOffset: { width: 1, height: 1 },
			shadowRadius: scaleSize(5),
			//borderWidth: scaleSize(2),
			//borderColor: theme.fontColor,
		},
		vehicles_input: {
			padding: scaleSize(10),
			marginTop: scaleSize(10),
			marginBottom: scaleSize(10),
			borderWidth: scaleSize(1),
			borderColor: theme.primary,
			borderRadius: scaleSize(10),
			fontSize: scaleSize(14),
			color: theme.fontColor,
			backgroundColor: theme.input,
		},
		vehicles_valueContainer: {
			flexDirection: "row",
			alignItems: "center",
			marginBottom: scaleSize(10),
		},
	});

// Export the getStyles function for use in other parts of the application
export default getStyles;
