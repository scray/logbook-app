import {StyleSheet, View} from 'react-native';
import TourManagementMenu from '../components/tourManagement/TourManagementMenu';
import Settings from './Settings';
import Wallet from './Wallet';
import NavigationBar from '../components/navigationBar/navigationBar';
import {useState} from "react";
import {Theme} from "../api/theme";

export default function Overview({setCurrentTheme}:{setCurrentTheme:(theme:Theme)=>void}) {
    const [currentPage, setCurrentPage] = useState("starttour");

    const LoadPage = () =>{
        switch(currentPage){
            case "starttour":
                return <TourManagementMenu loadPage= {currentPage} />;
            case "tourmanagment":
                return <TourManagementMenu loadPage= {currentPage} />;
            case "wallet":
                return <Wallet/>;
            case "settings":
                return <Settings setCurrentTheme={setCurrentTheme}/>;
            default:
                return <TourManagementMenu loadPage= {currentPage}/>;
        }
    }

    return (
        <View style={styles.container}>
            <NavigationBar currentPage = {currentPage} setCurrentPage = {setCurrentPage}/>
            <View style={styles.container}>
                <LoadPage/>
            </View>
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
