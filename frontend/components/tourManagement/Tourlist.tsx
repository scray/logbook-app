import { Button, StyleSheet, View, Text, ToastAndroid, ScrollView, TouchableOpacity } from "react-native";
import Tour from "../../model/Tour";
import { tours as tourList, updateTourList } from "../../api/tourManagement";
import React, { useEffect, useState } from "react";
import { userId } from "../../api/httpRequests";
import Map from "../map/Map";
import { Ionicons, Fontisto } from '@expo/vector-icons';


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

    useEffect(() => {
        refreshTourList();
        const interval = setInterval(() => {
            refreshTourList();
        }, 10000);
        return () => clearInterval(interval);
    }, []);
    function refreshTourList() {
        updateTourList(userId).then(r => {
            ToastAndroid.show("Tourlist updated", ToastAndroid.SHORT);
            setTours(tourList);
        }).catch(error => {
            ToastAndroid.show(error.message, ToastAndroid.SHORT);
        });
    }


    function LoadTour(selectedTour: Tour) {//loads selected Tour after pressing the tourbutton
        setCurrentTour(selectedTour);
    }

    return (
        <View style={styles.tourlistContainer}>

            {currentTour && currentTour.waypoints && currentTour.waypoints.length >= 1 ? (
                <View style={styles.detailedTourContainer}>
                    <Button
                        title={"back"}
                        onPress={() => setCurrentTour(undefined)}
                    />
                    <View style={styles.detailContainer}>
                        <Text style={styles.detailText}> {"Tour ID: " + currentTour.tourId} </Text>
                        <Text style={styles.detailText}> {"User ID: " + currentTour.userId} </Text>
                        <Text style={styles.detailText}> {currentTour.waypoints[0].latitude + ", " + currentTour.waypoints[0].longitude + " - " + currentTour.waypoints[currentTour.waypoints.length - 1].latitude + ", " + currentTour.waypoints[currentTour.waypoints.length - 1].longitude} </Text>
                        <Text style={styles.detailText}> {currentTour.waypoints[currentTour.waypoints.length - 1].latitude + ", " + currentTour.waypoints[currentTour.waypoints.length - 1].longitude} </Text>
                        <Text style={styles.detailText}> {"Time: " + new Date(currentTour.waypoints[0].timestamp).toLocaleDateString("de-DE", options) + " - " + new Date(currentTour.waypoints[currentTour.waypoints.length - 1].timestamp).toLocaleDateString("de-DE", options)} </Text>
                    </View>
                    <Map selectedTour={currentTour} />
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
                                            <Fontisto style={styles.text}name="arrow-v" size={28} color="black" />
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
    },
    refreshButtonContainer: {
        backgroundColor: '#4285f4',
        borderRadius: 20,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    detailedTourContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    detailContainer: {
        borderWidth: 2,
        borderRadius: 10,
        padding: 10,
        backgroundColor: '#f2f2f2',
        marginVertical: 5,
        alignItems: 'center',
        flexDirection: "column"
    },
    detailText: {
        fontSize: 18,
        marginVertical: 5,
        borderBottomWidth: 1,
        paddingBottom: 5
    },
    tourId:{
        fontSize: 20,
        borderRightWidth: 1,
        paddingRight: 2,
        marginRight: 10,
        fontWeight: 'bold',
    },
    text:{
        color: "white",
    }
});
