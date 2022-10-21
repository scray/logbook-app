"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contracts = exports.Logger = void 0;
const contract_1 = require("./blockchain/contract");
const logger_1 = require("./logger");
exports.Logger = new logger_1.LoggerManager();
exports.Logger.register("LOG", logger_1.Prefix.NORMAL, logger_1.Colors.FgWhite);
exports.Logger.register("WARNING", logger_1.Prefix.WARNING, logger_1.Colors.FgYellow);
exports.Logger.register("ERROR", logger_1.Prefix.ERROR, logger_1.Colors.FgRed);
exports.Logger.register("SUCCESS", logger_1.Prefix.SUCCESS, logger_1.Colors.FgGreen);
exports.Logger.write(logger_1.Prefix.SUCCESS, "The ledger has been started and is trying to work. :)");
exports.contracts = [contract_1.Contracts];