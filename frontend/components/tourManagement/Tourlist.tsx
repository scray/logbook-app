import { Button, StyleSheet, View, Text, ToastAndroid, ScrollView, TouchableOpacity, Pressable } from "react-native";
import Tour from "../../model/Tour";
import { tours as tourList, updateTourList } from "../../api/tourManagement";
import React, { useContext, useEffect, useState } from "react";
import Map from "../map/Map";
import { Ionicons, Fontisto } from '@expo/vector-icons';
import { Context } from "../profile/UserID";
import * as Location from 'expo-location';

interface location {
    "city": string | null;
    "district": string | null;
    "streetNumber": string | null;
    "street": string | null;
    "region": string | null;
    "subregion": string | null;
    "country": string | null;
    "postalCode": string | null;
    "name": string | null;
    "isoCountryCode": string | null;
    "timezone": string | null;
}


export default function Tourlist({
        currentTour,
        setCurrentTour
    }: { currentTour: Tour | undefined, setCurrentTour: (tour: Tour | undefined) => void }) {
        const [tours, setTours] = useState<Tour[]>(tourList);

        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: "numeric",
            minute: "numeric",
        }

    const { userId, setUserId, theme } = useContext(Context);
    const [isMounted, setIsMounted] = useState(true);

    useEffect(() => {
        return () => setIsMounted(false);
    }, []);

    useEffect(() => {
        refreshTourList();
        const interval = setInterval(() => {
            refreshTourList();
        }, 10000);
        return () => clearInterval(interval)
    }, []);

    function refreshTourList() {
        if(isMounted) {
            if(userId){
                updateTourList(userId).then(r => {
                    ToastAndroid.show("Tourlist updated for User ID " + userId, ToastAndroid.SHORT);
                    console.log("THe comp is mounted")
                    setTours(tourList.reverse());
                    console.log("The component IS STILL mounted")
                }).catch(error => {
                    ToastAndroid.show(error.message, ToastAndroid.SHORT);
                });
            }else{
                ToastAndroid.show("No User ID provided! " + userId, ToastAndroid.SHORT);
            }
        }
    }
    
    
    

    const [startLocation,setStartLocation] = useState<location>();
    const [endLocation,setEndLocation] = useState<location>();

    async function LoadTour(selectedTour: Tour) {//loads selected Tour after pressing the tourbutton
        setCurrentTour(selectedTour);
        const startLocation = await getLocation(selectedTour.waypoints[0].latitude, selectedTour.waypoints[0].longitude);
        if(startLocation && startLocation[0])setStartLocation(startLocation[0])
        const endLocation = await getLocation(selectedTour.waypoints[selectedTour.waypoints.length-1].latitude, selectedTour.waypoints[selectedTour.waypoints.length-1].longitude);
        if(endLocation && endLocation[0])setEndLocation(endLocation[0])
    }

    const getLocation = async(latitude:number,longitude:number)=>{
        return await Location.reverseGeocodeAsync({"latitude": latitude, "longitude": longitude}).then((location)=>{
            if(location) return location
        });
    }

    const styles = StyleSheet.create({
        tourlistContainer: {
            flex: 1,
            alignItems: 'center',
            marginTop: 20,
        },
        container: {
            flexDirection: "row",
            padding: 10,
            alignItems: 'center',
            borderRadius: 10,
            borderWidth: 2,
            marginRight: "auto",
        },
        headline: {
            fontSize: 30,
        },
        scrollView: {
            flex: 1,
            width: '100%',
            maxHeight: '77%',
        },
        buttonContainer: {
            flex: 1,
            flexDirection: "row",
            width: '100%',
            padding: 10,
            marginVertical: 5,
            alignItems: 'center',
            borderRadius: 10,
            borderWidth: 2,
        },
        buttonText: {
            fontSize: 18,
            color: theme.fontColor
        },
        refreshButtonContainer: {
            backgroundColor: theme.primary,
            borderRadius: 20,
            padding: 10,
            alignItems: 'center',
            justifyContent: 'center',
        },
        detailedTourContainer: { 
            maxHeight: "100%",
            maxWidth:"100%",
            padding: 10,
        },
        detailContainer: {
            maxWidth:"95%",
        },
        adressContainer:{
            flex:1,
            flexDirection: "row",
        },
        detailText: {
            fontSize: 18,
            borderBottomWidth: 1,
            paddingBottom: 5,
            paddingLeft: 2,
        },
        tourId:{
            fontSize: 20,
            borderRightWidth: 1,
            paddingRight: 2,
            marginRight: 10,
            fontWeight: 'bold',
        },
        text:{
            color: theme.fontColor,
        }
    });
    

    return (
        <View style={styles.tourlistContainer}>

            {currentTour && currentTour.waypoints && currentTour.waypoints.length >= 1 ? (
                <View style={styles.detailedTourContainer}>
                    <View style={styles.detailContainer}>
                        <TouchableOpacity onPress={() => setCurrentTour(undefined)}><Ionicons style={styles.text} name="backspace-outline" size={40} /></TouchableOpacity>
                        <Text style={styles.detailText}> {"Tour ID: " + currentTour.tourId} </Text>
                        <Text style={styles.detailText}> {"User ID: " + currentTour.userId} </Text>
                        <Text style={styles.detailText}> {startLocation?.street + " " + startLocation?.streetNumber + ", " + startLocation?.city + " " + startLocation?.country}</Text>
                        <Text style={styles.detailText}> {endLocation?.street + " " + endLocation?.streetNumber + ", " + endLocation?.city + " " + endLocation?.country}</Text>
                        <Text style={styles.detailText}> {"Time: " + new Date(currentTour.waypoints[0].timestamp).toLocaleDateString("de-DE", options) + " - " + new Date(currentTour.waypoints[currentTour.waypoints.length - 1].timestamp).toLocaleDateString("de-DE", options)} </Text>
                    </View>
                    <Map selectedTour={currentTour} size={52} />
                </View>
            ) : (

                <View style={styles.tourlistContainer}>
                    <View style={styles.container}>
                        <Text style={[styles.headline,styles.text]}>Tours: </Text>
                        <TouchableOpacity onPress={() => { refreshTourList() }} style={styles.refreshButtonContainer}>
                            <Ionicons name="ios-refresh" size={28} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.scrollView}>
                        {
                            tours && tours.map((tour, index) => {
                                if (tour.waypoints && tour.waypoints.length >= 1) {
                                    let date1 = new Date(tour.waypoints[0].timestamp).toLocaleString("de-DE", options)
                                    let date2 = new Date(tour.waypoints[tour.waypoints.length - 1].timestamp).toLocaleString("de-DE", options)
                                    return (
                                        <TouchableOpacity
                                            key={index}
                                            style={styles.buttonContainer}
                                            onPress={() => { LoadTour(tour) }}>
                                                <Text style={[styles.tourId,styles.text]}> { tour.tourId }</Text>
                                                <View>
                                                    <Text style={[styles.buttonText,styles.text]}>{date1}</Text>
                                                    <Text style={[styles.buttonText,styles.text]}>{date2}</Text>
                                                </View>
                                            <Fontisto style={styles.text} name="arrow-v" size={28} color="black" />
                                        </TouchableOpacity>
                                    )
                                }
                            })
                        }
                    </ScrollView>
                </View>
            )}
        </View>
    )


}