package org.scray.logbookappApi.Operations;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.concurrent.TimeoutException;
import java.util.logging.*;

import com.google.gson.Gson;

import org.hyperledger.fabric.gateway.*;
import org.scray.logbookappApi.LogbookApi;
import org.scray.logbookappApi.Objects.Tour;
import org.scray.logbookappApi.Objects.Waypoint;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;

public class BlockchainOperations {

	@Value("${mock-mode:false}")
	private boolean mockMode=true;

	Gson gson = new Gson();
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
		return writeTour(userid, vechicleId, gson.toJson(tour));
	}

	private Tour writeTour(String userid, String vehicleId, String tour) throws Exception {
		String data;
		if (gateway == null) {
			gateway = connect();
		}
		Network network = gateway.getNetwork(channel);
		Contract contract = network.getContract(smartContract);
		contract.submitTransaction("createTour", userid, vehicleId, tour);
		data = new String(contract.submitTransaction("createTour", userid, vehicleId, tour));
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

	public Waypoint updateTour(String userid, String tourid, Waypoint wp) throws Exception {
		return updateTour(userid, tourid, gson.toJson(wp));
	}

	private Waypoint updateTour(String userid, String tourid, String wp) throws Exception {
		if (gateway == null) {
			gateway = connect();
		}
		Network network = gateway.getNetwork(channel);
		Contract contract = network.getContract(smartContract);
		String data = new String(contract.submitTransaction("addWaypoint", userid, tourid, wp));
		data = data.substring(data.length());
		while (data.contains("\\\"")) {
			data = data.replace("\\\"", "\"");
		}
		if (data.equalsIgnoreCase("false")) {
			throw new Exception("Waypoint could not be added.");
		}
		try {
			return gson.fromJson(data, Waypoint.class);
		} catch (Exception e) {
			logger.error("Unable to parse waypint {} Exception: {}", data, e);
			return gson.fromJson(data.substring(1, data.length() - 1), Waypoint.class);
		}
	}

	public int getTourCount(String userid) throws Exception {
		Tour[] tours = readTours(userid);
		return tours.length;
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

		return new Tour("alice", tourId, waypoints);
	}

	private Tour[] getDummyTours() {
		var waypoints = new ArrayList<Waypoint>();

		waypoints.add(new Waypoint(1.0f, 1.2f, 1679696780L));
		waypoints.add(new Waypoint(1.2f, 1.8f, 1679696790L));
		waypoints.add(new Waypoint(1.3f, 1.9f, 1679696800L));
		waypoints.add(new Waypoint(1.4f, 2.0f, 1679696840L));

		Tour[] tours = new Tour[] { new Tour("alice", "tour1", waypoints), new Tour("alice", "tour2", waypoints) };

		return tours;
	}

}