package org.scray.logbookappApi;

import org.scray.logbookappApi.Logging.DiscordHook;
import org.scray.logbookappApi.Objects.Tour;
import com.google.gson.Gson;

public class Test {

    public static void main (String[] args){
        DiscordHook.send("Test started");
    }
}
