import { Context, Contract } from 'fabric-contract-api';
import { Logger } from '..';
import { Prefix } from '../logger';
import { Asset, TemporaryAsset, Waypoint } from './asset';


export class Contracts extends Contract {

    constructor() {
        super("ContractsContract");
        Logger.write(Prefix.WARNING, "Contract has been started.");
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

    public async createTour(context: Context, entryId: string, userId: string, travelId: string, positions: string) {
        /* Adding a new entry to the ledger with the given ID and details. */
        Logger.write(Prefix.NORMAL, "Added entry on id " + entryId + " to the chain.");

        let entry = new Asset();
        entry.userId = userId;
        entry.travelId = travelId;
        entry.positions = positions;

        context.stub.putState(entryId, Buffer.from(JSON.stringify(entry)));
    }

    public async getTour(context: Context, entryId: string): Promise<Asset> {
        /* Requesting entry on a given id and return the valid entry or throw error */

        Logger.write(Prefix.NORMAL, "Request entry with the id " + entryId + " from the blockchain.");

        let bytes = await context.stub.getState(entryId);

        if (bytes.length <= 0)
            Logger.write(Prefix.ERROR, "The required entry with id " + entryId + " is not available.");
        else
            Logger.write(Prefix.SUCCESS, "Entry with id " + entryId + " has been found.");

        return JSON.parse(bytes.toString());
    }

    public async getTours(context : Context): Promise<Asset[]>
    {
        // iterating thru StateQueryObject to get Buffer values -> https://hyperledger.github.io/fabric-chaincode-node/release-1.4/api/tutorial-using-iterators.html
        let working = true;
        const begin = 'entry-0';
        const end = 'entry-9999';
        let entries = [];
        const iteration = await context.stub.getStateByRange(begin, end);

        while (working) {

            const state = await iteration.next();

            //  sate.value.value := Buffer
            if(state.value !== undefined && state.value.value !== undefined){
                const insert = JSON.parse(state.value.value.toString());
                const key = state.value.key;
                //entries.push({ key, insert }) entry consists of entryId and an Tour/Asset Objekt
                entries.push(insert)
            }
            //  if iterator is done, the query has finished and the while loop ends
            if(state.done){
                Logger.write(Prefix.SUCCESS,'Query finished!')
                working = false;
                await iteration.close()
            }
        }

        return entries;

    }
    public async changeEntries(context: Context, entryId: string, userId: string, travelId: string, positions: Waypoint[] ){
        let bytes = await context.stub.getState(travelId);
        // if the returned byte array is not empty overwrite it
        if(bytes.length > 0){
            let entry = new Asset();

            entry.userId = userId;
            entry.travelId = travelId;
            entry.positions = positions;

            context.stub.putState(entryId, Buffer.from(JSON.stringify(entry)));  

            Logger.write(Prefix.SUCCESS, 'Asset Changed.');

        }
        // if the byte array has no content log ERROR 
        else{
            Logger.write(Prefix.ERROR, 'Asset does not exist.');

        }
    }

    // add waypoint
    public async addWaypoint(context: Context, entryId: string, waypoint: Waypoint){
        
        let buffer = await context.stub.getState(entryId);
        // if data to entryID exists convert and add the waypoint
       if(buffer.length>0){
            let objekt = JSON.parse(buffer.toString())
            let positions = objekt.positions
            positions.push(waypoint) // add waypoint to list
            objekt.positions = positions
            context.stub.putState(entryId, Buffer.from(JSON.stringify(objekt)));
            Logger.write(Prefix.SUCCESS,'Positions Updated.')
       }
       else{
            Logger.write(Prefix.ERROR, 'EntryID does not exist.')
       }
    }


    /* Temporary Transactions */
    public async saveTempEntry(context: Context, entryId: string, data: string) {
        Logger.write(Prefix.NORMAL, "Some data has been written to the blockchain. (" + entryId + ")");

        let entry = new TemporaryAsset();
        entry.data = data;

        context.stub.putState(entryId, Buffer.from(JSON.stringify(entry)));
    }

    public async getTempEntry(context: Context, entryId: string) {
        Logger.write(Prefix.NORMAL, "Request entry with the id " + entryId + " from the blockchain.");

        let bytes = await context.stub.getState(entryId);

        if (bytes.length <= 0)
            Logger.write(Prefix.ERROR, "The required entry with id " + entryId + " is not available.");
        else
            Logger.write(Prefix.SUCCESS, "Entry with id " + entryId + " has been found.");

        return JSON.parse(bytes.toString());
    }
} 