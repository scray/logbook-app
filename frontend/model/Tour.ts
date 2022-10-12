import Coordinates from "./Coordinates";

interface Tour {
    userId: string
    travelId: string
    waypoints: Array<Coordinates>
}

export default Tour;
