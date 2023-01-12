"use strict";
/*
 * SPDX-License-Identifier: Apache-2.0
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FabCar = void 0;
const fabric_contract_api_1 = require("fabric-contract-api");
class FabCar extends fabric_contract_api_1.Contract {
    initLedger(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            console.info('============= START : Initialize Ledger ===========');
            const cars = [
                {
                    color: 'blue',
                    make: 'Toyota',
                    model: 'Prius',
                    owner: 'Tomoko',
                },
                {
                    color: 'red',
                    make: 'Ford',
                    model: 'Mustang',
                    owner: 'Brad',
                },
                {
                    color: 'green',
                    make: 'Hyundai',
                    model: 'Tucson',
                    owner: 'Jin Soo',
                },
                {
                    color: 'yellow',
                    make: 'Volkswagen',
                    model: 'Passat',
                    owner: 'Max',
                },
                {
                    color: 'black',
                    make: 'Tesla',
                    model: 'S',
                    owner: 'Adriana',
                },
                {
                    color: 'purple',
                    make: 'Peugeot',
                    model: '205',
                    owner: 'Michel',
                },
                {
                    color: 'white',
                    make: 'Chery',
                    model: 'S22L',
                    owner: 'Aarav',
                },
                {
                    color: 'violet',
                    make: 'Fiat',
                    model: 'Punto',
                    owner: 'Pari',
                },
                {
                    color: 'indigo',
                    make: 'Tata',
                    model: 'Nano',
                    owner: 'Valeria',
                },
                {
                    color: 'brown',
                    make: 'Holden',
                    model: 'Barina',
                    owner: 'Shotaro',
                },
            ];
            for (let i = 0; i < cars.length; i++) {
                cars[i].docType = 'car';
                yield ctx.stub.putState('CAR' + i, Buffer.from(JSON.stringify(cars[i])));
                console.info('Added <--> ', cars[i]);
            }
            console.info('============= END : Initialize Ledger ===========');
        });
    }
    queryCar(ctx, carNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            const carAsBytes = yield ctx.stub.getState(carNumber); // get the car from chaincode state
            if (!carAsBytes || carAsBytes.length === 0) {
                throw new Error(`${carNumber} does not exist`);
            }
            console.log(carAsBytes.toString());
            return carAsBytes.toString();
        });
    }
    createCar(ctx, carNumber, make, model, color, owner) {
        return __awaiter(this, void 0, void 0, function* () {
            console.info('============= START : Create Car ===========');
            const car = {
                color,
                docType: 'car',
                make,
                model,
                owner,
            };
            yield ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
            console.info('============= END : Create Car ===========');
        });
    }
    queryAllCars(ctx) {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function* () {
            const startKey = '';
            const endKey = '';
            const allResults = [];
            try {
                for (var _b = __asyncValues(ctx.stub.getStateByRange(startKey, endKey)), _c; _c = yield _b.next(), !_c.done;) {
                    const { key, value } = _c.value;
                    const strValue = Buffer.from(value).toString('utf8');
                    let record;
                    try {
                        record = JSON.parse(strValue);
                    }
                    catch (err) {
                        console.log(err);
                        record = strValue;
                    }
                    allResults.push({ Key: key, Record: record });
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            console.info(allResults);
            return JSON.stringify(allResults);
        });
    }
    changeCarOwner(ctx, carNumber, newOwner) {
        return __awaiter(this, void 0, void 0, function* () {
            console.info('============= START : changeCarOwner ===========');
            const carAsBytes = yield ctx.stub.getState(carNumber); // get the car from chaincode state
            if (!carAsBytes || carAsBytes.length === 0) {
                throw new Error(`${carNumber} does not exist`);
            }
            const car = JSON.parse(carAsBytes.toString());
            car.owner = newOwner;
            yield ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
            console.info('============= END : changeCarOwner ===========');
        });
    }
}
exports.FabCar = FabCar;
