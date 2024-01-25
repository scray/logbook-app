// Import necessary modules and components
import React, { useContext, useEffect, useState, useCallback } from "react";
import { View, Text, TextInput, Pressable, Switch } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import Picker from 'react-native-dropdown-picker';

import ProfilePicture from "../components/profile/ProfilePicture";
import { Context, storeUserId, getUserId } from "../components/profile/UserID";
import { darkTheme, lightTheme } from "../styles/theme";
import getStyles from '../styles/styles';
import axios from 'axios';

const server = "http://localhost:8080/tour-app";

// Define the Wallet component
const Wallet = () => {
    // Access user context to manage user-related data
    const { userId, setUserId } = useContext(Context);
    const { theme, setTheme } = useContext(Context);


    // State variables for user input, push notifications, map style, and theme
    const [inputValue, setInputValue] = useState(userId);
    const [isPushNotificationsEnabled, setIsPushNotificationsEnabled] = useState(false);
    const [mapStyle, setMapStyle] = useState("standard");
    const [open, setOpen] = useState(false);

    const [totalDistance, setTotalDistance] = useState<number>(0);
    const [totalTourCount, setCalculateTourCount] = useState<number>(0);
    const [averageTourTime, setCalculateAverageTourTime] = useState<number>(0);
    const [averageCO2, setCalculateAverageCO2] = useState<number>(0);

    // Get dynamic styles based on the current theme
    const styles = getStyles(theme);

    // Function to load data including user ID, theme, and settings
    const loadData = async () => {
        const id = await getUserId();
        if (id) setInputValue(id);

        const pushEnabled = await AsyncStorage.getItem("isPushNotificationsEnabled");
        setIsPushNotificationsEnabled(pushEnabled === "true");

        const storedMapStyle = await AsyncStorage.getItem("mapStyle");
        setMapStyle(storedMapStyle || "standard");
    };

    // Use the useEffect hook to load data when the component mounts
    useEffect(() => {
        loadData();
    }, []);

    // Handle user input change
    const handleTextChange = useCallback((text) => {
        setInputValue(text);
    }, []);

    // Save user ID to storage and update state
    const saveUserId = useCallback(() => {
        if (inputValue) {
            storeUserId(inputValue);
            setUserId(inputValue);
            setInputValue('');
        }
    }, [inputValue]);

    // Update map style setting and store it in AsyncStorage
    const setMapStyleAsync = useCallback((mStyle) => {
        AsyncStorage.setItem("mapStyle", mStyle); // Save map style to storage
        setMapStyle(mStyle);                      // Update map style in the state
    }, []);

    // Update push notifications setting and store it in AsyncStorage
    const setIsPushNotificationsEnabledAsync = useCallback((enabled) => {
        AsyncStorage.setItem("isPushNotificationsEnabled", String(enabled)); // Save push notification setting to storage
        setIsPushNotificationsEnabled(enabled);                                // Update push notification setting in the state
    }, []);

    // Update the theme based on Dark Mode setting
    const setDarkMode = useCallback((darkMode) => {
        // Determine the theme based on the darkMode setting
        const newTheme = darkMode ? darkTheme : lightTheme;
        setTheme(newTheme); // Update the theme in the state
    }, []);

    const calculateAverageCO2 = async (user: string) => {
        try {
            const response = await axios.get(`${server}/tours/average-co2/${user}`);
            const result = parseInt(response.data.averageCO2);
            setCalculateAverageCO2(result);
        } catch (error) {
            console.error(error);
            setCalculateAverageCO2(32);
        }
    };

    const calculateTotalDistance = async (user: string) => {
        try {
            const response = await axios.get(`${server}/tours/total-distance/${user}`);
            const result = parseInt(response.data.totalDistance);
            setTotalDistance(result);
        } catch (error) {
            console.error(error);
            setTotalDistance(13431);
        }
    };

    const calculateTourCount = async (user: string) => {
        try {
            const response = await axios.get(`${server}/tours/count/${user}`);
            const result = response.data.count;
            setCalculateTourCount(result);
        } catch (error) {
            console.error(error.config);
            setCalculateTourCount(61);
        }
    };

    const calculateAverageTourTime = async (user: string) => {
        try {
            const response = await axios.get(`${server}/tours/average-tour-time/${user}`);
            const result = parseInt(response.data.averageTourTime);
            setCalculateAverageTourTime(result);
        } catch (error) {
            console.error(error.config);
            setCalculateAverageTourTime(2695);
        }
    };

    // Demo user
    // TODO: Replace with userId in production
    const user = "alice";

    useEffect(() => {
        calculateTotalDistance(user);
        calculateTourCount(user);
        calculateAverageTourTime(user);
        calculateAverageCO2(user);
    }, []);


    // Render the Wallet component
    return (
        <View style={styles.wallet_container}>
            <Text style={[styles.wallet_title, {textAlign: 'center'}]}>YOUR PROFILE</Text>
            <View style={styles.wallet_containerInner}>
                <View style={[styles.wallet_containerContent, {alignItems: 'center'}]}>
                    <ProfilePicture></ProfilePicture>
                    <Text style={styles.wallet_userTitle}>{userId || 'Your UserID'}</Text>
                    <View style={styles.wallet_inputContainer}>
                        <TextInput style={styles.wallet_input} placeholder="Enter User ID" onChangeText={handleTextChange} value={inputValue}/>
                    </View>
                    <Pressable style={styles.wallet_saveButton} onPress={()=>{saveUserId()}}>
                        <Text style={styles.wallet_saveButtonTitle}>Save</Text>
                    </Pressable>
                </View>
                <View style={styles.wallet_containerInner2}>
                    <View style={[styles.wallet_containerContent, { height: '60%'}]}>
                        <View style={[styles.wallet_innerContainerContent, {justifyContent: 'center'}]}>
                            <AntDesign name="piechart" size={30} color="#08AEA7" />
                            <Text style={[styles.wallet_blockTitle]}>Statistics</Text>
                        </View>
                        <View style={[styles.wallet_innerContainerContent, {alignItems: 'center'}]}>
                            <View style={[styles.wallet_containerInner2, {alignItems: 'center'}]}>
                                <Text style={styles.wallet_numberStyle}>{totalTourCount}</Text>
                                <View style={styles.wallet_horizontalLine}></View>
                                <Text style={styles.wallet_text}>Tours</Text>
                            </View>
                            <View style={[styles.wallet_containerInner2, {alignItems: 'center'}]}>
                                <Text style={styles.wallet_numberStyle}>{totalTourCount*averageCO2}</Text>
                                <View style={styles.wallet_horizontalLine}></View>
                                <Text style={styles.wallet_text}>Total CO2 emissions</Text>
                            </View>
                            <View style={[styles.wallet_containerInner2, {alignItems: 'center'}]}>
                                <Text style={styles.wallet_numberStyle}>{averageCO2}</Text>
                                <View style={styles.wallet_horizontalLine}></View>
                                <Text style={styles.wallet_text}>CO2 emissions per trip</Text>
                            </View>
                        </View>
                        <View style={[styles.wallet_innerContainerContent, {justifyContent: 'center'}, {marginLeft: 96}, {marginRight: 96}]}>
                            <View style={[styles.wallet_containerInner2, {alignItems: 'center'}]}>
                                <Text style={styles.wallet_numberStyle}>{averageTourTime}</Text>
                                <View style={styles.wallet_horizontalLine}></View>
                                <Text style={styles.wallet_text}>Average travel time</Text>
                            </View>
                            <View style={[styles.wallet_containerInner2, {alignItems: 'center'}]}>
                                <Text style={styles.wallet_numberStyle}>{totalDistance}</Text>
                                <View style={styles.wallet_horizontalLine}></View>
                                <Text style={styles.wallet_text}>Total Distance</Text>
                            </View>
                        </View>
                    </View>

                    <View style={[styles.wallet_containerContent, {justifyContent: 'space-evenly'}]}>
                        <View style={[styles.wallet_innerContainerContent, {marginBottom: 30}, {justifyContent: 'center'}]}>
                            <Ionicons name="ios-settings" size={30} color="#08AEA7" />
                            <Text style={styles.wallet_blockTitle}>Settings</Text>
                        </View>
                        <View style={[styles.wallet_innerContainerContent, {alignItems: 'center'}]}>
                            <View style={styles.wallet_innerContainerContent}>
                                <Text style={[styles.wallet_text, {paddingRight  : 24}]}>Dark Mode</Text>
                                <Switch value={theme === darkTheme ? true : false} onValueChange={setDarkMode}/>
                            </View>
                            <View style={styles.wallet_innerContainerContent}>
                                <Text style={[styles.wallet_text, {paddingRight  : 24}]}>Push Notifications</Text>
                                <Switch value={isPushNotificationsEnabled} onValueChange={setIsPushNotificationsEnabledAsync}/>
                            </View>
                            <View>
                                <View style={[styles.wallet_innerContainerContent, {justifyContent: 'space-between'}]}>
                                    <Text style={[styles.wallet_text, , {paddingRight  : 24} ]} numberOfLines={1}>Map Style:</Text>
                                        <View>
                                            <Picker
                                                items={[
                                                    {label: "Standard", value: "standard"},
                                                    {label: "Satellite", value: "satellite"},
                                                    {label: "Hybrid", value: "hybrid"},
                                                    {label: "Terrain", value: "terrain"},
                                                    {label: "None", value: "none"}
                                                ]}
                                                style={styles.wallet_picker}
                                                setValue={setMapStyle}
                                                value={mapStyle}
                                                open={open}
                                                setOpen={setOpen}
                                             />
                                        </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default Wallet;
