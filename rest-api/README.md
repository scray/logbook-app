# logbook-app

## Logbook App (REST API)
The REST API is made in Java with SpringBoot. It is used to communicate with the blockchain running either on the same or another system.

### Docker
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

### Local system
Locate into the rest-api directory and (optionally) run the tests to check if a connection to the blockchain can be established:
```bash
cd rest-api
mvn test
```

Run the application:
```bash
mvn spring-boot:run
```