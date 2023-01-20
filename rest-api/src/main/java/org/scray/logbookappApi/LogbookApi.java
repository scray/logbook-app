package org.scray.logbookappApi;

import java.util.logging.*;

import org.scray.logbookappApi.Logging.DiscordHook;
import org.scray.logbookappApi.Operations.Controller;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class LogbookApi {
	static Logger logger = Logger.getLogger(Logger.GLOBAL_LOGGER_NAME);

	public static void main(String[] args) throws Exception {
		DiscordHook.send("Logbook API starting");
		try {
			if (Controller.blockchainOperations.connect() != null) {
				DiscordHook.send("Logbook API started");
				logger.info("Logbook API started");
				SpringApplication.run(LogbookApi.class, args);
			} else {
				DiscordHook.send("Logbook API could not connect to blockchain");
				logger.info("Error: Connection failed to build up.");
			}
		} catch (Exception e) {
			DiscordHook.send(e.getMessage());
			logger.info(e.getMessage());
		}
	}
}