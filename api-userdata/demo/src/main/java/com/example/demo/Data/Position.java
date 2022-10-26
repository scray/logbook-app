package com.example.demo.Data;

import java.sql.Timestamp;;

public class Position {
    float longitude, latitude;
    Timestamp time;

    public Position (float longitude, float latitude, Timestamp time){
        this.longitude = longitude;
        this.latitude = latitude;
        this.time = time;
    }

    public String getPosition(){
        return (Float.toString(longitude) + " " + Float.toString(latitude));
    }

    public Timestamp getTime(){
        return time;
    }
}