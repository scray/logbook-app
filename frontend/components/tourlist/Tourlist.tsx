import {Button, StyleSheet, View, Text} from "react-native";
import Tour from "../../model/Tour";
import {tours} from "../../api/tourManagement";

export default function Tourlist({
                                     currentTour,
                                     setCurrentTour
                                 }: { currentTour: Tour | undefined, setCurrentTour: (tour: Tour | undefined) => void }) {

    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: "numeric",
        minute: "numeric"
    }

    function LoadTour(selectedTour: Tour) {//loads selected Tour after pressing the tourbutton
        setCurrentTour(selectedTour);
    }

    return (
        <View style={styles.tourlistContainer}>
            {currentTour ? (
                <View>
                    <Button
                        title={"back"}
                        onPress={() => setCurrentTour(undefined)}
                    />

                    <Text> {"Tour ID: " + currentTour.tourId} </Text>
                    <Text> {"User ID: " + currentTour.userId} </Text>
                    <Text> {"Coordinates: " + currentTour.waypoints[0].getLatitude() + ", " + currentTour.waypoints[0].getLongitude() + " - " + currentTour.waypoints[currentTour.waypoints.length - 1].getLatitude() + ", " + currentTour.waypoints[currentTour.waypoints.length - 1].getLongitude()} </Text>
                    <Text> {"Time: " + new Date(currentTour.waypoints[0].getTimestamp()).toLocaleDateString("de-DE", options) + " - " + new Date(currentTour.waypoints[currentTour.waypoints.length - 1].getTimestamp()).toLocaleDateString("de-DE", options)} </Text>
                </View>
            ) : (
                tours.map((tour, index) => {
                    let date1 = new Date(tour.waypoints[0].getTimestamp()).toLocaleDateString("de-DE", options)
                    let date2 = new Date(tour.waypoints[tour.waypoints.length - 1].getTimestamp()).toLocaleDateString("de-DE", options)
                    return (
                        <Button
                            key={index}
                            title={date1 + " - " + date2}
                            onPress={() => {
                                LoadTour(tour)
                            }}
                        />
                    )

                })
            )}
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
