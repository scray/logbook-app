import { Platform, StyleSheet, ToastAndroid, View, Text } from "react-native";
import { createTour, createWaypoint } from "../../api/tourManagement";
import Tourlist from "./Tourlist";
import TourStartButton from "./TourStartButton";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import * as Location from "expo-location";
import Tour from "../../model/Tour";
import { Context } from "../profile/UserID";
import * as TaskManager from "expo-task-manager";
import Coordinates from "../../model/Coordinates";
import Map from "../map/Map";

export default function TourManagementMenu({ loadPage }: { loadPage: string }) {
    const [currentTour, setCurrentTour] = useState<Tour>();
    const [runningTour, setRunningTour] = useState<Tour>();
    const { userId, setUserId, theme } = useContext(Context);
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [startTime, setStartTime] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    async function onButtonToggle(state: string): Promise<boolean> {
        console.log(state, permissionGranted, userId)
        if (state === "start" && permissionGranted && userId) {
            console.log("Trying to start tour")
            return createTour(userId).then((tour) => {
                setRunningTour(tour)
                ToastAndroid.show("Created new tour for " + userId, ToastAndroid.SHORT);
                captureWaypoint();
                setStartTime(Date.now())
                return true
            }).catch((error) => {
                ToastAndroid.show(error.message, ToastAndroid.SHORT);
                setRunningTour(undefined)
                return false
            });
        } else if (runningTour) {
            setRunningTour(undefined);
            return false;
        }
        return new Promise((resolve) => {
            resolve(true)
        })
    }

    useEffect(() => {
        if (!permissionGranted && Platform.OS === "android") {
            let isMounted = true;
            Location.requestForegroundPermissionsAsync().then(({status}) => {
                if (status === "granted") {
                    Location.requestBackgroundPermissionsAsync().then(({status}) => {
                        if(isMounted){
                            if (status === "granted") {
                            setPermissionGranted(true);
                            } else {
                            console.log("Background Permission NOT granted!!!")
                            }
                        }
                    })
                } else {
                    console.log("Foreground Permission NOT granted!!!")
                }
            })
            return()=>{
                isMounted= false;
                setPermissionGranted(false);
            }
        }
    }, []);

    function captureWaypoint() {
        if (runningTour) {
            console.log("Running Tour: " + JSON.stringify(runningTour) + " with userid: " + userId)
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
                        ToastAndroid.show(error.message, ToastAndroid.SHORT);
                    });
                }
            }).catch(error => {
                console.log("If you are trying to get the location via the emulator or web, this is NOT possible!", error);
            })
        }
    }

    useEffect(() => {
        captureWaypoint();
        const interval = setInterval(() => {
            captureWaypoint();
        }, 10000);
        return () => clearInterval(interval);
    }, [runningTour])
    
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Date.now())
        }, 100);
        return () => clearInterval(interval);
    }, []);

    const styles = StyleSheet.create({
        tourlistContainer: {
            flex: 1,
            alignItems: 'center',
            justifyContent: "center",
            padding: 10,
        },
        text: {
            textAlign: 'center',
            fontSize: 26,
            fontWeight: '500',
            color: '#1D1D1D'
        },
        mapContainer: {
            padding: 30,

        }
    });

    function getFormattedTimeString(elapsedTime:number) {
        const seconds = Math.floor((elapsedTime / 1000) % 60);
        const minutes = Math.floor((elapsedTime / 1000 / 60) % 60);
        const hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);
        const milliseconds = Math.floor((elapsedTime % 1000) / 100);
        return `${hours}:${minutes}:${seconds}.${milliseconds}`;
    }

    return (
        <View style={styles.tourlistContainer}>
            {loadPage === "starttour" ? (
                <View>
                    {
                        runningTour && (
                            <Text style={styles.text}>{getFormattedTimeString(currentTime-startTime)}</Text>
                        )
                    }
                    <View style={styles.mapContainer}>
                    {
                        runningTour ? (
                            <Map selectedTour={runningTour} size={50}/>
                        ) : (
                            <Text style={styles.text} numberOfLines={1}> Press the button to either start or stop a tour</Text>
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
