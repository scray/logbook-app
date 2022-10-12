import React from "react";
import { Button, StyleSheet, View } from "react-native";
import Coordinates from "../../model/Coordinates";
import Tour from "../../model/Tour";

let tourlist: Tour[] = [
  {userId: "Guenther69", travelId: "travelid1",waypoints: [new Coordinates(100,100,1),new Coordinates(101,100,2),new Coordinates(102,100,3)]},
  {userId: "Guenther69", travelId: "travelid1",waypoints: [new Coordinates(1,100,4),new Coordinates(2,100,5),new Coordinates(3,100,6)]}
]

export default function Tourlist(){
    return(
        <View style={styles.tourlistContainer}>
          {tourlist.map(createTourButtons, tourlist)}
        </View>
    )
}

function createTourButtons(tour: Tour){
  return(
    <Button
      title = { tour.waypoints[0].timestamp + " - " + tour.waypoints[tour.waypoints.length - 1].timestamp}
      onPress = { () => { console.log("Clicked " + tour.waypoints[0].timestamp + " - " + tour.waypoints[tour.waypoints.length - 1].timestamp)}}
    />
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
