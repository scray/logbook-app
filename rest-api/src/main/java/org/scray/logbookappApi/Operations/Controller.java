package org.scray.logbookappApi.Operations;

import com.google.gson.Gson;
import org.scray.logbookappApi.Objects.Waypoint;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.scray.logbookappApi.Objects.Tour;

@RestController
@RequestMapping(path = "/tour-app")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class Controller {
    Gson gson = new Gson();

    private static Logger logger = LoggerFactory.getLogger(Controller.class);

    // ------------------------------------ SET PARAMETERS FOR CONNECTION ------------------------------------ //
    public static final BlockchainOperations blockchainOperations = new BlockchainOperations(
            "alice-dev",
            "basic",
            "alice",
            "./wallet");

    // ------------------------------------ POST METHODS ------------------------------------ //


    //add vehicle
    @PostMapping("/tours/{userid}")
    @ResponseBody
    public ResponseEntity<Object> write_tour(@PathVariable String userid, @RequestBody Tour obj_tour) {
        logger.debug("Request: POST /tours/" + userid + " " + gson.toJson(obj_tour));
        ResponseEntity<Object> response;
        try {
            response = ResponseEntity.ok(blockchainOperations.writeTour(userid, obj_tour.getVehiceId(), obj_tour));
        } catch (Exception e) {
            response = ResponseEntity.badRequest().body("Error: " + e.getMessage());
            e.printStackTrace();
        }
        logger.debug("Response: " + response.getBody());
        return response;
    }

    // ------------------------------------ PUT METHODS ------------------------------------ //

    //do we really need to add a vehicle here?
    @PutMapping("/tours/{userid}/{tourid}")
    @ResponseBody
    public ResponseEntity<Object> update_tour(@PathVariable String userid, @PathVariable String tourid, @RequestBody Waypoint obj_wp) {
        logger.debug("Request: PUT /tours/" + userid + "/" + tourid + " " + gson.toJson(obj_wp));
        ResponseEntity<Object> response;
        try {
            response = ResponseEntity.ok(blockchainOperations.updateTour(userid, tourid, obj_wp));
        } catch (Exception e) {
            response = ResponseEntity.badRequest().body(e.getMessage());
            e.printStackTrace();
        }
        logger.debug("Response: " + response.getBody());
        return response;
    }

    // ------------------------------------ GET METHODS ------------------------------------ //
    @GetMapping(path = "/tours/{userid}/{tourid}", produces = "application/json")
    @ResponseBody
    public ResponseEntity<Object> get_tour(@PathVariable String userid, @PathVariable String tourid) {
    	
        logger.debug("Request: GET /tours/" + userid + "/" + tourid);
        ResponseEntity<Object> response;
        try {
            response = ResponseEntity.ok(blockchainOperations.readTour(userid, tourid));
        } catch (Exception e) {
            response = ResponseEntity.badRequest().body(e.getMessage());
            e.printStackTrace();
        }
        logger.debug("Response: " + response.getBody());
        return response;
    }

    @GetMapping(path = "/tours/{userid}", produces = "application/json")
    @ResponseBody
    public ResponseEntity<Object> get_tours(@PathVariable String userid) {
        logger.debug("Request: GET /tours/" + userid);
        ResponseEntity<Object> response;
        try {
            response = ResponseEntity.ok(blockchainOperations.readTours(userid));
        } catch (Exception e) {
            response = ResponseEntity.badRequest().body(e.getMessage());
            e.printStackTrace();
        }
        logger.debug("Response: " + response.getBody());
        return response;
    }

    @GetMapping(path = "/tours/count/{userid}", produces = "application/json")
    @ResponseBody
    public ResponseEntity<Object> getTourCount(@PathVariable String userid) {
        logger.debug("Request: GET /tours/count/" + userid);
        ResponseEntity<Object> response;
        try {
            int tourCount = blockchainOperations.getTourCount(userid);
            response = ResponseEntity.ok("{\"count\": " + tourCount + "}");
        } catch (Exception e) {
            response = ResponseEntity.badRequest().body(e.getMessage());
            e.printStackTrace();
        }
        logger.debug("Response: " + response.getBody());
        return response;
    }
}
