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

    // ==================== BENUTZER-AUTORISIERUNG ==================== //

    /**
     * Prüft ob der aktuelle Benutzer autorisiert ist, Änderungen vorzunehmen
     */
    static checkWriteAuthorization(context, operation) {
        const clientIdentity = context.clientIdentity;
        const crtUserId = clientIdentity.getID();
        __1.Logger.write(logger_1.Prefix.NORMAL, `User ${crtUserId} attempting ${operation}`);

        const authorizedUsers = [
            'x509::/CN=alice/OU=admin::/C=DE/ST=Baden/L=Bretten/O=peer801.hso.dlt.s-node.de/CN=ca.peer801.hso.dlt.s-node.de'
        ];


        if (!authorizedUsers.includes(crtUserId)) {
            __1.Logger.write(logger_1.Prefix.ERROR, `User ${crtUserId} is not authorized for ${operation}`);
            throw new Error(`User is not authorized to ${operation}. Only Alice can modify tours.`);
        }

        __1.Logger.write(logger_1.Prefix.SUCCESS, `User ${crtUserId} authorized for ${operation}`);
        return true;
    }

    /**
     * Extrahiert den Benutzernamen aus der Client-Identität
     */
    static extractUsername(clientId) {
        // Extrahiere CN (Common Name) aus der X.509 Identität
        const match = clientId.match(/CN=([^/]+)/);
        return match ? match[1] : 'unknown';
    }

    // ==================== GEOGRAFISCHE VALIDIERUNG ==================== //

    /**
     * Prüft ob Koordinaten in Deutschland liegen
     */
    static isInGermany(latitude, longitude) {
        // Deutschland ungefähre Grenzen
        const minLat = 47.3;   // Südgrenze (Bodensee)
        const maxLat = 55.0;   // Nordgrenze (Dänemark)
        const minLon = 5.9;    // Westgrenze (Niederlande)
        const maxLon = 15.0;   // Ostgrenze (Polen)

        return latitude >= minLat && latitude <= maxLat &&
            longitude >= minLon && longitude <= maxLon;
    }

    /**
     * Prüft ob Koordinaten in Europa liegen
     */
    static isInEurope(latitude, longitude) {
        // Rough geographic boundaries of Europe
        const minLat = 34.0;   // Southern Europe (e.g. Crete, Greece)
        const maxLat = 72.0;   // Northern Europe (e.g. northern Norway)
        const minLon = -25.0;  // Western edge (e.g. Azores)
        const maxLon = 45.0;   // Eastern edge (e.g. Ural mountains)

        return latitude >= minLat && latitude <= maxLat &&
            longitude >= minLon && longitude <= maxLon;
    }

    /**
     * Prüft ob Koordinaten in der Schweiz liegen
     */
    static isInSwitzerland(latitude, longitude) {
        // Schweiz ungefähre Grenzen
        const minLat = 45.8;   // Südgrenze
        const maxLat = 47.8;   // Nordgrenze
        const minLon = 5.9;    // Westgrenze
        const maxLon = 10.5;   // Ostgrenze

        return latitude >= minLat && latitude <= maxLat &&
            longitude >= minLon && longitude <= maxLon;
    }

    /**
     * Validiert Waypoint basierend auf Tour-Einstellungen
     */
    static validateWaypointLocation(waypoint, internationaleFahrten) {
        const latitude = waypoint.latitude;
        const longitude = waypoint.longitude;

        __1.Logger.write(logger_1.Prefix.NORMAL,
            `Validating waypoint: lat=${latitude}, lon=${longitude}, intl=${JSON.stringify(internationaleFahrten)}`);

        // Default: nur Inland erlaubt
        if (!internationaleFahrten || Object.keys(internationaleFahrten).length === 0) {
            internationaleFahrten = { inland: true, eu: false, eu_ch: false };
        }

        // Prüflogik basierend auf internationaleFahrten
        if (internationaleFahrten.inland && !internationaleFahrten.eu && !internationaleFahrten.eu_ch) {
            // Nur Inland erlaubt
            if (!Contracts.isInGermany(latitude, longitude)) {
                __1.Logger.write(logger_1.Prefix.ERROR, 'Waypoint außerhalb Deutschlands');
                throw new Error('Waypoint außerhalb Deutschlands. Diese Tour erlaubt nur Inlandsfahrten.');
            }
        } else if (internationaleFahrten.eu && !internationaleFahrten.eu_ch) {
            // EU erlaubt (aber nicht Schweiz)
            if (!Contracts.isInEurope(latitude, longitude)) {
                __1.Logger.write(logger_1.Prefix.ERROR, 'Waypoint außerhalb der EU');
                throw new Error('Waypoint außerhalb der EU. Diese Tour erlaubt nur EU-Fahrten.');
            }
            // Zusätzlich prüfen dass es nicht in der Schweiz ist
            if (Contracts.isInSwitzerland(latitude, longitude)) {
                __1.Logger.write(logger_1.Prefix.ERROR, 'Waypoint in der Schweiz, aber nur EU erlaubt');
                throw new Error('Waypoint in der Schweiz. Diese Tour erlaubt nur EU-Fahrten (ohne Schweiz).');
            }
        } else if (internationaleFahrten.eu_ch) {
            // EU + Schweiz erlaubt
            if (!Contracts.isInEurope(latitude, longitude) && !Contracts.isInSwitzerland(latitude, longitude)) {
                __1.Logger.write(logger_1.Prefix.ERROR, 'Waypoint außerhalb EU/Schweiz');
                throw new Error('Waypoint außerhalb EU/Schweiz. Diese Tour erlaubt nur Fahrten in EU und Schweiz.');
            }
        }

        __1.Logger.write(logger_1.Prefix.SUCCESS, 'Waypoint location validated successfully');
        return true;
    }

    // ==================== CONTRACT METHODEN ==================== //

    createTour(context, userId, vehicleId, tour) {
        return __awaiter(this, void 0, void 0, function* () {
            // Autorisierung prüfen
            Contracts.checkWriteAuthorization(context, 'create tour');

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

    updateTour(context, userId, tourId, updatedTourJson) {
        return __awaiter(this, void 0, void 0, function* () {
            // Autorisierung prüfen
            Contracts.checkWriteAuthorization(context, 'update tour');

            __1.Logger.write(logger_1.Prefix.NORMAL, "Trying to update tour " + tourId + " for user " + userId);

            let bytes = yield context.stub.getState(userId);
            if (bytes.length < 1) {
                __1.Logger.write(logger_1.Prefix.ERROR, "No such user with id " + userId);
                return false;
            }

            let userData = JSON.parse(bytes.toString());
            let tourIndex = userData.tours.findIndex(tour => tour.tourId === tourId);

            if (tourIndex === -1) {
                __1.Logger.write(logger_1.Prefix.ERROR, "No such tour with id " + tourId + " for user " + userId);
                return false;
            }

            try {
                let updatedTourData = JSON.parse(updatedTourJson);

                updatedTourData.userId = userData.tours[tourIndex].userId;
                updatedTourData.tourId = userData.tours[tourIndex].tourId;

                userData.tours[tourIndex] = updatedTourData;

                yield context.stub.putState(userId, Buffer.from(JSON.stringify(userData)));

                __1.Logger.write(logger_1.Prefix.SUCCESS, "Tour " + tourId + " for user " + userId + " has been updated successfully.");

                return JSON.stringify(userData.tours[tourIndex]);

            } catch (error) {
                __1.Logger.write(logger_1.Prefix.ERROR, "Error parsing updated tour data: " + error);
                return false;
            }
        });
    }

    addWaypoint(context, userId, tourId, waypoint) {
        return __awaiter(this, void 0, void 0, function* () {
            // Autorisierung prüfen
            Contracts.checkWriteAuthorization(context, 'add waypoint');

            /* Adding a waypoint to the given tourId from the given user with userId */
            __1.Logger.write(logger_1.Prefix.NORMAL, "Trying to add Waypoint");
            let bytes = yield context.stub.getState(userId);
            if (bytes.length < 1) {
                __1.Logger.write(logger_1.Prefix.ERROR, "No such user with id " + userId);
                return false;
            }
            let data = JSON.parse(bytes.toString());
            let found = data.tours.find(element => element.tourId == tourId);
            if (!found) {
                __1.Logger.write(logger_1.Prefix.ERROR, "No such tour with id " + tourId);
                return false;
            }

            // Parse waypoint data
            let waypoint_data = JSON.parse(waypoint);

            try {
                // Hole internationale Fahrten Einstellungen der Tour
                const internationaleFahrten = found.internationaleFahrten || {
                    inland: true,
                    eu: false,
                    eu_ch: false
                };

                // Validiere Waypoint Location
                Contracts.validateWaypointLocation(waypoint_data, internationaleFahrten);

            } catch (validationError) {
                __1.Logger.write(logger_1.Prefix.ERROR,
                    "Waypoint validation failed: " + validationError.message);
                // Werfe den Fehler weiter, damit er an den Client zurückgegeben wird
                throw validationError;
            }
            // Waypoint hinzufügen wenn Validierung erfolgreich
            found.waypoints.push(waypoint_data);
            context.stub.putState(userId, Buffer.from(JSON.stringify(data)));
            __1.Logger.write(logger_1.Prefix.NORMAL, "The waypoint " + waypoint + " for tour " + tourId + " for user " + userId + " has been generated.");
            __1.Logger.write(logger_1.Prefix.NORMAL, JSON.stringify(data));
            return JSON.stringify(waypoint_data);
        });
    }

    // READ-ONLY METHODEN (keine Autorisierung nötig)

    getTour(context, userId, tourId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Keine Autorisierung nötig - alle dürfen lesen
            const clientIdentity = context.clientIdentity;
            const crtUserId = clientIdentity.getID();
            const username = Contracts.extractUsername(crtUserId);
            __1.Logger.write(logger_1.Prefix.NORMAL, `User ${username} reading tour ${tourId}`);

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
            // Keine Autorisierung nötig - alle dürfen lesen
            const clientIdentity = context.clientIdentity;
            const crtUserId = clientIdentity.getID();
            const username = Contracts.extractUsername(crtUserId);
            __1.Logger.write(logger_1.Prefix.NORMAL, `User ${username} reading tours for ${userId}`);

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
            // Autorisierung prüfen
            Contracts.checkWriteAuthorization(context, 'create transport');

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
            // Keine Autorisierung nötig - alle dürfen lesen
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

    // CALCULATION METHODEN (Read-Only)

    calculateTotalDistance(context, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Keine Autorisierung nötig - alle dürfen lesen
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
            // Keine Autorisierung nötig - alle dürfen lesen
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
            const roundedAverageTourTimeInHours = +averageTourTimeInHours.toFixed(2);

            __1.Logger.write(logger_1.Prefix.SUCCESS, "Average tour time calculated for user " + userId + ": " + averageTourTimeInHours + " hours");
            return averageTourTimeInHours;
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

    calculateCO2(tour) {
        const waypoints = tour.waypoints;
        let totalCO2 = 0;

        for (let i = 0; i < waypoints.length - 1; i++) {
            const lon1 = waypoints[i].longitude;
            const lat1 = waypoints[i].latitude;
            const lon2 = waypoints[i + 1].longitude;
            const lat2 = waypoints[i + 1].latitude;
            const distance = haversineDistance(lon1, lat1, lon2, lat2);

            const emissionPerKm = tour.vehicle.emissionPerKm;
            const CO2ForSegment = distance * emissionPerKm;

            totalCO2 += CO2ForSegment;
        }

        return totalCO2;
    }

    calculateAverageCO2(context, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Keine Autorisierung nötig - alle dürfen lesen
            __1.Logger.write(logger_1.Prefix.NORMAL, "Calculating average CO2 for user: " + userId);

            let bytes = yield context.stub.getState(userId);
            if (bytes.length < 1) {
                __1.Logger.write(logger_1.Prefix.ERROR, "No such user with id " + userId);
                return false;
            }

            let data = JSON.parse(bytes.toString());
            let totalCO2 = 0;
            let totalTours = 0;

            data.tours.forEach((tour) => {
                const CO2ForTour = this.calculateCO2(tour);
                if (CO2ForTour > 0) {
                    totalCO2 += CO2ForTour;
                    totalTours++;
                }
            });

            if (totalTours === 0) {
                __1.Logger.write(logger_1.Prefix.ERROR, "No tours available for user " + userId);
                return false;
            }

            const averageCO2 = totalCO2 / totalTours;

            __1.Logger.write(logger_1.Prefix.SUCCESS, "Average CO2 calculated for user " + userId + ": " + averageCO2);
            return averageCO2;
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

            __1.Logger.write(logger_1.Prefix.NORMAL, "Distance for " + tour.tourId + " is:: " + distance);
            __1.Logger.write(logger_1.Prefix.NORMAL, "Time for " + tour.tourId + " is:: " + time);
        }
        return T_Distances;
    }
}
exports.Contracts = Contracts;