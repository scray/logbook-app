package org.scray.dlt_logbook.client;


import java.util.Date;
import java.util.Random;


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

}
