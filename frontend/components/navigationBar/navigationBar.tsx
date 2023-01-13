import { StyleSheet, Text, View, Pressable } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialIcons } from '@expo/vector-icons'; 

export default function NavigationBar(){
    return(
        <View style={styles.NavContainer}>
            <View style={styles.NavBar}>
                <Pressable onPress={() => {}}>
                    <MaterialIcons name="account-circle" size={32} color="white" />
                </Pressable>
                <Pressable onPress={() => {}}>
                    <MaterialIcons name="tour" size={32} color="white" />
                </Pressable>
                <Pressable onPress={() => {}}>
                    <Ionicons name="wallet" size={32} color="white" />
                </Pressable>
                <Pressable onPress={() => {}}>
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