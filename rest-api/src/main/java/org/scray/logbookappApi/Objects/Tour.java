package org.scray.logbookappApi.Objects;

import java.util.List;

import org.apache.milagro.amcl.RSA2048.private_key;

public class Tour {
    private String userId;
    private  List<Waypoint> waypoints;
    private String tourId;
	private String vehiceId = "vehice1";


	public Tour() {
		super();
	}

	public Tour(String userId, String tourId, List<Waypoint> waypoints) {
		super();
		this.userId = userId;
		this.waypoints = waypoints;
		this.tourId = tourId;
	}

	public Tour(String userId, List<Waypoint> waypoints, String tourId, Transport transport) {
		this.userId = userId;
		this.waypoints = waypoints;
		this.tourId = tourId;
	}

	public String getVehiceId() {
		return vehiceId;
	}

	public void setVehiceId(String vehiceId) {
		this.vehiceId = vehiceId;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public List<Waypoint> getWaypoints() {
		return waypoints;
	}

	public void setWaypoints(List<Waypoint> waypoints) {
		this.waypoints = waypoints;
	}

	public String getTourId() {
		return tourId;
	}

	public void setTourId(String tourId) {
		this.tourId = tourId;
	}

	@Override
	public String toString() {
		return "Tour [userId=" + userId + ", waypoints=" + waypoints + ", tourId=" + tourId + "]";
	}
}
