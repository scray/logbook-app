import { Context, Contract } from 'fabric-contract-api';

class Contracts extends Contract {

    public async Initialize(context: Context) {
        console.info("The ledger has been initialized.");

        /*
            Set initialization paramters in this function and call it once the chaincode has been started.
        */
    }

}