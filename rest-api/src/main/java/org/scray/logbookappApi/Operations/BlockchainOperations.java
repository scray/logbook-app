package org.scray.logbookappApi.Operations;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.logging.*;

import com.google.gson.Gson;
import org.hyperledger.fabric.gateway.*;
import org.scray.logbookappApi.Data.Tour;
import org.scray.logbookappApi.Objects.Waypoint;

public class BlockchainOperations {
    Gson gson = new Gson();
    static Logger logger = Logger.getLogger(Logger.GLOBAL_LOGGER_NAME);

    String channel = "mychannel";
    String smartContract = "basic";
    String walletPathString = "";
    String userName = "";
    Gateway gateway = null;

    private final String userid = "0";

    // ------------------------------------ TEST METHOD (TO DELETE) ------------------------------------ //
    public String readtest(int methode) {
        if (methode == 1) {
            return "Returned from" + this.getClass().toString();
        } else {
            return "Wrong method!";
        }
    }

    // ------------------------------------ CONSTRUCTOR ------------------------------------ // 
    public BlockchainOperations(String channel, String smartContract, String userName, String walletPath) {
        super();
        this.channel = channel;
        this.smartContract = smartContract;
        this.walletPathString = walletPath;
        this.userName = userName;
    }

    // ------------------------------------ BUILD UP CONNECTION ------------------------------------ //
    public Gateway connect(String userName)
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
    public String readTour(String userid, String tourid) throws Exception {
        String data = "";
        if (gateway == null) {
            gateway = connect(userName);
        }
        Network network = gateway.getNetwork(channel);
        Contract contract = network.getContract(smartContract);

        data = new String(contract.evaluateTransaction("getTour", userid, tourid));
        logger.info("Get succesful.");
        return data;
    }

    public String readTours(String userId) throws Exception {
        String data = "";
        if (gateway == null) {
            gateway = connect(userName);
        }
        Network network = gateway.getNetwork(channel);
        Contract contract = network.getContract(smartContract);

        data = new String(contract.evaluateTransaction("getTours", userid, userId));
        logger.info("Get succesful.");
        return data;
    }

    // ------------------------------------ WRITE BLOCKCHAIN REQUEST ------------------------------------ //

    public void writeTour(String userid, Tour tour) throws Exception {
        writeTour(userid, gson.toJson(tour));
    }

    private void writeTour(String userid, String tour) throws Exception {
        if (gateway == null) {
            gateway = connect(userName);
        }
        Network network = gateway.getNetwork(channel);
        Contract contract = network.getContract(smartContract);

        contract.submitTransaction("createTour", userid, tour);
        logger.info("Post succesful.");
    }

    // ------------------------------------ UPDATE BLOCKCHAIN REQUEST ------------------------------------ //

    public void updateTour(String userid, String tourid, Waypoint wp) throws Exception {
        updateTour(userid, tourid, gson.toJson(wp));
    }

    private void updateTour(String userid, String tourid, String wp) throws Exception {
        if (gateway == null) {
            gateway = connect(userName);
        }
        Network network = gateway.getNetwork(channel);
        Contract contract = network.getContract(smartContract);

        contract.submitTransaction("addWaypoint", userid, tourid, wp);
    }
}