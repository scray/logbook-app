package org.scray.logbookappApi;

import java.util.logging.*;

import org.scray.logbookappApi.Operations.Controller;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class LogbookApi {
	static Logger logger = Logger.getLogger(Logger.GLOBAL_LOGGER_NAME);

	public static void main(String[] args) throws Exception {
		if (Controller.blockchainOperations.connect() != null) {
			SpringApplication.run(LogbookApi.class, args);
		} else {
			logger.info("Error: Connection failed to build up.");
		}
	}
}