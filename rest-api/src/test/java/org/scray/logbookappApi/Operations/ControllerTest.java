package org.scray.logbookappApi.Operations;

import com.google.gson.Gson;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.scray.logbookappApi.Objects.Tour;
import org.scray.logbookappApi.Objects.Waypoint;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.RequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Arrays;

@ExtendWith(SpringExtension.class)
@WebMvcTest(value = Controller.class)
@WithMockUser
class ControllerTest {
    Gson gson = new Gson();

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private Controller controller;

    @Disabled("Temporarily disabled - needs update for documents field")
    @Test
    void testWrite() throws Exception {
        Mockito.when(controller.write_tour(Mockito.anyString(), Mockito.any(Tour.class))).thenReturn(ResponseEntity.ok(gson.toJson(this.getNewTour())));
        RequestBuilder requestBuilder = MockMvcRequestBuilders
                .post("/tour-app/tours/1")
                .accept(MediaType.APPLICATION_JSON)
                .content(gson.toJson(this.getNewTour()))
                .contentType(MediaType.APPLICATION_JSON);

        MvcResult result = mockMvc.perform(requestBuilder).andReturn();

        assertEquals(gson.toJson(this.getNewTour()), result.getResponse().getContentAsString());
    }

    @Test
    void testUpdate() throws Exception {
        Mockito.when(controller.update_tour(Mockito.anyString(), Mockito.anyString(), Mockito.any(Waypoint.class))).thenReturn(ResponseEntity.ok("OK"));
        RequestBuilder requestBuilder = MockMvcRequestBuilders.put(
                        "/tour-app/tours/1/0"
                )
                .accept(MediaType.APPLICATION_JSON)
                .content(gson.toJson(this.getNewWaypoint()))
                .contentType(MediaType.APPLICATION_JSON);

        MvcResult result = mockMvc.perform(requestBuilder).andReturn();

        assertEquals("OK", result.getResponse().getContentAsString());
    }

    @Test
    void testGetTour() throws Exception {
        Mockito.when(controller.get_tour(Mockito.anyString(), Mockito.anyString())).thenReturn(ResponseEntity.ok(gson.toJson(this.getNewTour())));
        RequestBuilder requestBuilder = MockMvcRequestBuilders.get(
                "/tour-app/tours/1/0"
        ).accept(MediaType.APPLICATION_JSON);

        MvcResult result = mockMvc.perform(requestBuilder).andReturn();

        assertEquals(gson.toJson(this.getNewTour()), result.getResponse().getContentAsString());
    }

    @Test
    void testGetTours() throws Exception {
        Mockito.when(controller.get_tours(Mockito.anyString())).thenReturn(ResponseEntity.ok(gson.toJson(new Tour[]{this.getNewTour()})));
        RequestBuilder requestBuilder = MockMvcRequestBuilders.get(
                "/tour-app/tours/1"
        ).accept(MediaType.APPLICATION_JSON);

        MvcResult result = mockMvc.perform(requestBuilder).andReturn();

        assertEquals(gson.toJson(new Tour[]{this.getNewTour()}), result.getResponse().getContentAsString());
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