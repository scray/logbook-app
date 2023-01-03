import { ThreadAutoArchiveDuration } from 'discord.js';
import { Context, Contract } from 'fabric-contract-api';
import { Logger } from '..';
import { Prefix } from '../logger';
import { Tour, Waypoint, User } from './asset';

export class Contracts extends Contract {

    constructor() {
        super("ContractsContract");
        Logger.write(Prefix.WARNING, "Contract has been started.");
    }

    public async Initialize(context: Context) {
        /* Initializing an entry on user and tour id 0 / 0. With three different waypoints with non-real coordinates. */

        Logger.write(Prefix.NORMAL, "The ledger will be initialized.");

        let user = new User("0");

        let waypoint = [];

        waypoint.push(new Waypoint(1, 1, 100))
        waypoint.push(new Waypoint(2, 2, 101));
        waypoint.push(new Waypoint(3, 3, 103));

        let entry = new Tour("0", "0");
        entry.waypoints = waypoint;

        user.tours.push(entry);

        context.stub.putState(entry.userId, Buffer.from(JSON.stringify(user)));

        Logger.write(Prefix.SUCCESS, "Ledger has been put in final state and has created an 0 id for tour and user.");
    }

    public async createTour(context: Context, userId: string, tourId: string) {
        /* Creating a tour with the given userId and tourId to fill it with waypoints.  */

        let bytes = await context.stub.getState(userId);

        if (bytes.length < 1)
            return false;

        let data: User = JSON.parse(bytes.toString());

        let index = data.tours.findIndex(element => element.tourId == tourId);

        if (index != -1)
            data.tours[index] = new Tour(userId, tourId);
        else
            data.tours.push(new Tour(userId, tourId));

        context.stub.putState(userId, Buffer.from(JSON.stringify(data)));

        Logger.write(Prefix.NORMAL, "The tour " + tourId + " for user " + userId + " has been generated.");
    }

    public async getTour(context: Context, userId: string, tourId: string) {
        /* Request the tour with the given tourId from the given user with userId */

        Logger.write(Prefix.NORMAL, "Request entry with the id " + userId + " from the blockchain.");

        let bytes = await context.stub.getState(userId);

        if (bytes.length <= 0)
            Logger.write(Prefix.ERROR, "The required entry with id " + userId + " is not available.");
        else {
            let data: User = JSON.parse(bytes.toString());

            let found = data.tours.find(element => element.tourId == tourId);

            if (found) {
                Logger.write(Prefix.SUCCESS, "Tour " + tourId + " for user " + userId + " has been found and sent to the requester.");
                return JSON.stringify(found);
            } else {
                return false;
            }
        }
    }
} 