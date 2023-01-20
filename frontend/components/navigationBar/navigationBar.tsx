import { StyleSheet, Text, View, Pressable } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialIcons } from '@expo/vector-icons'; 
import {useState} from "react";

export default function NavigationBar({currentPage, setCurrentPage}: {currentPage : String, setCurrentPage: React.Dispatch<React.SetStateAction<string>>}){

    return(
        <View style={styles.NavContainer}>
            <View style={styles.NavBar}>
                <Pressable onPress={() => {setCurrentPage("starttour") }}>
                    <MaterialIcons name="account-circle" size={32} color="white" />
                </Pressable>
                <Pressable onPress={() => {setCurrentPage("tourmanagment") }}>
                    <MaterialIcons name="tour" size={32} color="white" />
                </Pressable>
                <Pressable onPress={() => {setCurrentPage("wallet") }}>
                    <Ionicons name="wallet" size={32} color="white" />
                </Pressable>
                <Pressable onPress={() => {setCurrentPage("settings") }}>
                    <Ionicons name="settings-outline" size={32} color="white" />
                </Pressable>                
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    NavContainer: {
        position: "absolute",
        bottom: 20,
        alignItems: "center",
    },
    NavBar:{
        flexDirection: "row",
        backgroundColor: "green",
        width: "95%",
        justifyContent: "space-evenly",
        borderRadius: 30,
    }
})