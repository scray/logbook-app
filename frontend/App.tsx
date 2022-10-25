import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Tourlist from './components/tourlist/Tourlist';
import TourStartButton from './components/tourManagement/TourStartButton';
import Overview from './pages/Overview';
import Map from "./components/map/Map";

import Geocoder from 'react-native-geocoding';
Geocoder.init("AIzaSyD50jUxLasEpiMuNFU2MYWw-PPGJGaCFdI", {language : "en"});

export default function App() {
  return (
    <View style={styles.container}>
        <Overview/>
        <Map/>
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
