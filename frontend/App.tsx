import {StatusBar} from 'expo-status-bar';
import {StyleSheet, View} from 'react-native';
import Overview from './pages/Overview';
import { LinearGradient } from 'expo-linear-gradient';
import {theme} from "./api/theme";
import {useState} from "react";

export default function App() {
    const [currentTheme, setCurrentTheme] = useState(theme);

    return (
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
