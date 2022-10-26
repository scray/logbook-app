
import Geocoder from 'react-native-geocoding';
import * as Location from 'expo-location';
import { apikey } from "./../credentials"
export default async function ConvertCoorToAdr(longitude: number, latitude: number ){

    Location.setGoogleApiKey(apikey)
    console.log("!!!!!!!!!!!")
    let address = await Location.reverseGeocodeAsync({latitude,longitude})
    console.log("!!!!!!!!!!!" + address)

    Geocoder.init(apikey, {language : "de"});


    return await Geocoder.from(longitude, latitude)
		.then(json => {
        return JSON.stringify(json.results[0].address_components[0].short_name)
		})
		.catch(error => {
            console.warn(error)
            return "error"  
        })
    
}