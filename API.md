# Brand Builder Public Use API Documentation

The Brand Builder Public Use API allows you to programmatically access the brand extraction and generation features.

## Authentication

All API requests must include an `x-api-key` header with your valid API key.

```http
x-api-key: YOUR_API_KEY
```

> [!NOTE]
> The API key is configured via the `BRAND_BUILDER_API_KEY` environment variable on the server.

## Versioning

The current API version is `v1`. All endpoints are prefixed with `/api/v1`.

## Endpoints

### 1. Health Check
Verify API availability and authentication status.

**URL**: `/api/v1/health`  
**Method**: `GET`

**Example Request**:
```bash
curl -H "x-api-key: YOUR_API_KEY" http://localhost:3000/api/v1/health
```

---

### 2. Generate Brand Kit
Traces a website URL and generates a comprehensive brand kit.

**URL**: `/api/v1/generate`  
**Method**: `POST`  
**Body**:
```json
{
  "url": "https://example.com"
}
```

**Example Request**:
```bash
curl -X POST -H "Content-Type: application/json" -H "x-api-key: YOUR_API_KEY" -d '{"url":"https://example.com"}' http://localhost:3000/api/v1/generate
```

---

### 3. Export Brand Kit
Generates a downloadable ZIP file containing design tokens and assets for a given brand kit object.

**URL**: `/api/v1/export`  
**Method**: `POST`  
**Body**: A valid `BrandKit` object (as returned by the `/generate` endpoint).

**Example Request**:
```bash
curl -X POST -H "Content-Type: application/json" -H "x-api-key: YOUR_API_KEY" -d @brand-kit.json http://localhost:3000/api/v1/export --output brand-kit.zip
```

## Error Handling

The API returns standard HTTP status codes:
- `200`: Success
- `400`: Bad Request (e.g., missing parameters)
- `401`: Unauthorized (invalid or missing API key)
- `500`: Internal Server Error

Error responses follow this format:
```json
{
  "error": "Error message description"
}
```
