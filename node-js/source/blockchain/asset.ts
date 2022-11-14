export class TemporaryAsset{
    data : string;
}
export class Waypoint{
    longitude : number;
    latitude : number;
    timestamp : number;

    constructor(longitude : number, latitude : number, timestamp : number){
        this.latitude = latitude;
        this.longitude = longitude;
        this.timestamp = timestamp;
    }
}

export class Asset{
    userId : string;
    travelId : string;
    positions : Waypoint[];
}
