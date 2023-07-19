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
docker build -t scrayorg/logbook-app-chaincode:1.0 .
```

Run the docker image:
```bash
docker run logbook-app-chaincode
```

You will have to open some ports to be able to communicate with the chaincode.


### Run it in local mikrok8s cluster

#### Move image
```bash
docker save scrayorg/logbook-app-chaincode:1.0 > logbook-app-chaincode:1.0.tar
microk8s ctr image import logbook-app-chaincode:1.0.tar

```

### Start deployment and install chaincode
```bash
PKGID=basic_1.0:a50b6e6de3ac0a753193c6f36767ca26f2a09670542ed6a5ded0b1ac3efef923
kubectl delete configmap invoice-chaincode-external
kubectl create configmap invoice-chaincode-external \
 --from-literal=chaincode_id=$PKGID



kubectl apply -f k8s-deployment-descriptor.yaml
```

## Debugging

### Editing chaincode in container
* Get pod with contains the chaincode:  
  ```
  CC_POD=$(kubectl get pod -l app=logbook-app-chaincode -o jsonpath="{.items[0].metadata.name}")
  ```
* Get console promt in chain code container  
  ```
  kubectl exec --stdin --tty $CC_POD  -- /bin/sh
  ```
* Edit chain code
  ```
   cd /usr/local/lib/logbook-app/chaincode
   vi blockchain/contract.js
  ```
* Compiel and start chain code  
   ```
   npm install
   npm start
  ```
### Manualy start chaincode
#### Start in background
```
nohup npm start > /var/log/chaincode/logbook-app.logs 2>&1 &
```

#### Terminate chaincode

```
kill $(ps -ef | pgrep -f fabric-chaincode-node)
```

#### Show logs
```
tail -f /var/log/chaincode/logbook-app.logs
```

### Execute chaincode with CLI
```
peer chaincode query -C channel-1 -n basic -c '{"function":"getTours","Args":[""]}'
```
