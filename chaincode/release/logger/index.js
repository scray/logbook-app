"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerManager = exports.LoggerPrefix = exports.Colors = exports.Prefix = void 0;
const fs_extra_1 = require("fs-extra");
var Prefix;
(function (Prefix) {
    Prefix[Prefix["NORMAL"] = 0] = "NORMAL";
    Prefix[Prefix["WARNING"] = 1] = "WARNING";
    Prefix[Prefix["ERROR"] = 2] = "ERROR";
    Prefix[Prefix["SUCCESS"] = 3] = "SUCCESS";
})(Prefix = exports.Prefix || (exports.Prefix = {}));
var Colors;
(function (Colors) {
    Colors["Reset"] = "\u001B[0m";
    Colors["Bright"] = "\u001B[1m";
    Colors["Dim"] = "\u001B[2m";
    Colors["Underscore"] = "\u001B[4m";
    Colors["Blink"] = "\u001B[5m";
    Colors["Reverse"] = "\u001B[7m";
    Colors["Hidden"] = "\u001B[8m";
    Colors["FgBlack"] = "\u001B[30m";
    Colors["FgRed"] = "\u001B[31m";
    Colors["FgGreen"] = "\u001B[32m";
    Colors["FgYellow"] = "\u001B[33m";
    Colors["FgBlue"] = "\u001B[34m";
    Colors["FgMagenta"] = "\u001B[35m";
    Colors["FgCyan"] = "\u001B[36m";
    Colors["FgWhite"] = "\u001B[37m";
    Colors["BgBlack"] = "\u001B[40m";
    Colors["BgRed"] = "\u001B[41m";
    Colors["BgGreen"] = "\u001B[42m";
    Colors["BgYellow"] = "\u001B[43m";
    Colors["BgBlue"] = "\u001B[44m";
    Colors["BgMagenta"] = "\u001B[45m";
    Colors["BgCyan"] = "\u001B[46m";
    Colors["BgWhite"] = "\u001B[47m";
})(Colors = exports.Colors || (exports.Colors = {}));
class LoggerPrefix {
    constructor(name, id, color) {
        this.name = "";
        this.name = name;
        this.id = id;
        this.color = color;
    }
}
exports.LoggerPrefix = LoggerPrefix;
class LoggerManager {
    constructor() {
        this.prefixes = [];
        this.prefixes = [];
    }
    register(name, id, color) {
        this.prefixes.push(new LoggerPrefix(name, id, color));
    }
    find(id) {
        return this.prefixes.find(element => element.id == id);
    }
    write(id, text) {
        var prefix = this.find(id);
        if (prefix) {
            (0, fs_extra_1.appendFileSync)("./logs/" + prefix.name.toLowerCase() + ".log", "[" + new Date().toDateString() + "] " + text + "\n");
            console.info(prefix.color + "[" + prefix.name + "] " + Colors.Reset + text);
        }
    }
}
exports.LoggerManager = LoggerManager;
