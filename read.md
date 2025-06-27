# How to Use This Project

This project is a React Native application built with Expo.

## Prerequisites

- Node.js (version >= 18)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

## Installation

1. Clone the repository:

   ```bash
   git clone <repository_url>
   cd <project_directory>
   ```

2. Install the dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

## Running the Project

To start the development server, use the following command:

```bash
npm run dev
# or
yarn dev
```

This will start the Expo development server, which you can then access through the Expo Go app on your mobile device or through a web browser.

Alternatively, you can use the following command to start the development server:

```bash
npx expo start
```

This command will open the Expo development server in your web browser. You can then inspect the web view to see the mobile view.

## Building for Web

To build the project for the web, use the following command:

```bash
npm run build:web
# or
yarn build:web
```

This will create a `web-build` directory containing the production-ready web application.

## Linting

To run the linter, use the following command:

```bash
npm run lint
# or
yarn lint
```

This will check the code for any linting errors.
