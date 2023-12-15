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
const asset_1 = require("./vehicle");
const logger_1 = require("../logger");

class TransportContract extends fabric_contract_api_1.Contract {
    constructor() {
        super("TransportContract");
        __1.Logger.write(logger_1.Prefix.WARNING, "TransportContract has been started.");
    }

    createTransport(context, transport) {
        return __awaiter(this, void 0, void 0, function* () {
            let data;
            __1.Logger.write(logger_1.Prefix.NORMAL, "Trying to create a transport with ID " + transport.id + ".");
            let bytes = yield context.stub.getState(transport.id);
            if (bytes.length < 1) {
                data = new asset_1.Transport(transport.id, transport.name, transport.emissionPerKm);
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
}

exports.TransportContract = TransportContract;
