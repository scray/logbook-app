"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contracts = void 0;
const fabric_contract_api_1 = require("fabric-contract-api");
const __1 = require("..");
const logger_1 = require("../logger");
const asset_1 = require("./asset");
const vehicle_1 = require("./vehicle")

const haversineDistance = require("../../libs/cf-calculator/cf-calculation.js");
class Contracts extends fabric_contract_api_1.Contract {
    constructor() {
        super("ContractsContract");
        __1.Logger.write(logger_1.Prefix.WARNING, "Contract has been started.");
    }


    createTour(context, userId, vehicleId, tour) {
        return __awaiter(this, void 0, void 0, function* () {
            /* Creating a tour with the given userId and tourId to fill it with waypoints.  */
            let data;
            __1.Logger.write(logger_1.Prefix.NORMAL, "Trying to create a tour for user id " + userId + ".");
            let bytes = yield context.stub.getState(userId);
            if (bytes.length < 1) {
                data = new asset_1.User(userId);
                __1.Logger.write(logger_1.Prefix.WARNING, "State data was empty on createTour, creating a new user instead and going on with procedure.");
            }
            try {
                data = JSON.parse(bytes.toString());
            }
            catch (e) {
                __1.Logger.write(logger_1.Prefix.WARNING, "User (" + userId + ") does not exist. Creating a new user.");
                __1.Logger.write(logger_1.Prefix.ERROR, "Exception catched: " + e + ".");
                data = new asset_1.User(userId);
            }
            let tour_data = JSON.parse(tour);
            tour_data.tourId = data.tours.length.toString();
            tour_data.vehicleId = vehicleId;
            data.tours.push(tour_data);
            context.stub.putState(userId, Buffer.from(JSON.stringify(data)));
            __1.Logger.write(logger_1.Prefix.NORMAL, "The tour " + tour_data.tourId + " for user " + userId + " has been generated.");
            __1.Logger.write(logger_1.Prefix.NORMAL, tour);
            return JSON.stringify(tour_data);
        });


    }

    //returns all trips, not one distance
    //need userId or TourId to be integrated
    calculateDistances(tour) {
        const T_Distances = [];
        const waypoints = tour.waypoints;
        for (var i = 0; i < waypoints.length; i++){
            if (waypoints[i+1] == null) break;
            const lon1 = waypoints[i].longitude;
            const lat1 = waypoints[i].latitude;
            const time1 = waypoints[i].timestamp;

            const lon2 = waypoints[i+1].longitude;
            const lat2 = waypoints[i+1].latitude;
            const time2 = waypoints[i+1].timestamp;

            const distance = haversineDistance(lon1, lat1, lon2, lat2);

            console.log(distance);
            const time = time2 - time1;

            T_Distances.push({ distance: distance, time: time });

            __1.Logger.write(logger_1.Prefix.NORMAL, "Distance for " + Tour.tourId + " is:: " + distance);
            __1.Logger.write(logger_1.Prefix.NORMAL, "Time for " + Tour.tourId + " is:: " + time);
        }
        return T_Distances;
    }

    addWaypoint(context, userId, tourId, waypoint) {
        return __awaiter(this, void 0, void 0, function* () {
            /* Adding a waypoint to the given tourId from the given user with userId */
            __1.Logger.write(logger_1.Prefix.NORMAL, "Trying to add Waypoint");
            let bytes = yield context.stub.getState(userId);
            if (bytes.length < 1) {
                __1.Logger.write(logger_1.Prefix.ERROR, "No such user with id" + userId);
                return false;
            }
            let data = JSON.parse(bytes.toString());
            let found = data.tours.find(element => element.tourId == tourId);
            if (!found) {
                __1.Logger.write(logger_1.Prefix.ERROR, "No such tour with id" + tourId);
                return false;
            }
            let waypoint_data = JSON.parse(waypoint);
            found.waypoints.push(waypoint_data);
            context.stub.putState(userId, Buffer.from(JSON.stringify(data)));
            __1.Logger.write(logger_1.Prefix.NORMAL, "The waypoint " + waypoint + " for tour " + tourId + " for user " + userId + " has been generated.");
            __1.Logger.write(logger_1.Prefix.NORMAL, JSON.stringify(data));
            return JSON.stringify(waypoint_data);
        });
    }

    getTour(context, userId, tourId) {
        return __awaiter(this, void 0, void 0, function* () {
            /* Request the tour with the given tourId from the given user with userId */
            __1.Logger.write(logger_1.Prefix.NORMAL, " Request the tour with the given tourId from the given user with " + userId);
            __1.Logger.write(logger_1.Prefix.NORMAL, "Request entry with the id " + userId + " from the blockchain.");
            let bytes = yield context.stub.getState(userId);
            if (bytes.length <= 0) {
                __1.Logger.write(logger_1.Prefix.ERROR, "The required entry with id " + userId + " is not available.");
                return false;
            }
            let data = JSON.parse(bytes.toString());
            let found = data.tours.find(element => element.tourId == tourId);
            if (!found)
                return false;
            __1.Logger.write(logger_1.Prefix.SUCCESS, "Tour " + tourId + " for user " + userId + " has been found and sent to the requester.");
            return JSON.stringify(found);
        });
    }

    getTours(context, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            /* Request all tours from the given user with userId */
            __1.Logger.write(logger_1.Prefix.NORMAL, " Test message of user: " + userId);
            __1.Logger.write(logger_1.Prefix.NORMAL, "Request entry with the id " + userId + " from the blockchain.");
            let bytes = yield context.stub.getState(userId);
            if (bytes.length <= 0) {
                __1.Logger.write(logger_1.Prefix.ERROR, "The required entry with id " + userId + " is not available.");
                return false;
            }
            let data = JSON.parse(bytes.toString());
            __1.Logger.write(logger_1.Prefix.SUCCESS, "Tours for user " + userId + " has been found and sent to the requester.");
            return JSON.stringify(data.tours);
        });
    }

    createTransport(context, transport) {
            return __awaiter(this, void 0, void 0, function* () {
                let data;
                __1.Logger.write(logger_1.Prefix.NORMAL, "Trying to create a transport with ID " + transport.id + ".");
                let bytes = yield context.stub.getState(transport.id);
                if (bytes.length < 1) {
                    data = new asset_1.Vehicle(transport.id, transport.name, transport.emissionPerKm);
                } else {
                    __1.Logger.write(logger_1.Prefix.WARNING, "Transport with ID " + transport.id + " already exists. Updating the data.");
                    data = JSON.parse(bytes.toString());
                    data.name = transport.name;
                    data.emissionPerKm = transport.emissionPerKm;
                }
                context.stub.putState(transport.id, Buffer.from(JSON.stringify(data)));
                __1.Logger.write(logger_1.Prefix.NORMAL, "Transport with ID " + transport.id + " has been created/updated.");
                return JSON.stringify(data);
            });
        }

    getTransport(context, transportId) {
        return __awaiter(this, void 0, void 0, function* () {
            __1.Logger.write(logger_1.Prefix.NORMAL, " Requesting transport with ID " + transportId + " from the blockchain.");
            let bytes = yield context.stub.getState(transportId);
            if (bytes.length <= 0) {
                __1.Logger.write(logger_1.Prefix.ERROR, "The required transport with ID " + transportId + " is not available.");
                return false;
            }
            let data = JSON.parse(bytes.toString());
            __1.Logger.write(logger_1.Prefix.SUCCESS, "Transport with ID " + transportId + " has been found and sent to the requester.");
            return JSON.stringify(data);
        });
    }

    calculateTotalDistance(context, userId) {
            return __awaiter(this, void 0, void 0, function* () {
                __1.Logger.write(logger_1.Prefix.NORMAL, "Calculating total distance for user: " + userId);

                let bytes = yield context.stub.getState(userId);
                if (bytes.length < 1) {
                    __1.Logger.write(logger_1.Prefix.ERROR, "No such user with id " + userId);
                    return false;
                }

                let data = JSON.parse(bytes.toString());
                let totalDistance = 0;

                data.tours.forEach((tour) => {
                    totalDistance += this.calculateTourDistance(tour);
                });

                __1.Logger.write(logger_1.Prefix.SUCCESS, "Total distance calculated for user " + userId + ": " + totalDistance);
                return totalDistance;
            });
        }

    calculateTourDistance(tour) {
        let tourDistance = 0;
        const waypoints = tour.waypoints;

        for (let i = 0; i < waypoints.length - 1; i++) {
            const lon1 = waypoints[i].longitude;
            const lat1 = waypoints[i].latitude;
            const lon2 = waypoints[i + 1].longitude;
            const lat2 = waypoints[i + 1].latitude;

            tourDistance += haversineDistance(lon1, lat1, lon2, lat2);
        }

        return tourDistance;
    }

     calculateAverageTourTime(context, userId) {
            return __awaiter(this, void 0, void 0, function* () {
                __1.Logger.write(logger_1.Prefix.NORMAL, "Calculating average tour time for user: " + userId);

                let bytes = yield context.stub.getState(userId);
                if (bytes.length < 1) {
                    __1.Logger.write(logger_1.Prefix.ERROR, "No such user with id " + userId);
                    return false;
                }

                let data = JSON.parse(bytes.toString());
                let totalTourTime = 0;
                let totalTours = data.tours.length;

                data.tours.forEach((tour) => {
                            const tourTime = this.calculateTourTime(tour);
                            if (tourTime > 0) {
                                totalTourTime += tourTime;
                                totalTours++;
                            }
                        });

                if (totalTours === 0) {
                    __1.Logger.write(logger_1.Prefix.ERROR, "No tours available for user " + userId);
                    return false;
                }

                const averageTourTimeInSeconds = totalTourTime / totalTours;
                const averageTourTimeInHours = averageTourTimeInSeconds / 3600;


                __1.Logger.write(logger_1.Prefix.SUCCESS, "Average tour time calculated for user " + userId + ": " + averageTourTime + " seconds");
                return averageTourTime;
            });
        }

        calculateTourTime(tour) {
            const waypoints = tour.waypoints;
            if (waypoints.length < 2) {
                __1.Logger.write(logger_1.Prefix.ERROR, "Tour " + tour.tourId + " has less than two waypoints. Unable to calculate tour time.");
                return 0;
            }

            const firstWaypointTime = waypoints[0].timestamp;
            const lastWaypointTime = waypoints[waypoints.length - 1].timestamp;

            return lastWaypointTime - firstWaypointTime;
        }

}
exports.Contracts = Contracts;
