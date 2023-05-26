package org.scray.logbookappApi.Objects;

public class Waypoint {
    private float longitude;
    public float getLongitude() {
        return longitude;
    }

    public void setLongitude(float longitude) {
        this.longitude = longitude;
    }

    private float latitude;
    public float getLatitude() {
        return latitude;
    }

    public void setLatitude(float latitude) {
        this.latitude = latitude;
    }

    private long timestamp;

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    public Waypoint() {

    }

    public Waypoint(float latitude,float longitude,long timestamp){
        this.longitude = longitude;
        this.latitude = latitude;
        this.timestamp = timestamp;
    }

	@Override
	public String toString() {
		return "Waypoint [longitude=" + longitude + ", latitude=" + latitude + ", timestamp=" + timestamp + "]";
	}


}