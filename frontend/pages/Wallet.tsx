import {StyleSheet, View, Text} from 'react-native';

export default function Wallet() {
    return (
        <View style={styles.container}>
            <Text>Wallet</Text>
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
