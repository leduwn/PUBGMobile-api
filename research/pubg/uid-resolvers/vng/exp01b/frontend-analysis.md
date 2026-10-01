# Experiment #01B — Frontend JavaScript Analysis

## 1. getCharac String Search

- **getCharac string found:** YES
- **Locations observed:**
  1. `https://cdn.midasbuy.com/oversea_web/static/js/commonSdk.91ea77e9.bundle.js` (core API definition and Axios wrapper)
  2. `https://cdn.midasbuy.com/oversea_web/static/js/balanceVerify.4fac664b.js` (business logic store and validation handler)
  3. `https://pagedoo.midasbuy.com/cdn/materials/dist/gems-materials-midasbuy_saas_materials@1768539847/3252.72ac039082d73ecc.js` (role binding helper)
  4. `https://cdn.midasbuy.com/oversea_web/static/js/paymentSdk.e008c353.bundle.js` (duplicate SDK instance)

## 2. Caller Location

- **Caller located:** YES
- **Direct initiator call stack (from CDP):**
  1. `e.writable.L.find.window.XMLHttpRequest.send` at `aegis.min.js:7:73428` (Tencent Aegis telemetry hook on native `XMLHttpRequest`)
  2. Anonymous function at `commonSdk.91ea77e9.bundle.js:4:310371` (Axios XHR adapter `xhr.js`)
  3. `xhr` at `commonSdk.91ea77e9.bundle.js:4:308406` (Axios adapter invocation)
  4. `l` (Axios `dispatchRequest`) at `commonSdk.91ea77e9.bundle.js:4:320248`
- **Higher-level business callers:**
  - `E = (e, t, n) => b.post("/getCharac", {...e}, { signal: t?.signal, mapReturn: "info", noPublicParams: n })` in `commonSdk.91ea77e9.bundle.js:562328`
  - Wrapped by `w = (e, t, n) => { ... }` which attaches session info (`UUID`, `website_country`, etc.) and handles risk control challenges (`riskFlexibleV2`).
  - Triggered by `ue.prototype.getCharac` in `balanceVerify.4fac664b.js:85210` on Player ID submission.

## 3. Payload Construction

- **Payload construction located:** YES
- **Unencrypted parameters structure:**
  In `balanceVerify.4fac664b.js`:
  ```javascript
  var u = p.default.extend(this._getInterfaceParams(), {
    openid: l,        // User-entered PUBG UID (e.g. "5421835339")
    area_id: n,
    zone_id: i,       // e.g. "1"
    plat_id: o,
    __product_id: e
  });
  ```
- **Intercepted and encrypted by Axios request interceptor `v` (`commonSdk.91ea77e9.bundle.js`):**
  ```javascript
  let v = e => {
    let t = e?.url?.replace(e?.baseURL || "/interface/", ""),
        n = e.noPublicParams ? {} : (0, r.Ak)();
    if ("post" === e.method && !e.notEncrypt) {
      e.data = (0, s.f)({ ...n, ...e.data });
    }
    ...
  }
  ```
- **Encryption routine in Module `90565` (`commonSdk.91ea77e9.bundle.js:809943`):**
  ```javascript
  function o(e) {
    return btoa(String.fromCharCode(...(e.match(/../g) || []).map(e => parseInt(e, 16))));
  }

  function u(e) {
    let t = JSON.stringify((0, r.default)(e, e => void 0 !== e && "object" != typeof e ? String(e) : e)),
        n = document.getElementById("xMidasToken").value;
    if (!n) return e;
    let s = document.getElementById("xMidasVersion").value,
        u = i(() => {
          try {
            return window.xMidas({ d: t });
          } catch (t) {
            return e;
          }
        });
    return u.result
      ? {
          encrypt_msg: o(u.result),
          ctoken_ver: s,
          ctoken: n
        }
      : e;
  }
  ```

## 4. Origin of Security Fields

### `encrypt_msg`
- **Origin:** FRONTEND (Generated dynamically in browser)
- **Mechanism:** Created by calling `window.xMidas({ d: JSON.stringify(params) })`. The returned hex ciphertext is decoded into binary bytes and encoded to standard Base64 using `btoa(...)`.
- **Underlying Engine:** `window.xMidas` is an obfuscated Tencent Chaos VM runtime loaded from `https://pay.pubgm.zing.vn/oversea_web/static/js/x-midas/ZgpUawDKwAeaT2U3HD3TvWxJm2uzyN1NQBinaGBPnC9m...`.

### `ctoken`
- **Origin:** STORAGE / DOM (Server-injected hidden input)
- **Mechanism:** Read directly from the DOM input element: `document.getElementById("xMidasToken").value`.
- **Value Semantics:** Token identifying the client session / risk validation state. Redacted in reports.

### `ctoken_ver`
- **Origin:** STORAGE / DOM (Server-injected hidden input)
- **Mechanism:** Read directly from the DOM input element: `document.getElementById("xMidasVersion").value`.
- **Observed Value:** Static version string `"1.0.0"`.

## 5. Response Handling and role_id Processing

- **getCharac Response Body:**
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
- **Storage in Local Storage:**
  Handled in `balanceVerify.4fac664b.js` by `saveLoginRecord`:
  ```javascript
  c.saveLoginRecord(D.appid, {
    zoneid: t,
    userid: l,       // "5421835339" (submitted UID)
    openid: n,       // "25877658659587368" (returned openid)
    charac_name: i,  // "Duwn黎杨" (URL-decoded charac_name)
    ...
  });
  ```
  Result stored in key `loginrecord_1450019043` and `__RCPreOpenId__`.

- **Downstream Requests (`shelves/query`):**
  When querying available products/shelves, the frontend maps:
  - `role_id`: Takes the submitted UID (`"5421835339"`).
  - `game_openid`: Takes the returned Tencent `openid` (`"25877658659587368"`).
  - `game_openid_sign_data`: Takes `{ openid: "25877658659587368", role_id: "5421835339", character_name: "Duwn黎杨", sign: "", ext: {} }`.

## 6. Identifier Summary

| Identifier | Source | Value / Semantic | Relation to UID |
|---|---|---|---|
| `userid` / `role_id` | Submitted by user input | `5421835339` | Exactly equals submitted PUBG Mobile UID |
| `openid` / `game_openid` | Returned by `getCharac` | `25877658659587368` | Tencent Midas internal account identifier mapped to UID |
| `charac_name` | Returned by `getCharac` | `Duwn黎杨` | Player in-game display nickname |
| `zoneid` | Returned by `getCharac` | `1` | Server partition identifier (Default PUBG VN zone) |
