package org.scray.logbookappApi.interactive.tests;

import java.util.Iterator;

import org.scray.logbookappApi.Objects.Tour;
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

			for (int i = 0; i < tours.length; i++) {
				System.out.println(tours[i]);
			}

		} catch (Exception e) {
			e.printStackTrace();
		}


	}

}
