package com.example.demo.Operations;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Objects.Tour;
import com.example.demo.Objects.Waypoint;

@RestController
@RequestMapping(path = "/tour-app")
public class Controller {

	// ------------------------------------ SET PARAMETERS FOR CONNECTION ------------------------------------ //
	private BlockchainOperations blockchainOperations = new BlockchainOperations(
			"channel-t",
			"basic",
			"alice",
			"./wallet");

	// ------------------------------------ POST METHODS ------------------------------------ //
	@PostMapping("/tours")
    @ResponseBody
    public String write_tour(@RequestBody Tour data) {
        blockchainOperations.writeTour(data);
        return "Data has been inserted!";
    }

	// ------------------------------------ PUT METHODS ------------------------------------ //
	@PutMapping("/tours/{id}")
    @ResponseBody
    public String update_tour(@PathVariable String id, @RequestBody Waypoint wp) {
        blockchainOperations.updateTour(id ,wp);
        return "Data has been inserted!";
    }

	// ------------------------------------ PATCH METHODS ------------------------------------ //
	@PutMapping("/tours/{id}")
    @ResponseBody
    public String patch_tour(@PathVariable String id, @RequestBody Boolean has_finished) {
        blockchainOperations.patchTour(id ,has_finished);
        return "Data has been inserted!";
    }

	// ------------------------------------ GET METHODS ------------------------------------ //	
	@GetMapping(path = "/tours/{id}", produces = "application/json")
	public Tour get_tour(@PathVariable String id) {
		return blockchainOperations.readTour( id);
	}

	@GetMapping(path = "/tours/user/{id}", produces = "application/json")
	public Tour[] get_tours(@PathVariable String id) {
		return blockchainOperations.readTours(id);
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