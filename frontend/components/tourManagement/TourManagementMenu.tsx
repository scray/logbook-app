import {StyleSheet, View} from "react-native";
import {createTour, createWaypoint, currentTour, setCurrentTour} from "../../api/tourManagement";
import TourStartButton from "./TourStartButton";
import {useEffect} from "react";
import * as Location from "expo-location";

export default function TourManagementMenu() {
    function onButtonToggle(state: string) {
        if (state === "start") {
            createTour("testUser").then((tour) => {
                setCurrentTour(tour)
            });
        } else if (currentTour) {
            setCurrentTour(undefined);
        }
    }

    //create a waypoint every minute
    useEffect(() => {
        const interval = setInterval(() => {
            if (currentTour) {
                Location.getCurrentPositionAsync().then(location => {
                    if (currentTour) {
                        console.log("new waypoint");
                        createWaypoint(currentTour, location);
                    }
                }).catch(error => {
                    console.log("If you are trying to get the location via the emulator or web, this is NOT possible!", error);
                })
            }
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    return (
        <View style={styles.tourlistContainer}>
            <TourStartButton onPress={onButtonToggle}/>
        </View>
    )
}

const styles = StyleSheet.create({
    tourlistContainer: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
