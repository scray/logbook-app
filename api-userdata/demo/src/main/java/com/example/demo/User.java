package com.example.demo;

public class User {
    private int id;
    private String name;
    private String surname;
    private Travels travels;

    public User(int id, String name, String surname) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        travels = new Travels();
    }

    public int getId() {
        return id;
    }

    public void setId(int i) {
        id = i;
    }

    public String getName() {
        return surname + " " + name;
    }

    public void setName(String n) {
        name = n;
    }

    public void setSurname(String s) {
        surname = s;
    }

    public Travels getTravels() {
        return travels;
    }
}