import {Platform, StyleSheet, ToastAndroid, View, Text, Button, TextInput} from "react-native";
import {createTour, createWaypoint, currentTour, setCurrentTour} from "../../api/tourManagement";
import Tourlist from "./Tourlist";
import TourStartButton from "./TourStartButton";
import {useEffect, useLayoutEffect, useState} from "react";
import * as Location from "expo-location";
import Tour from "../../model/Tour";
import Map from "../map/Map";
import { userId } from "../../api/httpRequests";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TourManagementMenu() {
    
    const storeData = async (storagekey: string,value: string) => {//save Data to asyncStorage
        try {
          await AsyncStorage.setItem(storagekey, value);
          console.log("User ID " + userId + " has been saved!");
        } catch (e) {
            console.error(e);
        }
    }

    const getData = async (storagekey: string) => {//get Data from asyncStorage
        try {
            const value = await AsyncStorage.getItem(storagekey);
            return value
        } catch(e) {
            console.error(e);
            return "";
        }
    }

    const [userId, setUserId] = useState("");
    const handleTextChange = (text:string) => {
        setUserId(text);
    }

    const [currentTour, setCurrentTour] = useState<Tour>();
    const [permissionGranted, setPermissionGranted] = useState(false);

    async function onButtonToggle(state: string): Promise<boolean> {
        if (state === "start" && permissionGranted) {
            return createTour(userId).then((tour) => {
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
            const value = await getData("userId")
            value && setUserId(value);

        })()
    }, []);

    useEffect(() => {
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
            <TextInput
                placeholder="Enter User ID"
                onChangeText={handleTextChange}
                value={userId}
            />
            <Button
                title="Save"
                onPress={()=>{storeData("userId",userId)}}
            />
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
