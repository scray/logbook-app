import { useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import { createTour } from "../../api/TourManagementAPI";
import Tour from "../../model/Tour";
import TourStartButton from "./TourStartButton";

export default function TourManagementMenu(){
    const [tour, setTour] = useState<Tour>()

    function onButtonToggle(state:string) {
        if(state === "start") {
            setTour(createTour("test"/*replace*/))
            //TODO create waypoints every ... seconds
        } else {
            //TODO stop Creation of waypoints and archive tour
        }
    }

    return(
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
