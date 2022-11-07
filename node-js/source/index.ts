import { Contracts } from "./blockchain/contract";
import { Colors, LoggerManager, Prefix } from "./logger";
import { Discord } from "./logger/discord";

export var Logger = new LoggerManager();

Logger.register("LOG", Prefix.NORMAL, Colors.FgWhite);
Logger.register("WARNING", Prefix.WARNING, Colors.FgYellow);
Logger.register("ERROR", Prefix.ERROR, Colors.FgRed);
Logger.register("SUCCESS", Prefix.SUCCESS, Colors.FgGreen);

Logger.write(Prefix.SUCCESS, "The ledger has been started and is trying to work. :)");

export const contracts: any[] = [Contracts];
