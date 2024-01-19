package org.scray.logbookappApi.Operations;

import com.google.gson.Gson;
import org.junit.jupiter.api.Test;
import org.scray.logbookappApi.Objects.Tour;
import org.scray.logbookappApi.Objects.Waypoint;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Arrays;

import org.junit.jupiter.api.Tag;


class BlockchainOperationsTest {
    Gson gson = new Gson();

    private final BlockchainOperations blockchainOperations = new BlockchainOperations(
            "channel-t",
            "basic",
            "alice",
            "./wallet");

    @Test
    @Tag("IntegrationTest")
    void connect() {
        try (AutoCloseable connection = blockchainOperations.connect()) {
            assertNotNull(connection);
        } catch (Exception e) {
            fail(e);
        }
    }

    @Test
    @Tag("IntegrationTest")
    void readTour() {
        try {
            blockchainOperations.readTour("1", "0");
        } catch (Exception e) {
            fail(e);
        }
    }

    @Test
    @Tag("IntegrationTest")
    void readTours() {
        try {
           System.out.print("Tour id: " + blockchainOperations.readTours("1")[0].getTourId());
        } catch (Exception e) {
            fail(e);
        }
    }

    @Test
    @Tag("IntegrationTest")
    void writeTour() {
        try {
        	Tour tour = this.getNewTour();
            assertEquals(gson.toJson(tour), blockchainOperations.writeTour("alice", "v1",  tour));
        } catch (Exception e) {
        	e.printStackTrace();
            fail(e);
        }
    }

    @Test
    @Tag("IntegrationTest")
    void updateTour() {
        try {
            blockchainOperations.updateTour("1", "0", this.getNewWaypoint());
        } catch (Exception e) {
            fail(e);
        }
    }

    private Waypoint getNewWaypoint() {
    	return new Waypoint(.0f, .0f, 0);
    }

    private Tour getNewTour() {
        Waypoint waypoint = new Waypoint(.0f, .0f, 0);

        Tour tour = new Tour("1", "0", Arrays.asList(waypoint));

        return tour;
    }
}