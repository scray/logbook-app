package com.example.demo.Operations;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Objects.Tour;
import com.example.demo.Objects.Waypoint;
import com.google.gson.Gson;

@RestController
@RequestMapping(path = "/tour-app")
public class Controller {
	Gson gson = new Gson();

	/*
	 * TODO Delete
	 */
	@PutMapping(path = "/tours/{id}/{content}", produces = "application/json")
	public String test(@PathVariable String id, @PathVariable String content) {
		String tour_as_json = blockchainOperations.readTour(id);
		return tour_as_json;
	}
	/*
	 * 
	 */

	// ------------------------------------ SET PARAMETERS FOR CONNECTION ------------------------------------ //
	private BlockchainOperations blockchainOperations = new BlockchainOperations(
			"channel-t",
			"basic",
			"alice",
			"./wallet");

	// ------------------------------------ POST METHODS ------------------------------------ //
	@PostMapping("/tours")
    @ResponseBody
	public String write_tour(@RequestBody Tour obj_tour) {
		String json_tour = gson.toJson(obj_tour);
        blockchainOperations.writeTour(json_tour);
        return "Data has been inserted!";
    }

	// ------------------------------------ PUT METHODS ------------------------------------ //
	@PutMapping("/tours/{id}")
    @ResponseBody
	public String update_tour(@PathVariable String id, @RequestBody Waypoint obj_wp) {
		String json_wp = gson.toJson(obj_wp);
        blockchainOperations.updateTour(id ,json_wp);
        return "Data has been inserted!";
    }

	// ------------------------------------ PATCH METHODS ------------------------------------ //
	@PatchMapping("/tours/{id}")
    @ResponseBody
    public String patch_tour(@PathVariable String id, @RequestBody Boolean has_finished) {
        blockchainOperations.patchTour(id ,has_finished);
        return "Data has been inserted!";
    }

	// ------------------------------------ GET METHODS ------------------------------------ //	
	@GetMapping(path = "/tours/{id}", produces = "application/json")
	public Tour get_tour(@PathVariable String id) {
		String tour_as_json = blockchainOperations.readTour(id);
		Tour obj_tour = gson.fromJson(tour_as_json, Tour.class);
		return obj_tour;
	}

	@GetMapping(path = "/tours/user/{id}", produces = "application/json")
	public Tour[] get_tours(@PathVariable String id) {
		String tours_as_json = blockchainOperations.readTours(id);
		Tour[] obj_tours = gson.fromJson(tours_as_json, Tour[].class);
		return obj_tours;
	}
}