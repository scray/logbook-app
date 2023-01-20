package org.scray.logbookappApi.Operations;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.logging.*;

import com.google.gson.Gson;
import org.hyperledger.fabric.gateway.*;
import org.scray.logbookappApi.Logging.DiscordHook;
import org.scray.logbookappApi.Objects.Tour;
import org.scray.logbookappApi.Objects.Waypoint;

public class BlockchainOperations {
    Gson gson = new Gson();
    static Logger logger = Logger.getLogger(Logger.GLOBAL_LOGGER_NAME);

    String channel;
    String smartContract;
    String walletPathString;
    String userName;
    Gateway gateway = null;

    // ------------------------------------ CONSTRUCTOR ------------------------------------ // 
    public BlockchainOperations(String channel, String smartContract, String userName, String walletPath) {
        super();
        this.channel = channel;
        this.smartContract = smartContract;
        this.walletPathString = walletPath;
        this.userName = userName;
    }

    // ------------------------------------ BUILD UP CONNECTION ------------------------------------ //
    public Gateway connect()
            throws Exception {
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

    // ------------------------------------ READ BLOCKCHAIN REQUEST ------------------------------------ //
    public Tour readTour(String userid, String tourid) throws Exception {
        String data;
        if (gateway == null) {
            gateway = connect();
        }
        Network network = gateway.getNetwork(channel);
        Contract contract = network.getContract(smartContract);

        data = new String(contract.evaluateTransaction("getTour", userid, tourid));
        logger.info("Get succesful.");
        return gson.fromJson(data, Tour.class);
    }

    public Tour[] readTours(String userid) throws Exception {
        String data;
        if (gateway == null) {
            gateway = connect();
        }
        Network network = gateway.getNetwork(channel);
        Contract contract = network.getContract(smartContract);

        data = new String(contract.evaluateTransaction("getTours", userid));
        DiscordHook.send(data);
        logger.info("Get succesful.");
        return gson.fromJson(data, Tour[].class);
    }

    // ------------------------------------ WRITE BLOCKCHAIN REQUEST ------------------------------------ //

    public Tour writeTour(String userid, Tour tour) throws Exception {
        return writeTour(userid, gson.toJson(tour));
    }

    private Tour writeTour(String userid, String tour) throws Exception {
        String data;
        if (gateway == null) {
            gateway = connect();
        }
        Network network = gateway.getNetwork(channel);
        Contract contract = network.getContract(smartContract);
        contract.submitTransaction("createTour", userid, tour);
        data = new String(contract.submitTransaction("createTour", userid, tour));
        while(data.contains("\\\"")) {
            data = data.replace("\\\"", "\"");
        }
        DiscordHook.send(data);
        try {
            return gson.fromJson(data, Tour.class);
        } catch (Exception e) {
            return gson.fromJson(data.substring(1, data.length() - 1), Tour.class);
        }
    }

    // ------------------------------------ UPDATE BLOCKCHAIN REQUEST ------------------------------------ //

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
        data = data.substring(1, data.length() - 1);
        while(data.contains("\\\"")) {
            data = data.replace("\\\"", "\"");
        }
        DiscordHook.send(data);
        try {
            return gson.fromJson(data, Waypoint.class);
        } catch (Exception e) {
            return gson.fromJson(data.substring(1, data.length() - 1), Waypoint.class);
        }
    }
}