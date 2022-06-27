package com.example.demo;

import java.net.URI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

//import com.example.demo.Users;
//import com.example.demo.UserDAO;
//import com.example.demo.User;

@RestController
@RequestMapping(path = "/users")
public class UserController {

	@Autowired
	private UserDAO userDataAccess;

    @GetMapping(path = "/", produces = "application/json")
	public Users getUserList() {
		return userDataAccess.getAllUsers();
	}

	@GetMapping(path = "/{id}", produces = "application/json")
	public User getUser(@PathVariable int id) {
		return userDataAccess.getUser(id);
	}
	
	@GetMapping(path = "/{id}/travels", produces = "application/json")
	public String getAllUserTravels(@PathVariable int userID) {
		return userDataAccess.getUser(userID).getTravels().getAllTravels().toString();
	}

	@GetMapping(path = "/{userID}/travels/{travelID}", produces = "application/json")
	public String getUserTravel(@PathVariable int userID , @PathVariable int travelID) {
		return userDataAccess.getUser(userID).getTravels().getTravel(travelID).toString();
	}

	@GetMapping(path = "/{userID}/travels/{travelID}", produces = "application/json")
	public String getUserTravelStartPosition(@PathVariable int userID , @PathVariable int travelID) {
		return userDataAccess.getUser(userID).getTravels().getTravel(travelID).getFirstTravelPosition().toString();
	}

	@GetMapping(path = "/{userID}/travels/{travelID}", produces = "application/json")
	public String getUserTravelEndPosition(@PathVariable int userID , @PathVariable int travelID) {
		return userDataAccess.getUser(userID).getTravels().getTravel(travelID).getLastTravelPosition().toString();
	}
	
	@GetMapping(path = "/names", produces = "application/json")
	public String getUserNames() {
		StringBuilder s = new StringBuilder("");
		for (int i = 0; i < userDataAccess.getUserCount(); i++) {
			s.append(userDataAccess.getUser(i).getName());
		}
		return s.toString();
	}
	

	// Create a POST method to add an employee to the list
	@PostMapping(path = "/", consumes = "application/json", produces = "application/json")

	public ResponseEntity<Object> addUser(@RequestBody User user) {

		// Creating an ID of an employee from the number of employees
		Integer id = userDataAccess.getAllUsers().getUserList().size() + 1;
		user.setId(id);

		userDataAccess.addUser(user);	
		URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(user.getId())
				.toUri();

		return ResponseEntity.created(location).build();
	}
}
