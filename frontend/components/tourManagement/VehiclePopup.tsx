// Import necessary modules and components
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Button, FlatList, TextInput, StyleSheet, Pressable, Modal } from 'react-native';
import getStyles from "../../styles/styles";
import { Context } from '../profile/UserID';

// TODO: Add actual logic here
// Type definition for a vehicle
type Vehicle = {
    id: number;
    name: string;
};

// TODO: Add actual logic here
// Predefined vehicles for demo
const predefinedVehicles = [
    { id: 1, name: 'Car' },
    { id: 2, name: 'Truck' },
    { id: 3, name: 'Bike' },
    { id: 4, name: 'Scooter' },
];

// The custom hook for fetching and adding vehicles
const useVehicleService = () => {
    // Initialize the state with predefined vehicles
    // TODO: Replace with actual logic
    const [vehicles, setVehicles] = useState<Vehicle[]>(predefinedVehicles);

    useEffect(() => {
        // Fetch vehicles from API (or use mock data)
        // TODO: Replace with actual fetch logic
    }, []);

    // Function to add a new vehicle
    const addVehicle = async (vehicleName: string) => {
        // Simulate adding a vehicle
        // TODO: Replace with actual API logic
        const newVehicle = { id: vehicles.length + 1, name: vehicleName };
        setVehicles([...vehicles, newVehicle]);
    };

    return { vehicles, addVehicle };
};

// The main component
const VehiclePopup = ({ visible, onClose, onSelectVehicle }: { visible: boolean; onClose: () => void; onSelectVehicle: (vehicle: Vehicle) => void; }) => {
    const { vehicles, addVehicle } = useVehicleService(); // Use the custom hook to manage vehicles
    const [newVehicleName, setNewVehicleName] = useState(''); // State to track the name of a new vehicle
    const { theme } = useContext(Context); // Access the theme from the context
    const styles = getStyles(theme); // Get styles based on the theme

    // Function to handle the submission of a new vehicle
    const handleSubmitNewVehicle = () => {
        addVehicle(newVehicleName);
        setNewVehicleName('');
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.vehicles_formContainer}>
                <Text style={styles.vehicles_title}>Select a vehicle</Text>
                <Pressable style={styles.vehicles_buttonClose} onPress={onClose}><Text style={styles.vehicles_buttonCloseText}>X</Text></Pressable>
                <FlatList
                    data={vehicles}
                    renderItem={({ item }) => (
                        <View style={styles.vehicles_item}>
                            <Text style={styles.vehicles_text}>{item.name}</Text>
                            <Pressable style={styles.vehicles_buttonSelect} onPress={() => onSelectVehicle(item)}><Text style={styles.vehicles_buttonSelectText}>Select</Text></Pressable>
                        </View>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                />
                <TextInput
                    style={styles.vehicles_input}
                    onChangeText={setNewVehicleName}
                    value={newVehicleName}
                    placeholder="New Vehicle Name"
                />
                <Pressable style={styles.vehicles_buttonSubmit} onPress={handleSubmitNewVehicle}><Text style={styles.vehicles_buttonSubmitText}>Submit New Vehicle</Text></Pressable>
            </View>
        </Modal>
    );
};

export default VehiclePopup;
