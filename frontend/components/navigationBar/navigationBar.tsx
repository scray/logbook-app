import { StyleSheet, View, Pressable } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialIcons } from '@expo/vector-icons';
import { lightTheme, darkTheme, Theme } from "../../api/theme";
import { useContext } from "react";
import { Context } from "../profile/UserID";

export default function NavigationBar({currentPage, setCurrentPage}: {currentPage : String, setCurrentPage: React.Dispatch<React.SetStateAction<string>>}){
    
    const { theme } = useContext(Context);
    
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
            color: (currentPage === "starttour") ? (theme.titleColor) : (theme.secondary),
        },
        btn2:{
            color: (currentPage === "tourmanagment") ? (theme.titleColor) : (theme.secondary),
        },
        btn3:{
            color: (currentPage === "wallet") ? (theme.titleColor) : (theme.secondary),
        },
        btn4:{
            color: (currentPage === "settings") ? (theme.titleColor) : (theme.secondary),
        }
    })

    return(
        <View style={styles.NavContainer}>
            <View style={styles.NavBar}>
                <Pressable onPress={() => {setCurrentPage("starttour") }}>
                    <Ionicons style={styles.btn1} name="play" size={32}/>
                </Pressable>
                <Pressable onPress={() => {setCurrentPage("tourmanagment") }}>
                    <MaterialIcons style={styles.btn2} name="tour" size={32} />
                </Pressable>
                <Pressable onPress={() => {setCurrentPage("wallet") }}>
                    <MaterialIcons style={styles.btn3} name="account-circle" size={32} />
                </Pressable>
                <Pressable onPress={() => {setCurrentPage("settings") }}>
                    <Ionicons style={styles.btn4} name="settings-outline" size={32} />
                </Pressable>                
            </View>
        </View>
    );
}
