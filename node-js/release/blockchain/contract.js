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
    }
    Initialize(context) {
        return __awaiter(this, void 0, void 0, function* () {
            /* Set initialization paramters in this function and call it once the chaincode has been started. */
            __1.Logger.write(logger_1.Prefix.NORMAL, "The ledger will be initialized.");
            let entry = new asset_1.Asset();
            entry.userId = "user-0";
            entry.travelId = "travel-0";
            entry.positions = "test-position"; //needs to be reworked into position array
            context.stub.putState("entry-0", Buffer.from(JSON.stringify(entry)));
            __1.Logger.write(logger_1.Prefix.SUCCESS, "Ledger has been put in final state.");
        });
    }
    createEntry(context, entryId, userId, travelId, positions) {
        return __awaiter(this, void 0, void 0, function* () {
            /* Adding a new entry to the ledger with the given ID and details. */
            __1.Logger.write(logger_1.Prefix.NORMAL, "Added entry on id " + entryId + " to the chain.");
            let entry = new asset_1.Asset();
            entry.userId = userId;
            entry.travelId = travelId;
            entry.positions = positions;
            context.stub.putState(entryId, Buffer.from(JSON.stringify(entry)));
        });
    }
    getEntry(context, entryId) {
        return __awaiter(this, void 0, void 0, function* () {
            /* Requesting entry on a given id and return the valid entry or throw error */
            __1.Logger.write(logger_1.Prefix.NORMAL, "Request entry with the id " + entryId + " from the blockchain.");
            let bytes = yield context.stub.getState(entryId);
            if (bytes.length <= 0)
                throw new Error("The required entry with id " + entryId + " is not available.");
            else
                __1.Logger.write(logger_1.Prefix.SUCCESS, "Entry with id " + entryId + " has been found.");
            return bytes.toString();
        });
    }
}
exports.Contracts = Contracts;
