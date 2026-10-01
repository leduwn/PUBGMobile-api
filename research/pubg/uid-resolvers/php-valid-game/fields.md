# GoPay Games & `triyatna/php-valid-game` Field Matrix

## Comparison of Fields

| Player Data Field | Package Public API (`toArray()`) | Package Debug Mode (`$result->debug()`) | Raw GoPay Upstream Response | Reference VNG (`getCharac`) | Reference Midasbuy API |
|---|---|---|---|---|---|
| **Account Validation** | `status` (bool `true`) | `httpStatus` (`201`) | `message: "Success"` | `ret: 0` | `data.status: "success"` |
| **Player UID** | NOT RETURNED | In query params only | NOT RETURNED in body | Echoed `role_id` | Echoed `player_id` |
| **Player Nickname** | `data.nickname` (string) | `meta.data.data.username` | `data.username` | `info.charac_name` | `nickname` / `player_name` |
| **Country / Region** | `data.country` (always `""`) | `meta.data.data.countryOrigin` | `data.countryOrigin` (`""`) | `active_country`, `register_country` | NOT RETURNED |
| **Zone / Partition** | NOT RETURNED | NOT RETURNED | NOT RETURNED | `info.zoneid` (`"1"`) | `zone_id` (`"1"`) |
| **Ban Status** | NOT RETURNED | NOT RETURNED | NOT RETURNED | `info.is_ban` (`false`) | `is_ban` (`false`) |
| **Tencent OpenID** | NOT RETURNED | NOT RETURNED | NOT RETURNED | `info.openid` (numeric string) | NOT RETURNED |
| **Player Level** | NOT RETURNED | NOT RETURNED | NOT RETURNED | NOT RETURNED | NOT RETURNED |
| **Rank / Tier** | NOT RETURNED | NOT RETURNED | NOT RETURNED | NOT RETURNED | NOT RETURNED |
| **Avatar / Frame** | NOT RETURNED | NOT RETURNED | NOT RETURNED | NOT RETURNED | NOT RETURNED |
| **Collection Status** | NOT RETURNED | NOT RETURNED | NOT RETURNED | NOT RETURNED | NOT RETURNED |
| **Collection Items** | NOT RETURNED | NOT RETURNED | NOT RETURNED | NOT RETURNED | NOT RETURNED |
| **Inventory / Skins** | NOT RETURNED | NOT RETURNED | NOT RETURNED | NOT RETURNED | NOT RETURNED |

---

## Detailed Schema Breakdown

### 1. Package Public Result (`$result->toArray()`)
```json
{
  "status": true,
  "message": "User ID is valid.",
  "data": {
    "game": "PUBG Mobile",
    "nickname": "你层次太低",
    "country": ""
  }
}
```
*Note on `country`: The field is hardcoded to an empty string `""` in `src/DTO/ValidationResult.php` with a comment `// TODO: Implement country detection from zoneId`.*

### 2. Package Debug Result (`$result->debug()`)
```json
{
  "httpStatus": 201,
  "timestamp": "2026-10-01T01:51:00+00:00",
  "meta": {
    "data": {
      "message": "Success",
      "data": {
        "countryOrigin": "",
        "username": "你层次太低"
      }
    }
  }
}
```

### 3. Upstream HTTP Response (`POST https://gopay.co.id/games/v1/order/user-account`)
```json
{
  "message": "Success",
  "data": {
    "countryOrigin": "",
    "username": "你层次太低"
  }
}
```

### 4. Upstream HTTP Headers
```http
HTTP/2 201
server: ESA
content-type: application/json; charset=utf-8
x-powered-by: Vocagame
x-ratelimit-limit: 30
x-retry-remaining: 29
x-retry-reset: Thu, 01 Oct 2026 01:51:37 GMT
```
