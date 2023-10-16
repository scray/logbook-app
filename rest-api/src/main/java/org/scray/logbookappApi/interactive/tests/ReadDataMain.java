package org.scray.logbookappApi.interactive.tests;


import java.util.Arrays;



import org.scray.logbookappApi.Objects.Tour;
import org.scray.logbookappApi.Objects.Transport;
import org.scray.logbookappApi.Objects.Waypoint;
import org.scray.logbookappApi.Operations.BlockchainOperations;


public class ReadDataMain {

	public static void main(String[] args) {
		try {
		 BlockchainOperations blockchainOperations = new BlockchainOperations(
		            "stefan-43",
		            "basic",
		            "alice",
		            "C:\\Users\\st.obermeier\\git\\logbook-app\\rest-api\\wallet");


			blockchainOperations.connect();
			Waypoint waypoint1 = new Waypoint(52.520008f, 13.404954f, System.currentTimeMillis());
			Waypoint waypoint2 = new Waypoint(48.8566f, 2.3522f, System.currentTimeMillis());
			Waypoint waypoint3 = new Waypoint(51.5074f, -0.1278f, System.currentTimeMillis());

			Transport transport = new Transport("Car", 0.2, 50, "petrol", 1000.0);

			Tour newTour = new Tour("alice", Arrays.asList(waypoint1, waypoint2, waypoint3), "28", transport);

			blockchainOperations.writeTour("alice", newTour);

			System.out.println("New tour created successfully!");

			var tours = blockchainOperations.readTours("alice");


			System.out.println(tours.length);
			System.out.println("Hello");
			for (int i = 0; i < tours.length; i++) {
				System.out.println(tours[i]);
				System.out.println(tours[i].getTourId());
			}

		} catch (Exception e) {
			e.printStackTrace();
		}


	}

}
