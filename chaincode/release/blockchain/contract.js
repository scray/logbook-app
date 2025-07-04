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

    /**
     * Prüft, ob der Benutzer ein Admin ist basierend auf dem Zertifikat
     */
    static isAdmin(clientIdentity) {
        try {

            const ou = clientIdentity.getAttributeValue('ou');
            const mspId = clientIdentity.getMSPID();
            const clientId = clientIdentity.getID();

            __1.Logger.write(logger_1.Prefix.NORMAL,
                `Checking admin status - OU: ${ou}, MSP: ${mspId}, ID: ${clientId}`);

            if (ou && ou.toLowerCase() === 'admin') {
                return true;
            }

            const ouMatch = clientId.match(/OU=([^/:]+)/);
            if (ouMatch && ouMatch[1].toLowerCase() === 'admin') {
                return true;
            }

            if (mspId && mspId.includes('Admin')) {
                return true;
            }

            return false;
        } catch (error) {
            __1.Logger.write(logger_1.Prefix.ERROR,
                `Error checking admin status: ${error.message}`);
            return false;
        }
    }

    /**
     * Prüft die Autorisierung für Schreiboperationen
     */
    static checkWriteAuthorization(context, operation) {
        const clientIdentity = context.clientIdentity;
        const clientId = clientIdentity.getID();
        const username = Contracts.extractUsername(clientId);

        __1.Logger.write(logger_1.Prefix.NORMAL,
            `User ${username} attempting ${operation}`);

        if (!Contracts.isAdmin(clientIdentity)) {
            __1.Logger.write(logger_1.Prefix.ERROR,
                `User ${username} is not authorized for ${operation} - admin role required`);
            throw new Error(`User ${username} is not authorized to ${operation}. Admin role required.`);
        }

        __1.Logger.write(logger_1.Prefix.SUCCESS,
            `User ${username} (admin) authorized for ${operation}`);
        return true;
    }

    /**
     * Prüft die Autorisierung für Leseoperationen
     * Alle authentifizierten Benutzer dürfen lesen
     */
    static checkReadAuthorization(context, operation) {
        const clientIdentity = context.clientIdentity;
        const clientId = clientIdentity.getID();
        const username = Contracts.extractUsername(clientId);

        __1.Logger.write(logger_1.Prefix.NORMAL,
            `User ${username} attempting ${operation}`);

        // Alle authentifizierten Benutzer dürfen lesen
        // Die Authentifizierung erfolgt bereits durch Fabric
        __1.Logger.write(logger_1.Prefix.SUCCESS,
            `User ${username} authorized for ${operation}`);

        return true;
    }

    /**
     * Extrahiert den Benutzernamen aus der Client ID
     */
    static extractUsername(clientId) {
        const match = clientId.match(/CN=([^/]+)/);
        return match ? match[1] : 'unknown';
    }

    /**
     * Nützlich für Debugging und Audit
     */
    getUserInfo(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const clientIdentity = context.clientIdentity;

            const userInfo = {
                id: clientIdentity.getID(),
                mspId: clientIdentity.getMSPID(),
                username: Contracts.extractUsername(clientIdentity.getID()),
                isAdmin: Contracts.isAdmin(clientIdentity),
                attributes: {}
            };

            try {
                userInfo.attributes.ou = clientIdentity.getAttributeValue('ou');
            } catch (e) {
                // Attribut existiert möglicherweise nicht
            }

            try {
                userInfo.attributes.role = clientIdentity.getAttributeValue('role');
            } catch (e) {
                // Attribut existiert möglicherweise nicht
            }

            __1.Logger.write(logger_1.Prefix.NORMAL,
                `User info requested: ${JSON.stringify(userInfo)}`);

            return JSON.stringify(userInfo);
        });
    }

    static isInGermany(latitude, longitude) {
        const minLat = 47.3;
        const maxLat = 55.0;
        const minLon = 5.9;
        const maxLon = 15.0;

        return latitude >= minLat && latitude <= maxLat &&
            longitude >= minLon && longitude <= maxLon;
    }

    static isInEurope(latitude, longitude) {
        const minLat = 34.0;
        const maxLat = 72.0;
        const minLon = -25.0;
        const maxLon = 45.0;

        return latitude >= minLat && latitude <= maxLat &&
            longitude >= minLon && longitude <= maxLon;
    }

    static isInSwitzerland(latitude, longitude) {
        const minLat = 45.8;
        const maxLat = 47.8;
        const minLon = 5.9;
        const maxLon = 10.5;

        return latitude >= minLat && latitude <= maxLat &&
            longitude >= minLon && longitude <= maxLon;
    }

    static validateWaypointLocation(waypoint, internationaleFahrten) {
        const latitude = waypoint.latitude;
        const longitude = waypoint.longitude;

        __1.Logger.write(logger_1.Prefix.NORMAL,
            `Validating waypoint: lat=${latitude}, lon=${longitude}, intl=${JSON.stringify(internationaleFahrten)}`);

        if (!internationaleFahrten || Object.keys(internationaleFahrten).length === 0) {
            internationaleFahrten = { inland: true, eu: false, eu_ch: false };
        }

        if (internationaleFahrten.inland && !internationaleFahrten.eu && !internationaleFahrten.eu_ch) {
            if (!Contracts.isInGermany(latitude, longitude)) {
                __1.Logger.write(logger_1.Prefix.ERROR, 'Waypoint außerhalb Deutschlands');
                throw new Error('Waypoint außerhalb Deutschlands. Diese Tour erlaubt nur Inlandsfahrten.');
            }
        } else if (internationaleFahrten.eu && !internationaleFahrten.eu_ch) {
            if (!Contracts.isInEurope(latitude, longitude)) {
                __1.Logger.write(logger_1.Prefix.ERROR, 'Waypoint außerhalb der EU');
                throw new Error('Waypoint außerhalb der EU. Diese Tour erlaubt nur EU-Fahrten.');
            }
            if (Contracts.isInSwitzerland(latitude, longitude)) {
                __1.Logger.write(logger_1.Prefix.ERROR, 'Waypoint in der Schweiz, aber nur EU erlaubt');
                throw new Error('Waypoint in der Schweiz. Diese Tour erlaubt nur EU-Fahrten (ohne Schweiz).');
            }
        } else if (internationaleFahrten.eu_ch) {
            if (!Contracts.isInEurope(latitude, longitude) && !Contracts.isInSwitzerland(latitude, longitude)) {
                __1.Logger.write(logger_1.Prefix.ERROR, 'Waypoint außerhalb EU/Schweiz');
                throw new Error('Waypoint außerhalb EU/Schweiz. Diese Tour erlaubt nur Fahrten in EU und Schweiz.');
            }
        }

        __1.Logger.write(logger_1.Prefix.SUCCESS, 'Waypoint location validated successfully');
        return true;
    }

    // Phase 1 des Zwei-Phasen-Commits: Bereitet Upload vor und prüft Autorisierung
    prepareDocument(context, userId, tourId, documentJson) {
        return __awaiter(this, void 0, void 0, function* () {
            Contracts.checkWriteAuthorization(context, 'prepare document upload');

            __1.Logger.write(logger_1.Prefix.NORMAL,
                "Preparing document upload for tour " + tourId);

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

            let document = JSON.parse(documentJson);
            document.status = "PENDING";
            document.preparedAt = Date.now();
            document.expiresAt = Date.now() + (5 * 60 * 1000); // 5 Minuten Timeout

            if (!found.documents) {
                found.documents = [];
            }

            const existingIndex = found.documents.findIndex(doc => doc.fileName === document.fileName);
            if (existingIndex >= 0) {
                document.version = (found.documents[existingIndex].version || 1) + 1;
                found.documents[existingIndex] = document;
            } else {
                document.version = 1;
                found.documents.push(document);
            }

            yield context.stub.putState(userId, Buffer.from(JSON.stringify(data)));

            __1.Logger.write(logger_1.Prefix.SUCCESS,
                "Document upload prepared for " + document.fileName);

            return JSON.stringify(document);
        });
    }

    // Phase 3 des Zwei-Phasen-Commits: Finalisiert Upload mit S3 Key
    commitDocument(context, userId, tourId, fileName, s3Key) {
        return __awaiter(this, void 0, void 0, function* () {
            Contracts.checkWriteAuthorization(context, 'commit document upload');

            __1.Logger.write(logger_1.Prefix.NORMAL,
                "Committing document " + fileName + " with S3 key " + s3Key);

            let bytes = yield context.stub.getState(userId);
            if (bytes.length < 1) {
                return false;
            }

            let data = JSON.parse(bytes.toString());
            let found = data.tours.find(element => element.tourId == tourId);
            if (!found || !found.documents) {
                return false;
            }

            let document = found.documents.find(doc => doc.fileName === fileName);
            if (!document) {
                __1.Logger.write(logger_1.Prefix.ERROR, "Document not found: " + fileName);
                return false;
            }

            if (document.status !== "PENDING") {
                __1.Logger.write(logger_1.Prefix.ERROR,
                    "Document not in PENDING state: " + document.status);
                return false;
            }

            // Timeout-Prüfung
            if (Date.now() > document.expiresAt) {
                __1.Logger.write(logger_1.Prefix.ERROR, "Document preparation expired");
                document.status = "EXPIRED";
                yield context.stub.putState(userId, Buffer.from(JSON.stringify(data)));
                return false;
            }

            document.s3Key = s3Key;
            document.status = "ACTIVE";
            document.committedAt = Date.now();
            delete document.preparedAt;
            delete document.expiresAt;

            yield context.stub.putState(userId, Buffer.from(JSON.stringify(data)));

            __1.Logger.write(logger_1.Prefix.SUCCESS,
                "Document " + fileName + " committed successfully");

            return JSON.stringify(document);
        });
    }

    // Rollback bei Fehler: Bricht Upload ab
    abortDocument(context, userId, tourId, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            Contracts.checkWriteAuthorization(context, 'abort document upload');

            __1.Logger.write(logger_1.Prefix.NORMAL,
                "Aborting document upload for " + fileName);

            let bytes = yield context.stub.getState(userId);
            if (bytes.length < 1) {
                return false;
            }

            let data = JSON.parse(bytes.toString());
            let found = data.tours.find(element => element.tourId == tourId);
            if (!found || !found.documents) {
                return false;
            }

            let documentIndex = found.documents.findIndex(doc => doc.fileName === fileName);
            if (documentIndex < 0) {
                return false;
            }

            let document = found.documents[documentIndex];

            if (document.status === "PENDING") {
                if (document.version === 1) {
                    found.documents.splice(documentIndex, 1);
                } else {
                    document.status = "ABORTED";
                    document.abortedAt = Date.now();
                }

                yield context.stub.putState(userId, Buffer.from(JSON.stringify(data)));

                __1.Logger.write(logger_1.Prefix.SUCCESS,
                    "Document upload aborted for " + fileName);
                return true;
            }

            return false;
        });
    }

    addDocument(context, userId, tourId, documentJson) {
        return __awaiter(this, void 0, void 0, function* () {
            Contracts.checkWriteAuthorization(context, 'add document');

            __1.Logger.write(logger_1.Prefix.NORMAL, "Trying to add document to tour " + tourId);

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

            let document = JSON.parse(documentJson);

            if (!found.documents) {
                found.documents = [];
            }

            const existingDoc = found.documents.find(doc => doc.fileName === document.fileName);
            if (existingDoc) {
                __1.Logger.write(logger_1.Prefix.WARNING, "Document with same filename already exists, updating");
                Object.assign(existingDoc, document);
            } else {
                found.documents.push(document);
            }

            yield context.stub.putState(userId, Buffer.from(JSON.stringify(data)));

            __1.Logger.write(logger_1.Prefix.SUCCESS,
                "Document " + document.fileName + " added to tour " + tourId);

            return JSON.stringify(document);
        });
    }

    updateDocument(context, userId, tourId, fileName, updatedDocumentJson) {
        return __awaiter(this, void 0, void 0, function* () {
            Contracts.checkWriteAuthorization(context, 'update document');

            __1.Logger.write(logger_1.Prefix.NORMAL,
                "Trying to update document " + fileName + " in tour " + tourId);

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

            if (!found.documents) {
                found.documents = [];
            }

            let updatedDocument = JSON.parse(updatedDocumentJson);

            const documentIndex = found.documents.findIndex(doc => doc.fileName === fileName);

            if (documentIndex === -1) {
                __1.Logger.write(logger_1.Prefix.ERROR,
                    "Document " + fileName + " not found in tour " + tourId);
                return false;
            }

            if (!updatedDocument.uploadDate) {
                updatedDocument.uploadDate = found.documents[documentIndex].uploadDate;
            }

            updatedDocument.fileName = fileName;
            found.documents[documentIndex] = updatedDocument;

            yield context.stub.putState(userId, Buffer.from(JSON.stringify(data)));

            __1.Logger.write(logger_1.Prefix.SUCCESS,
                "Document " + fileName + " updated in tour " + tourId);

            return JSON.stringify(updatedDocument);
        });
    }

    // Leseoperationen - nur Autorisierung für Lesen erforderlich
    getDocuments(context, userId, tourId) {
        return __awaiter(this, void 0, void 0, function* () {
            Contracts.checkReadAuthorization(context, 'read documents');

            let bytes = yield context.stub.getState(userId);
            if (bytes.length <= 0) {
                __1.Logger.write(logger_1.Prefix.ERROR,
                    "The required entry with id " + userId + " is not available.");
                return false;
            }

            let data = JSON.parse(bytes.toString());
            let found = data.tours.find(element => element.tourId == tourId);
            if (!found) {
                __1.Logger.write(logger_1.Prefix.ERROR, "No such tour with id " + tourId);
                return false;
            }

            const documents = found.documents || [];

            __1.Logger.write(logger_1.Prefix.SUCCESS,
                "Documents for tour " + tourId + " retrieved successfully");

            return JSON.stringify(documents);
        });
    }

    createTour(context, userId, vehicleId, tour) {
        return __awaiter(this, void 0, void 0, function* () {
            Contracts.checkWriteAuthorization(context, 'create tour');

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
            Contracts.checkWriteAuthorization(context, 'add waypoint');

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

            let waypoint_data = JSON.parse(waypoint);

            try {
                const internationaleFahrten = found.internationaleFahrten || {
                    inland: true,
                    eu: false,
                    eu_ch: false
                };

                Contracts.validateWaypointLocation(waypoint_data, internationaleFahrten);

            } catch (validationError) {
                __1.Logger.write(logger_1.Prefix.ERROR,
                    "Waypoint validation failed: " + validationError.message);
                throw validationError;
            }

            found.waypoints.push(waypoint_data);
            context.stub.putState(userId, Buffer.from(JSON.stringify(data)));
            __1.Logger.write(logger_1.Prefix.NORMAL, "The waypoint " + waypoint + " for tour " + tourId + " for user " + userId + " has been generated.");
            __1.Logger.write(logger_1.Prefix.NORMAL, JSON.stringify(data));
            return JSON.stringify(waypoint_data);
        });
    }

    // Leseoperationen
    getTour(context, userId, tourId) {
        return __awaiter(this, void 0, void 0, function* () {
            Contracts.checkReadAuthorization(context, 'read tour');

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
            Contracts.checkReadAuthorization(context, 'read tours');

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
            Contracts.checkReadAuthorization(context, 'read transport');

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

    // Berechnungsmethoden - nur Leserechte erforderlich
    calculateTotalDistance(context, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            Contracts.checkReadAuthorization(context, 'calculate total distance');

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
            Contracts.checkReadAuthorization(context, 'calculate average tour time');

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
            Contracts.checkReadAuthorization(context, 'calculate average CO2');

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