package org.scray.logbookappApi;

import java.util.logging.*;

import org.scray.logbookappApi.Operations.Controller;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class LogbookApi {

    private static Logger logger = LoggerFactory.getLogger(LogbookApi.class);


	public static void main(String[] args) throws Exception {
		logger.debug("Logbook API starting");
		try {
			if (Controller.blockchainOperations.connect() != null) {
				logger.info("Logbook API started");
				SpringApplication.run(LogbookApi.class, args);
			} else {
				logger.debug("Logbook API could not connect to blockchain");
				logger.info("Error: Connection failed to build up.");
			}
		} catch (Exception e) {
			logger.info(e.getMessage());
		}
	}
}