import {Pressable, StyleSheet, Text, TextInput, ToastAndroid, View} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useContext, useEffect, useLayoutEffect, useState} from "react";
import ProfilePicture from "../components/profile/ProfilePicture";
import {theme} from "../api/theme";
import { Context, storeUserId, getUserId} from "../components/profile/UserID";

export default function Wallet() {
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
        }
    }
    return (
        <View style={styles.container}>
            <Text style={styles.title}>YOUR PROFILE</Text>
            <ProfilePicture></ProfilePicture>
            <View style={styles.inputContainer}>
                <TextInput style={styles.input} placeholder="Enter User ID" onChangeText={handleTextChange} value={inputValue}/>
            </View>
            <Pressable style={styles.saveButton} onPress={()=>{saveUserId() }}>
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
        color: theme.titleColor,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    label: {
        fontSize: 18,
        marginRight: 10,
        color: theme.fontColor,
    },
    input: {
        padding: 10,
        borderWidth: 1,
        borderColor: theme.tertiary,
        borderRadius: 5,
        flex: 1,
        fontSize: 16,
        color: theme.primary,
    },
    saveButton: {
        backgroundColor: theme.secondary,
        marginTop: 20,
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    saveButtonTitle: {
        color: theme.fontColor,
        fontWeight: 'bold',
    }
});