# logbook-app

## Logbook App (Chaincode)
The chaincode is made with hyperledger fabric. It is used to store the data of the logbook entries. It is written in typescript in Node.js and compiled to javascript.

### Prerequisites
#### Using your own network
If you decide to host your own chaincode, you need to have a running instance of hyperledger fabric. You can find more information on how to do this in the [hyperledger fabric documentation](https://hyperledger-fabric.readthedocs.io/en/release-2.2/).

#### Discord Logger
The REST API can send logs to a Discord channel. To do this, you need to create a Discord Webhook and change the Discord webhook url `url` in the [DiscordHook](source/logger/discord.ts) file.

### Run and Build the Chaincode
#### Docker
Locate into the chaincode directory:
```bash
cd chaincode
```

Build the docker image:
```bash
docker build -t logbook-app-chaincode .
```

Run the docker image:
```bash
docker run logbook-app-chaincode
```

You will have to open some ports to be able to communicate with the chaincode.

## Debugging

### Editing chaincode in container
* Get pod with contains the chaincode:  
  ```
  CC_POD=$(kubectl get pod -l app=invoice-chaincode-external -o jsonpath="{.items[0].metadata.name}")
  ```
* Get console promt in chain code container  
  ```
  kubectl exec --stdin --tty $CC_POD  -- /bin/sh
  ```
* Edit chain code
  ```
   cd ~/logbook-app/chaincode
   vi release/blockchain/contract.js
  ```
* Compiel and start chain code  
   ```
   npm install
   npm start
  ```
