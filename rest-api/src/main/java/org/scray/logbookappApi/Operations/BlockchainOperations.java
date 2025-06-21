package org.scray.logbookappApi.Operations;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeoutException;
import java.util.logging.*;

import com.google.gson.*;

import java.lang.reflect.Type;

import org.hyperledger.fabric.gateway.*;
import org.scray.logbookappApi.LogbookApi;
import org.scray.logbookappApi.Objects.Tour;
import org.scray.logbookappApi.Objects.Waypoint;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;

public class BlockchainOperations {

	@Value("${mock-mode:false}")
	private boolean mockMode = false;


	Gson gson = new GsonBuilder()
			.serializeNulls()
			.setPrettyPrinting()
			.registerTypeAdapter(Map.class, (JsonDeserializer<Map<String, Boolean>>) (json, typeOfT, context) -> {
				if (json.isJsonObject()) {
					JsonObject obj = json.getAsJsonObject();
					Map<String, Boolean> map = new HashMap<>();

					// Falls das alte boolean Format vorliegt
					if (obj.has("internationaleFahrten") && obj.get("internationaleFahrten").isJsonPrimitive()) {
						boolean oldValue = obj.get("internationaleFahrten").getAsBoolean();
						map.put("eu", oldValue);
						map.put("eu_ch", oldValue);
						map.put("inland", !oldValue);
						return map;
					}

					// Normale Map deserialization
					obj.entrySet().forEach(entry -> {
						if (entry.getValue().isJsonPrimitive()) {
							map.put(entry.getKey(), entry.getValue().getAsBoolean());
						}
					});

					// Falls Map leer ist, Defaults setzen
					if (map.isEmpty()) {
						map.put("eu", false);
						map.put("eu_ch", false);
						map.put("inland", true);
					}

					return map;
				}

				// Fallback: Default Map
				Map<String, Boolean> defaultMap = new HashMap<>();
				defaultMap.put("eu", false);
				defaultMap.put("eu_ch", false);
				defaultMap.put("inland", true);
				return defaultMap;
			})
			.create();

	private static Logger logger = LoggerFactory.getLogger(LogbookApi.class);



	String channel;
	String smartContract;
	String walletPathString;
	String userName;
	Gateway gateway = null;

	// ------------------------------------ CONSTRUCTOR
	// ------------------------------------ //
	public BlockchainOperations(String channel, String smartContract, String userName, String walletPath) {
		super();
		this.channel = channel;
		this.smartContract = smartContract;
		this.walletPathString = walletPath;
		this.userName = userName;
	}

	// ------------------------------------ BUILD UP CONNECTION
	// ------------------------------------ //
	public Gateway connect() throws Exception {
		// Load a file system based wallet for managing identities.
		Path walletPath = Paths.get(walletPathString);

		Wallet wallet = Wallets.newFileSystemWallet(walletPath);

		Path networkConfigPath = Paths.get(walletPathString + File.separator + "connection.yaml");
		Gateway.Builder builder = Gateway.createBuilder();
		builder.identity(wallet, userName).networkConfig(networkConfigPath).discovery(true);

		return builder.connect();
	}

	static {
		System.setProperty("org.hyperledger.fabric.sdk.service_discovery.as_localhost", "false");
	}

	// ------------------------------------ READ BLOCKCHAIN REQUEST
	// ------------------------------------ //
	public Tour readTour(String userid, String tourid) throws Exception {
		if (!this.mockMode) {
			String data;
			if (gateway == null) {
				gateway = connect();
			}
			Network network = gateway.getNetwork(channel);
			Contract contract = network.getContract(smartContract);

			data = new String(contract.evaluateTransaction("getTour", userid, tourid));
			logger.info("Get succesful.");
			if (data.equalsIgnoreCase("false")) {
				throw new Exception("Tour with id " + tourid + " does not exist. Or user " + userid
						+ " does not have access to it.");
			}

			return gson.fromJson(data, Tour.class);
		} else {
			return this.getDummyTour(tourid);
		}
	}

	public Tour[] readTours(String userid) throws Exception {

		if (!this.mockMode) {
			String data;
			if (gateway == null) {
				gateway = connect();
			}
			Network network = gateway.getNetwork(channel);
			Contract contract = network.getContract(smartContract);

			data = new String(contract.evaluateTransaction("getTours", userid));
			logger.info("Get succesful.");
			if (data.equalsIgnoreCase("false")) {
				throw new Exception("No tours found for user " + userid);
			}
			return gson.fromJson(data, Tour[].class);
		} else {
			return this.getDummyTours();

		}
	}

	// ------------------------------------ WRITE BLOCKCHAIN REQUEST
	// ------------------------------------ //

	public Tour writeTour(String userid, String vechicleId, Tour tour) throws Exception {
		System.out.println("=== DEBUG: writeTour called ===");
		System.out.println("Tour before JSON conversion: " + tour.toString());
		System.out.println("InternationaleFahrten before JSON: " + tour.getInternationaleFahrten());

		// Sicherstellen dass internationaleFahrten nicht null/leer ist
		if (tour.getInternationaleFahrten() == null || tour.getInternationaleFahrten().isEmpty()) {
			System.out.println("InternationaleFahrten is null/empty, setting defaults");
			Map<String, Boolean> defaults = new HashMap<>();
			defaults.put("eu", false);
			defaults.put("eu_ch", false);
			defaults.put("inland", true);
			tour.setInternationaleFahrten(defaults);
		}

		String jsonString = gson.toJson(tour);
		System.out.println("JSON string: " + jsonString);

		return writeTour(userid, vechicleId, jsonString);
	}

	private Tour writeTour(String userid, String vehicleId, String tour) throws Exception {
		System.out.println("=== DEBUG: writeTour(String) called ===");
		System.out.println("JSON received: " + tour);

		if (gateway == null) {
			gateway = connect();
		}
		Network network = gateway.getNetwork(channel);
		Contract contract = network.getContract(smartContract);

		// Parse und validate vor dem senden
		Tour tourObject = gson.fromJson(tour, Tour.class);
		System.out.println("Parsed tour object internationaleFahrten: " + tourObject.getInternationaleFahrten());

		String data = new String(contract.submitTransaction(
				"createTour",
				userid,
				vehicleId,
				tour
		));

		while (data.contains("\\\"")) {
			data = data.replace("\\\"", "\"");
		}
		if (data.equalsIgnoreCase("false")) {
			throw new Exception("Tour could not be created.");
		}
		try {
			return gson.fromJson(data, Tour.class);
		} catch (Exception e) {
			return gson.fromJson(data.substring(1, data.length() - 1), Tour.class);
		}
	}

	public void createTransport() throws Exception {

		if (gateway == null) {
			gateway = connect();
		}
		Network network = gateway.getNetwork(channel);
		Contract contract = network.getContract(smartContract);
		try {
			contract.submitTransaction("createTransport", "");
		} catch (ContractException | TimeoutException | InterruptedException e) {
			logger.error("Error while creating a transport {}", e);
			e.printStackTrace();
		}
	}
	// ------------------------------------ UPDATE BLOCKCHAIN REQUEST
	// ------------------------------------ //



	public Tour updateTourInternationaleFahrten(String userid, String tourid, Map<String, Boolean> internationaleFahrten) throws Exception {
		if (gateway == null) {
			gateway = connect();
		}
		Network network = gateway.getNetwork(channel);
		Contract contract = network.getContract(smartContract);

		Tour currentTour = readTour(userid, tourid);
		if (currentTour == null) {
			throw new Exception("Tour with id " + tourid + " does not exist.");
		}

		currentTour.setInternationaleFahrten(internationaleFahrten);

		String tourJson = gson.toJson(currentTour);
		System.out.println("testtest"+" "+tourJson);
		String data = new String(contract.submitTransaction(
				"updateTour",
				userid,
				tourid,
				tourJson
		));

		while (data.contains("\\\"")) {
			data = data.replace("\\\"", "\"");
		}

		if (data.equalsIgnoreCase("false")) {
			throw new Exception("Tour could not be updated.");
		}

		try {
			return gson.fromJson(data, Tour.class);
		} catch (Exception e) {
			return gson.fromJson(data.substring(1, data.length() - 1), Tour.class);
		}
	}

	public Waypoint updateTour(String userid, String tourid, Waypoint wp) throws Exception {
		return updateTour(userid, tourid, gson.toJson(wp));
	}
	private Waypoint updateTour(String userid, String tourid, String wp) throws Exception {
		if (gateway == null) {
			gateway = connect();
		}
		Network network = gateway.getNetwork(channel);
		Contract contract = network.getContract(smartContract);

		// Submit transaction
		String data = new String(contract.submitTransaction("addWaypoint", userid, tourid, wp));

		// Bereinige escaped quotes
		while (data.contains("\\\"")) {
			data = data.replace("\\\"", "\"");
		}

		logger.info("Response from addWaypoint: " + data);

		// Prüfe auf Fehler
		if (data.equalsIgnoreCase("false")) {
			throw new Exception("Waypoint could not be added.");
		}

		// Parse die Antwort
		try {
			return gson.fromJson(data, Waypoint.class);
		} catch (Exception e) {
			logger.error("Unable to parse waypoint {} Exception: {}", data, e);

			// Versuche nochmal mit bereinigtem String
			if (data.startsWith("\"") && data.endsWith("\"")) {
				return gson.fromJson(data.substring(1, data.length() - 1), Waypoint.class);
			}

			throw e;
		}
	}

	public int getTourCount(String userid) throws Exception {
		Tour[] tours = readTours(userid);
		return tours.length;
	}

	public double calculateTotalDistance(String userId) throws Exception {
		if (gateway == null) {
			gateway = connect();
		}
		Network network = gateway.getNetwork(channel);
		Contract contract = network.getContract(smartContract);

		try {
			String data = new String(contract.evaluateTransaction("calculateTotalDistance", userId));
			if (data.equalsIgnoreCase("false")) {
				throw new Exception("Unable to calculate total distance.");
			}

			return gson.fromJson(data, Double.class);
		} catch (Exception e) {
			logger.error("Error getting total distance: {}", e);
			throw new Exception("Error while calculating total distance.", e);
		}
	}

	public int getCO2(String userid) throws Exception {
		return 0;
	}



	private Tour getDummyTour(String tourId) {
		var waypoints = new ArrayList<Waypoint>();

		waypoints.add(new Waypoint(1.0f, 1.2f, 1679696780L));
		waypoints.add(new Waypoint(1.2f, 1.8f, 1679696790L));
		waypoints.add(new Waypoint(1.3f, 1.9f, 1679696800L));
		waypoints.add(new Waypoint(1.4f, 2.0f, 1679696840L));

		Tour tour = new Tour("alice", tourId, waypoints);

		// Default internationale Fahrten setzen
		Map<String, Boolean> internationaleFahrten = new HashMap<>();
		internationaleFahrten.put("eu", false);
		internationaleFahrten.put("eu_ch", false);
		internationaleFahrten.put("inland", true);
		tour.setInternationaleFahrten(internationaleFahrten);

		return tour;
	}

	private Tour[] getDummyTours() {
		var waypoints = new ArrayList<Waypoint>();

		waypoints.add(new Waypoint(1.0f, 1.2f, 1679696780L));
		waypoints.add(new Waypoint(1.2f, 1.8f, 1679696790L));
		waypoints.add(new Waypoint(1.3f, 1.9f, 1679696800L));
		waypoints.add(new Waypoint(1.4f, 2.0f, 1679696840L));

		Tour tour1 = new Tour("alice", "tour1", waypoints);
		Tour tour2 = new Tour("alice", "tour2", waypoints);

		// Default internationale Fahrten für beide Tours setzen
		Map<String, Boolean> internationaleFahrten = new HashMap<>();
		internationaleFahrten.put("eu", false);
		internationaleFahrten.put("eu_ch", false);
		internationaleFahrten.put("inland", true);

		tour1.setInternationaleFahrten(internationaleFahrten);
		tour2.setInternationaleFahrten(new HashMap<>(internationaleFahrten)); // Kopie für tour2

		Tour[] tours = new Tour[] { tour1, tour2 };
		return tours;
	}



	public double calculateAverageTourTime(String userId) throws Exception {
		if (gateway == null) {
			gateway = connect();
		}

		Network network = gateway.getNetwork(channel);
		Contract contract = network.getContract(smartContract);

		try {
			String data = new String(contract.evaluateTransaction("calculateAverageTourTime", userId));
			if (data.equalsIgnoreCase("false")) {
				throw new Exception("Unable to calculate average tour time.");
			}

			return gson.fromJson(data, Double.class);
		} catch (Exception e) {
			logger.error("Error getting average tour time: {}", e);
			throw new Exception("Error while calculating average tour time.", e);
		}
	}

	public double calculateAverageCO2(String userId) throws Exception {
		if (gateway == null) {
			gateway = connect();
		}

		Network network = gateway.getNetwork(channel);
		Contract contract = network.getContract(smartContract);

		try {
			String data = new String(contract.evaluateTransaction("calculateAverageCO2", userId));
			if (data.equalsIgnoreCase("false")) {
				throw new Exception("Unable to calculate average CO2.");
			}

			return gson.fromJson(data, Double.class);
		} catch (Exception e) {
			logger.error("Error getting average CO2: {}", e);
			throw new Exception("Error while calculating average CO2.", e);
		}
	}

}