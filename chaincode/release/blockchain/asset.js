"use strict";
/*
    Exact recreation of the object classes for the targeted blockchain operations.
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tour = exports.Waypoint = exports.User = void 0;
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
    constructor(userId, tourId, vehicleId) {
        this.finish = false;
        this.waypoints = [];
        this.userId = userId;
        this.tourId = tourId;
        this.vehicleId = vehicleId;
    }
}
exports.Tour = Tour;
