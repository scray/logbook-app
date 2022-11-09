package com.example.demo.Operations;

import com.google.common.eventbus.AllowConcurrentEvents;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/tour-app")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class Controller {

	// ------------------------------------ SET PARAMETERS FOR CONNECTION ------------------------------------ //
	private BlockchainOperations blockchainOperations = new BlockchainOperations(
			"channel-t",
			"basic",
			"alice",
			"./wallet");

	// ------------------------------------ WRITE METHODS ------------------------------------ //
	@GetMapping("/write/{id}/{data}")
	@ResponseBody
	public String getEmployeesById(@PathVariable String id, @PathVariable String data) {
		blockchainOperations.writeTour(id, data);
		return "Data has been inserted!";
	}

	// ------------------------------------ READ METHODS ------------------------------------ //	
	@GetMapping(path = "/read/{id}", produces = "application/json")
	public String test_function(@PathVariable String id) {
		return blockchainOperations.read(id);
	}

	/*private static String getName (JSONObject TOUR_JSON) {
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
	}*/
	
}

// TODO --> Methoden um JSON zu zerlegen und geforderte Daten zurückzugeben