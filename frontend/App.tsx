import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Tourlist from './components/tourlist/Tourlist';
import TourStartButton from './components/tourManagement/TourStartButton';
import Overview from './pages/Overview';

export default function App() {
  return (
    <View style={styles.container}>
        <Overview/>
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
