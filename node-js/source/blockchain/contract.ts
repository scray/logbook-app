import { Context, Contract } from 'fabric-contract-api';
import { Logger } from '..';
import { Prefix } from '../logger';
import { Asset } from './asset';

export class Contracts extends Contract {

    constructor() {
        super("ContractsContract");
    }

    public async Initialize(context: Context) {
        /* Set initialization paramters in this function and call it once the chaincode has been started. */

        Logger.write(Prefix.NORMAL, "The ledger will be initialized.");

        let entry = new Asset();
        entry.userId = "user-0";
        entry.travelId = "travel-0";
        entry.positions = "test-position"; //needs to be reworked into position array

        context.stub.putState("entry-0", Buffer.from(JSON.stringify(entry)));

        Logger.write(Prefix.SUCCESS, "Ledger has been put in final state.");
    }

    public async createEntry(context: Context, entryId: string, userId: string, travelId: string, positions: string) {
        /* Adding a new entry to the ledger with the given ID and details. */
        Logger.write(Prefix.NORMAL, "Added entry on id " + entryId + " to the chain.");

        let entry = new Asset();
        entry.userId = userId;
        entry.travelId = travelId;
        entry.positions = positions;

        context.stub.putState(entryId, Buffer.from(JSON.stringify(entry)));
    }

    public async getEntry(context: Context, entryId: string) {
        /* Requesting entry on a given id and return the valid entry or throw error */

        Logger.write(Prefix.NORMAL, "Request entry with the id " + entryId + " from the blockchain.");

        let bytes = await context.stub.getState(entryId);

        if (bytes.length <= 0)
            throw new Error("The required entry with id " + entryId + " is not available.");
        else
            Logger.write(Prefix.SUCCESS, "Entry with id " + entryId + " has been found.");

        return bytes.toString();
    }

    public async getAllEntries(context : Context)
    {
        /* TODO; */
    }
} 