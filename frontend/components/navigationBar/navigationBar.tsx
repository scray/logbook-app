import { StyleSheet, Text, View, Pressable } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialIcons } from '@expo/vector-icons'; 
import {useState} from "react";

export default function NavigationBar({currentPage, setCurrentPage}: {currentPage : String, setCurrentPage: React.Dispatch<React.SetStateAction<string>>}){
    
    const styles = StyleSheet.create({
        NavContainer: {
            position: "absolute",
            bottom: 0,
            alignItems: "center",
            zIndex: 99,
        },
        NavBar:{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-evenly",
            padding: 5,
            borderTopWidth: 1,
            borderColor: "#C1C1C1",
        },
        btn1:{
            color: (currentPage === "starttour") ? ("white") : ("#C1C1C1"),
        },
        btn2:{
            color: (currentPage === "tourmanagment") ? ("white") : ("#C1C1C1"),
        },
        btn3:{
            color: (currentPage === "wallet") ? ("white") : ("#C1C1C1"),
        },
        btn4:{
            color: (currentPage === "settings") ? ("white") : ("#C1C1C1"),
        }
    })

    return(
        <View style={styles.NavContainer}>
            <View style={styles.NavBar}>
                <Pressable onPress={() => {setCurrentPage("starttour") }}>
                    <Ionicons style={styles.btn1} name="play" size={32} color="white" />
                </Pressable>
                <Pressable onPress={() => {setCurrentPage("tourmanagment") }}>
                    <MaterialIcons style={styles.btn2} name="tour" size={32} color="white" />
                </Pressable>
                <Pressable onPress={() => {setCurrentPage("account-circle") }}>
                    <Ionicons style={styles.btn3} name="wallet" size={32} color="white" />
                </Pressable>
                <Pressable onPress={() => {setCurrentPage("settings") }}>
                    <Ionicons style={styles.btn4} name="settings-outline" size={32} color="white" />
                </Pressable>                
            </View>
        </View>
    );
}
