import Coordinates from "../model/Coordinates";
import Tour from "../model/Tour";
import {Region} from "react-native-maps";
import {LocationObject} from "expo-location";

export const tours: Array<Tour> = [
    {
        userId: "Guenther69",
        travelId: "travelid1",
        waypoints: [new Coordinates(51.1, 11, 1), new Coordinates(51.2, 11, 2), new Coordinates(51.3, 11, 3)]
    },
    {
        userId: "Guenther69",
        travelId: "travelid1",
        waypoints: [new Coordinates(1, 11, 4), new Coordinates(2, 11, 5), new Coordinates(3, 11, 6)]
    },
    {
        userId: "Felix",
        travelId: "travelid1",
        waypoints: [new Coordinates(99, 11, 5), new Coordinates(98, 11, 40), new Coordinates(90, 11, 200)]
    }
]

export let currentTour: Tour | undefined

export function setCurrentTour(tour: Tour | undefined) {
    currentTour = tour;
}

export function createTour(userId: string): Tour {
    //example data
    return {
        userId,
        travelId: "abcdefghijklmnopqrstuvwxyz",
        waypoints: []
    }
}

export function createWaypoint(currentTour: Tour, location: LocationObject) {
    currentTour.waypoints.push(
        new Coordinates(
            location.coords.latitude,
            location.coords.longitude,
            location.timestamp
        )
    )
}

export function saveTour(tour: Tour) {
    tours.push(tour);
    //TODO: save tour to blockchain
}

export function updateTourList(userId: string) {
    //TODO: update tours from blockchain
}

export function getRegion(tour: Tour): Region {
    let minLat = 1000;
    let maxLat = -1000;
    let minLong = 1000;
    let maxLong = -1000;
    tour.waypoints.forEach(waypoint => {
        if (waypoint.latitude < minLat) minLat = waypoint.latitude;
        if (waypoint.latitude > maxLat) maxLat = waypoint.latitude;
        if (waypoint.longitude < minLong) minLong = waypoint.longitude;
        if (waypoint.longitude > maxLong) maxLong = waypoint.longitude;
    })
    return {
        latitude: (minLat + maxLat) / 2,
        longitude: (minLong + maxLong) / 2,
        latitudeDelta: maxLat - minLat + (maxLat - minLat) * 0.6,
        longitudeDelta: maxLong - minLong + (maxLong - minLong) * 0.6
    }
}
