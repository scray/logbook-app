import { appendFileSync } from "fs-extra";
import { Discord } from "./discord";

export enum Prefix {
    NORMAL,
    WARNING,
    ERROR,
    SUCCESS
}

export enum Colors {
    Reset = "\u001B[0m",
    Bright = "\u001B[1m",
    Dim = "\u001B[2m",
    Underscore = "\u001B[4m",
    Blink = "\u001B[5m",
    Reverse = "\u001B[7m",
    Hidden = "\u001B[8m",
    FgBlack = "\u001B[30m",
    FgRed = "\u001B[31m",
    FgGreen = "\u001B[32m",
    FgYellow = "\u001B[33m",
    FgBlue = "\u001B[34m",
    FgMagenta = "\u001B[35m",
    FgCyan = "\u001B[36m",
    FgWhite = "\u001B[37m",
    BgBlack = "\u001B[40m",
    BgRed = "\u001B[41m",
    BgGreen = "\u001B[42m",
    BgYellow = "\u001B[43m",
    BgBlue = "\u001B[44m",
    BgMagenta = "\u001B[45m",
    BgCyan = "\u001B[46m",
    BgWhite = "\u001B[47m"
}

export class LoggerPrefix {

    name: string = "";
    id: number;
    color: Colors;

    constructor(name: string, id: number, color: Colors) {
        this.name = name;
        this.id = id;
        this.color = color;
    }
}

export class LoggerManager {

    prefixes: LoggerPrefix[] = [];
    discord : Discord;

    constructor() {
        this.prefixes = [];
        this.discord = new Discord();
    }

    register(name: string, id: number, color: Colors) {
        this.prefixes.push(new LoggerPrefix(name, id, color));
    }

    find(id: number) {
        return this.prefixes.find(element => element.id == id);
    }

    write(id: number, text: string) {
        var prefix = this.find(id);
        if (prefix) {
            appendFileSync("./logs/" + prefix.name.toLowerCase() + ".log", "[" + new Date().toDateString() + "] " + text + "\n")
            console.info(prefix.color + "[" + prefix.name + "] " + Colors.Reset + text);
            this.discord.send(prefix.name, text);
        }
    }
}
