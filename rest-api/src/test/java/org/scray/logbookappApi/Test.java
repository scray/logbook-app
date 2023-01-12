package org.scray.logbookappApi;

import org.scray.logbookappApi.Objects.Tour;
import com.google.gson.Gson;

public class Test {

    public static Gson gson = new Gson();

    public static void main (String[] args){
        String obj = "{\"userId\":\"tristan\",\"tourId\":\"tourid\",\"waypoints\":[]};";
        Tour t = gson.fromJson(obj, Tour.class);
        System.out.println(t.getUserId());
    }
}
