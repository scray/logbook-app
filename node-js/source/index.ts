import { Context, Contract } from "fabric-contract-api";

export class AddChangesContract extends Contract {

    constructor() {
        super("AddChangesContract");
    }

    async instantiate(ctx : Context) {
     
    }

    async setNewAssetValue(ctx : Context, newValue : number) {
    
    }
}

module.exports = AddChangesContract;