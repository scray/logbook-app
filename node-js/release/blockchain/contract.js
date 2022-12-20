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
            /* Set initialization paramters in this function and call it once the chaincode has been started. */
            __1.Logger.write(logger_1.Prefix.NORMAL, "The ledger will be initialized.");
            let entry = new asset_1.Asset();
            entry.userId = "user-0";
            //entry.tourId = "tour-0";   //tourId only in the returned tour Object to backend
            entry.positions = asset_1.Waypoint[1]; //reworked to waypoint
            context.stub.putState("tour-0", Buffer.from(JSON.stringify(entry))); //entry now tour
            __1.Logger.write(logger_1.Prefix.SUCCESS, "Ledger has been put in final state.");
        });
    }
    createTour(context, /*entryId: string,*/ userId, travelId, positions) {
        return __awaiter(this, void 0, void 0, function* () {
            /* Adding a new entry to the ledger with the given ID and details. */
            __1.Logger.write(logger_1.Prefix.NORMAL, "Added entry on id " + travelId + " to the chain."); //entryId now tourId
            let entry = new asset_1.Asset();
            entry.userId = userId;
            //entry.travelId = travelId;     //travelId only in the returned Travel Object to backend
            entry.positions = JSON.parse(positions);
            context.stub.putState(travelId, Buffer.from(JSON.stringify(entry)));
        });
    }
    //retrieve Asset from BC; add travelId to make it a Travel Object; return TravelObject
    getTour(context, travelId) {
        return __awaiter(this, void 0, void 0, function* () {
            /* Requesting entry on a given id and return the valid entry or throw error */
            let tour;
            __1.Logger.write(logger_1.Prefix.NORMAL, "Request entry with the id " + travelId + " from the blockchain.");
            let bytes = yield context.stub.getState(travelId);
            if (bytes.length <= 0)
                __1.Logger.write(logger_1.Prefix.ERROR, "The required entry with id " + travelId + " is not available.");
            else
                __1.Logger.write(logger_1.Prefix.SUCCESS, "Entry with id " + travelId + " has been found.");
            let asset = JSON.parse(bytes.toString());
            tour = new asset_1.Travel(travelId, asset.positions, asset.userId);
            return JSON.stringify(travelId);
        });
    }
    getTours(context) {
        return __awaiter(this, void 0, void 0, function* () {
            // iterating thru StateQueryObject to get Buffer values -> https://hyperledger.github.io/fabric-chaincode-node/release-1.4/api/tutorial-using-iterators.html
            let working = true;
            const begin = 'tour-0';
            const end = 'tour-9999';
            let entries = [];
            const iteration = yield context.stub.getStateByRange(begin, end);
            while (working) {
                const state = yield iteration.next();
                //  sate.value.value := Buffer
                //  make the Asset from BC to an tour, push and return the tourArray
                if (state.value !== undefined && state.value.value !== undefined) {
                    const asset = JSON.parse(state.value.value.toString());
                    const key = state.value.key;
                    const insert = new asset_1.Travel(key, asset.positions, asset.userId);
                    entries.push(insert);
                }
                //  if iterator is done, the query has finished and the while loop ends
                if (state.done) {
                    __1.Logger.write(logger_1.Prefix.SUCCESS, 'Query finished!');
                    working = false;
                    yield iteration.close();
                }
            }
            return JSON.stringify(entries);
        });
    }
    changeEntries(context, /*entryId: string,*/ userId, travelId, positions) {
        return __awaiter(this, void 0, void 0, function* () {
            let bytes = yield context.stub.getState(travelId);
            // if the returned byte array is not empty overwrite it
            if (bytes.length > 0) {
                let entry = new asset_1.Asset();
                entry.userId = userId;
                //entry.travelId = travelId;     //travelId only in the returned Travel Object to backend
                entry.positions = JSON.parse(positions);
                context.stub.putState(travelId, Buffer.from(JSON.stringify(entry)));
                __1.Logger.write(logger_1.Prefix.SUCCESS, 'Asset Changed.');
            }
            // if the byte array has no content log ERROR 
            else {
                __1.Logger.write(logger_1.Prefix.ERROR, 'Asset does not exist.');
            }
        });
    }
    // add waypoint
    addWaypoint(context, travelId, waypoint) {
        return __awaiter(this, void 0, void 0, function* () {
            let buffer = yield context.stub.getState(travelId);
            // if data to entryID exists convert and add the waypoint
            if (buffer.length > 0) {
                let objekt = JSON.parse(buffer.toString());
                let positions = objekt.positions;
                positions.push(JSON.parse(waypoint)); // add waypoint to list
                objekt.positions = positions;
                context.stub.putState(travelId, Buffer.from(JSON.stringify(objekt)));
                __1.Logger.write(logger_1.Prefix.SUCCESS, 'Positions Updated.');
            }
            else {
                __1.Logger.write(logger_1.Prefix.ERROR, 'The tourId does not exist.');
            }
        });
    }
    /* Temporary Transactions */ //entryId is now tourId
    saveTempEntry(context, tourId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            __1.Logger.write(logger_1.Prefix.NORMAL, "Some data has been written to the blockchain. (" + tourId + ")");
            let entry = new asset_1.TemporaryAsset();
            entry.data = data;
            context.stub.putState(tourId, Buffer.from(JSON.stringify(entry)));
        });
    }
    //entryId is now tourId
    getTempEntry(context, tourId) {
        return __awaiter(this, void 0, void 0, function* () {
            __1.Logger.write(logger_1.Prefix.NORMAL, "Request entry with the id " + tourId + " from the blockchain.");
            let bytes = yield context.stub.getState(tourId);
            if (bytes.length <= 0)
                __1.Logger.write(logger_1.Prefix.ERROR, "The required entry with id " + tourId + " is not available.");
            else
                __1.Logger.write(logger_1.Prefix.SUCCESS, "Entry with id " + tourId + " has been found.");
            return bytes.toString();
        });
    }
}
exports.Contracts = Contracts;
