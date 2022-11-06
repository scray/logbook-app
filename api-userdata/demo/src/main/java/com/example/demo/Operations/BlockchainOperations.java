package com.example.demo.Operations;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.hyperledger.fabric.gateway.Contract;
import org.hyperledger.fabric.gateway.Gateway;
import org.hyperledger.fabric.gateway.Network;
import org.hyperledger.fabric.gateway.Wallet;
import org.hyperledger.fabric.gateway.Wallets;
import org.apache.commons.logging.Log;
import org.apache.tomcat.util.json.JSONParser;
import org.json.*;

public class BlockchainOperations {
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
    public String read(String methodName) {
        String data = "{}";
        try {
            if (gateway == null) {
                gateway = connect(userName);
            }
            // get the network and contract
            Network network = gateway.getNetwork(channel);
            Contract contract = network.getContract(smartContract);

            data = new String(contract.evaluateTransaction(methodName));
            return data;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return data;
    }

    // ------------------------------------ WRITE BLOCKCHAIN REQUEST ------------------------------------ //
   
    public void writeTour(String tour_string) {
        try {
            if (gateway == null) {
                gateway = connect(userName);
            }
            // get the network and contract
            Network network = gateway.getNetwork(channel);
            Contract contract = network.getContract(smartContract);

            contract.submitTransaction("Initialize",
            tour_string);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}