const shim = require('fabric-shim');

const Chaincode = class {
	async Init(stub : any) {
		return shim.success(Buffer.from('Initialized Successfully!'));
	}
};

shim.start(new Chaincode());