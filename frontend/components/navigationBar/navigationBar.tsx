// Import necessary modules and components
import { View, Pressable, Text, Image } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useContext } from 'react';

import { Context } from '../profile/UserID';
import getStyles from '../../styles/styles';

// Define the 'NavigationBar' functional component
export default function NavigationBar({ currentPage, setCurrentPage }: { currentPage: string; setCurrentPage: React.Dispatch<React.SetStateAction<string>> }) {
    // Access the 'theme' from the user context
    const { theme } = useContext(Context);

    // Get dynamic styles based on the current theme and current page
    const styles = getStyles(theme, currentPage);

    return (
        <View style={styles.nav_container}>
            <Image source={require('../../assets/logo.png')} style={styles.nav_photo} />
            <Pressable style={styles.nav_navItem} onPress={() => setCurrentPage('starttour')}>
                <Ionicons name="play" size={32} style={styles.nav_btn1} />
                <Text style={[styles.nav_btnText, styles.nav_btn1]}>Start tour</Text>
            </Pressable>
            <Pressable style={styles.nav_navItem} onPress={() => setCurrentPage('tourmanagment')}>
                <MaterialIcons name="tour" size={32} style={styles.nav_btn2} />
                <Text style={[styles.nav_btnText, styles.nav_btn2]}>Overview</Text>
            </Pressable>
            <Pressable style={styles.nav_navItem} onPress={() => setCurrentPage('wallet')}>
                <MaterialIcons name="account-circle" size={32} style={styles.nav_btn3} />
                <Text style={[styles.nav_btnText, styles.nav_btn3]}>User profile</Text>
            </Pressable>
        </View>
    );
}
