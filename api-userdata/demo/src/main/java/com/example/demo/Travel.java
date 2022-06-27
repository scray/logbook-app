package com.example.demo;

import java.util.ArrayList;
import java.util.List;

public class Travel {
    private List<Position> travelPositions;

    public List<Position> getTravelPositions() {
        if (travelPositions == null) {
            travelPositions = new ArrayList<>();
        }
        return travelPositions;
    }

    public void setTravelPostions(List<Position> positionsList) {
        this.travelPositions = positionsList;
    }

    public void addTravelPosition(Position p) {
        travelPositions.add(p);
    }

    public List<Position> getAllTravelPositions() {
        return travelPositions;
    }

    public Position getTravelPosition(int id) {
        if (id < travelPositions.size()) {
            return travelPositions.get(id);
        }
        return null;
    }

    public Position getLastTravelPosition() {
        if (travelPositions.size() > 0) {
            return travelPositions.get(travelPositions.size() - 1);
        }
        return null;
    }

    public Position getFirstTravelPosition() {
        if (travelPositions.size() > 0) {
            return travelPositions.get(0);
        }
        return null;
    }
}