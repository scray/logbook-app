# logbook-app

## Summary
- [Contributors](#contributors)
- [General Info](#general-info)
- [Running the App](#running-the-app)

## Contributors
Made as a part of the course _Application Development_ with Prof. Dr. Michael Cebulla at the _[Hochschule Anhalt University of Applied Sciences](https://www.hs-anhalt.de/startseite.html)_ in cooperation with the company [_Seeburger AG_](https://www.seeburger.com/).

Developers:
- [Felix Beinßen](https://github.com/Chafficui) (Team Lead & Frontend)
- [Tim Berend](https://github.com/timbx1) (Chaincode)
- [Philipp Irmscher](https://github.com/philirmscher) (Frontend & Styling)
- [Jason Labrenz](https://github.com/jazonthemazon) (Backend)
- [Tristan Roesch](https://github.com/TristanRoesch) (Backend & Documentation)
- [Dominik Stieberitz](https://github.com/dvGrab) (Chaincode)

Under the supervision of:
- [Stefan Obermeier](https://github.com/obermeier) (Seeburger AG)
- [Prof. Dr. Michael Cebulla](https://www.hs-anhalt.de/hochschule-anhalt/service/personenverzeichnis/prof-dr-michael-cebulla.html) (Hochschule Anhalt)

## General Info
The logbook-app is an app that allows users to view and capture their tours. The app is divided into three parts: the frontend, the backend (often referenced as REST-API) and the chaincode. The frontend is an Expo App (React Native) that allows users to view and capture their tours. The backend is a REST API that manages the communication with the chaincode.
The chaincode is a Hyperledger Fabric chaincode that manages the data of the tours. All three parts must be running in order to use the app. Example-Instances of the backend and the chaincode are hosted and available for use. So for testing purpose it is enough to just run the frontend.

## Running the App

### Logbook App (Frontend)
See the [frontend README](frontend/README.md) for more information.

### Logbook App (Backend)
See the [backend README](rest-api/README.md) for more information.

### Logbook App (Chaincode)
See the [chaincode README](chaincode/README.md) for more information.