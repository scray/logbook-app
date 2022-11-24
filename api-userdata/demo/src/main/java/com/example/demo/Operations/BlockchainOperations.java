package com.example.demo.Operations;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.logging.*;

import org.hyperledger.fabric.gateway.Contract;
import org.hyperledger.fabric.gateway.Gateway;
import org.hyperledger.fabric.gateway.Network;
import org.hyperledger.fabric.gateway.Wallet;
import org.hyperledger.fabric.gateway.Wallets;

import com.example.demo.Objects.Tour;
import com.example.demo.Objects.Waypoint;

public class BlockchainOperations {
    static Logger logger = Logger.getLogger(Logger.GLOBAL_LOGGER_NAME);

    String channel = "mychannel";
    String smartContract = "basic";
    String walletPathString = "";
    String userName = "";
    Gateway gateway = null;

    // ------------------------------------ TEST METHOD (TO DELETE) ------------------------------------ //
    public String readtest(int methode){
        if (methode == 1){
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
    public Tour readTour(String id) {
        Tour data = new Tour();
        try {
            if (gateway == null) {
                gateway = connect(userName);
            }
            Network network = gateway.getNetwork(channel);
            Contract contract = network.getContract(smartContract);

            //TODO --> RETURN TOUR / TOUR[]
            //data = new String(contract.evaluateTransaction("getTour", id));
            logger.info("Get succesful.");
            return data;
        } catch (Exception e) {
            e.printStackTrace();
        }
        logger.warning("Get failed.");
        return null;
    }

    public Tour[] readTours(String id) {
        Tour[] data = null;
        try {
            if (gateway == null) {
                gateway = connect(userName);
            }
            Network network = gateway.getNetwork(channel);
            Contract contract = network.getContract(smartContract);

            //TODO --> RETURN TOUR[]
            //data = new String(contract.evaluateTransaction("getTours", id));
            logger.info("Get succesful.");
            return data;
        } catch (Exception e) {
            e.printStackTrace();
        }
        logger.warning("Get failed.");
        return null;
    }

    // ------------------------------------ WRITE BLOCKCHAIN REQUEST ------------------------------------ //
   
    public void writeTour(Tour tour) {
        try {
            if (gateway == null) {
                gateway = connect(userName);
            }
            Network network = gateway.getNetwork(channel);
            Contract contract = network.getContract(smartContract);

            //TODO --> Tour übergeben! Datentyp?
            contract.submitTransaction("createTour", tour.toString());
            logger.info("Post succesful.");
        } catch (Exception e) {
            e.printStackTrace();
            logger.warning("Post failed.");
        }
    }

    // ------------------------------------ UPDATE BLOCKCHAIN REQUEST ------------------------------------ //
   
    public void updateTour(String id, Waypoint wp) {
        try {
            if (gateway == null) {
                gateway = connect(userName);
            }
            Network network = gateway.getNetwork(channel);
            Contract contract = network.getContract(smartContract);

            //TODO --> Übergabe 2 Parameter
            //contract.submitTransaction("addWaypoint", id, wp);
        } catch (Exception e) {
            e.printStackTrace();

        }
    }

    // ------------------------------------ UPDATE BLOCKCHAIN REQUEST ------------------------------------ //
    public void patchTour(String id, Boolean has_finished) {
        try {
            if (gateway == null) {
                gateway = connect(userName);
            }
            Network network = gateway.getNetwork(channel);
            Contract contract = network.getContract(smartContract);

            //TODO --> Übergabe 2 Parameter
            //contract.submitTransaction("addWaypoint", id, has_finished);
        } catch (Exception e) {
            e.printStackTrace();

        }
    }
}