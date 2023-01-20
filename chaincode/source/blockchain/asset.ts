/*
    Exact recreation of the object classes for the targeted blockchain operations.
*/

export class User {
    userId: string;
    tours: Tour[] = [];

    constructor(userId: string) {
        this.userId = userId;
    }
}

export class Waypoint {
    longitude: number;
    latitude: number;
    timestamp: number;

    constructor(longitude: number, latitude: number, timestamp: number) {
        this.longitude = longitude;
        this.latitude = latitude;
        this.timestamp = timestamp;
    }
}

export class Tour {
    userId: string;
    tourId: string;
    finish: boolean = false;
    waypoints: Waypoint[] = [];

    constructor(userId: string, tourId: string) {
        this.userId = userId;
        this.tourId = tourId;
    }
}

