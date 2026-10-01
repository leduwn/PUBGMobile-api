# PUBG Mobile Technical Research — `triyatna/php-valid-game` & GoPay Games

## 1. Executive Summary

This experiment evaluated `triyatna/php-valid-game` and its underlying GoPay Games upstream provider (`POST https://gopay.co.id/games/v1/order/user-account`) using a live PHP 8.5 runtime with `debug=true` across both international and regional (VN) PUBG Mobile accounts.

Key finding:
- GoPay upstream returns **strictly two data fields**: `username` (player nickname) and `countryOrigin` (string, empty for global accounts).
- Zero undocumented, hidden, profile, collection, openid, or inventory fields exist in the upstream GoPay response.
- Regional limitation: GoPay resolves international PUBG Mobile UIDs (e.g. `5123456789`, `5115612480`, `51569444543`), but completely fails on PUBG Mobile VN accounts (e.g. `5421835339` returns `404 Invalid user account`).

---

## 2. Package Architecture & Configuration

- **Repository:** `https://github.com/triyatna/php-valid-game`
- **Supported Games Configuration:** `src/Registry/GameRegistry.php`
- **PUBG Registration:**
  ```php
  'pubg' => [
      'label'        => 'PUBG Mobile',
      'requiresZone' => false,
      'gopayCode'    => 'PUBG_ID',
      'codashop'     => null,
      'nicknameFrom' => [],
  ],
  ```
- **Provider Delegation:**
  - `CodashopProvider` is **DISABLED / NULL** for PUBG Mobile.
  - `GopayGamesProvider` is the **EXCLUSIVE** provider for PUBG Mobile.
  - Zone ID is explicitly set to `requiresZone => false`.

---

## 3. Network & Transport Inspection

- **Endpoint:** `POST https://gopay.co.id/games/v1/order/user-account`
- **Authentication:** Zero auth credentials required. No API keys, no bearer tokens, no cookies, no CSRF tokens, no HMAC signatures.
- **Request Payload:**
  ```json
  {
    "code": "PUBG_ID",
    "data": {
      "userId": "51569444543",
      "zoneId": ""
    }
  }
  ```
- **Upstream Gateway:** The upstream server is managed by Vocagame (`x-powered-by: Vocagame`, `server: ESA`).
- **Rate Limiting:** GoPay enforces standard rate limiting headers:
  - `x-ratelimit-limit`: `30`
  - `x-retry-remaining`: Decrements per request (`29`, `28`...)
  - `retry-after`: Second window remaining (e.g. `10`)

---

## 4. Live Experiment Results (with `debug=true`)

### Test Case A: Known Valid International UID 1 (`5123456789`)
- **HTTP Status:** `201 Created`
- **ValidationResult Public Output:**
  ```json
  {
    "status": true,
    "message": "User ID is valid.",
    "data": {
      "game": "PUBG Mobile",
      "nickname": "Eliah2",
      "country": ""
    }
  }
  ```
- **ValidationResult Debug Output (`$result->debug()`):**
  ```json
  {
    "httpStatus": 201,
    "timestamp": "2026-10-01T01:50:59+00:00",
    "meta": {
      "data": {
        "message": "Success",
        "data": {
          "countryOrigin": "",
          "username": "Eliah2"
        }
      }
    }
  }
  ```

### Test Case B: Known Valid International UID 2 (`5115612480`)
- **HTTP Status:** `201 Created`
- **Extracted Nickname:** `Sonic905`
- **Upstream Raw Body:**
  ```json
  {
    "message": "Success",
    "data": {
      "countryOrigin": "",
      "username": "Sonic905"
    }
  }
  ```

### Test Case C: Known Valid International UID 3 (`51569444543`)
- **HTTP Status:** `201 Created`
- **Extracted Nickname:** `你层次太低`
- **Upstream Raw Body:**
  ```json
  {
    "message": "Success",
    "data": {
      "countryOrigin": "",
      "username": "你层次太低"
    }
  }
  ```

### Test Case D: Confirmed Valid PUBG Mobile VN UID (`5421835339`)
- **HTTP Status:** `404 Not Found`
- **ValidationResult Public Output:**
  ```json
  {
    "status": false,
    "message": "Invalid user account",
    "data": {
      "game": "PUBG Mobile",
      "nickname": "",
      "country": ""
    }
  }
  ```
- **ValidationResult Debug Output (`$result->debug()`):**
  ```json
  {
    "httpStatus": 404,
    "timestamp": "2026-10-01T01:51:01+00:00",
    "meta": {
      "data": {
        "statusCode": 404,
        "message": "Invalid user account",
        "error": "Not Found"
      }
    }
  }
  ```

---

## 5. Exhaustive Field Enumeration

All keys appearing anywhere in the upstream JSON response on success:

| Level | Key Name | Type | Observed Value | Description |
|---|---|---|---|---|
| Root | `message` | String | `"Success"` | Status confirmation |
| Root | `data` | Object | `{...}` | Payload container |
| Root.data | `username` | String | `"你层次太低"` | In-game player nickname |
| Root.data | `countryOrigin` | String | `""` | Country of origin (empty string) |

### Missing Player Information:
- **`openid`**: ABSENT. (Unlike VNG `getCharac`, GoPay does not expose internal Tencent `openid`).
- **`player_id` / `userId`**: ABSENT in response body. (Only present in request payload).
- **`zone_id`**: ABSENT.
- **`is_ban`**: ABSENT.
- **Level / Rank / Tier**: ABSENT.
- **Avatar / Frame**: ABSENT.
- **Inventory / Skins / Outfits**: ABSENT.
- **Collection**: ABSENT.

---

## 6. Analysis: Library Implementation vs Raw Upstream

1. **Nickname Extraction Logic:**
   In `GopayGamesProvider::extractNickname()`, the package searches multiple paths:
   `data.username`, `data.userAccount`, `data.nickname`, `data.name`, `username`, `userAccount`.
   For PUBG Mobile, GoPay upstream strictly returns `data.username`.
2. **Country Field:**
   `ValidationResult::toArray()` outputs `'country' => ''`. This is not populated from `countryOrigin` because the library author hardcoded an empty string with a comment: `// TODO: Implement country detection from zoneId`. Even if mapped to `data.countryOrigin`, upstream returned an empty string for all tested accounts.
3. **Information Drop / Filtering:**
   The library does not discard any meaningful player metadata, because the upstream GoPay response itself only contains `username` and empty `countryOrigin`.

---

## 7. Conclusions & Research State

1. **GoPay / `php-valid-game` is an Account Validation Endpoint Only:**
   Like Midasbuy, GoPay Games is an external top-up web gateway. Its upstream service only validates that an account exists so that payment orders can be processed. It has no integration with player profile data, inventory databases, or collection state.
2. **Regional Coverage is Incomplete:**
   GoPay only resolves certain Global/International accounts. It rejects valid accounts registered under localized publishers (such as PUBG Mobile VN under VNG).
3. **Collection Investigation Branch Status:**
   `triyatna/php-valid-game` and GoPay Games are a **CONFIRMED DEAD END** for:
   - Player Profile (Level, Rank, Avatar)
   - Public Collection
   - Owned Inventory / Items

---

## 8. Next Experiment

With all web resolvers (VNG web shop, Midasbuy APIs, GoPay Games) confirmed incapable of providing collection data, the project must proceed directly to in-game network traffic analysis:

**Experiment #02 — PUBG Mobile VN Android Emulator Network Baseline**
Capture idle lobby baseline traffic and Settings controls before executing friend search and player inspection.

- **Extracted Nickname:** `Sonic905`
- **Upstream Raw Body:** `{"message":"Success","data":{"countryOrigin":"","username":"Sonic905"}}`

### Test Case C: Known Valid International UID 3 (`51569444543`)
- **HTTP Status:** `201 Created`
- **Extracted Nickname:** `你层次太低`
- **Upstream Raw Body:** `{"message":"Success","data":{"countryOrigin":"","username":"你层次太低"}}`

### Test Case D: Confirmed Valid PUBG Mobile VN UID (`5421835339`)
- **HTTP Status:** `404 Not Found`
- **ValidationResult Public Output:** `status: false`, `message: "Invalid user account"`
- **ValidationResult Debug Output:** `httpStatus: 404`, `meta.data: {"statusCode":404,"message":"Invalid user account","error":"Not Found"}`
