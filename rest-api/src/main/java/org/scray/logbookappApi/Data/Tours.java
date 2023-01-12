package org.scray.logbookappApi.Data;

import java.util.ArrayList;
import java.util.List;

public class Tours {
    private List<Tour> tourList;

    public List<Tour> getPositionList() {
        if (tourList == null) {
            tourList = new ArrayList<>();
        }
        return tourList;
    }

    public void setTourList(List<Tour> tourList) {
        this.tourList = tourList;
    }

    public void addTour(Tour t) {
		if (tourList == null) {
			tourList = new ArrayList<>();
		}
		tourList.add(t);
	}

    public List<Tour> getAllTours() {
        return tourList;
    }

    public Tour getTour(int id) {
        if (id < tourList.size() && tourList.size() > 0) {
            return tourList.get(id);
        }
        return null;
    }
}