import Coordinates from "../model/Coordinates";
import Tour from "../model/Tour";
import {Region} from "react-native-maps";
import {LocationObject} from "expo-location";
import * as httpRequests from "./httpRequests";

export let tours: Array<Tour> = [{
    userId: "testuser",
    tourId: "tourid1",
    waypoints: [new Coordinates(51.1, 11, 1), new Coordinates(51.2, 11, 2), new Coordinates(51.3, 11, 3)]
},{
    userId: "testuser",
    tourId: "tourid2",
    waypoints: [new Coordinates(51.1, 11, 1), new Coordinates(51.2, 11, 2), new Coordinates(51.3, 11, 3)]
},{
    userId: "testuser",
    tourId: "tourid3",
    waypoints: [new Coordinates(51.1, 11, 1), new Coordinates(51.2, 11, 2), new Coordinates(51.3, 11, 3)]
},{
    userId: "testuser",
    tourId: "tourid4",
    waypoints: [new Coordinates(51.1, 11, 1), new Coordinates(51.2, 11, 2), new Coordinates(51.3, 11, 3)]
},{
    userId: "testuser",
    tourId: "tourid5",
    waypoints: [new Coordinates(51.1, 11, 1), new Coordinates(51.2, 11, 2), new Coordinates(51.3, 11, 3)]
},{
    userId: "testuser",
    tourId: "tourid6",
    waypoints: [new Coordinates(51.1, 11, 1), new Coordinates(51.2, 11, 2), new Coordinates(51.3, 11, 3)]
},{
    userId: "testuser",
    tourId: "tourid7",
    waypoints: [new Coordinates(51.1, 11, 1), new Coordinates(51.2, 11, 2), new Coordinates(51.3, 11, 3)]
},{
    userId: "testuser",
    tourId: "tourid8",
    waypoints: [new Coordinates(51.1, 11, 1), new Coordinates(51.2, 11, 2), new Coordinates(51.3, 11, 3)]
},{
    userId: "testuser",
    tourId: "tourid9",
    waypoints: [new Coordinates(51.1, 11, 1), new Coordinates(51.2, 11, 2), new Coordinates(51.3, 11, 3)]
},{
    userId: "testuser",
    tourId: "tourid10",
    waypoints: [new Coordinates(51.1, 11, 1), new Coordinates(51.2, 11, 2), new Coordinates(51.3, 11, 3)]
},{
    userId: "testuser",
    tourId: "tourid11",
    waypoints: [new Coordinates(51.1, 11, 1), new Coordinates(51.2, 11, 2), new Coordinates(51.3, 11, 3)]
},{
    userId: "testuser",
    tourId: "tourid12",
    waypoints: [new Coordinates(51.1, 11, 1), new Coordinates(51.2, 11, 2), new Coordinates(51.3, 11, 3)]
},{
    userId: "testuser",
    tourId: "tourid13",
    waypoints: [new Coordinates(51.1, 11, 1), new Coordinates(51.2, 11, 2), new Coordinates(51.3, 11, 3)]
},{
    userId: "testuser",
    tourId: "tourid14",
    waypoints: [new Coordinates(51.1, 11, 1), new Coordinates(51.2, 11, 2), new Coordinates(51.3, 11, 3)]
},
]

export let currentTour: Tour | undefined

export function setCurrentTour(tour: Tour | undefined) {
    currentTour = tour;
}

export async function createTour(userId: string): Promise<Tour> {
    console.log("CREATING TOUR! " + userId)
    let tour = {
        userId: userId,
        tourId: "",
        waypoints: []
    }

    try {
        let res = await httpRequests.post("/" + userId, tour)
        tour.tourId = res.tourId
    } catch(error) {
        console.log("Unable to get a new tour id" + error + " Leave tour id empty")
    }
    return tour
}

export async function createWaypoint(currentTour: Tour, waypoint: Coordinates) {
    await httpRequests.put("/" + currentTour.userId + "/" + currentTour.tourId, waypoint);
    return waypoint;
}

export async function updateTourList(userId: string) {
    tours = await httpRequests.get("/" + userId);
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