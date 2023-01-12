export default class Coordinates{
    longitude: number;
    latitude: number;
    timestamp: number;


    public constructor(latitude: number, longitude: number, timestamp: number){
        this.longitude = longitude;
        this.latitude = latitude;
        this.timestamp = timestamp;
    }

    public getLongitude(): number{
        return this.longitude;
    }

    public getLatitude(): number{
        return this.latitude;
    }
    public getTimestamp(): number{
        return this.timestamp;
    }

}
