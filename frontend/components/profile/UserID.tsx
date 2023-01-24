import { createContext, useEffect, useState } from "react";
import { ToastAndroid } from "react-native";
import UserContext from "../../api/userContext";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeUserId= async (value: string) => {//save Data to asyncStorage
    try {
      await AsyncStorage.setItem("userId", value).then(()=>{
        ToastAndroid.show("UserId " + value + " has been saved!", ToastAndroid.SHORT);
      });
    } catch (e) {
        console.error(e);
    }
}

export const getUserId = async () => {//get Data from asyncStorage
    try {
        return await AsyncStorage.getItem("userId").then((userId)=>{
            ToastAndroid.show("Loaded User ID " + userId + " from storage! ", ToastAndroid.SHORT);
            return userId;
          });
    } catch(e) {
        console.error(e);
        return "";
    }
}

export const Context = createContext<UserContext>({userId: "", setUserId: (value)=>{}});
