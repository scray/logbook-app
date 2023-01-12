package org.scray.dlt_logbook.client;


import java.util.Date;
import java.util.Random;

import org.scray.hyperledger.fabric.example.app.BlockchainOperations;


public class App
{

    public static void main(String[] args)
        throws Exception
    {
        String walletPath = "./clients/java-example-client/wallet";

        BlockchainOperations blockchainOperations = new BlockchainOperations("channel-t", "basic", "alice", walletPath);

        blockchainOperations.write(
                                   "key " + (new Date()).toString(),
                                   "value" + new Random().nextInt());

        String assets = blockchainOperations.read("GetAllAssets");

        System.out.println("Assets: " + assets);
    }

    public static void writeAndReadEntry(BlockchainOperations blockchainOperations) {
        blockchainOperations.createEntry("entry1", "user1", "travel1", "pos1");
        String entry = blockchainOperations.getEntry("entry1");
        System.out.println("Assets: " + entry);
    }

}
