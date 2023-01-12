/*
 * BlockchainWriter.java
 *
 * created at 2021-07-01 by st.obermeier <YOURMAILADDRESS>
 *
 * Copyright (c) SEEBURGER AG, Germany. All Rights Reserved.
 */
package org.scray.hyperledger.fabric.example.app;


import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.hyperledger.fabric.gateway.Contract;
import org.hyperledger.fabric.gateway.Gateway;
import org.hyperledger.fabric.gateway.Network;
import org.hyperledger.fabric.gateway.Wallet;
import org.hyperledger.fabric.gateway.Wallets;


public class BlockchainOperations
{
    String channel = "mychannel";
    String smartContract = "basic";
    String walletPathString = "";
    String userName = "";
    Gateway gateway = null;

    public BlockchainOperations(String channel, String smartContract, String userName, String walletPath)
    {
        super();
        this.channel = channel;
        this.smartContract = smartContract;
        this.walletPathString = walletPath;
        this.userName = userName;
    }

    static
    {
        System.setProperty("org.hyperledger.fabric.sdk.service_discovery.as_localhost", "false");
    }

    public void write(String id, String value)
    {

        try
        {
            if (gateway == null)
            {
                gateway = connect(userName);
            }

            // get the network and contract
            Network network = gateway.getNetwork(channel);
            Contract contract = network.getContract(smartContract);

            contract.submitTransaction("CreateAsset",
                                       id,
                                       value
                                       );
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }

    }

    public void createEntry(String entryId, String userId,  String travelId, String positions)
    {

        try
        {
            if (gateway == null)
            {
                gateway = connect(userName);
            }

            // get the network and contract
            Network network = gateway.getNetwork(channel);
            Contract contract = network.getContract(smartContract);

            contract.submitTransaction("createEntry",
                                       entryId,
                                       userId,
                                       travelId,
                                       positions
                                       );
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
    }

    public String getEntry(String id) {
        String data = "{}";

        try
        {
            if (gateway == null)
            {
                gateway = connect(userName);
            }

                        Network network = gateway.getNetwork(channel);
            Contract contract = network.getContract(smartContract);

            data = new String(contract.evaluateTransaction("getEntry", id));

            return data;

        }
        catch (Exception e)
        {
            e.printStackTrace();
        }

        return data;
    }


    public String read(String methodName)
    {
        String data = "{}";

        try
        {
            if (gateway == null)
            {
                gateway = connect(userName);
            }

            // get the network and contract
            Network network = gateway.getNetwork(channel);
            Contract contract = network.getContract(smartContract);

            data = new String(contract.evaluateTransaction(methodName));

            return data;

        }
        catch (Exception e)
        {
            e.printStackTrace();
        }

        return data;
    }


    public Gateway connect(String userName)
        throws Exception
    {
        // Load a file system based wallet for managing identities.
        Path walletPath = Paths.get(walletPathString);

        Wallet wallet = Wallets.newFileSystemWallet(walletPath);

        Path networkConfigPath = Paths.get(walletPathString + File.separator + "connection.yaml");
        Gateway.Builder builder = Gateway.createBuilder();
        builder.identity(wallet, userName).networkConfig(networkConfigPath).discovery(true);

        return builder.connect();
    }
}
