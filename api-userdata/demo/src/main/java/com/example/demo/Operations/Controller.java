package com.example.demo.Operations;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController; 

@RestController
@RequestMapping(path = "/tour-app")
public class Controller {

// TODO --> return as json, Testdaten erstellen, get methode allgemein für Frontend / parse data to JSON for transfer to blockchain

	// ------------------------------------ TEST FUNCTIONS (TO DELETE) ------------------------------------ //
	@GetMapping(path = "/test-1", produces = "application/json")
	public String test_function() {
	return getData();
	}

	@GetMapping(path = "/test-2/{methode}", produces = "application/json")
	public String test_function2(@PathVariable int methode ) {
	return  blockchainOperations.readtest(methode);
	}

	// ------------------------------------ SET PARAMETERS FOR CONNECTION ------------------------------------ //
	private BlockchainOperations blockchainOperations = new BlockchainOperations(
		// TODO --> change to blockchain parameters
			"channel-t",
			"basic",
			"alice",
			"walletPath");

	// ------------------------------------ READ METHODS ------------------------------------ //	
	@GetMapping(path = "/read/tour/", produces = "application/json")
	public String getData() {
		return blockchainOperations.read("Initialize");
	}

	// ------------------------------------ WRITE METHODS ------------------------------------ //
	@PutMapping(path = "/add/tours/{ts}/")
	public void addTours(@PathVariable String ts, @RequestBody String TOURS_JSON) {
		blockchainOperations.writeTours(TOURS_JSON);
	}

	@PutMapping(path = "/add/tour/{t}/")
	public void addTour(@PathVariable String t, @RequestBody String TOUR_JSON) {
		blockchainOperations.writeTour(TOUR_JSON);
	}

	@PutMapping(path = "/add/position/{p}")
	public void addPosition(@PathVariable String p, @PathVariable String POSITION_JSON) {


		blockchainOperations.writePosition(POSITION_JSON);
	}
}