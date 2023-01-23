import { Platform, StyleSheet, ToastAndroid, View, Text, Button, TextInput } from "react-native";
import { createTour, createWaypoint, currentTour, setCurrentTour } from "../../api/tourManagement";
import Tourlist from "./Tourlist";
import TourStartButton from "./TourStartButton";
import { useEffect, useLayoutEffect, useState } from "react";
import * as Location from "expo-location";
import Tour from "../../model/Tour";
import Map from "../map/Map";
import { userId } from "../../api/httpRequests";

export default function TourManagementMenu({loadPage}:{loadPage:string}) {

    const [currentTour, setCurrentTour] = useState<Tour>();
    const [runningTour, setRunningTour] = useState<Tour>();
    const [permissionGranted, setPermissionGranted] = useState(false);

    async function onButtonToggle(state: string): Promise<boolean> {
        if (state === "start" && permissionGranted) {
            return createTour(userId).then((tour) => {
                setRunningTour(tour)
                return true
            }).catch((error) => {
                ToastAndroid.show(error.message, ToastAndroid.SHORT);
                setRunningTour(undefined)
                return false
            });
        } else if (currentTour) {
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
                        setPermissionGranted(true);
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
        const interval = setInterval(() => {
            console.log("Running Tour: " + JSON.stringify(runningTour))
            if (runningTour) {
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
        }, 10000);
        return () => clearInterval(interval);
    }, [runningTour])

    return(
    
        <View style={styles.tourlistContainer}>
            {loadPage === "starttour" ? (
                <View>
                    <TourStartButton onPress={onButtonToggle} />
                </View>
            ) : (
                <View>
                    <Tourlist currentTour={currentTour} setCurrentTour={setCurrentTour} />
                    <Map selectedTour={currentTour} />
                </View>
            )}
        </View>
    )
}


const styles = StyleSheet.create({
    tourlistContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: "red",
    }
});
