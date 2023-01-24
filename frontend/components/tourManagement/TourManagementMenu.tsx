import { Platform, StyleSheet, ToastAndroid, View, Text } from "react-native";
import { createTour, createWaypoint } from "../../api/tourManagement";
import Tourlist from "./Tourlist";
import TourStartButton from "./TourStartButton";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import * as Location from "expo-location";
import Tour from "../../model/Tour";
import {theme} from "../../api/theme";
import { Context } from "../profile/UserID";

export default function TourManagementMenu({ loadPage }: { loadPage: string }) {

    const [currentTour, setCurrentTour] = useState<Tour>();
    const [runningTour, setRunningTour] = useState<Tour>();
    const { userId, setUserId } = useContext(Context);
    let permissionGranted = false;

    async function onButtonToggle(state: string): Promise<boolean> {
        if (state === "start" && permissionGranted && userId) {
            return createTour(userId).then((tour) => {
                setRunningTour(tour)
                ToastAndroid.show("Created new tour for " + userId, ToastAndroid.SHORT);
                return true
            }).catch((error) => {
                ToastAndroid.show(error.message, ToastAndroid.SHORT);
                setRunningTour(undefined)
                return false
            });
        } else if (runningTour) {
            setRunningTour(undefined);
        }
        return new Promise((resolve) => {
            resolve(true)
        })
    }

    //create a waypoint every 10 seconds
    useLayoutEffect(() => {
        (async () => {

            if (!permissionGranted && Platform.OS === "android") {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status === "granted") {
                    let { status } = await Location.requestBackgroundPermissionsAsync();
                    if (status === "granted") {
                        permissionGranted = true;
                        console.log("Permission granted!!! Status:" + permissionGranted)
                    } else {
                        console.log("Background Permission NOT granted!!!")
                    }
                } else {
                    console.log("Foreground Permission NOT granted!!!")
                }
            }

        })()
    }, []);

    useEffect(() => {
        function captureWaypoint() {
            if (runningTour) {
                console.log("Running Tour: " + JSON.stringify(runningTour) + " with userid: " + userId)
                Location.getCurrentPositionAsync().then(location => {
                    if (runningTour) {
                        console.log("new waypoint: " + location.coords.latitude + ", " + location.coords.longitude);
                        createWaypoint(runningTour, location).catch((error) => {
                            ToastAndroid.show(error.message, ToastAndroid.SHORT);
                        });
                    }
                }).catch(error => {
                    console.log("If you are trying to get the location via the emulator or web, this is NOT possible!", error);
                })
            }
        }
        captureWaypoint();
        const interval = setInterval(() => {
            captureWaypoint();
        }, 10000);
        return () => clearInterval(interval);
    }, [runningTour])

    return (

        <View style={styles.tourlistContainer}>
            {loadPage === "starttour" ? (
                <View>
                    <Text style={styles.text}> Press the button to either start or stop a tour.</Text>
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


const styles = StyleSheet.create({
    tourlistContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "center",
    },
    text: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.fontColor
    },
});
