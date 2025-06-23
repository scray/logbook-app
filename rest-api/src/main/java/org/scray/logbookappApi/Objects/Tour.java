package org.scray.logbookappApi.Objects;

import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;

public class Tour {
	private String userId;
	private List<Waypoint> waypoints;
	private String tourId;
	private String vehiceId = "vehice1";
	private long startTime;
	private long endTime;
	private Map<String, Boolean> internationaleFahrten;
	private List<Document> documents;

	public Tour() {
		super();
		this.internationaleFahrten = createDefaultInternationaleFahrtenMap();
		this.documents = new ArrayList<>();
	}

	public Tour(String userId, String tourId, List<Waypoint> waypoints) {
		super();
		this.userId = userId;
		this.waypoints = waypoints;
		this.tourId = tourId;
		this.internationaleFahrten = createDefaultInternationaleFahrtenMap();
		this.documents = new ArrayList<>();

		this.startTime = waypoints.stream()
				.mapToLong(Waypoint::getTimestamp)
				.min()
				.orElse(0);

		this.endTime = waypoints.stream()
				.mapToLong(Waypoint::getTimestamp)
				.max()
				.orElse(0);
	}

	public Tour(String userId, List<Waypoint> waypoints, String tourId, Transport transport) {
		this.userId = userId;
		this.waypoints = waypoints;
		this.tourId = tourId;
		this.internationaleFahrten = createDefaultInternationaleFahrtenMap();
		this.documents = new ArrayList<>();
	}

	public Tour(String userId, List<Waypoint> waypoints, String tourId, Transport transport, boolean internationaleFahrten) {
		this.userId = userId;
		this.waypoints = waypoints;
		this.tourId = tourId;
		// Migration: boolean zu Map
		this.internationaleFahrten = createInternationaleFahrtenMap(internationaleFahrten);
		this.documents = new ArrayList<>();
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

	public long getStartTime() {
		return startTime;
	}

	public void setStartTime(long startTime) {
		this.startTime = startTime;
	}

	public long getEndTime() {
		return endTime;
	}

	public void setEndTime(long endTime) {
		this.endTime = endTime;
	}

	public Map<String, Boolean> getInternationaleFahrten() {
		if (internationaleFahrten == null) {
			System.out.println("DEBUG: internationaleFahrten was null, creating default");
			internationaleFahrten = createDefaultInternationaleFahrtenMap();
		}
		else if (internationaleFahrten.isEmpty()) {
			System.out.println("DEBUG: internationaleFahrten was empty, filling with defaults");
			internationaleFahrten.putAll(createDefaultInternationaleFahrtenMap());
		}
		return internationaleFahrten;
	}

	public void setInternationaleFahrten(Map<String, Boolean> internationaleFahrten) {
		if (internationaleFahrten == null || internationaleFahrten.isEmpty()) {
			System.out.println("DEBUG: Setting internationaleFahrten with null/empty map, using defaults");
			this.internationaleFahrten = createDefaultInternationaleFahrtenMap();
		} else {
			this.internationaleFahrten = internationaleFahrten;
		}
		System.out.println("DEBUG: After setting internationaleFahrten: " + this.internationaleFahrten);
	}

	// Backward compatibility - falls noch alte boolean Methoden verwendet werden
	public void setInternationaleFahrten(boolean internationaleFahrten) {
		this.internationaleFahrten = createInternationaleFahrtenMap(internationaleFahrten);
	}


	public List<Document> getDocuments() {
		if (documents == null) {
			documents = new ArrayList<>();
		}
		return documents;
	}

	public void setDocuments(List<Document> documents) {
		this.documents = documents;
	}

	public void addDocument(Document document) {
		if (this.documents == null) {
			this.documents = new ArrayList<>();
		}
		this.documents.add(document);
	}

	public void ensureInternationaleFahrtenInitialized() {
		if (internationaleFahrten == null) {
			internationaleFahrten = new HashMap<>();
		}
		if (internationaleFahrten.isEmpty()) {
			internationaleFahrten.putAll(createDefaultInternationaleFahrtenMap());
		}
	}

	@Override
	public String toString() {
		return "Tour [userId=" + userId + ", waypoints=" + waypoints + ", tourId=" + tourId
				+ ", internationaleFahrten=" + internationaleFahrten + ", documents=" + documents + "]";
	}

	private Map<String, Boolean> createInternationaleFahrtenMap(boolean isInternational) {
		Map<String, Boolean> map = new HashMap<>();
		map.put("eu", isInternational);
		map.put("eu_ch", isInternational);
		map.put("inland", !isInternational);
		return map;
	}

	private Map<String, Boolean> createDefaultInternationaleFahrtenMap() {
		Map<String, Boolean> map = new HashMap<>();
		map.put("eu", false);
		map.put("eu_ch", false);
		map.put("inland", true);
		return map;
	}


}