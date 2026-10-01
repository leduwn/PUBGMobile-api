# Experiment #01B — VNGGames PUBG Mobile VN Request Chain

## Objective

Dissect the VNGGames / Midasbuy web shop request chain surrounding the validation of PUBG Mobile VN UID `5421835339`. Specifically determine:
1. Requests occurring immediately before `getCharac`.
2. Requests occurring immediately after `getCharac`.
3. The exact JavaScript caller of `getCharac`.
4. The semantic origin and propagation of `role_id`.
5. Whether additional identifiers exist beyond `role_id` and UID.
6. The source and generation mechanism of `encrypt_msg`, `ctoken`, and `ctoken_ver`.
7. Evidence regarding upstream backend architecture (VNG / Tencent).

## Environment

- **Browser:** Headless Google Chrome 131.0.0.0 (Windows NT 10.0; Win64; x64) via Playwright CDP
- **Page:** `https://pay.zing.vn/pubgm` (embedding `https://pay.pubgm.zing.vn/pubgmvn/vn/buy/pubgmvn`)
- **Date/Time:** 2026-10-01 00:36:00 UTC+7
- **Target UID:** `5421835339`

## Exact actions performed

1. Launched automated Chrome instance with full CDP Network tracing.
2. Navigated to `https://pay.zing.vn/pubgm`.
3. Accepted optional cookie consent banner.
4. Clicked `Vui lòng nhập Player ID của bạn` to trigger the player entry dialog (`iframe[src*="playerid_enter"]`).
5. Entered test UID `5421835339` into the Player ID input field.
6. Captured baseline browser storage states immediately prior to submission.
7. Clicked the confirmation `OK` button (`.Button_btn_primary__1ncdM`).
8. Observed subsequent automatic network requests for 10 seconds without any further user interaction.
9. Captured post-validation browser local/session storage across all frames.
10. Saved all downloaded frontend scripts, network events, and frame storage snapshots for static analysis.

## Directly observed request timeline

Key requests around UID validation (reference point T=0ms: `getCharac`):

| Time | Method | Host | Path | Status | Notes |
|---|---|---|---|---|---|
| T-4873ms | GET | `pay.pubgm.zing.vn` | `/interface/setCookie` | 200 | Pre-validation handshake; encrypted session cookie init |
| T-4508ms | POST | `pay.pubgm.zing.vn` | `/report/midasbuy/v1/webdata` | 200 | Frontend performance metrics report |
| T-4014ms | POST | `pay.harvestsharp.com` | `/cgi-bin/fp-behv` | 200 | Harvestsharp fraud/risk device fingerprinting |
| T-2743ms | POST | `sg.galileotelemetry.tencent.com` | `/collect` | 200 | Tencent Aegis SDK client telemetry |
| T-1213ms | GET | data URI | `data:image/svg+xml...` | 200 | UI clear/action icon rendering |
| **T+0ms** | **POST** | `pay.pubgm.zing.vn` | `/interface/getCharac` | **200** | **Target player validation request** |
| T+1ms | GET | data URI | `data:image/png...` | 200 | UI loading spinner |
| T+237ms | POST | `report1.midasbuy.com` | `/cgi-bin/log_data.fcg` | 200 | Midasbuy player resolution result telemetry (`openid`, `charac_name`) |
| T+258ms | GET | `pay.pubgm.zing.vn` | `/interface/getSaasLoginData` | 200 | Check SaaS login session state |
| T+311ms | GET | `pay.pubgm.zing.vn` | `/interface/getSaasLoginData` | 200 | Duplicate check from secondary frame |
| T+640ms | POST | `pay.pubgm.zing.vn` | `/frontend/api/midasbuy/v1/shelves/query` | 200 | Query UC product shelves using player context |
| T+641ms | POST | `pay.pubgm.zing.vn` | `/frontend/api/midasbuy/v1/shelves/query` | 200 | Query UC product shelves (outer frame) |
| T+1899ms | GET | `report1.midasbuy.com` | `/cgi-bin/log_report_new` | 200 | Shelves query timing & interface success telemetry |
| T+3081ms | POST | `pay.harvestsharp.com` | `/cgi-bin/fp-behv` | 200 | Behavior cadence heartbeat |

*Complete 104-request timeline preserved in `timeline.md`.*


## getCharac request

- **Method:** `POST`
- **URL:** `https://pay.pubgm.zing.vn/interface/getCharac`
- **Status:** `200 OK`
- **Initiator:**
```json
{
  "type": "script",
  "stack": {
    "callFrames": [
      {
        "functionName": "e.writable.L.find.window.XMLHttpRequest.send",
        "url": "https://aegis.cdn-go.cn/aegis-sdk-v2/latest/aegis.min.js",
        "lineNumber": 7,
        "columnNumber": 73428
      },
      {
        "functionName": "",
        "url": "https://cdn.midasbuy.com/oversea_web/static/js/commonSdk.91ea77e9.bundle.js",
        "lineNumber": 4,
        "columnNumber": 310371
      },
      {
        "functionName": "xhr",
        "url": "https://cdn.midasbuy.com/oversea_web/static/js/commonSdk.91ea77e9.bundle.js",
        "lineNumber": 4,
        "columnNumber": 308406
      },
      {
        "functionName": "l",
        "url": "https://cdn.midasbuy.com/oversea_web/static/js/commonSdk.91ea77e9.bundle.js",
        "lineNumber": 4,
        "columnNumber": 320248
      }
    ]
  }
}
```

### Payload

```json
{
  "encrypt_msg": "PRESENT (Base64 ciphertext generated from {appid:'1450019043',zoneid:'1',openid:'5421835339'})",
  "ctoken_ver": "1.0.0",
  "ctoken": "PRESENT (REDACTED)"
}
```

### Relevant headers

```json
{
  "content-type": "application/json",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  "Referer": "https://pay.pubgm.zing.vn/common-sdk?id=playerid_enter&appid=1450019043&country=vn&removeIframeBeforeLoad=true&from=self.midasbuy_saas&lang=vn&shopcode=pubgmvn",
  "traceparent": "00-fa54ed5c25cc6d8cfdfef8341b27da8e-2164ad3b477dbca7-01"
}
```

## getCharac response

```json
{
  "ret": 0,
  "info": {
    "zoneid": "1",
    "openid": "25877658659587368",
    "charac_name": "Duwn%E9%BB%8E%E6%9D%A8",
    "active_country": "",
    "register_country": "",
    "is_ban": false
  }
}
```

Response Headers of interest:
```json
{
  "server": "nginx, VNG-GPT-SEA",
  "via": "1.1 google",
  "seqid": "a7925102c45d7ca0a43b9c3a53d48908",
  "x-ratelimit-limit": "30",
  "x-ratelimit-remaining": "29"
}
```

## Player data

- **UID:** `5421835339` (user input)
- **Nickname:** `Duwn黎杨` (decoded from `charac_name: "Duwn%E9%BB%8E%E6%9D%A8"`)
- **role_id:** `5421835339` (used downstream by frontend to denote UID)
- **Other identifiers:**
  - `openid`: `25877658659587368` (Tencent Midasbuy internal account identifier)
  - `zoneid`: `1` (PUBG Mobile VN partition)
  - `is_ban`: `false`

## role_id analysis

- **Submitted UID:** `5421835339`
- **Observed role_id:** `5421835339`
- **Same as UID:** YES
- **Observed at:** REQUEST (Appears in downstream POST requests from frontend, NOT in `getCharac` response body)

## Token/encryption fields

- **encrypt_msg:** PRESENT
  - **Origin:** FRONTEND
  - **Mechanism:** Generated at runtime via `window.xMidas({ d: JSON.stringify(params) })`. Resulting hex string is converted to binary and Base64-encoded via `btoa(...)`. Obfuscated Chaos VM script loaded from `pay.pubgm.zing.vn/oversea_web/static/js/x-midas/...`.
- **ctoken:** PRESENT
  - **Origin:** STORAGE / DOM
  - **Mechanism:** Read directly from hidden input `#xMidasToken` (`document.getElementById("xMidasToken").value`), injected by the server on initial HTML page render.
- **ctoken_ver:** `1.0.0`
  - **Origin:** STORAGE / DOM
  - **Mechanism:** Read from `#xMidasVersion` (`document.getElementById("xMidasVersion").value`).

*NO secret values included.*

## Request before getCharac

`GET https://pay.pubgm.zing.vn/interface/setCookie?encrypt_msg=...&ctoken_ver=1.0.0&ctoken=...&hostname=pay.pubgm.zing.vn`
- **Status:** 200 OK
- **Response:** `{"ret":0,"msg":"set cookie success"}`
- **Purpose:** Handshake establishing server-side session cookies before submitting sensitive game queries.

## Requests after getCharac

1. `POST https://report1.midasbuy.com/cgi-bin/log_data.fcg`:
   Reports player resolution event telemetry: `charac_name=Duwn%2525E9%2525BB%25258E%2525E6%25259D%2525A8`, `openid=25877658659587368`, `zoneid=1`.
2. `GET https://pay.pubgm.zing.vn/interface/getSaasLoginData`:
   Checks if an existing binding/login session is active for the current client device.
3. `POST https://pay.pubgm.zing.vn/frontend/api/midasbuy/v1/shelves/query`:
   Submits player identity parameters to fetch available UC packages. Payload includes:
   `"role_id": "5421835339"`, `"game_openid": "25877658659587368"`, `"character_name": "Duwn黎杨"`.

## UID propagation

Requests containing the raw string `5421835339`:
1. `GET https://report1.midasbuy.com/cgi-bin/log_data.fcg` (telemetry string)
2. `POST https://pay.pubgm.zing.vn/frontend/api/midasbuy/v1/shelves/query` (as `role_id: "5421835339"`)

*Note: In `getCharac`, UID `5421835339` is encapsulated inside `encrypt_msg` ciphertext.*

## role_id propagation

Requests containing the field name `role_id`:
1. `POST https://pay.pubgm.zing.vn/frontend/api/midasbuy/v1/shelves/query`
   - Field `role_id`: `"5421835339"`
   - Field `game_openid_sign_data.role_id`: `"5421835339"`

## Frontend JavaScript findings

- **Bundle:** `https://cdn.midasbuy.com/oversea_web/static/js/commonSdk.91ea77e9.bundle.js` & `balanceVerify.4fac664b.js`
- **Caller:** `ue.prototype.getCharac` (`balanceVerify.4fac664b.js:85210`) invokes Axios instance `b.post("/getCharac", ...)`
- **Payload builder:** Module `90565` (`commonSdk.91ea77e9.bundle.js:809943`) serializes `{ appid, zoneid, openid: shortId }` and invokes `window.xMidas({ d: t })`.
- **Response handler:** Decodes `info.charac_name`, extracts `info.openid`, saves state to `localStorage.loginrecord_1450019043`, and triggers event `enter_playerid_success`.

## Other identifiers discovered

| Field | JSON path | Relation | Confidence |
|---|---|---|---|
| `openid` | `info.openid` | Internal 17-digit Tencent Midas account ID (`25877658659587368`) mapped to PUBG UID | HIGH |
| `zoneid` | `info.zoneid` | Game server partition ID (`1`) | HIGH |
| `charac_name` | `info.charac_name` | URL-encoded player display nickname (`Duwn%E9%BB%8E%E6%9D%A8` -> `Duwn黎杨`) | HIGH |
| `is_ban` | `info.is_ban` | Boolean account ban flag (`false`) | HIGH |

## Browser storage observations

- **Frame:** `pay.pubgm.zing.vn`
- **Key:** `loginrecord_1450019043`
```json
{
  "openid": "25877658659587368",
  "charac_name": "Duwn黎杨",
  "zoneid": "1",
  "userid": "5421835339",
  "is_ban": false,
  "register_country": "",
  "active_country": "",
  "pf": "mds_pc_browser-v3-android-midasweb"
}
```
- **Key:** `__RCPreOpenId__`: `"25877658659587368"`


## What was NOT observed

- No payment performed.
- No request replayed.
- No API called manually.
- No encryption bypass attempted.
- No UID other than 5421835339 tested.
- No collection or inventory data returned by any observed web endpoint.

## Directly observed facts

1. `pay.zing.vn/pubgm` embeds Tencent Midasbuy SaaS web application via iframe.
2. `getCharac` accepts only `{ encrypt_msg, ctoken, ctoken_ver }` over HTTP; the plaintext UID is never transmitted in cleartext over the wire during validation.
3. The client-side parameter passed to the encryptor is named `openid` (holding user input `5421835339`).
4. `getCharac` response does NOT contain `role_id`; it returns `openid` (`25877658659587368`), `charac_name` (`Duwn%E9%BB%8E%E6%9D%A8`), and `zoneid` (`1`).
5. In downstream requests (`shelves/query`), the term `role_id` is assigned the user's submitted UID (`5421835339`), while the returned 17-digit identifier is passed as `game_openid`.
6. Reverse proxy headers contain `server: nginx, VNG-GPT-SEA` and `trpc-trans-info`, confirming upstream communication with Tencent's tRPC backend infrastructure.

## Inferences / hypotheses

1. `role_id` on the VNG/Midas web frontend is simply an alias for the game UID (`5421835339`), not a distinct internal surrogate key.
2. The true internal Tencent game account surrogate key is `openid` (`25877658659587368`).
3. VNGGames operates as a localized distributor/payment gateway frontend on top of Tencent Midasbuy SaaS and Tencent tRPC services.
4. The web top-up flow terminates at package display (`shelves/query`) and contains zero character collection or skin data.

## Confidence

- **getCharac identified:** HIGH
- **role_id semantics:** HIGH
- **encrypt_msg source:** HIGH
- **ctoken source:** HIGH

## Research state updates

- **VNG getCharac:** Fully documented, including initiator call stack, module architecture, and payload encryption flow.
- **VNG UID → nickname:** Resolved via `getCharac` response field `charac_name`.
- **UID → different internal player identifier:** Confirmed. `UID 5421835339` maps to Tencent `openid 25877658659587368`.
- **Collection API via Web:** DEAD END. VNG web top-up flow does not interact with game inventory or collection endpoints.

## Most useful next experiment

Recommend ONE next experiment only:

**Experiment #02 — Emulator Passive Network Baseline Capture**
Proceed with passive network observation on the Windows Android emulator running official PUBG Mobile VN in idle lobby and control states to establish protocol baseline before triggering game friend search or collection inspect.

DO NOT execute it.

- **Reused by later request:** YES (`POST /frontend/api/midasbuy/v1/shelves/query`)
