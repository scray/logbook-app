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
const asset_1 = require("./asset");
class Contracts extends fabric_contract_api_1.Contract {
    Initialize(context) {
        return __awaiter(this, void 0, void 0, function* () {
            /* Set initialization paramters in this function and call it once the chaincode has been started. */
            console.info("The ledger has been initialized.");
            let entry = new asset_1.Asset();
            entry.userId = "user-0";
            entry.travelId = "travel-0";
            entry.positions = "test-position"; //needs to be reworked into position array
            context.stub.putState("entry-0", Buffer.from(JSON.stringify(entry)));
            console.info("Ledger has been put in final state.");
        });
    }
    createEntry(context, entryId, userId, travelId, positions) {
        return __awaiter(this, void 0, void 0, function* () {
            /* Adding a new entry to the ledger with the given ID and details. */
            console.info("Added entry on id " + entryId + " to the chain.");
            let entry = new asset_1.Asset();
            entry.userId = userId;
            entry.travelId = travelId;
            entry.positions = positions;
            context.stub.putState(entryId, Buffer.from(JSON.stringify(entry)));
        });
    }
}
exports.Contracts = Contracts;
