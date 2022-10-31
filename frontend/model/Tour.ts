import Coordinates from "./Coordinates";

interface Tour {
    userId: string
    tourId: string
    waypoints: Array<Coordinates>
}

export default Tour;
