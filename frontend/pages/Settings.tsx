import {View, Text, Switch, StyleSheet} from "react-native";
import React, {useEffect, useState} from "react";
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";

const Settings = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isPushNotificationsEnabled, setIsPushNotificationsEnabled] = useState(false);
    const [mapStyle, setMapStyle] = useState("standard");
    const [open, setOpen] = useState(false);

    useEffect(() => {
        AsyncStorage.setItem("isDarkMode", isDarkMode.toString());
        AsyncStorage.setItem("isPushNotificationsEnabled", isPushNotificationsEnabled.toString());
        AsyncStorage.setItem("mapStyle", mapStyle);
    }, [isDarkMode, isPushNotificationsEnabled, mapStyle]);

    useEffect(() => {
        AsyncStorage.getItem("isDarkMode").then((value) => {
            setIsDarkMode(value === "true");
        });
        AsyncStorage.getItem("isPushNotificationsEnabled").then((value) => {
            setIsPushNotificationsEnabled(value === "true");
        });
        AsyncStorage.getItem("mapStyle").then((value) => {
            setMapStyle(value || "standard");
        });
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.settingsContainer}>
                <Text style={{fontSize: 24, marginBottom: 20}}>Settings</Text>
                <View style={styles.settingRow}>
                    <Text style={styles.settingText}>Dark Mode</Text>
                    <Switch value={isDarkMode} onValueChange={setIsDarkMode}/>
                </View>

                <View style={styles.settingRow}>
                    <Text style={styles.settingText}>Push Notifications</Text>
                    <Switch value={isPushNotificationsEnabled} onValueChange={setIsPushNotificationsEnabled}/>
                </View>

                <View style={styles.settingRow}>
                    <Text style={styles.settingText}>Map Style</Text>
                    <DropDownPicker
                        items={[
                            {label: "Standard", value: "standard"},
                            {label: "Satellite", value: "satellite"},
                            {label: "Hybrid", value: "hybrid"},
                            {label: "Terrain", value: "terrain"},
                            {label: "None", value: "none"}
                        ]}
                        containerStyle={styles.picker}
                        setValue={setMapStyle}
                        value={mapStyle}
                        open={open}
                        setOpen={setOpen}
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    settingsContainer: {
        width: "80%",
        padding: 20,
    },
    settingRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 10,
    },
    settingText: {
        fontSize: 18,
    },
    picker: {
        width: "50%",
    },
});

export default Settings;
