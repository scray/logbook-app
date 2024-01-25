// Import necessary modules and components
import React, { useContext, useEffect, useState } from "react";
import { Platform, View, Text } from "react-native";
import * as Location from "expo-location";
import { showToast } from "../components/util/Toast";
import TourStartButton from "../components/tourManagement/TourStartButton"; // Importing the TourStartButton component
import Map from "../components/map/Map"; // Importing the Map component
import { Context } from "../components/profile/UserID"; // Importing the user context
import getStyles from "../styles/styles"; // Importing style-related functions
import Tour from "../model/Tour"; // Importing the Tour model
import Coordinates from "../model/Coordinates"; // Importing the Coordinates model
import { createTour, createWaypoint } from "../api/tourManagement"; // Importing API functions

// Define the StartTour component
export default function StartTour() {
  // Define state variables to manage the current tour, permission status, start time, and current time
  const [runningTour, setRunningTour] = useState<Tour>();
  const { userId, theme } = useContext(Context);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const styles = getStyles(theme); // Retrieve styles based on the current theme

  // Function to handle the start/stop button toggle
  async function onButtonToggle(state: string): Promise<boolean> {
    console.log(state, permissionGranted, userId);
    if (state === "start" && permissionGranted && userId) {
      console.log("Trying to start a tour");
      return createTour(userId)
        .then((tour) => {
          setRunningTour(tour);
          showToast("Created a new tour for " + userId);
          captureWaypoint();
          setStartTime(Date.now());
          return true;
        })
        .catch((error) => {
          showToast(error.message);
          setRunningTour(undefined);
          return false;
        });
    } else if (runningTour) {
      setRunningTour(undefined);
      return false;
    }
    return new Promise((resolve) => {
      resolve(true);
    });
  }

  // UseEffect hook to request location permissions on Android
  useEffect(() => {
    if (!permissionGranted && Platform.OS === "android") {
      let isMounted = true;
      Location.requestForegroundPermissionsAsync()
        .then(({ status }) => {
          if (status === "granted") {
            Location.requestBackgroundPermissionsAsync().then(({ status }) => {
              if (isMounted) {
                if (status === "granted") {
                  setPermissionGranted(true);
                } else {
                  console.log("Background Permission NOT granted!!!");
                }
              }
            });
          } else {
            console.log("Foreground Permission NOT granted!!!");
          }
        });
      return () => {
        isMounted = false;
        setPermissionGranted(false);
      };
    }
  }, []);

  // Function to capture a waypoint and add it to the running tour
  function captureWaypoint() {
    if (runningTour) {
      console.log(
        "Running Tour: " +
          JSON.stringify(runningTour) +
          " with userid: " +
          userId
      );
      Location.getCurrentPositionAsync()
        .then((location) => {
          if (runningTour) {
            console.log(
              "New waypoint: " +
                location.coords.latitude +
                ", " +
                location.coords.longitude
            );
            createWaypoint(
              runningTour,
              new Coordinates(
                location.coords.latitude,
                location.coords.longitude,
                location.timestamp
              )
            )
              .then((wp) => {
                console.log(runningTour);
                runningTour.waypoints.push(wp);
                setRunningTour(runningTour);
              })
              .catch((error) => {
                showToast(error.message);
              });
          }
        })
        .catch((error) => {
          console.log(
            "If you are trying to get the location via the emulator or web, this is NOT possible!",
            error
          );
        });
    }
  }

  // UseEffect hook to periodically capture waypoints
  useEffect(() => {
    captureWaypoint();
    const interval = setInterval(() => {
      captureWaypoint();
    }, 10000);
    return () => clearInterval(interval);
  }, [runningTour]);

  // UseEffect hook to update the current time every 100 milliseconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Function to format elapsed time into hours, minutes, seconds, and milliseconds
  function getFormattedTimeString(elapsedTime: number) {
    const seconds = Math.floor((elapsedTime / 1000) % 60);
    const minutes = Math.floor((elapsedTime / 1000 / 60) % 60);
    const hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);
    const milliseconds = Math.floor((elapsedTime % 1000) / 100);
    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
  }

  return (
    <View style={styles.starttour_container}>
      {runningTour && (
        <Text style={styles.starttour_text}>
          {getFormattedTimeString(currentTime - startTime)}
        </Text>
      )}
      <View style={styles.starttour_mapContainer}>
        {runningTour ? (
          <Map selectedTour={runningTour} size={50} />
        ) : (
          <Text style={styles.starttour_text} numberOfLines={1}>
            Press the button to either start or stop a tour
          </Text>
        )}
      </View>
      <TourStartButton onPress={onButtonToggle} />
    </View>
  );
}
