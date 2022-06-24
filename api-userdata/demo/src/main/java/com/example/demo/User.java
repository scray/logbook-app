package com.example.demo;

public class User {
    private int id;
    private String name;
    private String surname;
    private boolean hasVisited;

    public User (int id, String name, String surname){
        this.id = id;
        this.name = name;
        this.surname = surname;
        hasVisited = false;
    }

    public int getId(){
        return id;
    }

    public void setId(int i){
        id = i;
    }

    public String getName(){
        return name;
    }

    public void setName(String n){
        name = n;
    }

    public String getSurname(){
        return surname;
    }

    public void setSurname(String s){
        surname = s;
    }

    public boolean getHasVisited(){
        return hasVisited;
    }

    public void setHasVisited(boolean v){
        hasVisited = v;
    }
}
