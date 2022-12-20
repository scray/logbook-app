"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Travel = exports.Asset = exports.Waypoint = exports.TemporaryAsset = void 0;
class TemporaryAsset {
}
exports.TemporaryAsset = TemporaryAsset;
class Waypoint {
    constructor(longitude, latitude, timestamp) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.timestamp = timestamp;
    }
}
exports.Waypoint = Waypoint;
// Asset = Blockchain Object (without travelID)
class Asset {
}
exports.Asset = Asset;
// return for Backend (API)
class Travel {
    constructor(travelId, positions, userId) {
        this.travelId = travelId;
        this.positions = positions;
        this.userId = userId;
    }
}
exports.Travel = Travel;
