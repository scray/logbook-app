package com.example.demo;

import java.util.ArrayList;
import java.util.List;

public class Travels {
    private List<Travel> travelList;

    public List<Travel> getPositionList() {
        if (travelList == null) {
            travelList = new ArrayList<>();
        }
        return travelList;
    }

    public void setTravelList(List<Travel> travelList) {
        this.travelList = travelList;
    }

    public void addTravel(Travel t) {
		if (travelList == null) {
			travelList = new ArrayList<>();
		}
		travelList.add(t);
	}

    public List<Travel> getAllTravels() {
        return travelList;
    }

    public Travel getTravel(int id) {
        if (id < travelList.size() && travelList.size() > 0) {
            return travelList.get(id);
        }
        return null;
    }
}