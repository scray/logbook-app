import {StatusBar} from 'expo-status-bar';
import {StyleSheet, View} from 'react-native';
import Overview from './pages/Overview';
import BlockchainRestTestComponent from "./components/BlockchainRestTestComponent";
import NavigationBar from './components/navigationBar/navigationBar';

export default function App() {
    return (
        <View style={styles.container}>
            <Overview/>
            {
                // <BlockchainRestTestComponent/>
            }
            <StatusBar style="auto"/>
            <NavigationBar></NavigationBar>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
