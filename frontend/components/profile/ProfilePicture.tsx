// Import necessary modules and components
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext, useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { View, Image, TouchableOpacity } from 'react-native';

import { Context } from './UserID';
import getStyles from '../../styles/styles';

// Define the 'ProfilePicture' functional component
interface Props {}

const ProfilePicture: React.FC<Props> = () => {
    // Initialize state variables
    const [imageUri, setImageUri] = useState<string | null>(null); // Stores the URI of the selected profile image
    const { theme, setTheme } = useContext(Context); // Access the 'theme' from the user context

    // Get dynamic styles based on the current theme
    const styles = getStyles(theme);

    // Use the useEffect hook to load the stored profile image from AsyncStorage
    useEffect(() => {
        (async () => {
            const storedImage = await AsyncStorage.getItem('profileImage');
            if (storedImage) {
                setImageUri(storedImage);
            }
        })();
    }, []);

    // Function to handle the selection of a new profile image
    const handleChooseImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.cancelled) {
            setImageUri(result.uri); // Set the selected image URI
            await AsyncStorage.setItem('profileImage', result.uri); // Save the image URI to permanent storage (AsyncStorage)
        }
    };

    return (
        <View>
            <TouchableOpacity onPress={handleChooseImage}>
                {imageUri ? (
                    <Image
                        source={{ uri: imageUri }}
                        style={styles.profile_image}
                    />
                ) : (
                    <Image
                        source={require('../../assets/icon.png')}
                        style={styles.profile_image}
                    />
                )}
            </TouchableOpacity>
        </View>
    );
};

export default ProfilePicture;