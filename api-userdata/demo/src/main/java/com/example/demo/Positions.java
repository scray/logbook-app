package com.example.demo;

import java.util.ArrayList;
import java.util.List;

public class Positions {
    private List<Position> positionsList;

    public List<Position> getPositionList() {
        if (positionsList == null) {
            positionsList = new ArrayList<>();
        }
        return positionsList;
    }

    public void setPostionsList(List<Position> positionsList) {
        this.positionsList = positionsList;
    }

    public void addPosition(Position p) {
        positionsList.add(p);
    }

    public List<Position> getAllPositions() {
        return positionsList;
    }

    public Position getPosition(int id) {
        if (id < positionsList.size()) {
            return positionsList.get(id);
        }
        return null;
    }

    public Position getLastPosition(){
        return positionsList.get(positionsList.size() -1);
    }
}