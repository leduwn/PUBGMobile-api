# PUBG Mobile UID API Test Report

## 1. Result

Status:

WORKING

## 2. Endpoint

Method: POST  
URL: https://gopay.co.id/games/v1/order/user-account

## 3. Required request

Headers:
```http
Content-Type: application/json
Accept: application/json
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36
```

Payload (Standard):
```json
{
  "code": "PUBG_ID",
  "data": {
    "userId": "5123456789",
    "zoneId": ""
  }
}
```

Payload (Minimal - without zoneId):
```json
{
  "code": "PUBG_ID",
  "data": {
    "userId": "5123456789"
  }
}
```

*Note: `zoneId` is completely optional for PUBG Mobile.*

## 4. Authentication

Requires authentication: NO

Cookie required: NO

Token required: NO

Signature required: NO

*All requests executed cleanly without session cookies, Bearer tokens, or HMAC signatures.*

## 5. Valid UID result

HTTP: 201 Created

Raw sanitized response:
```json
{
  "message": "Success",
  "data": {
    "countryOrigin": "",
    "username": "Eliah2"
  }
}
```

Sample with UID_2 (5115612480):
```json
{
  "message": "Success",
  "data": {
    "countryOrigin": "",
    "username": "Sonic905"
  }
}
```

Nickname field:
`data.username`

Other player information returned:
`data.countryOrigin` (string, currently empty string `""` for tested accounts)

## 6. Invalid UID result

HTTP: 404 Not Found

Raw sanitized response:
```json
{
  "statusCode": 404,
  "message": "Invalid user account",
  "error": "Not Found"
}
```

How invalid player is identified:
- HTTP Status code is `404`.
- JSON body contains `message: "Invalid user account"` and `error: "Not Found"`.

## 7. Invalid format result

- Non-numeric string (`userId: "abc"`):
  - HTTP Status: 404 Not Found
  - Body: `{"statusCode":404,"message":"Invalid user account","error":"Not Found"}`
- Single digit (`userId: "1"`):
  - HTTP Status: 404 Not Found
  - Body: `{"statusCode":404,"message":"Invalid user account","error":"Not Found"}`
- Overflow numeric string (`userId: "999999999999999999999999"`):
  - HTTP Status: 404 Not Found
  - Body: `{"statusCode":404,"message":"Invalid user account","error":"Not Found"}`
- Missing `userId` property (`data: {}`):
  - HTTP Status: 404 Not Found
  - Body: `{"statusCode":404,"message":"Request failed with status code 400","error":"Not Found"}`

*Observation: Input validation is largely delegated to the upstream provider (Vocagame). Non-existing and ill-formatted account IDs trigger the same "Invalid user account" 404 response, while schema validation errors on payload return "Request failed with status code 400" wrapped in 404.*

## 8. Rate limit / stability

Rate limit headers observed:
- `x-ratelimit-limit`: `30`
- `x-retry-remaining`: Decrements per request (`29`, `28`, `27`...)
- `x-retry-reset`: Timestamp of window reset (e.g. `Wed, 30 Sep 2026 10:06:25 GMT`)
- `retry-after`: Second window remaining (e.g. `10`, `7`)

Stability observations across 3 consecutive requests (1.5s interval):
- Repetition 1: 178ms latency, HTTP 201, `{"message":"Success","data":{"countryOrigin":"","username":"Eliah2"}}`
- Repetition 2: 298ms latency, HTTP 201, `{"message":"Success","data":{"countryOrigin":"","username":"Eliah2"}}`
- Repetition 3: 168ms latency, HTTP 201, `{"message":"Success","data":{"countryOrigin":"","username":"Eliah2"}}`
- Cache status: `cf-cache-status: DYNAMIC`, `x-site-cache-status: DYNAMIC`
- Consistency: 100% deterministic, returns exact same nickname without drift.

## 9. Findings from source code

Direct evidence from `triyatna/php-valid-game`:
- Endpoint: `https://gopay.co.id/games/v1/order/user-account`
- Provider class: `Triyatna\PhpValidGame\Providers\GopayGamesProvider`
- Registry config: `gopayCode => 'PUBG_ID'`, `requiresZone => false`
- Transport: Standard Guzzle client sending JSON POST with default headers (`Accept: application/json`, Chrome User-Agent).
- Authentication: Zero auth credentials, zero cookies, zero signatures in the repository.

## 10. Differences from the open-source implementation

1. Response status code:
   - Source code expects standard 200 range (`$httpStatus >= 200 && $httpStatus < 300`). Actual server response code on success is `201 Created` (not 200 OK).
2. Data structure:
   - Source implementation checks fallback paths: `data.username`, `data.userAccount`, `data.nickname`, `data.name`, `username`, `userAccount`.
   - Real server response exclusively uses `data.username`.
3. Upstream Provider Header:
   - Actual response contains `x-powered-by: Vocagame`, showing GoPay Games relies on Vocagame API infrastructure.
4. Error handling:
   - When account is not found, server returns HTTP `404` with `{"statusCode":404,"message":"Invalid user account","error":"Not Found"}` rather than a 200 with `success: false`.

## 11. Conclusion

Can this API reliably perform:

PUBG UID → existence check:
YES

PUBG UID → nickname:
YES

Needs PUBG login:
NO

Suitable as Player Resolver for our future project:
YES

Reason:
The GoPay Games endpoint is fully active, public, requires no credentials or session tokens, delivers sub-300ms latency, accurately distinguishes valid accounts (HTTP 201 with `data.username`) from non-existent accounts (HTTP 404 `Invalid user account`), and has a reasonable rate limit window (30 req / window).

## 12. Next recommended experiment

Test resilience under burst/concurrent load and evaluate alternative top-up aggregator endpoints (e.g. direct Vocagame API or Codashop/UniPin fallback) to establish redundancy if GoPay rate limits or modifies their gateway in production.
