import { View, Pressable, StyleSheet, Text, Image } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useContext } from 'react';
import { Context } from '../profile/UserID';

export default function NavigationBar({ currentPage, setCurrentPage }: { currentPage: string; setCurrentPage: React.Dispatch<React.SetStateAction<string>> }) {

    const { theme } = useContext(Context);

    const styles = StyleSheet.create({
        container: {
            width: 300,
            backgroundColor: 'white',
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            zIndex: 2,
            flexDirection: 'column',
            justifyContent: 'flex-end',
            paddingLeft: 60,
            paddingBottom: 100,
        },
        photo: {
            width: 176.49,
            height: 112.44,
            marginBottom: 240,
        },
        navItem: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            fontSize: 18,
            fontWeight: '600',
        },
        btnText: {
            marginLeft: 10,
            color: theme.secondary,
            fontSize: 18,
            fontWeight: '600',
        },
        btn1: {
            color: currentPage === 'starttour' ? '#08AEA7' : '#C1BDBD',
        },
        btn2: {
            color: currentPage === 'tourmanagment' ? '#08AEA7' : '#C1BDBD',
        },
        btn3: {
            color: currentPage === 'wallet' ? '#08AEA7' : '#C1BDBD',
        },
        btn4: {
            color: currentPage === 'settings' ? '#08AEA7' : '#C1BDBD',
        },
    });

    return (
        <View style={styles.container}>
            <Image source={require('D:\\logobook-app\\frontend\\assets\\logo.png')} style={styles.photo} />
            <Pressable style={styles.navItem} onPress={() => setCurrentPage('starttour')}>
                <Ionicons name="play" size={32} style={styles.btn1} />
                <Text style={[styles.btnText, styles.btn1]}>Start tour</Text>
            </Pressable>
            <Pressable style={styles.navItem} onPress={() => setCurrentPage('tourmanagment')}>
                <MaterialIcons name="tour" size={32} style={styles.btn2} />
                <Text style={[styles.btnText, styles.btn2]}>Overview</Text>
            </Pressable>
            <Pressable style={styles.navItem} onPress={() => setCurrentPage('wallet')}>
                <MaterialIcons name="account-circle" size={32} style={styles.btn3} />
                <Text style={[styles.btnText, styles.btn3]}>User profile</Text>
            </Pressable>
            {/*<Pressable style={styles.navItem} onPress={() => setCurrentPage('settings')}>*/}
            {/*    <Ionicons name="settings-outline" size={32} style={styles.btn4} />*/}
            {/*    <Text style={[styles.btnText, styles.btn4]}>Settings</Text>*/}
            {/*</Pressable>*/}
        </View>
    );
}
