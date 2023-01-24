import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { View, Image, TouchableOpacity, Alert } from 'react-native';


interface Props {}

const ProfilePicture: React.FC<Props> = () => {
    
    const [imageUri, setImageUri] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
          const storedImage = await AsyncStorage.getItem('profileImage');
          if (storedImage) {
            setImageUri(storedImage);
          }
        })();
      }, []);

    const handleChooseImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.cancelled) {
            setImageUri(result.uri);
            await AsyncStorage.setItem('profileImage', result.uri); // save imageUri to permanent storage
        }
    };

    return (
        <View>
            <TouchableOpacity onPress={handleChooseImage}>
                {imageUri ? (
                    <Image
                        source={{ uri: imageUri }}
                        style={{ width: 100, height: 100, borderRadius: 50 }}
                    />
                ) : (
                    <Image
                        source={require('../../assets/icon.png')}
                        style={{ width: 100, height: 100, borderRadius: 50 }}
                    />
                )}
            </TouchableOpacity>
        </View>
    );
};

export default ProfilePicture;