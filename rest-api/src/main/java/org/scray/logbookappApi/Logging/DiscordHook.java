package org.scray.logbookappApi.Logging;

import javax.net.ssl.HttpsURLConnection;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.logging.Logger;

public class DiscordHook implements Runnable {
    private final String webhookURL = "https://discord.com/api/webhooks/1066042572910370896/kGhTilwHA1gijT7iCxssmqmmDZW_bx1DmcsC-CmkLuhD5mTledQ_ior9L6hlU95jzEa3";

    public static void send(String message) {
        System.out.println(message);
        new Thread(new DiscordHook(message)).start();
    }

    private final String message;

    public DiscordHook(String message) {
        this.message = message;
    }

    @Override
    public void run() {
        try {
            final HttpsURLConnection connection = (HttpsURLConnection) new URL(webhookURL).openConnection();
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setRequestProperty("User-Agent", "Mozilla/5.0 (X11; U; Linux i686) Gecko/20071127 Firefox/2.0.0.11");
            connection.setDoOutput(true);
            Logger.getLogger(Logger.GLOBAL_LOGGER_NAME).info("Sending message to Discord: " + message);
            try (final OutputStream outputStream = connection.getOutputStream()) {
                // Handle backslashes.
                String preparedCommand = message.replaceAll("\\\\", "");
                if (preparedCommand.endsWith(" *")) preparedCommand = preparedCommand.substring(0, preparedCommand.length() - 2) + "*";

                outputStream.write(("{\"content\":\"" + preparedCommand + "\"}").getBytes(StandardCharsets.UTF_8));
            }
            connection.getInputStream();
        } catch (final IOException e) {
            e.printStackTrace();
        }
    }
}