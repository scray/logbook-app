package com.example.demo;

import java.sql.Timestamp;;

public class Position {
    float x, y;
    Timestamp time;

    public Position (float x, float y, Timestamp time){
        this.x = x;
        this.y = y;
        this.time = time;
    }

    public String getPosition(){
        return (Float.toString(x) + " " + Float.toString(y));
    }

    public Timestamp getTime(){
        return time;
    }
}
