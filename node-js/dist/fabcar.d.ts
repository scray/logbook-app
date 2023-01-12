import { Context, Contract } from 'fabric-contract-api';
export declare class FabCar extends Contract {
    initLedger(ctx: Context): Promise<void>;
    queryCar(ctx: Context, carNumber: string): Promise<string>;
    createCar(ctx: Context, carNumber: string, make: string, model: string, color: string, owner: string): Promise<void>;
    queryAllCars(ctx: Context): Promise<string>;
    changeCarOwner(ctx: Context, carNumber: string, newOwner: string): Promise<void>;
}
