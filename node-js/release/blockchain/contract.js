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
class Contracts extends fabric_contract_api_1.Contract {
    constructor() {
        super("ContractsContract");
        __1.Logger.write(logger_1.Prefix.WARNING, "Contract has been started.");
    }
    Initialize(context) {
        return __awaiter(this, void 0, void 0, function* () {
            /* Initializing an entry on user and tour id 0 / 0. With three different waypoints with non-real coordinates. */
            __1.Logger.write(logger_1.Prefix.NORMAL, "The ledger will be initialized.");
            let user = new asset_1.User("0");
            let waypoint = [];
            waypoint.push(new asset_1.Waypoint(1, 1, 100));
            waypoint.push(new asset_1.Waypoint(2, 2, 101));
            waypoint.push(new asset_1.Waypoint(3, 3, 103));
            let entry = new asset_1.Tour("0", "0");
            entry.waypoints = waypoint;
            user.tours.push(entry);
            context.stub.putState(entry.userId, Buffer.from(JSON.stringify(user)));
            __1.Logger.write(logger_1.Prefix.SUCCESS, "Ledger has been put in final state and has created an 0 id for tour and user.");
        });
    }
    createTour(context, userId, tourId) {
        return __awaiter(this, void 0, void 0, function* () {
            /* Creating a tour with the given userId and tourId to fill it with waypoints.  */
            let bytes = yield context.stub.getState(userId);
            if (bytes.length < 1)
                return false;
            let data = JSON.parse(bytes.toString());
            let index = data.tours.findIndex(element => element.tourId == tourId);
            if (index != -1)
                data.tours[index] = new asset_1.Tour(userId, tourId);
            else
                data.tours.push(new asset_1.Tour(userId, tourId));
            context.stub.putState(userId, Buffer.from(JSON.stringify(data)));
            __1.Logger.write(logger_1.Prefix.NORMAL, "The tour " + tourId + " for user " + userId + " has been generated.");
        });
    }
    getTour(context, userId, tourId) {
        return __awaiter(this, void 0, void 0, function* () {
            /* Request the tour with the given tourId from the given user with userId */
            __1.Logger.write(logger_1.Prefix.NORMAL, "Request entry with the id " + userId + " from the blockchain.");
            let bytes = yield context.stub.getState(userId);
            if (bytes.length <= 0)
                __1.Logger.write(logger_1.Prefix.ERROR, "The required entry with id " + userId + " is not available.");
            else {
                let data = JSON.parse(bytes.toString());
                let found = data.tours.find(element => element.tourId == tourId);
                if (found) {
                    __1.Logger.write(logger_1.Prefix.SUCCESS, "Tour " + tourId + " for user " + userId + " has been found and sent to the requester.");
                    return JSON.stringify(found);
                }
                else {
                    return false;
                }
            }
        });
    }
}
exports.Contracts = Contracts;
