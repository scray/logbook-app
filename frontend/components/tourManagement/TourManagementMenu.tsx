import {StyleSheet, ToastAndroid, View} from "react-native";
import {createTour, createWaypoint, currentTour, setCurrentTour} from "../../api/tourManagement";
import TourStartButton from "./TourStartButton";
import {useEffect} from "react";
import * as Location from "expo-location";

export default function TourManagementMenu() {
    async function onButtonToggle(state: string): Promise<boolean> {
        if (state === "start") {
            return createTour("testUser").then((tour) => {
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
    useEffect(() => {
        const interval = setInterval(() => {
            if (currentTour) {
                Location.getCurrentPositionAsync().then(location => {
                    if (currentTour) {
                        console.log("new waypoint");
                        createWaypoint(currentTour, location).then((waypoint) => {
                            console.log(waypoint);
                        }).catch((error) => {
                            ToastAndroid.show(error.message, ToastAndroid.SHORT);
                        });
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
        alignItems: 'center',
        justifyContent: 'center',
    },
});
