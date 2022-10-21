import { Context, Contract } from 'fabric-contract-api';
import { Asset } from './asset';

export class Contracts extends Contract {

    public async Initialize(context: Context) {
        /* Set initialization paramters in this function and call it once the chaincode has been started. */

        console.info("The ledger has been initialized.");

        let entry = new Asset();
        entry.userId = "user-0";
        entry.travelId = "travel-0";
        entry.positions = "test-position"; //needs to be reworked into position array

        context.stub.putState("entry-0", Buffer.from(JSON.stringify(entry)));

        console.info("Ledger has been put in final state.");
    }

    public async createEntry(context: Context, entryId: string, userId: string, travelId: string, positions: string) {
        /* Adding a new entry to the ledger with the given ID and details. */

        console.info("Added entry on id " + entryId + " to the chain.");

        let entry = new Asset();
        entry.userId = userId;
        entry.travelId = travelId;
        entry.positions = positions;

        context.stub.putState(entryId, Buffer.from(JSON.stringify(entry)));
    }
} 