import {useContext, useState} from "react";
import {Pressable, Text, View} from "react-native";
import { Context } from "../profile/UserID";
import getStyles from "../../styles/styles";

// Define a functional component named 'TourStartButton' that accepts 'onPress' as a prop
export default function TourStartButton({ onPress }: { onPress: (state: string) => Promise<boolean> }) {
    // Define a state variable 'state' initialized to "start"
    const [state, setState] = useState("start");

    // Access the 'theme' from the user context
    const { theme } = useContext(Context);

    // Get dynamic styles based on the current theme
    const styles = getStyles(theme);

    // Function to toggle the button state between "start" and "stop"
    function toggleButton(): Promise<boolean> {
        if (state === "start") {
            setState("stop");
            console.log("Start to record tour");
        } else {
            setState("start");
            console.log("Stop recording tour");
        }
        // Call the 'onPress' function passed as a prop and return its result
        return onPress(state);
    }

    return (
        <View style={styles.tourstart_container}>
            <Pressable style={styles.tourstart_startButton} onPress={() => {
                toggleButton().then((success) => {
                    if (!success) {
                        setState("start")
                    }
                })
            }}>
                <Text style={styles.tourstart_startButtonText}>{state.toUpperCase()}</Text>
            </Pressable>
        </View>
    )
}
