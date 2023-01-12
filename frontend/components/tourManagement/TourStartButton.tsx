import { useState } from "react";
import { Button, StyleSheet, View } from "react-native";

export default function TourStartButton({onPress}:{onPress:(state:string)=>void}){
    const [state, setState] = useState("start")

    function toggleButton() {
        if(state === "start") {
            setState("stop")
        } else {
            setState("start")
        }
        onPress(state)
    }

    return(
        <View style={styles.tourlistContainer}>
            <Button onPress={toggleButton} color={state === "start" ? "green" : "red"} title={state}/>
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
