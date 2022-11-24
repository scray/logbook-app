package com.example.demo.Objects;

public class Tour {
    private String userId;
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    private String tourId;
    public String getTourId() {
        return tourId;
    }

    public void setTourId(String tourId) {
        this.tourId = tourId;
    }

    private Waypoint[] waypoints;

    public Waypoint[] getWaypoints() {
        return waypoints;
    }

    public void setWaypoints(Waypoint[] waypoints) {
        this.waypoints = waypoints;
    }

    public Tour(){
        
    }
    
}
