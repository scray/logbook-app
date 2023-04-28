# logbook-app

## Logbook App (Frontend)
The frontend is an Expo App (React Native) that allows users to view and capture their tours.

### Prerequisites
Make sure to get a google maps api key ([documentation](https://developers.google.com/maps/documentation/javascript/get-api-key)) and add it to the [app.json](app.json) file.

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

### Using a different server address for the REST API
If you want to use a different server address for the REST API, you can change it in the [httpRequests.ts](../frontend/api/httpRequests.ts) file.

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

Start in Windows CMD
```
set ANDROID_SDK_ROOT=%userprofile%\AppData\Local\Android\Sdk\
set PATH=%PATH%;%userprofile%\AppData\Local\Android\Sdk\platform-tools

npx expo start
```