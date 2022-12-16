import {useState} from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";

export default function TourStartButton({onPress}: { onPress: (state: string) => void }) {
    const [state, setState] = useState("start")

    let styles = StyleSheet.create({
        tourlistContainer: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        startButton: {
            backgroundColor: state === "start" ? "green" : "red",
            padding: 10,
            borderRadius: 5,
            marginTop: 100,
        },
        startButtonText: {
            color: state === "start" ? "white" : "black",
            fontSize: 20,
        }
    });

    function toggleButton() {
        if (state === "start") {
            setState("stop")
        } else {
            setState("start")
        }
        onPress(state)
    }

    return (
        <View style={styles.tourlistContainer}>
            <Pressable style={styles.startButton} onPress={toggleButton}>
                <Text style={styles.startButtonText}>{state.toUpperCase()}</Text>
            </Pressable>
        </View>
    )
}
