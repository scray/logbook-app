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

    public async createTour(context: Context, userId: string, tour: string) {
        /* Creating a tour with the given userId and tourId to fill it with waypoints.  */

        let bytes = await context.stub.getState(userId);

        if (bytes.length < 1)
            return false;

        let data: User = JSON.parse(bytes.toString());

        let tour_data: Tour = JSON.parse(tour);

        data.tours.push(tour_data);
        tour_data.tourId = data.tours.length.toString();

        context.stub.putState(userId, Buffer.from(JSON.stringify(data)));

        Logger.write(Prefix.NORMAL, "The tour " + tour_data.tourId + " for user " + userId + " has been generated.");

        return JSON.stringify(tour);
    }

    public async addWaypoint(context: Context, userId: string, tourId: string, waypoint: string) {
        /* Adding a waypoint to the given tourId from the given user with userId */

        let bytes = await context.stub.getState(userId);

        if (bytes.length < 1)
            return false;

        let data: User = JSON.parse(bytes.toString());

        let found = data.tours.find(element => element.tourId == tourId);

        if (!found)
            return false;

        let waypoint_data: Waypoint = JSON.parse(waypoint);

        found.waypoints.push(waypoint_data);

        context.stub.putState(userId, Buffer.from(JSON.stringify(data)));

        Logger.write(Prefix.NORMAL, "The waypoint " + waypoint + " for tour " + tourId + " for user " + userId + " has been generated.");

        return JSON.stringify(waypoint);
    }

    public async getTour(context: Context, userId: string, tourId: string) {
        /* Request the tour with the given tourId from the given user with userId */

        Logger.write(Prefix.NORMAL, "Request entry with the id " + userId + " from the blockchain.");

        let bytes = await context.stub.getState(userId);

        if (bytes.length <= 0) {
            Logger.write(Prefix.ERROR, "The required entry with id " + userId + " is not available.");
            return false;
        }

        let data: User = JSON.parse(bytes.toString());

        let found = data.tours.find(element => element.tourId == tourId);

        if (!found)
            return false;

        Logger.write(Prefix.SUCCESS, "Tour " + tourId + " for user " + userId + " has been found and sent to the requester.");

        return JSON.stringify(found);
    }

    public async getTours(context: Context, userId: string) {
        /* Request all tours from the given user with userId */

        Logger.write(Prefix.NORMAL, "Request entry with the id " + userId + " from the blockchain.");

        let bytes = await context.stub.getState(userId);

        if (bytes.length <= 0) {
            Logger.write(Prefix.ERROR, "The required entry with id " + userId + " is not available.");
            return false;
        }

        let data: User = JSON.parse(bytes.toString());

        Logger.write(Prefix.SUCCESS, "Tours for user " + userId + " has been found and sent to the requester.");

        return JSON.stringify(data.tours);
    }
}