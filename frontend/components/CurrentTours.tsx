//Connect axios as promise-based HTTP client to make requests to the local HTTP endpoints
import Waypoint from "../api/Waypoint";
import {useState} from "react";
import Tour from "../model/Tour";
import axios from "axios";
import { get } from "../api/httpRequests";

//Perform GET request to the endpoint /tour-app/tours/{userId}
const getAllRecords = async () => await axios.get<Tour[]>("http://localhost:8080/tour-app/tours/alice/").then((response) => {
    console.log("Status code " + response.status);
    console.log("Response " + response.data);
    console.log("Records successfuly fetched");
    return response.data;
});


//Perform POST request to the endpoint /tour-app/tours/{userId}
const postUser = async (tour: Tour) => await axios.post<Tour>("http://localhost:8080/tour-app/tours/alice/", tour).then((response) => {
    console.log("Status code " + response.status);
    console.log("Response " + response.data);
    console.log("User successfuly added");
});
//Perform GET request to the endpoint /tour-app/tours/{userId}/{tourId}
const currentTour = async (tourId: string) => await axios.get<Tour>('http://localhost:8080/tour-app/tours/alice/' + tourId).then((response) => {
    console.log("Status code " + response.status);
    console.log("Response " + response.data);
    console.log("Tour successfuly fetched");
    return response.data;
});
//Perform PUT request to the endpoint /tour-app/tours/{userId}/{tourId}
const updateTour = async (tourId: string, tour: Tour) => await axios.put<Tour>('http://localhost:8080/tour-app/tours/alice/' + tourId, tour).then((response) => {
    console.log("Status code " + response.status);
    console.log("Response " + response.data);
    console.log("Tour successfuly updated");
});

const CurrentTours = () => {
    const tours = getAllRecords();
    console.log(tours);
     return (
         <div>
         <h1>Current Tours</h1>
         </div>
     );
 }
export default CurrentTours;