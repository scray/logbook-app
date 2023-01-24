import {StatusBar} from 'expo-status-bar';
import {StyleSheet, View} from 'react-native';
import Overview from './pages/Overview';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

export default function App() {

    return (
        <View style={styles.container}>
            <LinearGradient
            colors={['#4c669f', '#3b5998', '#192f6a']}
            style={styles.gradient}
            start={[0, 0]}
            end={[1, 1]}
            >   
                <Overview/>
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
