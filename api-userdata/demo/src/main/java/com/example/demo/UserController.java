package main.java.com.example.demo;

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

import main.java.com.example.demo.Users;
import main.java.com.example.demo.UserDAO;
import main.java.com.example.demo.User;

@RestController
@RequestMapping(path = "/users")
public class UserController {

	@Autowired
	private UserDAO userDataAccess;

    @GetMapping(path = "/", produces = "application/json")
	public Users getEmployees() {
		return userDataAccess.getAllUsers();
	}

	@GetMapping(path = "/{id}", produces = "application/json")
	public Employee getEmployee(@PathVariable int id) {
		return userDataAccess.getUser(id);
	}
	
	@GetMapping(path = "/{id}/name", produces = "application/json")
	public String getEmployeeMail(@PathVariable int id) {
		return userDataAccess.getUser(id).getName();
	}
	
	@GetMapping(path = "/names", produces = "application/json")
	public String getEmployeesMails() {
		StringBuilder s = new StringBuilder("");
		for (int i = 0; i < userDataAccess.getEmployeeCount(); i++) {
			s.append(userDataAccess.getEmployee.getName()).append;
		}
		return s.toString();
	}

	// Create a POST method to add an employee to the list
	@PostMapping(path = "/", consumes = "application/json", produces = "application/json")

	public ResponseEntity<Object> addUser(@RequestBody Employee user) {

		// Creating an ID of an employee from the number of employees
		Integer id = userDataAccess.getAllUsers().getUserList().size + 1;
		user.setId(id);

		userDataAccess.addUser(user);	
		URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(user.getId())
				.toUri();

		return ResponseEntity.created(location).build();
	}
}
