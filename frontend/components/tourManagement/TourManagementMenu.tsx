// Import necessary modules and components
import { Platform, View, Text } from "react-native";
import { createTour, createWaypoint } from "../../api/tourManagement";
import Tourlist from "./Tourlist";
import TourStartButton from "./TourStartButton";
import { useContext, useEffect,  useState } from "react";
import * as Location from "expo-location";
import Tour from "../../model/Tour";
import { Context } from "../profile/UserID";
import Coordinates from "../../model/Coordinates";
import Map from "../map/Map";
import { showToast } from "../util/Toast";
import getStyles from "../../styles/styles";

// Define the TourManagementMenu component
export default function TourManagementMenu({ loadPage }: { loadPage: string }) {
    // Initialize state variables
    const [currentTour, setCurrentTour] = useState<Tour>(); // Current tour being managed
    const [runningTour, setRunningTour] = useState<Tour>(); // Currently running tour
    const { userId, theme } = useContext(Context); // User ID and theme from context
    const [permissionGranted, setPermissionGranted] = useState(false); // Location permission flag
    const [startTime, setStartTime] = useState(0); // Start time of the tour
    const [currentTime, setCurrentTime] = useState(0); // Current time
    const styles = getStyles(theme); // Dynamic styles based on the current theme

    // Function to handle button state toggle (start/stop tour)
    async function onButtonToggle(state: string): Promise<boolean> {
        console.log(state, permissionGranted, userId);
        if (state === "start" && permissionGranted && userId) {
            console.log("Trying to start tour");
            return createTour(userId).then((tour) => {
                setRunningTour(tour);
                showToast("Created a new tour for " + userId);
                captureWaypoint();
                setStartTime(Date.now());
                return true;
            }).catch((error) => {
                showToast(error.message);
                setRunningTour(undefined);
                return false;
            });
        } else if (runningTour) {
            setRunningTour(undefined);
            return false;
        }
        return new Promise((resolve) => {
            resolve(true);
        });
    }

    // Use the useEffect hook to request location permissions on Android
    useEffect(() => {
        if (!permissionGranted && Platform.OS === "android") {
            let isMounted = true;
            Location.requestForegroundPermissionsAsync().then(({ status }) => {
                if (status === "granted") {
                    Location.requestBackgroundPermissionsAsync().then(({ status }) => {
                        if (isMounted) {
                            if (status === "granted") {
                                setPermissionGranted(true);
                            } else {
                                console.log("Background Permission NOT granted!!!");
                            }
                        }
                    });
                } else {
                    console.log("Foreground Permission NOT granted!!!");
                }
            });
            return () => {
                isMounted = false;
                setPermissionGranted(false);
            };
        }
    }, []);

    // Function to capture a waypoint
    function captureWaypoint() {
        if (runningTour) {
            console.log("Running Tour: " + JSON.stringify(runningTour) + " with userid: " + userId);
            Location.getCurrentPositionAsync().then(location => {
                if (runningTour) {
                    console.log("new waypoint: " + location.coords.latitude + ", " + location.coords.longitude);
                    createWaypoint(runningTour, new Coordinates(
                        location.coords.latitude,
                        location.coords.longitude,
                        location.timestamp
                    )).then((wp) => {
                        console.log(runningTour);
                        runningTour.waypoints.push(wp);
                        setRunningTour(runningTour);
                    }).catch((error) => {
                        showToast(error.message);
                    });
                }
            }).catch(error => {
                console.log("If you are trying to get the location via the emulator or web, this is NOT possible!", error);
            });
        }
    }

    // Use the useEffect hook to periodically capture waypoints
    useEffect(() => {
        captureWaypoint();
        const interval = setInterval(() => {
            captureWaypoint();
        }, 10000);
        return () => clearInterval(interval);
    }, [runningTour]);

    // Use the useEffect hook to update the current time
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 100);
        return () => clearInterval(interval);
    }, []);

    // Function to format elapsed time as a string
    function getFormattedTimeString(elapsedTime: number) {
        const seconds = Math.floor((elapsedTime / 1000) % 60);
        const minutes = Math.floor((elapsedTime / 1000 / 60) % 60);
        const hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);
        const milliseconds = Math.floor((elapsedTime % 1000) / 100);
        return `${hours}:${minutes}:${seconds}.${milliseconds}`;
    }

    // Render the TourManagementMenu component
    return (
        <View style={styles.tourmanagement_tourlistContainer}>
            {loadPage === "starttour" ? (
                <View>
                    {
                        runningTour && (
                            <Text style={styles.tourmanagement_text}>{getFormattedTimeString(currentTime-startTime)}</Text>
                        )
                    }
                    <View style={styles.tourmanagement_mapContainer}>
                    {
                        runningTour ? (
                            <Map selectedTour={runningTour} size={50}/>
                        ) : (
                            <Text style={styles.tourmanagement_text} numberOfLines={1}> Press the button to either start or stop a tour</Text>
                        )
                    }
                    </View>
                    <TourStartButton onPress={onButtonToggle} />
                </View>
            ) : (
                <View>
                    <Tourlist currentTour={currentTour} setCurrentTour={setCurrentTour} />
                </View>
            )}
        </View>
    )
}
