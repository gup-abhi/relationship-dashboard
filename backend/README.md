# Backend

This directory contains the backend code for the Relationship Dashboard application. It is a Node.js application using Express and Mongoose.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB

### Installation

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Create a `.env` file in the `backend` directory and add the following environment variables:
    ```
    MONGO_URI=<your_mongodb_connection_string>
    PORT=5000
    ```

### Running the application

-   To run the application in development mode (with hot-reloading):
    ```bash
    npm run dev
    ```

-   To run the application in production mode:
    ```bash
    npm start
    ```

## API Endpoints

The backend exposes a RESTful API. For detailed information about the API endpoints, please see the [API Documentation](../docs/API.md).

## Scripts

-   `npm start`: Starts the production server.
-   `npm run dev`: Starts the development server with nodemon.
-   `npm test`: Runs the test suite (not yet implemented).
