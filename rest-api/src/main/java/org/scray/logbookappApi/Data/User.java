package org.scray.logbookappApi.Data;

public class User {
    private int id;
    private String name;
    private String surname;
    private Tours tours;

    public User(int id, String name, String surname) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        tours = new Tours();
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

    public Tours getTours() {
        return tours;
    }
}