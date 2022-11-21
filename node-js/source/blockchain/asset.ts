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

// Asset = Blockchain Object (without travelID)
export class Asset{
    userId : string;
    positions : Waypoint[];
}

// return for Backend (API)
export class Travel {
    travelId: string // are now entries the travelId 
    positions : Waypoint[];
    userId : string;
    constructor(travelId: string, positions: Waypoint[], userId: string){
        this.travelId = travelId
        this.positions = positions
        this.userId = userId
    }
}