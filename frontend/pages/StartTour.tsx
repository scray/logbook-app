import {StyleSheet, View, Text} from 'react-native';

export default function StartTour() {
    return (
        <View style={styles.container}>
            <Text>Start Tour</Text>
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
