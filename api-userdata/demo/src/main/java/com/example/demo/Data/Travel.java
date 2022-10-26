package com.example.demo.Data;

import java.util.ArrayList;
import java.util.List;

public class Travel {
    private List<Position> travelPositions;
    private Long id;
    private String name;

    public Travel(Long id, String name) {
        this.id = id;
        this.name = name;
        this.travelPositions = new ArrayList<>();
    }

    public List<Position> getAllTravelPositions() {
        return travelPositions;
    }

    public void setTravelPostions(List<Position> positionsList) {
        this.travelPositions = positionsList;
    }

    public void addTravelPosition(Position p) {
        travelPositions.add(p);
    }

    public Position getTravelPosition(int id) {
        if (id < travelPositions.size() && travelPositions != null) {
            return travelPositions.get(id);
        }
        return null;
    }

    public Position getLastTravelPosition() {
        if (travelPositions.size() > 0 && travelPositions != null) {
            return travelPositions.get(travelPositions.size() - 1);
        }
        return null;
    }

    public Position getFirstTravelPosition() {
        if (travelPositions.size() > 0 && travelPositions != null) {
            return travelPositions.get(0);
        }
        return null;
    }

    public Long getID(){
        return id;
    }

    public String getName(){
        return name;
    }

    public void setName(String n){
        name = n;
    }
}