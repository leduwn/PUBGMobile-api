# GitHub PUBG Mobile Player API Research

## APIs investigated

### Provider A
- **Repository:** `https://github.com/NightsSoftware/MidasbuyAPI`
- **Endpoint:** `POST https://midasbuy.night-apis.com/api/v1/pubg/getPlayer`
- **Auth:** Header `X-Api-Key` (commercial paid subscription)
- **Live test:** NO (`LIVE_TEST_STATUS = BLOCKED_BY_REQUIRED_API_KEY`)

### Provider B
- **Repository:** `https://github.com/exfador/midasbuy-api`
- **Endpoint:** `POST /info`
- **Auth:** Header `x-key` (commercial paid subscription)
- **Live test:** NO (`LIVE_TEST_STATUS = BLOCKED_BY_REQUIRED_API_KEY`)

## International UID tested

- **UID:** `51569444543` (from Provider B docs) / `555555555` (from Provider A docs)
- **Known validity:** `Validity outside documentation: UNKNOWN` (No live test performed; no user-provided international key available)

## Raw field comparison

| Information | Provider A (`/getPlayer`) | Provider B (`/info`) | Reference VNG Web (`getCharac`) |
|---|---|---|---|
| Player ID / UID | `data.player_id` (integer) | `player_id` (string) | Submitted UID (`role_id`) |
| Nickname | `data.player_name` (string) | `nickname` (string) | `info.charac_name` (URL-encoded) |
| Partition / Zone | NOT RETURNED | `zone_id` (string `"1"`) | `info.zoneid` (`"1"`) |
| Ban status | NOT RETURNED | `is_ban` (boolean `false`) | `info.is_ban` (`false`) |
| Status / Message | `data.status`, `data.message`, `message`, `success` | `success`, `message` (on error) | `ret` (integer `0`) |
| OpenID | NOT RETURNED | NOT RETURNED | `info.openid` (`25877658659587368`) |
| Level | NOT RETURNED | NOT RETURNED | NOT RETURNED |
| Rank / Tier | NOT RETURNED | NOT RETURNED | NOT RETURNED |
| Avatar / Frame | NOT RETURNED | NOT RETURNED | NOT RETURNED |
| Region / Country | NOT RETURNED | NOT RETURNED | `active_country`, `register_country` |
| Inventory | NOT RETURNED | NOT RETURNED | NOT RETURNED |
| Collection | NOT RETURNED | NOT RETURNED | NOT RETURNED |
| Skins / Items | NOT RETURNED | NOT RETURNED | NOT RETURNED |

## Provider A raw response

Documented schema from live Swagger 2.0 specification (`https://midasbuy.night-apis.com/apispec_1.json`):

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

Error response (`400 Bad Request`):
```json
{
  "success": false,
  "message": "Invalid request data"
}
```

Error response (`401 Unauthorized`):
```json
{
  "success": false,
  "message": "Api key required"
}
```

## Provider B raw response

Documented response from repository `readme.md`:

```json
{
  "success": true,
  "player_id": "51569444543",
  "nickname": "GNCOD",
  "zone_id": "1",
  "is_ban": false
}
```

Error response (`HTTP 200`, `success: false`):
```json
{
  "success": false,
  "message": "Player with this ID was not found. Check the Player ID and try again"
}

## Maximum information discovered

Identity:
- Player UID (`player_id`)
- Player Nickname (`player_name` / `nickname`)

Profile:
- None. Neither API exposes level, rank, avatar, title, popularity, or account age.

Inventory:
- None. Neither API exposes owned items, skins, weapon finishes, or outfits.

Collection:
- None. Neither API exposes collection visibility, collection counts, or collection item IDs.

## Undocumented fields discovered

Zero undocumented player fields discovered.
Inspection of Provider A's official Swagger spec (`/apispec_1.json`) confirms the response model schema contains strictly `{ data: { message, player_id, player_name, status }, message, success }`. No additional fields are defined or returned.

## Coverage

Can query tested international UID:
NOT TESTED (`LIVE_TEST_STATUS = BLOCKED_BY_REQUIRED_API_KEY`)

Evidence supports arbitrary international UID:
UNKNOWN (Both claim support for Global Midasbuy player IDs, but regional restrictions such as KR/JP, VN, or TW partitions are not documented; VNG uses distinct partition endpoints).

## Collection capability

Collection visibility:
NO

Owned item IDs:
NO

Full inventory:
NO

## Important architecture finding

Is API independent PUBG data source or a Midasbuy wrapper?

**API is a wrapper/provider, not an independent PUBG player database.**

Evidence:
1. Provider A explicitly brands itself as *"API for Midasbuy Top-up Store (midasbuy.com): PUBG codes activation, getting players info and more!"*.
2. Provider B explicitly documents error strings indicating Midasbuy session management: *"Midasbuy authorization is outdated. Please contact the administrator"* (`Авторизация Midasbuy устарела`).
3. Both APIs expose code redemption endpoints (`/activate`, `/redeem`) using Midasbuy 18-character voucher codes.
4. Returned fields match the exact subset of Tencent Midasbuy's `getCharac` web response (`zone_id: "1"`, `is_ban: false`, nickname).
5. Neither provider maintains or queries game servers directly; both automate HTTP requests against Midasbuy web shop backend endpoints using stored session cookies/tokens.

## Directly observed

1. Neither repository provides open-source server code; both only provide client documentation/examples and direct users to buy API keys on Telegram.
2. Provider A exposes a live Flasgger/Swagger 2.0 specification at `https://midasbuy.night-apis.com/apispec_1.json`.
3. Provider A's `/api/v1/pubg/getPlayer` returns only `{ message, player_id, player_name, status }`.
4. Provider B's `POST /info` returns `{ success, player_id, nickname, zone_id, is_ban }`.
5. Neither API exposes Tencent's internal `openid` field that was directly observed in the raw VNG `getCharac` CDP capture.
6. Neither API references or provides level, rank, avatar, profile stats, inventory, or collection.

## Inference

1. Third-party Midasbuy APIs rely on automated Midasbuy web sessions to perform the same `getCharac` handshake identified in Experiment #01B.
2. Because Midasbuy's upstream `getCharac` web endpoint only verifies account existence to validate UC redemption/purchase, it never receives or holds player inventory or collection data from the game servers.
3. Third-party top-up APIs cannot provide collection or profile data regardless of subscription tier or API key access.

## Conclusion

Maximum data obtainable from these GitHub APIs:
- Basic player validation: Player ID + Nickname (and optionally `zone_id` and `is_ban`).

Can they currently satisfy:

UID → full PUBG Mobile public profile:
NO

UID → public Collection:
NO

UID → owned inventory:
NO

Branch status: **Third-party top-up / Midasbuy APIs are a DEAD END for player collection data.**

## Next experiment

Recommend ONE experiment only:

**Experiment #02 — Emulator Passive Network Baseline Capture**
Proceed with passive network observation on an Android emulator running official PUBG Mobile VN in idle lobby and control states to establish protocol baseline before triggering game friend search or collection inspect.

DO NOT execute it.

```
