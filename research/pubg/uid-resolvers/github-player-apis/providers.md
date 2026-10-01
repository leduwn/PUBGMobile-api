# GitHub PUBG Mobile API Providers Inventory

## Overview

Analysis of third-party PUBG Mobile player lookup APIs discovered on GitHub:
1. **NightsSoftware/MidasbuyAPI** (`https://github.com/NightsSoftware/MidasbuyAPI`)
2. **exfador/midasbuy-api** (`https://github.com/exfador/midasbuy-api`)

Both services provide commercial/paid REST API gateways wrapping Tencent's Midasbuy top-up and code redemption system. Neither repository publishes backend server implementation code. Both repos host only client examples, documentation, and purchase instructions via Telegram.

---

## 1. Provider A: NightsSoftware / MidasbuyAPI

- **Repository:** `https://github.com/NightsSoftware/MidasbuyAPI`
- **Maintainer:** `NightStrang6r`
- **Hosted Gateway:** `https://midasbuy.night-apis.com` (legacy: `https://midasbuyapi.nightstranger.space`)
- **OpenAPI / Swagger Spec:** `https://midasbuy.night-apis.com/apispec_1.json` (Swagger 2.0 / Flasgger 0.9.7.1)
- **Authentication:** Header `X-Api-Key: <api_key>` (commercial key sold via Telegram `@NightStrang6r` / `@MidasbuyAPI_Manager`)
- **Server Implementation:** Closed source (Python/Flask backend indicated by Flasgger headers)

### Endpoints Inventory

| Method | Endpoint | Purpose | Category | Auth Required |
|---|---|---|---|---|
| `POST` | `/api/v1/pubg/getPlayer` | Look up player name by Player ID | Player lookup | `X-Api-Key` |
| `POST` | `/api/v1/pubg/activate` | Redeem UC code onto Player ID | Redeem | `X-Api-Key` |
| `POST` | `/api/v1/pubg/bulkActivate` | Redeem up to 5 codes onto one Player ID | Redeem | `X-Api-Key` |
| `POST` | `/api/v1/pubg/activateAsTask` | Enqueue async code activation task | Redeem | `X-Api-Key` |
| `POST` | `/api/v1/pubg/checkCode` | Validate UC code status and UC amount | Catalog / Redeem | `X-Api-Key` |
| `POST` | `/api/v1/pubg/taskStatus` | Poll status/result of async task | Redeem | `X-Api-Key` |
| `GET` | `/api/v1/pubg/task/{task_id}` | Poll async task by URL path | Redeem | `X-Api-Key` |

### Player Lookup Details (`POST /api/v1/pubg/getPlayer`)

- **Request Body:**
  ```json
  {
    "player_id": 555555555
  }
  ```
- **Documented 200 Response:**
  ```json
  {
    "success": true,
    "message": "Ok",
    "data": {
      "player_id": 555555555,
      "player_name": "PlayerName",
      "status": "success",
      "message": "Player found"
    }
  }
  ```

---

## 2. Provider B: exfador / midasbuy-api

- **Repository:** `https://github.com/exfador/midasbuy-api`
- **Maintainer:** `exfador`
- **Hosted Gateway:** Self-hosted or hosted server referenced as `http://<your-server>:8000`
- **Documentation:** `readme.md` in repository
- **Authentication:** Header `x-key: <api-key>` (commercial key sold via Telegram `@exfador`, channel `@midasbuyapi`)
- **Server Implementation:** Closed source (Node.js ≥18 / Python ≥3.10 claimed in badges)

### Endpoints Inventory

| Method | Endpoint | Purpose | Category | Auth Required |
|---|---|---|---|---|
| `POST` | `/info` | Look up player info by Player ID | Player lookup | `x-key` |
| `POST` | `/redeem` | Redeem Midasbuy UC code on player account | Redeem | `x-key` |
| `POST` | `/stats` | Usage counters and quota for API key | Account / Stats | `x-key` |
| `POST` | `/history` | Recent redemption attempts (paginated) | History | `x-key` |

### Player Lookup Details (`POST /info`)

- **Request Body:**
  ```json
  {
    "player_id": "51569444543"
  }
  ```
- **Documented 200 Response:**
  ```json
  {
    "success": true,
    "player_id": "51569444543",
    "nickname": "GNCOD",
    "zone_id": "1",
    "is_ban": false
  }
  ```
- **Documented Failure:**
  ```json
  {
    "success": false,
    "message": "Player with this ID was not found. Check the Player ID and try again"
  }
  ```
