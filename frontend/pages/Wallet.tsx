
import {Platform, StyleSheet, ToastAndroid, View, Text, Pressable, TextInput} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLayoutEffect, useState, createContext } from "react";

const UserIdContext = createContext("");

export default function Wallet() {

    useLayoutEffect(() => {
        (async() => {
            const value = await getData("userId")
            value && setUserId(value);
        })()
    }, []);
    
    const storeData = async (storagekey: string,value: string) => {//save Data to asyncStorage
        try {
          await AsyncStorage.setItem(storagekey, value);
          console.log("User ID " + userId + " has been saved!");
        } catch (e) {
            console.error(e);
        }
    }

    const getData = async (storagekey: string) => {//get Data from asyncStorage
        try {
            const value = await AsyncStorage.getItem(storagekey);
            return value
        } catch(e) {
            console.error(e);
            return "";
        }
    }

    const [userId, setUserId] = useState("");
    const handleTextChange = (text:string) => {
        setUserId(text);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Wallet</Text>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>User ID:</Text>
                <TextInput style={styles.input} placeholder="Enter User ID" onChangeText={handleTextChange} value={userId}/>
            </View>
            <Pressable style={styles.saveButton}onPress={()=>{storeData("userId",userId)}}>
                <Text style={styles.saveButtonTitle}>Save</Text>
            </Pressable>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    label: {
        fontSize: 18,
        marginRight: 10,
        color: '#666',
    },
    input: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    saveButton: {
        backgroundColor: '#f44336',
        marginTop: 20,
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    saveButtonTitle: {
        color: '#fff',
        fontWeight: 'bold',
    }
});