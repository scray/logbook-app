package org.scray.logbookappApi.interactive.tests;


import java.util.Arrays;



import org.scray.logbookappApi.Objects.Tour;
import org.scray.logbookappApi.Objects.Transport;
import org.scray.logbookappApi.Objects.Waypoint;
import org.scray.logbookappApi.Operations.BlockchainOperations;


public class VehicleCrator {

	public static void main(String[] args) {
		try {
		 BlockchainOperations blockchainOperations = new BlockchainOperations(
		            "alice-dev",
		            "basic",
		            "alice",
		            "C:\\Users\\st.obermeier\\git\\logbook-app\\rest-api\\wallet");


			blockchainOperations.connect();

			blockchainOperations.createTransport();


		} catch (Exception e) {
			e.printStackTrace();
		}


	}

}
