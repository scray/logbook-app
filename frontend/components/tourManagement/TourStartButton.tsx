import {useContext, useEffect, useState} from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";
import { darkTheme, lightTheme, Theme } from "../../api/theme";
import { Context } from "../profile/UserID";

export default function TourStartButton({onPress}: { onPress: (state: string) => Promise<boolean> }) {
    const [state, setState] = useState("start")
    const { theme } = useContext(Context);

    let styles = StyleSheet.create({
        container: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        startButton: {
            backgroundColor: state === "start" ? theme.button1 : theme.button2,
            padding: 10,
            borderRadius: 5,
            width: "30%",
        },
        startButtonText: {
            color: state === "start" ? theme.fontColor : theme.titleColor,
            fontSize: 20,
            textAlign: "center",
        }
    });

    function toggleButton(): Promise<boolean> {
        if (state === "start") {
            setState("stop")
            console.log("Start to record tour")
        } else {
            setState("start")
            console.log("Stop to record tour")
        }
        return onPress(state)
    }

    return (
        <View style={styles.container}>
            <Pressable style={styles.startButton} onPress={() => {
                toggleButton().then((success) => {
                    if (!success) {
                        setState("start")
                    }
                })
            }}>
                <Text style={styles.startButtonText}>{state.toUpperCase()}</Text>
            </Pressable>
        </View>
    )
}
