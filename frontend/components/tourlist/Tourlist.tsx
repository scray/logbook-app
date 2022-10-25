import React, { useState } from "react";
import { Button, StyleSheet, View, Text } from "react-native";
import Coordinates from "../../model/Coordinates";
import Tour from "../../model/Tour";

let tourlist: Tour[] = [
  {userId: "Guenther69", travelId: "travelid1",waypoints: [new Coordinates(100,100,1),new Coordinates(101,100,2),new Coordinates(102,100,3)]},
  {userId: "Guenther69", travelId: "travelid2",waypoints: [new Coordinates(1,100,4),new Coordinates(2,100,5),new Coordinates(3,100,6)]},
  {userId: "Felix", travelId: "travelid3",waypoints: [new Coordinates(99,100,5),new Coordinates(98,100,40),new Coordinates(90,100,200)]}
]



export default function Tourlist(){
  
    const [currentTour, setCurrentTour] = useState<Tour> ();

    function LoadTour(selectedTour: Tour, index: number ){//loads selected Tour after pressing the tourbutton
      setCurrentTour(selectedTour);
    }

    return(
        <View style={styles.tourlistContainer}>
          { currentTour ? (
          <View>
            <Button 
              title={ "back" }
              onPress = { () => setCurrentTour(undefined)}
            />

            <Text> { "Travel ID: " + currentTour.travelId } </Text>
            <Text> { "User ID: " + currentTour.userId } </Text>
            <Text> { "Starting Location: " + currentTour.waypoints[0].getLatitude() +  " + " + currentTour.waypoints[0].getLongitude() } </Text>
          </View>
          ) : (
            tourlist.map((tour, index) => {
              return (
                <Button
                  key = { index }
                  title = { tour.waypoints[0].timestamp + " - " + tour.waypoints[tour.waypoints.length - 1].timestamp}
                  onPress = { () => { LoadTour(tour, index)}}
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
