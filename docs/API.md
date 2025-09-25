# API Documentation

This document provides details about the backend API endpoints.

## Base URL
`/api`

## Endpoints

### Health Check
`GET /health`
- **Description**: Checks the health of the API and database connection.
- **Response**: 
```json
{
  "db": "connected"
}
```

---

## Demographics

Base URL: `/api/demographics`

### Get Age Ranges
`GET /age-ranges`
- **Description**: Retrieves the distribution of posts by age range.

### Get Gender Distribution
`GET /gender`
- **Description**: Retrieves the distribution of posts by gender.

### Get Relationship Stages
`GET /relationship-stages`
- **Description**: Retrieves the distribution of posts by relationship stage.

### Get Relationship Length
`GET /relationship-length`
- **Description**: Retrieves the distribution of posts by relationship length.

### Get Cross-Tabulation
`GET /cross-tabulation`
- **Description**: Performs a cross-tabulation between two demographic fields.
- **Query Parameters**:
  - `field1`: The first field for cross-tabulation.
  - `field2`: The second field for cross-tabulation.

---

## Issues

Base URL: `/api/issues`

### Get Primary Issues
`GET /primary`
- **Description**: Retrieves the primary issues.

### Get Secondary Issues
`GET /secondary`
- **Description**: Retrieves the secondary issues.

### Get Red Flags
`GET /red-flags`
- **Description**: Retrieves the red flags present in posts.

### Get Positive Indicators
`GET /positive-indicators`
- **Description**: Retrieves the positive indicators present in posts.

### Get Themes
`GET /themes`
- **Description**: Retrieves the key themes from posts.

### Get Complexity Score Distribution
`GET /complexity`
- **Description**: Retrieves the distribution of complexity scores.

---

## Overview

Base URL: `/api/overview`

### Get KPIs
`GET /kpis`
- **Description**: Retrieves key performance indicators.

### Get Top Issues
`GET /top-issues`
- **Description**: Retrieves the top issues.

### Get Sentiment Distribution
`GET /sentiment`
- **Description**: Retrieves the sentiment distribution.

### Get Recent Trends
`GET /recent-trends`
- **Description**: Retrieves recent trends.

---

## Sentiment

Base URL: `/api/sentiment`

### Get Sentiment Distribution
`GET /distribution`
- **Description**: Retrieves the sentiment distribution.

### Get Sentiment Trends
`GET /trends`
- **Description**: Retrieves sentiment trends over time.

### Get Sentiment by Demographics
`GET /by-demographics`
- **Description**: Retrieves sentiment distribution by demographic groups.

### Get Urgency Level Distribution
`GET /urgency`
- **Description**: Retrieves the distribution of urgency levels.

---

## Trends

Base URL: `/api/trends`

### Get Post Volume Trends
`GET /volume`
- **Description**: Retrieves post volume trends over time.

### Get Trending Topics
`GET /topics`
- **Description**: Retrieves trending topics.