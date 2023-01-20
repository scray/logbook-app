# logbook-app

## Logbook App (Frontend)
The frontend is an Expo App (React Native) that allows users to view and capture their tours.

### Getting Started
Install the expo-cli globally
```bash
npm install -g expo-cli
```
Navigate to the frontend directory and install the dependencies:
```bash
cd frontend
npm i
```

### Running the App
Run the app in the development mode:
```bash
npm start --web # for web (This version does not support map features)
npm start --android # for android (Runs on connected android devices or emulators)
```
Build the app for production: (IMPORTANT: Insert your own Google Maps API key in the app.js file)
```bash
npx expo run:ios # for ios
npx expo run:android # for android
```
