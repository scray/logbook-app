package org.scray.logbookappApi.Operations;

import com.google.gson.Gson;
import org.scray.logbookappApi.Objects.Waypoint;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.scray.logbookappApi.Objects.Tour;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping(path = "/tour-app")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class Controller {
    Gson gson = new Gson();

    private static Logger logger = LoggerFactory.getLogger(Controller.class);

    // ------------------------------------ SET PARAMETERS FOR CONNECTION ------------------------------------ //
    public static final BlockchainOperations blockchainOperations = new BlockchainOperations(
            "c1",
            "basic",
            "alice",
            "C:\\Users\\Özgür\\Projekte\\logbook-app\\rest-api\\wallet");

    // ------------------------------------ POST METHODS ------------------------------------ //
    //UpdateTour
    @PutMapping("/tours/{userid}/{tourid}/international")
    @ResponseBody
    public ResponseEntity<Object> updateTourInternationaleFahrten(
            @PathVariable String userid,
            @PathVariable String tourid,
            @RequestBody Map<String, Boolean> internationaleFahrten) {

        logger.debug("Request: PUT /tours/" + userid + "/" + tourid + "/international " + gson.toJson(internationaleFahrten));
        ResponseEntity<Object> response;

        try {
            Tour updatedTour = blockchainOperations.updateTourInternationaleFahrten(userid, tourid, internationaleFahrten);
            response = ResponseEntity.ok(updatedTour);
        } catch (Exception e) {
            response = ResponseEntity.badRequest().body("Error: " + e.getMessage());
            e.printStackTrace();
        }

        logger.debug("Response: " + response.getBody());
        return response;
    }

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

    @PutMapping("/tours/{userid}/{tourid}")
    @ResponseBody
    public ResponseEntity<Object> update_tour(@PathVariable String userid, @PathVariable String tourid, @RequestBody Waypoint obj_wp) {
        logger.debug("Request: PUT /tours/" + userid + "/" + tourid + " " + gson.toJson(obj_wp));
        ResponseEntity<Object> response;
        try {
            Waypoint result = blockchainOperations.updateTour(userid, tourid, obj_wp);
            response = ResponseEntity.ok(result);
        } catch (Exception e) {
            String errorMessage = e.getMessage();
            logger.error("Error updating tour: " + errorMessage);

            // Prüfe ob es ein Validierungsfehler ist
            if (errorMessage != null && (
                    errorMessage.contains("außerhalb Deutschlands") ||
                            errorMessage.contains("außerhalb der EU") ||
                            errorMessage.contains("außerhalb EU/Schweiz") ||
                            errorMessage.contains("in der Schweiz"))) {

                // Validierungsfehler - 400 Bad Request
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "VALIDATION_ERROR");
                errorResponse.put("message", errorMessage);
                errorResponse.put("type", "LOCATION_NOT_ALLOWED");
                response = ResponseEntity.badRequest().body(errorResponse);
            } else {
                // Andere Fehler - 500 Internal Server Error
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "INTERNAL_ERROR");
                errorResponse.put("message", errorMessage != null ? errorMessage : "Unbekannter Fehler");
                response = ResponseEntity.status(500).body(errorResponse);
            }
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

    @GetMapping(path = "/tours/total-distance/{userid}", produces = "application/json")
    @ResponseBody
    public ResponseEntity<Object> calculateTotalDistance(@PathVariable String userid) {
        logger.debug("Request: GET /tours/total-distance/" + userid);
        ResponseEntity<Object> response;
        try {
            double totalDistance = blockchainOperations.calculateTotalDistance(userid);
            response = ResponseEntity.ok("{\"totalDistance\": " + totalDistance + "}");
        } catch (Exception e) {
            response = ResponseEntity.badRequest().body(e.getMessage());
            e.printStackTrace();
        }
        logger.debug("Response: " + response.getBody());
        return response;
    }

    @GetMapping(path = "/tours/average-tour-time/{userid}", produces = "application/json")
    @ResponseBody
    public ResponseEntity<Object> calculateAverageTourTime(@PathVariable String userid) {
        logger.debug("Request: GET /tours/average-tour-time/" + userid);
        ResponseEntity<Object> response;
        try {
            double averageTourTime = blockchainOperations.calculateAverageTourTime(userid);
            response = ResponseEntity.ok("{\"averageTourTime\": " + averageTourTime + "}");
        } catch (Exception e) {
            response = ResponseEntity.badRequest().body(e.getMessage());
            e.printStackTrace();
        }
        logger.debug("Response: " + response.getBody());
        return response;
    }

    @GetMapping(path = "/tours/average-co2/{userid}", produces = "application/json")
    @ResponseBody
    public ResponseEntity<Object> calculateAverageCO2(@PathVariable String userid) {
        logger.debug("Request: GET /tours/average-co2/" + userid);
        ResponseEntity<Object> response;
        try {
            double averageCO2 = blockchainOperations.calculateAverageCO2(userid);
            response = ResponseEntity.ok("{\"averageCO2\": " + averageCO2 + "}");
        } catch (Exception e) {
            response = ResponseEntity.badRequest().body(e.getMessage());
            e.printStackTrace();
        }
        logger.debug("Response: " + response.getBody());
        return response;
    }



}
