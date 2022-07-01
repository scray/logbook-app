package com.example.demo;

import org.springframework.stereotype.Repository;

@Repository
public class UserDAO {

	private static Users list = new Users();

	public Users getAllUsers() {
		return list;
	}

	public void addUser(User user) {
		list.getUserList().add(user);
	}
	
	public User getUser(int id) {
		return list.getUserList().get(id);
	}
	
	public int getUserCount() {
		return list.getUserList().size();
	}
}