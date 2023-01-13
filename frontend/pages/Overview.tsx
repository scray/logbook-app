import {StyleSheet, View} from 'react-native';
import TourManagementMenu from '../components/tourManagement/TourManagementMenu';
import NavigationBar from '../components/navigationBar/navigationBar';
import {useState} from "react";

export default function Overview() {
    const [currentPage, setCurrentPage] = "tourmanagment";

    return (
        <View style={styles.container}>
            <TourManagementMenu/>
            <NavigationBar></NavigationBar>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
