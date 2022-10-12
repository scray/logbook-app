import Coordinates from "../model/Coordinates";
import Tour from "../model/Tour";

export const tours: Array<Tour> = []

export function createTour(userId: string): Tour {
    //example data
    return {
        userId,
        travelId: "abcdefghijklmnopqrstuvwxyz",
        waypoints: []
    }
}

export function createWaypoint(tour: Tour) {
    tour.waypoints.push(
        new Coordinates(
            0.0,
            0.0,
            new Date().getTime()
        )
    )
}
