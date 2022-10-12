import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Tourlist from '../components/tourlist/Tourlist';
import TourManagementMenu from '../components/tourManagement/TourManagementMenu';

export default function Overview() {
  return (
    <View style={styles.container}>
        <TourManagementMenu/>
        <Tourlist />
        <StatusBar style="auto" />
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
