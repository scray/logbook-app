import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ImageBackground } from 'react-native';
import Overview from './pages/Overview';
import { LinearGradient } from 'expo-linear-gradient';
import { darkTheme, lightTheme } from "./api/theme";
import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserContext from './api/userContext';
import { Context, storeUserId, getUserId } from './components/profile/UserID';
import NavigationBar from "./components/navigationBar/navigationBar";

export default function App() {
    const [currentTheme, setCurrentTheme] = useState(lightTheme);
    const [userId, setUserId] = useState("");


    useEffect(() => {
        AsyncStorage.getItem("isDarkMode").then((value) => {
            setCurrentTheme(value ? darkTheme : lightTheme)
        });
        (async () => {
            await getUserId().then((value) => {
                console.log("Loading user id " + value);
                if (value) {
                    setUserId(value);
                }
            })
        })()
    }, []);

    return (
        <Context.Provider value={{ userId, setUserId, theme: currentTheme }}>
            <ImageBackground source={require('./assets/background.png')} style={styles.background} >
                <View style={styles.container}>
                        {/*<LinearGradient*/}
                        {/*    colors={currentTheme.backgroundGradient}*/}
                        {/*    style={styles.gradient}*/}
                        {/*    start={[0, 0]}*/}
                        {/*    end={[1, 1]}*/}
                        {/*>*/}
                        <Overview setCurrentTheme={setCurrentTheme}/>
                        <StatusBar style="auto"/>
                        {/*</LinearGradient>*/}
                </View>
            </ImageBackground>
        </Context.Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
    },
    gradient: {
        flex: 1,
        height: "100%",
    },
    background: {
        flex: 1,
        resizeMode: 'cover',
    }
});
