# API Documentation

This document provides details about the backend API endpoints.

## Base URL
`/api`

## Endpoints

### Health Check
`GET /health`
- **Description**: Checks the health of the API.
- **Response**: 
```json
{
  "status": "UP"
}
```

### Demographics

#### Sample Demographics Validation
`POST /demographics/test-demographics`
- **Description**: Sample endpoint to test input validation for demographics data.
- **Request Body**: 
```json
{
  "title": "string",
  "subreddit": "string"
}
```
- **Response**: 
```json
{
  "message": "Demographics data received and validated successfully!",
  "data": { ... }
}
```

...
