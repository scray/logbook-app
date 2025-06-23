package org.scray.logbookappApi.Operations;

import com.google.gson.Gson;
import org.scray.logbookappApi.Objects.Waypoint;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.util.List;
import org.scray.logbookappApi.Objects.Document;
import org.scray.logbookappApi.Objects.Tour;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping(path = "/tour-app")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class Controller {

    @Autowired
    private S3Service s3Service;

    Gson gson = new Gson();

    private static Logger logger = LoggerFactory.getLogger(Controller.class);

    public static final BlockchainOperations blockchainOperations = new BlockchainOperations(
            "c1",
            "basic",
            "alice",
            "C:\\Users\\Özgür\\IdeaProjects\\logbook2-app\\rest-api\\wallet");

    // ==================== POST METHODS ==================== //

    @PostMapping("/tours/{userid}/{tourid}/documents")
    @ResponseBody
    public ResponseEntity<Object> uploadDocument(
            @PathVariable String userid,
            @PathVariable String tourid,
            @RequestParam("file") MultipartFile file,
            @RequestParam("hash") String clientHash) {

        logger.debug("Request: POST /tours/" + userid + "/" + tourid + "/documents");
        ResponseEntity<Object> response;
        String s3Key = null;
        boolean documentPrepared = false;
        String fileName = file.getOriginalFilename();

        try {
            // Phase 0: Hash-Validierung
            String serverHash = s3Service.calculateSHA256(file.getBytes());
            if (!serverHash.equals(clientHash)) {
                throw new IllegalArgumentException("Hash mismatch - file may be corrupted");
            }

            // Phase 1: PREPARE - Blockchain Autorisierung & Reservierung
            logger.info("Phase 1: Preparing document upload in blockchain");

            Document preparedDoc = blockchainOperations.prepareDocumentUpload(
                    userid,
                    tourid,
                    fileName,
                    serverHash,
                    file.getSize(),
                    file.getContentType()
            );

            documentPrepared = true;
            logger.info("Document preparation successful, status: " + preparedDoc.getStatus());

            // Phase 2: S3 Upload - Nur wenn Blockchain OK
            logger.info("Phase 2: Uploading to S3");

            try {
                s3Key = s3Service.uploadFile(file, userid, tourid);
                logger.info("S3 upload successful: " + s3Key);
            } catch (Exception s3Error) {
                logger.error("S3 upload failed: " + s3Error.getMessage());

                // Rollback: Abort in Blockchain
                try {
                    blockchainOperations.abortDocumentUpload(userid, tourid, fileName);
                    logger.info("Successfully aborted document preparation in blockchain");
                } catch (Exception abortError) {
                    logger.error("Failed to abort document preparation: " + abortError.getMessage());
                }

                throw new Exception("S3 upload failed: " + s3Error.getMessage());
            }

            // Phase 3: COMMIT - Finalisiere in Blockchain
            logger.info("Phase 3: Committing document in blockchain");

            Document committedDoc = blockchainOperations.commitDocumentUpload(
                    userid,
                    tourid,
                    fileName,
                    s3Key
            );

            logger.info("Document successfully committed, status: " + committedDoc.getStatus());
            response = ResponseEntity.ok(committedDoc);

        } catch (IllegalArgumentException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "VALIDATION_ERROR");
            errorResponse.put("message", e.getMessage());
            response = ResponseEntity.badRequest().body(errorResponse);

        } catch (Exception e) {
            String errorMessage = e.getMessage();
            logger.error("Error in document upload process: " + errorMessage);

            // Cleanup S3 wenn Upload erfolgt war aber Commit fehlschlug
            if (s3Key != null && documentPrepared) {
                try {
                    logger.info("Cleaning up S3 file after commit failure: " + s3Key);
                    s3Service.deleteFile(s3Key);
                    blockchainOperations.abortDocumentUpload(userid, tourid, fileName);
                } catch (Exception cleanupEx) {
                    logger.error("Cleanup failed: " + cleanupEx.getMessage());
                }
            }

            // Error Response basierend auf Fehlertyp
            if (errorMessage != null && errorMessage.contains("not authorized")) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "AUTHORIZATION_ERROR");
                errorResponse.put("message", "User not authorized to upload documents");
                errorResponse.put("type", "USER_NOT_AUTHORIZED");
                errorResponse.put("detail", "Only Alice can modify tours and upload documents");
                errorResponse.put("phase", documentPrepared ? "PREPARE" : "UNKNOWN");
                response = ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);

            } else if (errorMessage != null && errorMessage.contains("expired")) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "TIMEOUT_ERROR");
                errorResponse.put("message", "Document preparation expired");
                errorResponse.put("detail", "Upload took too long, please try again");
                response = ResponseEntity.status(HttpStatus.REQUEST_TIMEOUT).body(errorResponse);

            } else {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "UPLOAD_ERROR");
                errorResponse.put("message", errorMessage != null ? errorMessage : "Unknown error");
                errorResponse.put("phase", s3Key != null ? "COMMIT" : "S3_UPLOAD");
                response = ResponseEntity.status(500).body(errorResponse);
            }
        }

        logger.debug("Response: " + response.getBody());
        return response;
    }

    @PostMapping("/tours/{userid}")
    @ResponseBody
    public ResponseEntity<Object> createTour(@PathVariable String userid, @RequestBody Tour tour) {
        logger.debug("Request: POST /tours/" + userid + " " + gson.toJson(tour));
        ResponseEntity<Object> response;

        try {
            response = ResponseEntity.ok(blockchainOperations.writeTour(userid, tour.getVehiceId(), tour));
        } catch (Exception e) {
            String errorMessage = e.getMessage();
            logger.error("Error creating tour: " + errorMessage);

            if (errorMessage != null && errorMessage.contains("not authorized")) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "AUTHORIZATION_ERROR");
                errorResponse.put("message", errorMessage);
                errorResponse.put("type", "USER_NOT_AUTHORIZED");
                response = ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
            } else {
                response = ResponseEntity.badRequest().body("Error: " + errorMessage);
            }
        }

        logger.debug("Response: " + response.getBody());
        return response;
    }

    // ==================== PUT METHODS ==================== //

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
            String errorMessage = e.getMessage();
            logger.error("Error updating tour: " + errorMessage);

            if (errorMessage != null && errorMessage.contains("not authorized")) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "AUTHORIZATION_ERROR");
                errorResponse.put("message", errorMessage);
                errorResponse.put("type", "USER_NOT_AUTHORIZED");
                response = ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
            } else {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "UPDATE_ERROR");
                errorResponse.put("message", errorMessage != null ? errorMessage : "Unbekannter Fehler");
                errorResponse.put("type", "GENERAL_ERROR");
                response = ResponseEntity.badRequest().body(errorResponse);
            }
        }

        logger.debug("Response: " + response.getBody());
        return response;
    }

    @PutMapping("/tours/{userid}/{tourid}")
    @ResponseBody
    public ResponseEntity<Object> addWaypoint(@PathVariable String userid, @PathVariable String tourid, @RequestBody Waypoint waypoint) {
        logger.debug("Request: PUT /tours/" + userid + "/" + tourid + " " + gson.toJson(waypoint));
        ResponseEntity<Object> response;

        try {
            Waypoint result = blockchainOperations.updateTour(userid, tourid, waypoint);
            response = ResponseEntity.ok(result);
        } catch (Exception e) {
            String errorMessage = e.getMessage();
            logger.error("Error adding waypoint: " + errorMessage);

            Map<String, String> errorResponse = new HashMap<>();

            if (errorMessage != null && errorMessage.contains("not authorized")) {
                errorResponse.put("error", "AUTHORIZATION_ERROR");
                errorResponse.put("message", errorMessage);
                errorResponse.put("type", "USER_NOT_AUTHORIZED");
                response = ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
            }
            else if (errorMessage != null && (
                    errorMessage.contains("außerhalb Deutschlands") ||
                            errorMessage.contains("außerhalb der EU") ||
                            errorMessage.contains("außerhalb EU/Schweiz") ||
                            errorMessage.contains("in der Schweiz"))) {
                errorResponse.put("error", "VALIDATION_ERROR");
                errorResponse.put("message", errorMessage);
                errorResponse.put("type", "LOCATION_NOT_ALLOWED");
                response = ResponseEntity.badRequest().body(errorResponse);
            } else {
                errorResponse.put("error", "INTERNAL_ERROR");
                errorResponse.put("message", errorMessage != null ? errorMessage : "Unbekannter Fehler");
                errorResponse.put("type", "GENERAL_ERROR");
                response = ResponseEntity.status(500).body(errorResponse);
            }
        }

        logger.debug("Response: " + response.getBody());
        return response;
    }

    // ==================== DELETE METHODS ==================== //

    @DeleteMapping("/tours/{userid}/{tourid}/documents/{filename}")
    @ResponseBody
    public ResponseEntity<Object> deleteDocument(
            @PathVariable String userid,
            @PathVariable String tourid,
            @PathVariable String filename) {

        logger.debug("Request: DELETE /tours/" + userid + "/" + tourid + "/documents/" + filename);
        ResponseEntity<Object> response;

        try {
            // Hole aktuelles Dokument
            List<Document> documents = blockchainOperations.getDocuments(userid, tourid);
            Document document = documents.stream()
                    .filter(d -> d.getFileName().equals(filename))
                    .findFirst()
                    .orElseThrow(() -> new Exception("Document not found"));

            // Markiere Dokument als gelöscht (soft delete)
            Document deletedDocument = new Document(
                    document.getFileName(),
                    document.getHash(),
                    document.getUploadDate(),
                    document.getS3Key() + "_DELETED", // Markierung im S3Key
                    document.getFileSize(),
                    document.getContentType()
            );
            deletedDocument.setStatus("DELETED");
            deletedDocument.setLastModified(System.currentTimeMillis() / 1000);

            // Update in Blockchain
            blockchainOperations.updateDocument(userid, tourid, filename, deletedDocument);

            // Optional: S3 Datei behalten für Audit-Trail
            logger.info("Document marked as deleted (soft delete): " + filename);

            Map<String, String> result = new HashMap<>();
            result.put("message", "Document marked as deleted successfully");
            result.put("note", "Document remains in blockchain for audit trail");
            response = ResponseEntity.ok(result);

        } catch (Exception e) {
            String errorMessage = e.getMessage();
            logger.error("Error deleting document: " + errorMessage);

            if (errorMessage != null && errorMessage.contains("not authorized")) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "AUTHORIZATION_ERROR");
                errorResponse.put("message", errorMessage);
                errorResponse.put("type", "USER_NOT_AUTHORIZED");
                response = ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
            } else {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "DELETE_ERROR");
                errorResponse.put("message", errorMessage);
                response = ResponseEntity.status(500).body(errorResponse);
            }
        }

        logger.debug("Response: " + response.getBody());
        return response;
    }

    // ==================== GET METHODS ==================== //

    @GetMapping("/tours/{userid}/{tourid}/documents/{filename}")
    @ResponseBody
    public ResponseEntity<Object> downloadDocument(
            @PathVariable String userid,
            @PathVariable String tourid,
            @PathVariable String filename) {

        logger.debug("Request: GET /tours/" + userid + "/" + tourid + "/documents/" + filename);

        try {
            List<Document> documents = blockchainOperations.getDocuments(userid, tourid);
            Document document = documents.stream()
                    .filter(d -> d.getFileName().equals(filename))
                    .filter(d -> d.getStatus() == null || !"DELETED".equals(d.getStatus())) // Keine gelöschten Dokumente
                    .findFirst()
                    .orElseThrow(() -> new Exception("Document not found or has been deleted"));

            // Lade Datei von S3
            byte[] fileContent = s3Service.downloadFile(document.getS3Key());

            // Verifiziere Hash
            String currentHash = s3Service.calculateSHA256(fileContent);
            if (!currentHash.equals(document.getHash())) {
                throw new Exception("Document integrity check failed - hash mismatch");
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(document.getContentType()));
            headers.setContentDispositionFormData("attachment", document.getFileName());
            headers.setContentLength(fileContent.length);

            return new ResponseEntity<>(fileContent, headers, HttpStatus.OK);

        } catch (Exception e) {
            logger.error("Error downloading document: " + e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "DOWNLOAD_ERROR");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(404).body(errorResponse);
        }
    }

    @GetMapping("/tours/{userid}/{tourid}/documents")
    @ResponseBody
    public ResponseEntity<Object> getDocuments(
            @PathVariable String userid,
            @PathVariable String tourid) {

        logger.debug("Request: GET /tours/" + userid + "/" + tourid + "/documents");
        ResponseEntity<Object> response;

        try {
            List<Document> documents = blockchainOperations.getDocuments(userid, tourid);
            response = ResponseEntity.ok(documents);
        } catch (Exception e) {
            response = ResponseEntity.badRequest().body(e.getMessage());
            e.printStackTrace();
        }

        logger.debug("Response: " + response.getBody());
        return response;
    }

    @GetMapping(path = "/tours/{userid}/{tourid}", produces = "application/json")
    @ResponseBody
    public ResponseEntity<Object> getTour(@PathVariable String userid, @PathVariable String tourid) {

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
    public ResponseEntity<Object> getTours(@PathVariable String userid) {
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