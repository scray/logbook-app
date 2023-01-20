import {Platform, StyleSheet, ToastAndroid, View, Text} from "react-native";
import {createTour, createWaypoint, currentTour, setCurrentTour} from "../../api/tourManagement";
import Tourlist from "./Tourlist";
import TourStartButton from "./TourStartButton";
import {useEffect, useLayoutEffect, useState} from "react";
import * as Location from "expo-location";
import Tour from "../../model/Tour";
import Map from "../map/Map";

export default function TourManagementMenu() {
    
    const [currentTour, setCurrentTour] = useState<Tour>();
    const [permissionGranted, setPermissionGranted] = useState(false);

    async function onButtonToggle(state: string): Promise<boolean> {
        if (state === "start" && permissionGranted) {
            return createTour("Felix").then((tour) => {
                setCurrentTour(tour)
                return true
            }).catch((error) => {
                ToastAndroid.show(error.message, ToastAndroid.SHORT);
                setCurrentTour(undefined)
                return false
            });
        } else if (currentTour) {
            setCurrentTour(undefined);
        }
        return new Promise((resolve) => {
            resolve(true)
        })
    }

    //create a waypoint every minute
    useLayoutEffect(() => {
        (async() => {
            if(!permissionGranted && Platform.OS === "android"){
                let {status} = await Location.requestForegroundPermissionsAsync();
                if(status === "granted"){
                    setPermissionGranted(true);
                    console.log("Permission granted!!! Status:" + permissionGranted)
                }else{
                    console.log("Permission NOT granted!!!")
                }
            }
        })()
    }, []);

    useEffect(() => {
        console.log("Ja Dinge")
        const interval = setInterval(() => {
            console.log("Current Tour: " + JSON.stringify(currentTour))
            if (currentTour) {
                Location.getCurrentPositionAsync().then(location => {
                    if (currentTour) {
                        console.log("new waypoint: " + location.coords.latitude + ", " + location.coords.longitude);
                        createWaypoint(currentTour, location).then((waypoint) => {
                            console.log("Returned Waypoint from Rest-API: " + waypoint);
                        }).catch((error) => {
                            ToastAndroid.show(error.message, ToastAndroid.SHORT);
                        });
                    }
                }).catch(error => {
                    console.log("If you are trying to get the location via the emulator or web, this is NOT possible!", error);
                })
            }
        }, 10000);
        return () => clearInterval(interval);
    },[])

    return (
        <View style={styles.tourlistContainer}>
            <TourStartButton onPress={onButtonToggle}/>
            <Text style={styles.text}> Permission Status: { permissionGranted } bla</Text>
            <Tourlist currentTour={currentTour} setCurrentTour={setCurrentTour}/>
            <Map selectedTour={currentTour}/>
        </View>
    )
}

const styles = StyleSheet.create({
    tourlistContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text:{
        color: "red",
    }
});
