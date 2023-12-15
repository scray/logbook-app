"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.vehicle = void 0;

class Vehicle {
    constructor(id, name, emissionPerKm) {
        this.id = id;
        this.name = name;
        this.emissionPerKm = emissionPerKm;
    }
}

exports.vehicle = Vehicle;
