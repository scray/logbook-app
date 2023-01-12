import {StyleSheet, View} from 'react-native';
import Tourlist from '../components/tourlist/Tourlist';
import TourManagementMenu from '../components/tourManagement/TourManagementMenu';
import Map from "../components/map/Map";
import {useState} from "react";
import Tour from "../model/Tour";

export default function Overview() {
    const [currentTour, setCurrentTour] = useState<Tour>();

    return (
        <View style={styles.container}>
            <TourManagementMenu/>
            <Tourlist currentTour={currentTour} setCurrentTour={setCurrentTour}/>
            <Map selectedTour={currentTour}/>
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
