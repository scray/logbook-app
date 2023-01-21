import {StyleSheet, View} from 'react-native';
import TourManagementMenu from '../components/tourManagement/TourManagementMenu';
import Settings from './Settings';
import Wallet from './Wallet';
import StartTour from './StartTour';
import NavigationBar from '../components/navigationBar/navigationBar';
import {useState} from "react";
import { createStackNavigator } from 'react-navigation-stack';

export default function Overview() {
    const [currentPage, setCurrentPage] = useState("tourmanagment");

    const LoadPage = () =>{
        switch(currentPage){
            case "starttour":
                return <StartTour/>;
            case "tourmanagment":
                return <TourManagementMenu/>;
            case "wallet":
                return <Wallet/>;
            case "settings":
                return <Settings/>;
            default:
                return <TourManagementMenu/>;
        }
    }

    return (
        <View style={styles.container}>
            <LoadPage/>
            <NavigationBar currentPage = {currentPage} setCurrentPage = {setCurrentPage}/>
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
