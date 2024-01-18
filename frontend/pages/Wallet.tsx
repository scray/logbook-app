import {Pressable, StyleSheet, Switch, Text, TextInput, View} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useContext, useEffect, useLayoutEffect, useState} from "react";
import ProfilePicture from "../components/profile/ProfilePicture";
import { Context, storeUserId, getUserId} from "../components/profile/UserID";
import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import Picker from 'react-native-dropdown-picker';
import {darkTheme, lightTheme, Theme} from "../api/theme";


const Wallet = ({setCurrentTheme}:{setCurrentTheme:(theme:Theme)=>void}) => {
    const { userId, setUserId } = useContext(Context);
    const [inputValue, setInputValue] = useState(userId);
    const handleTextChange = (text:string) => {
        setInputValue(text);
    }
    useEffect(() => {
        const loadData = async () => {
            await getUserId().then((id)=>{

                if(id){
                    setInputValue(id);
                }
            });
        }
        loadData();
    }, []);

    function saveUserId(){
        if(inputValue){
            storeUserId(inputValue);
            setUserId(inputValue);
            setInputValue('');
        }
    }


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

    // function FsetIsDarkMode(darkMode:boolean) {
    //     AsyncStorage.setItem("isDarkMode", darkMode + "");
    //     setIsDarkMode(darkMode);
    //     setCurrentTheme(darkMode ? darkTheme : lightTheme);
    // }

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
            width: '100%',
            paddingLeft: 340,
            paddingTop: 32,
        },
        containerInner: {
            backgroundColor: 'rgba(230, 230, 230, 0.5)',
            flex: 1,
            marginTop: 32,
            marginRight: 32,
            marginBottom: 32,
            paddingLeft: 32,
            paddingTop: 32,
            paddingRight: 32,
            borderRadius: 25,
            flexDirection: 'row',
        },
        containerInner2: {
            flex: 1,
            flexDirection: 'column',
        },
        containerContent: {
            backgroundColor: 'white',
            paddingLeft: 28,
            paddingBottom: 28,
            paddingTop: 28,
            paddingRight: 28,
            marginRight: 20,
            marginBottom: 28,
            borderRadius: 25,
            justifyContent: 'space-evenly',
            position: 'relative',
        },
        innerContainerContent: {
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginBottom: 2,
        },
        title: {
            fontSize: 38,
            fontWeight: '700',
            textAlign: 'left',
            color: '#2C2C2C',
        },
        inputContainer: {
            flex: 1,
            width: 280,
            justifyContent: "flex-end",

        },
        label: {
            fontSize: 18,
            marginRight: 10,
            color: theme.fontColor,
        },
        input: {
            padding: 10,
            borderWidth: 1,
            borderColor: '#08AEA7',
            borderRadius: 100,
            fontSize: 14,
            color: '#2C2C2C',
        },
        saveButton: {
            backgroundColor: '#08AEA7',
            borderRadius: 100,
            paddingVertical: 10,
            paddingHorizontal: 20,
            marginTop: 12,
            width: 280,
            justifyContent: "flex-end",
        },
        saveButtonTitle: {
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: '600',
            textAlign: 'center',
        },
        userTitle: {
            color: '#1D1D1D',
            fontSize: 24,
            fontWeight: '700',
            textAlign: 'center',
            paddingTop: 18,
        },
        blockTitle: {
            marginLeft: 10,
            marginBottom: 10,
            color: '#08AEA7',
            fontSize: 24,
            fontWeight: '700',
            textAlign: 'center',
        },
        settingRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: 10,
        },
        settingText: {
            color: theme.titleColor,
            fontSize: 18,
        },
        text: {
            // paddingRight  : 24,
            fontSize: 16,
            textAlign: 'center',
        },
        numberStyle: {
            fontSize: 48,
            color: '#0092C8',
            fontWeight: '700',
            textAlign: 'center',
        },
        picker: {
            width: "100%",
            flexDirection: 'row',
        },
        horizontalLine: {
            borderBottomColor: '#BEBEBE',
            borderBottomWidth: 2,
            marginVertical: 10,
            textAlign: 'center',
            width: 72,
        },
    });

    return (
        <View style={styles.container}>
            <Text style={[styles.title, {textAlign: 'center'}]}>YOUR PROFILE</Text>
            <View style={styles.containerInner}>
                <View style={[styles.containerContent, {alignItems: 'center'}]}>
                    <ProfilePicture ></ProfilePicture>
                    <Text style={styles.userTitle}>{userId || 'Your UserId'}</Text>
                    <View style={styles.inputContainer}>
                        <TextInput style={styles.input} placeholder="Enter User ID" onChangeText={handleTextChange} value={inputValue}/>
                    </View>
                    <Pressable style={styles.saveButton} onPress={()=>{saveUserId()}}>
                        <Text style={styles.saveButtonTitle}>Save</Text>
                    </Pressable>
                </View>
                <View style={styles.containerInner2}>
                    <View style={[styles.containerContent, { height: '60%'}]}>
                        <View style={[styles. innerContainerContent, {justifyContent: 'center'}]}>
                            <AntDesign name="piechart" size={30} color="#08AEA7" />
                            <Text style={[styles.blockTitle]}>Statistics</Text>
                        </View>
                        <View style={[styles. innerContainerContent, {alignItems: 'center'}]}>
                            <View style={[styles. containerInner2, {alignItems: 'center'}]}>
                                <Text style={styles.numberStyle}>40</Text>
                                <View style={styles.horizontalLine}></View>
                                <Text style={styles.text}>Tours</Text>
                            </View>
                            <View style={[styles. containerInner2, {alignItems: 'center'}]}>
                                <Text style={styles.numberStyle}>164</Text>
                                <View style={styles.horizontalLine}></View>
                                <Text style={styles.text}>Gesamtmenge an CO2</Text>
                            </View>
                            <View style={[styles. containerInner2, {alignItems: 'center'}]}>
                                <Text style={styles.numberStyle}>50</Text>
                                <View style={styles.horizontalLine}></View>
                                <Text style={styles.text}>CO2-Menge pro Fahrt</Text>
                            </View>
                        </View>
                        <View style={[styles. innerContainerContent, {justifyContent: 'center'}, {marginLeft: 96}, {marginRight: 96}]}>
                            <View style={[styles. containerInner2, {alignItems: 'center'}]}>
                                <Text style={styles.numberStyle}>6</Text>
                                <View style={styles.horizontalLine}></View>
                                <Text style={styles.text}>Average travel time</Text>
                            </View>
                            <View style={[styles. containerInner2, {alignItems: 'center'}]}>
                                <Text style={styles.numberStyle}>105</Text>
                                <View style={styles.horizontalLine}></View>
                                <Text style={styles.text}>Kilometers pro Fahrt</Text>
                            </View>
                        </View>
                    </View>

                    <View style={[styles.containerContent, {justifyContent: 'space-evenly'}]}>
                        <View style={[styles. innerContainerContent, {marginBottom: 30}, {justifyContent: 'center'}]}>
                            <Ionicons name="ios-settings" size={30} color="#08AEA7" />
                            <Text style={styles.blockTitle}>Settings</Text>
                        </View>
                        <View style={[styles. innerContainerContent, {alignItems: 'center'}]}>
                            {/*<View>*/}
                                {/*<View style={[styles. innerContainerContent, {marginBottom: 22}, {justifyContent: 'space-between'}]}>*/}
                                {/*    <Text style={[styles.text]}>Dark Mode</Text>*/}
                                {/*    <Switch/>*/}
                                {/*</View>*/}
                                <View style={[styles. innerContainerContent]}>
                                    <Text style={[styles.text, {paddingRight  : 24}]}>Push Notifications</Text>
                                    <Switch value={isPushNotificationsEnabled} onValueChange={FsetIsPushNotificationsEnabled}/>
                                </View>
                            {/*</View>*/}
                            <View>
                                <View style={[styles. innerContainerContent, {justifyContent: 'space-between'}]}>
                                    <Text style={[styles.text, , {paddingRight  : 24} ]} numberOfLines={1}>Map Style:</Text>
                                        <View>
                                            <Picker
                                                items={[
                                                    {label: "Standard", value: "standard"},
                                                    {label: "Satellite", value: "satellite"},
                                                    {label: "Hybrid", value: "hybrid"},
                                                    {label: "Terrain", value: "terrain"},
                                                    {label: "None", value: "none"}
                                                ]}
                                                style={styles.picker}
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
}

export default Wallet;