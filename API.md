# API.md: EcoFlow AI

## Authentication & Authorization

EcoFlow AI utilizes Firebase Authentication for user management. Clients are expected to obtain a Firebase ID Token after successful user authentication (e.g., via email/password, Google Sign-In, etc.). This ID Token must be sent with every authenticated API request in the `Authorization` header.

**Method:** Firebase ID Token verification.
**Header Format:** `Authorization: Bearer <Firebase_ID_Token>`
**Authorization Levels:**
*   **Public:** No authentication required.
*   **User:** Authenticated user (Household User, UMKM Operator). Token must be valid.
*   **Admin:** Authenticated user with `Platform Admin` or `Community Admin` role. Token must be valid and associated role verified on the backend.

## Standard Response & Pagination Formats

All API responses will adhere to a consistent JSON structure to ensure predictability and ease of integration.

### Success Response

```json
{
  "status": "success",
  "message": "Optional success message.",
  "data": {
    // Primary response data
  }
}
```

### Error Response

```json
{
  "status": "error",
  "code": "ERROR_CODE_ENUM",
  "message": "A human-readable error description.",
  "details": {
    // Optional, more specific error details (e.g., validation errors)
  }
}
```

### Pagination Format

For endpoints returning lists of resources, pagination details will be included in the `pagination` object.

```json
{
  "status": "success",
  "data": [
    // Array of resource objects
  ],
  "pagination": {
    "total_items": 100,
    "total_pages": 10,
    "current_page": 1,
    "page_size": 10,
    "next_page": 2,
    "prev_page": null
  }
}
```

## API Endpoints

### Fermentation Batch Management

#### 1. Create New Fermentation Batch

*   **Method:** `POST`
*   **Path:** `/api/v1/batches`
*   **Description:** Initiates a new eco-enzyme fermentation batch, calculating initial ingredient ratios based on organic waste input.
*   **Auth Level:** User
*   **Request Body (JSON):**
    ```json
    {
      "waste_weight_kg": 5.2,
      "batch_name": "Kitchen Scraps Batch 1",
      "start_date": "2024-07-20"
    }
    ```
*   **Response Body (JSON):**
    ```json
    {
      "status": "success",
      "data": {
        "batch_id": "ee_batch_abc123",
        "batch_name": "Kitchen Scraps Batch 1",
        "start_date": "2024-07-20",
        "waste_weight_kg": 5.2,
        "calculated_water_liters": 15.6,
        "calculated_sugar_kg": 5.2,
        "status": "active",
        "expected_harvest_date": "2024-10-18"
      }
    }
    ```
*   **Status Codes:**
    *   `201 Created`: Successfully created batch.
    *   `400 Bad Request`: Invalid input data.
    *   `401 Unauthorized`: Missing or invalid authentication token.

#### 2. Log Fermentation Progress

*   **Method:** `POST`
*   **Path:** `/api/v1/batches/{batch_id}/logs`
*   **Description:** Records daily/weekly observations for an active fermentation batch and provides AI-driven status assessment.
*   **Auth Level:** User
*   **Request Body (JSON):**
    ```json
    {
      "log_date": "2024-08-05",
      "aroma": "sweet_sour",
      "color": "#A0522D",
      "gas_presence": true,
      "temperature_celsius": 28.5,
      "notes": "Slightly cloudy, active bubbling."
    }
    ```
*   **Response Body (JSON):**
    ```json
    {
      "status": "success",
      "data": {
        "log_id": "ee_log_xyz789",
        "batch_id": "ee_batch_abc123",
        "log_date": "2024-08-05",
        "aroma": "sweet_sour",
        "color": "#A0522D",
        "gas_presence": true,
        "temperature_celsius": 28.5,
        "notes": "Slightly cloudy, active bubbling.",
        "ai_status_prediction": "Normal",
        "ai_confidence_score": 0.92,
        "corrective_action_suggestion": "Continue monitoring. No action needed."
      }
    }
    ```
*   **Status Codes:**
    *   `201 Created`: Successfully logged progress.
    *   `400 Bad Request`: Invalid input data.
    *   `401 Unauthorized`: Missing or invalid authentication token.
    *   `404 Not Found`: Batch ID does not exist.

### Product Optimization & Business Analysis

#### 3. Get AI Product Recommendation

*   **Method:** `POST`
*   **Path:** `/api/v1/batches/{batch_id}/recommendation`
*   **Description:** Provides AI-driven product recommendations based on the harvested eco-enzyme's characteristics and user's intent.
*   **Auth Level:** User
*   **Request Body (JSON):**
    ```json
    {
      "harvest_date": "2024-10-20",
      "harvest_volume_liters": 12.5,
      "final_color": "#8B4513",
      "aroma_intensity": 7,
      "user_intent": "household_use"
    }
    ```
*   **Response Body (JSON):**
    ```json
    {
      "status": "success",
      "data": {
        "batch_id": "ee_batch_abc123",
        "recommendations": [
          {
            "product_name": "Household Cleaner",
            "compatibility_score": 95,
            "description": "Excellent for general cleaning, floor mopping, and kitchen surfaces.",
            "processing_instructions_summary": "Dilute 1:10 for general use. Store in a cool, dark place.",
            "roadmap_id": "roadmap_cleaner_v1"
          },
          {
            "product_name": "Liquid Fertilizer",
            "compatibility_score": 88,
            "description": "Nutrient-rich liquid for plant growth and soil health.",
            "processing_instructions_summary": "Dilute 1:500 for foliar spray. Apply weekly.",
            "roadmap_id": "roadmap_fertilizer_v1"
          }
        ]
      }
    }
    ```
*   **Status Codes:**
    *   `200 OK`: Successfully retrieved recommendations.
    *   `400 Bad Request`: Invalid input data.
    *   `401 Unauthorized`: Missing or invalid authentication token.
    *   `404 Not Found`: Batch ID does not exist.

#### 4. Perform Business Analysis

*   **Method:** `POST`
*   **Path:** `/api/v1/batches/{batch_id}/business-analysis`
*   **Description:** Calculates financial metrics for commercializing a selected eco-enzyme derivative.
*   **Auth Level:** User (UMKM Operator role recommended for full feature set)
*   **Request Body (JSON):**
    ```json
    {
      "product_name": "Household Cleaner",
      "production_volume_liters": 100,
      "target_market": "local_retail",
      "packaging_type": "500ml_bottle",
      "distribution_channel": "direct_sales",
      "additional_costs": [
        {"item": "bottle_labels", "cost_per_unit": 0.05},
        {"item": "transportation", "cost_per_unit": 0.10}
      ]
    }
    ```
*   **Response Body (JSON):**
    ```json
    {
      "status": "success",
      "data": {
        "batch_id": "ee_batch_abc123",
        "product_name": "Household Cleaner",
        "analysis_date": "2024-10-25",
        "cost_of_goods_sold_per_liter": 0.75,
        "suggested_retail_price_per_liter": 2.50,
        "gross_margin_percentage": 70.0,
        "break_even_units_liters": 40,
        "profit_projection_12_months": {
          "total_revenue": 2500.00,
          "total_costs": 750.00,
          "net_profit": 1750.00
        },
        "feasibility_rating": "Viable",
        "report_download_url": "https://api.ecoflow.ai/reports/ee_batch_abc123_biz_analysis.pdf"
      }
    }
    ```
*   **Status Codes:**
    *   `200 OK`: Successfully performed business analysis.
    *   `400 Bad Request`: Invalid input data.
    *   `401 Unauthorized`: Missing or invalid authentication token.
    *   `403 Forbidden`: User does not have sufficient permissions (e.g., not UMKM Operator).
    *   `404 Not Found`: Batch ID or product name does not exist.