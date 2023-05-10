package org.scray.logbookappApi.Operations;

import com.google.gson.Gson;
import org.junit.jupiter.api.Test;
import org.scray.logbookappApi.Objects.Tour;
import org.scray.logbookappApi.Objects.Waypoint;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Tag;

class BlockchainOperationsTest {
    Gson gson = new Gson();

    Tour tour = new Tour(
            "1",
            "0",
            new Waypoint[0]
    );

    Waypoint waypoint = new Waypoint(
            .0f,
            .0f,
            0
    );

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
            assertEquals(gson.toJson(tour), blockchainOperations.writeTour("1", tour));
        } catch (Exception e) {
            fail(e);
        }
    }

    @Test
    @Tag("IntegrationTest")
    void updateTour() {
        try {
            blockchainOperations.updateTour("1", "0", waypoint);
        } catch (Exception e) {
            fail(e);
        }
    }
}