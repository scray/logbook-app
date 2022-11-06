package com.example.demo.Operations;

import javax.json.JsonString;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.apache.juli.logging.Log;
import org.json.*;

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
			"channel-t",
			"basic",
			"alice",
			"walletPath");

	// ------------------------------------ WRITE METHODS ------------------------------------ //
	@PutMapping(path = "/add/tour/")
	public void addTour(@PathVariable String ts, @RequestBody String TOUR_TO_PARSE) { 
		blockchainOperations.writeTour(TOUR_TO_PARSE);
	}

	// ------------------------------------ READ METHODS ------------------------------------ //	
	@GetMapping(path = "/read/tour/", produces = "application/json")
	public String getData() {
		return blockchainOperations.read("Initialize");
	}

	private static String getName (JSONObject TOUR_JSON) {
		try {
			return TOUR_JSON.getString("name");
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return null;
	}

	private static String getTour (JSONObject TOUR_JSON) {
		try {
			return TOUR_JSON.getString("tour");
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return null;
	}

	private static String getPositions (JSONObject TOUR_JSON) {
		try {
			return TOUR_JSON.getString("positions");
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return null;
	}
	
}

// TODO --> Methoden um JSON zu zerlegen und geforderte Daten zurückzugeben