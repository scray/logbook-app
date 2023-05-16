package org.scray.logbookappApi.interactive.tests;

import org.scray.logbookappApi.Operations.BlockchainOperations;

public class ReadDataMain {

	public static void main(String[] args) {
		try {
		 BlockchainOperations blockchainOperations = new BlockchainOperations(
		            "channel-t",
		            "basic",
		            "alice",
		            "./wallet");


			blockchainOperations.connect();
			var tours = blockchainOperations.readTours("alice");

			System.out.println(tours.length);

		} catch (Exception e) {
			e.printStackTrace();
		}


	}

}
