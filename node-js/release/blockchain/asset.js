"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tour = exports.Waypoint = exports.User = void 0;
/*
    Exact recreation of the object classes for the targeted blockchain operations.
*/
class User {
    constructor(userId) {
        this.tours = [];
        this.userId = userId;
    }
}
exports.User = User;
class Waypoint {
    constructor(longitude, latitude, timestamp) {
        this.longitude = longitude;
        this.latitude = latitude;
        this.timestamp = timestamp;
    }
}
exports.Waypoint = Waypoint;
class Tour {
    constructor(userId, tourId) {
        this.finish = false;
        this.waypoints = [];
        this.userId = userId;
        this.tourId = tourId;
    }
}
exports.Tour = Tour;
