package org.scray.logbookappApi.interactive.tests;


import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;


import org.scray.logbookappApi.Objects.Tour;
import org.scray.logbookappApi.Objects.Transport;
import org.scray.logbookappApi.Objects.Waypoint;
import org.scray.logbookappApi.Operations.BlockchainOperations;


public class ReadDataMain {

	public static void main(String[] args) {

		try {
		 BlockchainOperations blockchainOperations = new BlockchainOperations(
		            "c1",
		            "basic",
		            "alice",
		            "C:\\Users\\Özgür\\Projekte\\logbook-app\\rest-api\\wallet");


			blockchainOperations.connect();
			Waypoint waypoint1 = new Waypoint(52.520008f, 13.404954f, System.currentTimeMillis());
			Waypoint waypoint2 = new Waypoint(48.8566f, 2.3522f, System.currentTimeMillis());
			Waypoint waypoint3 = new Waypoint(51.5074f, -0.1278f, System.currentTimeMillis());

			Transport transport = new Transport("Car", 0.2, 50, "petrol", 1000.0);

			//Tour newTour = new Tour("alice", Arrays.asList(waypoint1, waypoint2, waypoint3), "28", transport,true);
			Map<String, Boolean> internationaleFahrten = new HashMap<>();
			internationaleFahrten.put("eu", false);
			internationaleFahrten.put("eu_ch", false);
			internationaleFahrten.put("inland", false);
			//newTour.setInternationaleFahrten(internationaleFahrten);

			//System.out.println("12345"+newTour.getInternationaleFahrten());
			//blockchainOperations.writeTour("alice", "v42",  newTour);
			blockchainOperations.readTours("alice");
			System.out.println("New tour created successfully!");


			var tours = blockchainOperations.readTours("alice");


			System.out.println(tours.length);
			System.out.println("Hello");
			for (int i = 0; i < tours.length; i++) {
				System.out.println("Tour " + i + ": " + tours[i]);
				System.out.println("TourId: " + tours[i].getTourId() +
						" | International Fahrten: " + tours[i].getInternationaleFahrten());
				System.out.println("---");
			}

		} catch (Exception e) {
			e.printStackTrace();
		}


	}

}
