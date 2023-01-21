# logbook-app

## Logbook App (REST API)
The REST API is made in Java with SpringBoot. It is used to communicate with the blockchain running either on the same or another system.

### Prerequisites
Even though there is already a running instance of the chaincode which can be accessed with the files in the `wallet` folder, if you want to use your own chaincode, remember to change the `wallet/connection.yml` and `wallet/alice.id` files to point to your own kubernetes cluster.
More on this in the [chaincode](../chaincode/README.md) folder.

### Run and Build the REST API

#### Docker
Locate into the rest-api directory and (optionally) run the tests to check if a connection to the blockchain can be established:
```bash
cd rest-api
mvn test
```

Build the docker image:
```bash
docker build -t logbook-app-rest-api .
```

Run the docker image:
```bash
docker run -p 8080:8080 logbook-app-rest-api
```

#### Local system
Locate into the rest-api directory and (optionally) run the tests to check if a connection to the blockchain can be established:
```bash
cd rest-api
mvn test
```

Run the application:
```bash
mvn spring-boot:run
```

Make sure that the `wallet` folder is in the root directory of the project.