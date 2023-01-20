package org.scray.logbookappApi.Operations;

import com.google.gson.Gson;
import org.scray.logbookappApi.Objects.Waypoint;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.scray.logbookappApi.Objects.Tour;

@RestController
@RequestMapping(path = "/tour-app")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class Controller {

    // ------------------------------------ SET PARAMETERS FOR CONNECTION ------------------------------------ //
    public static final BlockchainOperations blockchainOperations = new BlockchainOperations(
            "channel-t",
            "basic",
            "alice",
            "./wallet");

    // ------------------------------------ POST METHODS ------------------------------------ //
    @PostMapping("/tours/{userid}")
    @ResponseBody
    public ResponseEntity<Object> write_tour(@PathVariable String userid, @RequestBody Tour obj_tour) {
        ResponseEntity<Object> response;
        try {
            response = ResponseEntity.ok(blockchainOperations.writeTour(userid, obj_tour));
        } catch (Exception e) {
            response = ResponseEntity.badRequest().body(e.getMessage());
        }
        return response;
    }

    // ------------------------------------ PUT METHODS ------------------------------------ //
    @PutMapping("/tours/{userid}/{tourid}")
    @ResponseBody
    public ResponseEntity<Object> update_tour(@PathVariable String userid, @PathVariable String tourid, @RequestBody Waypoint obj_wp) {
        ResponseEntity<Object> response;
        try {
            response = ResponseEntity.ok(blockchainOperations.updateTour(userid, tourid, obj_wp));
        } catch (Exception e) {
            response = ResponseEntity.badRequest().body(e.getMessage());
        }
        return response;
    }

    // ------------------------------------ GET METHODS ------------------------------------ //
    @GetMapping(path = "/tours/{userid}/{tourid}", produces = "application/json")
    @ResponseBody
    public ResponseEntity<Object> get_tour(@PathVariable String userid, @PathVariable String tourid) {
        ResponseEntity<Object> response;
        try {
            response = ResponseEntity.ok(blockchainOperations.readTour(userid, tourid));
        } catch (Exception e) {
            response = ResponseEntity.badRequest().body(e.getMessage());
        }
        return response;
    }

    @GetMapping(path = "/tours/{userid}", produces = "application/json")
    @ResponseBody
    public ResponseEntity<Object> get_tours(@PathVariable String userid) {
        ResponseEntity<Object> response;
        try {
            response = ResponseEntity.ok(blockchainOperations.readTours(userid));
        } catch (Exception e) {
            response = ResponseEntity.badRequest().body(e.getMessage());
        }
        return response;
    }
}