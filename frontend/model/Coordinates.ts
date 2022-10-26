export default class Coordinates{
    longitude: number;
    latitude: number;
    timestamp: number;


    public constructor(latitude: number, longitude: number , timestamp: number){
        this.latitude = latitude;
        this.longitude = longitude;
        this.timestamp = timestamp;
    }


    public getLatitude(): number{
        return this.latitude;
    }
    public getLongitude(): number{
        return this.longitude;
    }
    public getTimestamp(): number{
        return this.timestamp;
    }

}