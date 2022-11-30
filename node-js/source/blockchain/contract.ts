import { Context, Contract } from 'fabric-contract-api';
import { Logger } from '..';
import { Prefix } from '../logger';
import { Asset, TemporaryAsset, Tour, Waypoint } from './asset';


export class Contracts extends Contract {

    constructor() {
        super("ContractsContract");
        Logger.write(Prefix.WARNING, "Contract has been started.");
    }

    // NEW !!!
    // entry is now tourId
    // Asset-Object is now for saving on Blockchain 
    // tour-Object is now for transfer to Backend

    public async Initialize(context: Context) {
        /* Set initialization paramters in this function and call it once the chaincode has been started. */

        Logger.write(Prefix.NORMAL, "The ledger will be initialized.");

        let entry = new Asset();
        entry.userId = "user-0";
        //entry.tourId = "tour-0";   //tourId only in the returned tour Object to backend
        entry.positions = Waypoint[1];   //reworked to waypoint

        context.stub.putState("tour-0", Buffer.from(JSON.stringify(entry)));  //entry now tour

        Logger.write(Prefix.SUCCESS, "Ledger has been put in final state.");
    }

    public async createTour(context: Context, /*entryId: string,*/ userId: string, tourId: string, positions: Waypoint[]) { //entryId not needed entryId = tourId
        /* Adding a new entry to the ledger with the given ID and details. */
        Logger.write(Prefix.NORMAL, "Added entry on id " + tourId + " to the chain.");  //entryId now tourId

        let entry = new Asset();
        entry.userId = userId;
        //entry.tourId = tourId;     //tourId only in the returned tour Object to backend
        entry.positions = positions;

        context.stub.putState(tourId, Buffer.from(JSON.stringify(entry)));
    }
    //retrieve Asset from BC; add tourId to make it a tour Object; return tourObject
    public async getTour(context: Context, tourId: string): Promise<Tour> {     //entryId now tourId
        /* Requesting entry on a given id and return the valid entry or throw error */
        let tour: Tour
        Logger.write(Prefix.NORMAL, "Request entry with the id " + tourId + " from the blockchain.");

        let bytes = await context.stub.getState(tourId);

        if (bytes.length <= 0)
            Logger.write(Prefix.ERROR, "The required entry with id " + tourId + " is not available.");
        else
            Logger.write(Prefix.SUCCESS, "Entry with id " + tourId + " has been found.");
            let asset = JSON.parse(bytes.toString())
            tour = new Tour (tourId,asset.positions,asset.userId)

        return tour;
    }

    public async getTours(context : Context): Promise<Tour[]>
    {
        // iterating thru StateQueryObject to get Buffer values -> https://hyperledger.github.io/fabric-chaincode-node/release-1.4/api/tutorial-using-iterators.html
        let working = true;
        const begin = 'tour-0';
        const end = 'tour-9999';
        let entries = [];
        const iteration = await context.stub.getStateByRange(begin, end);

        while (working) {

            const state = await iteration.next();

            //  sate.value.value := Buffer
            //  make the Asset from BC to an tour, push and return the tourArray
            if(state.value !== undefined && state.value.value !== undefined){
                const asset = JSON.parse(state.value.value.toString());
                const key = state.value.key;
                const insert = new Tour(key, asset.positions, asset.userId)
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
    public async changeEntries(context: Context, /*entryId: string,*/ userId: string, tourID: string, positions: Waypoint[] ){
        let bytes = await context.stub.getState(tourID);
        // if the returned byte array is not empty overwrite it
        if(bytes.length > 0){
            let entry = new Asset();

            entry.userId = userId;
            //entry.tourId = tourId;     //tourId only in the returned tour Object to backend
            entry.positions = positions;

            context.stub.putState(tourID, Buffer.from(JSON.stringify(entry)));  

            Logger.write(Prefix.SUCCESS, 'Asset Changed.');

        }
        // if the byte array has no content log ERROR 
        else{
            Logger.write(Prefix.ERROR, 'Asset does not exist.');

        }
    }

    // add waypoint
    public async addWaypoint(context: Context, tourId: string, waypoint: Waypoint){ //tourId instead of entryId needed
        
        let buffer = await context.stub.getState(tourId);
        // if data to entryID exists convert and add the waypoint
       if(buffer.length>0){
            let objekt = JSON.parse(buffer.toString())
            let positions = objekt.positions
            positions.push(waypoint) // add waypoint to list
            objekt.positions = positions
            context.stub.putState(tourId, Buffer.from(JSON.stringify(objekt)));
            Logger.write(Prefix.SUCCESS,'Positions Updated.')
       }
       else{
            Logger.write(Prefix.ERROR, 'The tourId does not exist.')
       }
    }


    /* Temporary Transactions */        //entryId is now tourId
    public async saveTempEntry(context: Context, tourId: string, data: string) {
        Logger.write(Prefix.NORMAL, "Some data has been written to the blockchain. (" + tourId + ")");

        let entry = new TemporaryAsset();
        entry.data = data;

        context.stub.putState(tourId, Buffer.from(JSON.stringify(entry)));
    }

                                        //entryId is now tourId
    public async getTempEntry(context: Context, tourId: string) {
        Logger.write(Prefix.NORMAL, "Request entry with the id " + tourId + " from the blockchain.");

        let bytes = await context.stub.getState(tourId);

        if (bytes.length <= 0)
            Logger.write(Prefix.ERROR, "The required entry with id " + tourId + " is not available.");
        else
            Logger.write(Prefix.SUCCESS, "Entry with id " + tourId + " has been found.");

        return JSON.parse(bytes.toString());
    }
} 