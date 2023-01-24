import {StatusBar} from 'expo-status-bar';
import {StyleSheet, ToastAndroid, View} from 'react-native';
import Overview from './pages/Overview';
import { LinearGradient } from 'expo-linear-gradient';
import {theme} from "./api/theme";
import {createContext, useContext, useEffect, useLayoutEffect, useState} from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserContext from './api/userContext';
import { Context, storeUserId, getUserId } from './components/profile/UserID';

export default function App() {
    const [currentTheme, setCurrentTheme] = useState(theme);
    const [userId, setUserId] = useState("");

    useEffect(() => {
        (async() => {
            await getUserId().then((value)=>{ 
                console.log("Loading user id " + value);
                if(value){
                    setUserId(value);
                }
            })
        })()
    }, []);

    return (
        <Context.Provider value={{userId, setUserId}}>
            <View style={styles.container}>
                <LinearGradient
                colors={currentTheme.backgroundGradient}
                style={styles.gradient}
                start={[0, 0]}
                end={[1, 1]}
                >
                    <Overview setCurrentTheme={setCurrentTheme}/>
                    <StatusBar style="auto"/>
                </LinearGradient>
            </View>
        </Context.Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    gradient: {
        height: "100%",
        width: "100%"
    }
});
