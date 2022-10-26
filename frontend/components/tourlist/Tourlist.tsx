import React, { useState } from "react";
import { Button, StyleSheet, View, Text } from "react-native";
import Coordinates from "../../model/Coordinates";
import Tour from "../../model/Tour";
import ConvertCoorToAdr from "../../model/GetAdress";

let tourlist: Tour[] = [
  {userId: "SoerenGandalf", travelId: "123ds4fs2235",waypoints: [new Coordinates(51,11,757567674574),new Coordinates(51,11,2),new Coordinates(51,11,957567674574)]},
  {userId: "Guenther", travelId: "travelid2",waypoints: [new Coordinates(1,100,4),new Coordinates(2,100,5),new Coordinates(3,100,6)]},
  {userId: "Felix", travelId: "travelid3",waypoints: [new Coordinates(99,100,5),new Coordinates(98,100,40),new Coordinates(90,100,200)]}
]



export default function Tourlist(){
  
    const [currentTour, setCurrentTour] = useState<Tour> ()
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: "numeric", minute: "numeric" }

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
            <Text> { "Coordinates: " + currentTour.waypoints[0].getLatitude() +  ", " + currentTour.waypoints[0].getLongitude() + " - " + currentTour.waypoints[currentTour.waypoints.length-1].getLatitude() +  ", " + currentTour.waypoints[currentTour.waypoints.length-1].getLongitude()} </Text>
            <Text> { "Time: " + new Date (currentTour.waypoints[0].getTimestamp()).toLocaleDateString("de-DE", options)+ " - " + new Date (currentTour.waypoints[currentTour.waypoints.length-1].getTimestamp()).toLocaleDateString("de-DE", options)} </Text>
          </View>
          ) : (
            tourlist.map((tour, index) => { 
                
                //@ts-ignore
                let date1 = new Date (tour.waypoints[0].getTimestamp()).toLocaleDateString("de-DE", options)
                //@ts-ignore
                let date2 = new Date (tour.waypoints[tour.waypoints.length-1].getTimestamp()).toLocaleDateString("de-DE", options)
                return (
                  <Button
                    key = { index }
                    title = { date1  + " - " + date2 }
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
