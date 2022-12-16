import {StatusBar} from 'expo-status-bar';
import {StyleSheet, View} from 'react-native';
import Overview from './pages/Overview';
import BlockchainRestTestComponent from "./components/BlockchainRestTestComponent";

export default function App() {
    return (
        <View style={styles.container}>
            <Overview/>
            {
                // <BlockchainRestTestComponent/>
            }
            <StatusBar style="auto"/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
