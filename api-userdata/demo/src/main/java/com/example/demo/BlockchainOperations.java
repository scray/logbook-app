/*
 * BlockchainWriter.java
 *
 * created at 2021-07-01 by st.obermeier <YOURMAILADDRESS>
 *
 * Copyright (c) SEEBURGER AG, Germany. All Rights Reserved.
 */
package com.example.demo;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.hyperledger.fabric.gateway.Contract;
import org.hyperledger.fabric.gateway.Gateway;
import org.hyperledger.fabric.gateway.Network;
import org.hyperledger.fabric.gateway.Wallet;
import org.hyperledger.fabric.gateway.Wallets;

public class BlockchainOperations {
    String channel = "mychannel";
    String smartContract = "basic";
    String walletPathString = "";
    String userName = "";
    Gateway gateway = null;

    public BlockchainOperations(String channel, String smartContract, String userName, String walletPath) {
        super();
        this.channel = channel;
        this.smartContract = smartContract;
        this.walletPathString = walletPath;
        this.userName = userName;
    }

    static {
        System.setProperty("org.hyperledger.fabric.sdk.service_discovery.as_localhost", "false");
    }

    /* WRITE METHODEN */
    public void writeTravels(Travels ts) {
        try {
            if (gateway == null) {
                gateway = connect(userName);
            }
            // get the network and contract
            Network network = gateway.getNetwork(channel);
            Contract contract = network.getContract(smartContract);

            contract.submitTransaction("writeTravels_BLOCKCHAIN",
                    userName,
                    ts.getAllTravels().toString());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void writeTravel(Travel t) {
        try {
            if (gateway == null) {
                gateway = connect(userName);
            }
            // get the network and contract
            Network network = gateway.getNetwork(channel);
            Contract contract = network.getContract(smartContract);

            contract.submitTransaction("writeTravel_BLOCKCHAIN",
                    userName,
                    t.toString());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void writePosition(String tID, Position p) {
        try {
            if (gateway == null) {
                gateway = connect(userName);
            }
            // get the network and contract
            Network network = gateway.getNetwork(channel);
            Contract contract = network.getContract(smartContract);

            contract.submitTransaction("writePosition_BLOCKCHAIN",
            userName,
            tID,
            p.toString());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /* READ METHODEN */
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
}