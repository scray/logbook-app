package com.example.demo.Data;

import java.util.ArrayList;
import java.util.List;

public class Tour {
    private List<Position> tourPositions;
    private Long id;
    private String name;

    public Tour(Long id, String name) {
        this.id = id;
        this.name = name;
        this.tourPositions = new ArrayList<>();
    }

    public List<Position> getAllTourPositions() {
        return tourPositions;
    }

    public void setTourPostions(List<Position> positionsList) {
        this.tourPositions = positionsList;
    }

    public void addTourPosition(Position p) {
        tourPositions.add(p);
    }

    public Position getTourPosition(int id) {
        if (id < tourPositions.size() && tourPositions != null) {
            return tourPositions.get(id);
        }
        return null;
    }

    public Position getLastTourPosition() {
        if (tourPositions.size() > 0 && tourPositions != null) {
            return tourPositions.get(tourPositions.size() - 1);
        }
        return null;
    }

    public Position getFirstTourPosition() {
        if (tourPositions.size() > 0 && tourPositions != null) {
            return tourPositions.get(0);
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