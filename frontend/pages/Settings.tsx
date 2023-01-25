import {View, Text, Switch, StyleSheet} from "react-native";
import React, {useContext, useEffect, useState} from "react";
import Picker from 'react-native-dropdown-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {darkTheme, lightTheme, Theme} from "../api/theme";
import { Context } from "../components/profile/UserID";

const Settings = ({setCurrentTheme}:{setCurrentTheme:(theme:Theme)=>void}) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isPushNotificationsEnabled, setIsPushNotificationsEnabled] = useState(false);
    const [mapStyle, setMapStyle] = useState("standard");
    const [open, setOpen] = useState(false);
    const { theme } = useContext(Context);

    function FsetMapStyle(mStyle:string) {
        AsyncStorage.setItem("mapStyle", mStyle);
        setMapStyle(mStyle);
    }

    function FsetIsPushNotificationsEnabled(PushNotificationsEnabled:boolean) {
        AsyncStorage.setItem("isPushNotificationsEnabled", PushNotificationsEnabled + "");
        setIsPushNotificationsEnabled(PushNotificationsEnabled);
    }

    function FsetIsDarkMode(darkMode:boolean) {
        AsyncStorage.setItem("isDarkMode", darkMode + "");
        setIsDarkMode(darkMode);
        setCurrentTheme(darkMode ? darkTheme : lightTheme);
    }

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
            color: theme.titleColor,
            fontSize: 18,
        },
        picker: {
            width: "50%",
        },
    });

    return (
        <View style={styles.container}>
            <View style={styles.settingsContainer}>
                <Text style={{fontSize: 24, marginBottom: 20, color:theme.titleColor}}>Settings</Text>
                <View style={styles.settingRow}>
                    <Text style={styles.settingText}>Dark Mode</Text>
                    <Switch value={isDarkMode} onValueChange={FsetIsDarkMode}/>
                </View>

                <View style={styles.settingRow}>
                    <Text style={styles.settingText}>Push Notifications</Text>
                    <Switch value={isPushNotificationsEnabled} onValueChange={FsetIsPushNotificationsEnabled}/>
                </View>

                <View style={styles.settingRow}>
                    <Text style={styles.settingText}>Map Style</Text>
                    <Picker
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

export default Settings;
