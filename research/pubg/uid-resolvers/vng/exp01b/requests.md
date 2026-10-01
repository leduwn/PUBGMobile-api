# Experiment #01B — Detailed Request Specifications

## 1. Request Immediately Before getCharac (Handshake: setCookie)

- **Method:** `GET`
- **URL:** `https://pay.pubgm.zing.vn/interface/setCookie`
- **Query Parameters:**
  - `encrypt_msg`: `PRESENT (xMidas encrypted session state)`
  - `ctoken_ver`: `1.0.0`
  - `ctoken`: `PRESENT (REDACTED)`
  - `hostname`: `pay.pubgm.zing.vn`
- **Status:** `200`
- **Initiator:**
```json
{
  "type": "script",
  "stack": {
    "callFrames": [
      {
        "functionName": "e.writable.L.find.window.XMLHttpRequest.send",
        "scriptId": "35",
        "url": "https://aegis.cdn-go.cn/aegis-sdk-v2/latest/aegis.min.js",
        "lineNumber": 7,
        "columnNumber": 73428
      },
      {
        "functionName": "a",
        "scriptId": "35",
        "url": "https://aegis.cdn-go.cn/aegis-sdk-v2/latest/aegis.min.js",
        "lineNumber": 7,
        "columnNumber": 74857
      },
      {
        "functionName": "l",
        "scriptId": "35",
        "url": "https://aegis.cdn-go.cn/aegis-sdk-v2/latest/aegis.min.js",
        "lineNumber": 7,
        "columnNumber": 75046
      },
      {
        "functionName": "",
        "scriptId": "61",
        "url": "https://pagedoo.midasbuy.com/cdn/materials/dist/gems-materials-midasbuy_saas_materials@1768539847/65.72ac039082d73ecc.js",
        "lineNumber": 0,
        "columnNumber": 33655
      },
      {
        "functionName": "xhr",
        "scriptId": "61",
        "url": "https://pagedoo.midasbuy.com/cdn/materials/dist/gems-materials-midasbuy_saas_materials@1768539847/65.72ac039082d73ecc.js",
        "lineNumber": 0,
        "columnNumber": 31596
      },
      {
        "functionName": "tF",
        "scriptId": "61",
        "url": "https://pagedoo.midasbuy.com/cdn/materials/dist/gems-materials-midasbuy_saas_materials@1768539847/65.72ac039082d73ecc.js",
        "lineNumber": 0,
        "columnNumber": 49979
      }
    ]
  }
}
```
- **Request Headers (Sanitized):**
```json
{
  "sec-ch-ua-platform": "\"Windows\"",
  "Referer": "https://pay.pubgm.zing.vn/pubgmvn/vn/buy/pubgmvn",
  "Accept-Language": "vi-VN",
  "sec-ch-ua": "\"Chromium\";v=\"154\", \"Google Chrome\";v=\"154\", \"Not A(Brand\";v=\"99\"",
  "sec-ch-ua-mobile": "?0",
  "X-Request-Env": "online",
  "traceparent": "00-4cb4a89c5712b501d1f482f0957e8cda-e2e19e51956f5d1e-01",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  "Accept": "application/json, text/plain, */*"
}
```
- **Response Headers (Sanitized):**
```json
{
  "etag": "\"24-8lGTZU1PbAj3b1ZTHMulUbCUaz0\"",
  "seqid": "4cb4a89c5712b501d1f482f0957e8cda",
  "via": "1.1 google",
  "x-ratelimit-remaining": "27",
  "alt-svc": "h3=\":443\"; ma=2592000",
  "content-length": "36",
  "date": "Wed, 30 Sep 2026 17:35:55 GMT",
  "x-ratelimit-limit": "30",
  "content-type": "application/json; charset=utf-8",
  "server": "nginx, VNG-GPT-SEA"
}
```
- **Response Body:**
```json
{"ret":0,"msg":"set cookie success"}
```

## 2. Core Target Request: getCharac

- **Method:** `POST`
- **URL:** `https://pay.pubgm.zing.vn/interface/getCharac`
- **Status:** `200`
- **Initiator Call Stack:**
```json
{
  "type": "script",
  "stack": {
    "callFrames": [
      {
        "functionName": "e.writable.L.find.window.XMLHttpRequest.send",
        "scriptId": "180",
        "url": "https://aegis.cdn-go.cn/aegis-sdk-v2/latest/aegis.min.js",
        "lineNumber": 7,
        "columnNumber": 73428
      },
      {
        "functionName": "",
        "scriptId": "174",
        "url": "https://cdn.midasbuy.com/oversea_web/static/js/commonSdk.91ea77e9.bundle.js",
        "lineNumber": 4,
        "columnNumber": 310371
      },
      {
        "functionName": "xhr",
        "scriptId": "174",
        "url": "https://cdn.midasbuy.com/oversea_web/static/js/commonSdk.91ea77e9.bundle.js",
        "lineNumber": 4,
        "columnNumber": 308406
      },
      {
        "functionName": "l",
        "scriptId": "174",
        "url": "https://cdn.midasbuy.com/oversea_web/static/js/commonSdk.91ea77e9.bundle.js",
        "lineNumber": 4,
        "columnNumber": 320248
      }
    ]
  }
}
```
- **Request Headers (Sanitized):**
```json
{
  "sec-ch-ua-platform": "\"Windows\"",
  "Referer": "https://pay.pubgm.zing.vn/common-sdk?id=playerid_enter&appid=1450019043&country=vn&removeIframeBeforeLoad=true&from=self.midasbuy_saas&lang=vn&shopcode=pubgmvn",
  "Accept-Language": "vi-VN",
  "sec-ch-ua": "\"Chromium\";v=\"154\", \"Google Chrome\";v=\"154\", \"Not A(Brand\";v=\"99\"",
  "sec-ch-ua-mobile": "?0",
  "traceparent": "00-a7925102c45d7ca0a43b9c3a53d48908-795ca3e8ce74fcf1-00",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  "Accept": "application/json, text/plain, */*",
  "Content-Type": "application/json"
}
```
- **Request Payload (Sanitized):**
```json
{
  "encrypt_msg": "PRESENT (Base64 xMidas ciphertext of {appid:'1450019043',zoneid:'1',openid:'5421835339'})",
  "ctoken_ver": "1.0.0",
  "ctoken": "PRESENT (REDACTED)"
}
```
- **Response Headers (Sanitized):**
```json
{
  "etag": "\"9c-nIOaaUQ5GrCFJOFiqlp73ByeSqM\"",
  "seqid": "a7925102c45d7ca0a43b9c3a53d48908",
  "via": "1.1 google",
  "x-ratelimit-remaining": "29",
  "alt-svc": "h3=\":443\"; ma=2592000",
  "content-length": "156",
  "date": "Wed, 30 Sep 2026 17:36:00 GMT",
  "x-ratelimit-limit": "30",
  "content-type": "application/json; charset=utf-8",
  "server": "nginx, VNG-GPT-SEA"
}
```
- **Response Body:**
```json
{"ret":0,"info":{"zoneid":"1","openid":"25877658659587368","charac_name":"Duwn%E9%BB%8E%E6%9D%A8","active_country":"","register_country":"","is_ban":false}}
```

## 3. Requests Immediately After getCharac

### 3.1 getSaasLoginData

- **Method:** `GET`
- **URL:** `https://pay.pubgm.zing.vn/interface/getSaasLoginData`
- **Status:** `200`
- **Initiator:**
```json
{
  "type": "script",
  "stack": {
    "callFrames": [
      {
        "functionName": "e.writable.L.find.window.XMLHttpRequest.send",
        "scriptId": "35",
        "url": "https://aegis.cdn-go.cn/aegis-sdk-v2/latest/aegis.min.js",
        "lineNumber": 7,
        "columnNumber": 73428
      },
      {
        "functionName": "",
        "scriptId": "61",
        "url": "https://pagedoo.midasbuy.com/cdn/materials/dist/gems-materials-midasbuy_saas_materials@1768539847/65.72ac039082d73ecc.js",
        "lineNumber": 0,
        "columnNumber": 33655
      },
      {
        "functionName": "xhr",
        "scriptId": "61",
        "url": "https://pagedoo.midasbuy.com/cdn/materials/dist/gems-materials-midasbuy_saas_materials@1768539847/65.72ac039082d73ecc.js",
        "lineNumber": 0,
        "columnNumber": 31596
      },
      {
        "functionName": "tF",
        "scriptId": "61",
        "url": "https://pagedoo.midasbuy.com/cdn/materials/dist/gems-materials-midasbuy_saas_materials@1768539847/65.72ac039082d73ecc.js",
        "lineNumber": 0,
        "columnNumber": 49979
      }
    ]
  }
}
```
- **Response Body (Sanitized):**
```json
{
  "ret": 0,
  "data": {
    "user": null,
    "currentBindUser": null,
    "gameUsers": [],
    "imInfo": {
      "usersig": "REDACTED",
      "appid": "20020384",
      "uid": "047979131385770371790789744408",
      "adminLists": [],
      "CentrifugeJwt": ""
    },
    "wsInfo": {
      "token": "REDACTED"
    }
  }
}
```

### 3.2 shelves/query

- **Method:** `POST`
- **URL:** `https://pay.pubgm.zing.vn/frontend/api/midasbuy/v1/shelves/query`
- **Status:** `200`
- **Initiator:**
```json
{
  "type": "script",
  "stack": {
    "callFrames": [
      {
        "functionName": "e.writable.L.find.window.XMLHttpRequest.send",
        "scriptId": "35",
        "url": "https://aegis.cdn-go.cn/aegis-sdk-v2/latest/aegis.min.js",
        "lineNumber": 7,
        "columnNumber": 73428
      },
      {
        "functionName": "",
        "scriptId": "61",
        "url": "https://pagedoo.midasbuy.com/cdn/materials/dist/gems-materials-midasbuy_saas_materials@1768539847/65.72ac039082d73ecc.js",
        "lineNumber": 0,
        "columnNumber": 33655
      },
      {
        "functionName": "xhr",
        "scriptId": "61",
        "url": "https://pagedoo.midasbuy.com/cdn/materials/dist/gems-materials-midasbuy_saas_materials@1768539847/65.72ac039082d73ecc.js",
        "lineNumber": 0,
        "columnNumber": 31596
      },
      {
        "functionName": "tF",
        "scriptId": "61",
        "url": "https://pagedoo.midasbuy.com/cdn/materials/dist/gems-materials-midasbuy_saas_materials@1768539847/65.72ac039082d73ecc.js",
        "lineNumber": 0,
        "columnNumber": 49979
      }
    ]
  }
}
```
- **Request Payload (Directly Observed):**
```json
{"browserParams":"","app_id":"1450019043","language":"vn","region":"VN","shop_code":"pubgmvn","product_types":["GameCoins"],"game_openid":"","isReady":true,"mid":"","role_id":"","server_id":"1","device_id":"047979131385770371790789744408","is_vip_product":true,"client_ver":"android","tab_lab":"","game_openid_sign_data":{"openid":"","role_id":"","character_name":"","sign":"","ext":{}},"is_editor":false}
```
- **Response Headers (Sanitized):**
```json
{
  "content-encoding": "gzip",
  "x-content-type-options": "nosniff, nosniff",
  "via": "1.1 google",
  "alt-svc": "h3=\":443\"; ma=2592000",
  "date": "Wed, 30 Sep 2026 17:35:52 GMT",
  "content-type": "application/json",
  "vary": "Accept-Encoding",
  "server": "nginx, VNG-GPT-SEA",
  "trpc-trans-info": "{\"Cookie\":\"VVVJRD0wNTk1NTQ2Nzc5NDg5NTY1OTE3OTA3ODk3NDQ0MDQyNTQzMzsgbWlkYXNidXlEZXZpY2VJZD0wNDc5NzkxMzEzODU3NzAzNzE3OTA3ODk3NDQ0MDg7IHNlbGVjdF9jb29raWU9MDsgY29va2llX2NvbnRyb2w9MHwwfDA7IHNob3Bjb2RlPXB1Ymdtdm47IGNvdW50cnk9dm47IF9naWQ9R0ExLjIuNzgwNzEwMzE1LjE3OTA3ODk3NDU7IF9nYXRfU0hPUD0xOyB0ZW5jZW50X3RkcmM9U0N4VmpxMkIzZlZTQXZFY1V6ZWF1Qkl6UzlxNnJ4dnhpazsgX2dhPUdBMS4xLjQ5MDMzMDM2NC4xNzkwNzg5NzQ1OyBfZ2FfNEtZNk03SlA5TD1HUzIuMS5zMTc5MDc4OTc0NyRvMSRnMCR0MTc5MDc4OTc0NyRqNjAkbDAkaDE2ODc5MDI0ODY7IGZvcnRlclRva2VuPTE1MGU3N2FhODE0ZjQyYzU5MGM3NjE2Y2VmYWE1ZDgwXzE3OTA3ODk3NDc2MTNfX1VERjQzXzI3Y2tf\",\"X-Forwarded-For\":\"NDIuMTEyLjExMC4xMzAsIDM1LjI0MS4zLjE4NywgNDIuMTEyLjExMC4xMzAsIDM0Ljg3LjEyNS4yNDA=\",\"X-Real-IP\":\"MzQuODcuMTI1LjI0MA==\",\"X-Request-Id\":\"NDRmZGUzYTQtNWYxOC00MDg1LTgxZDYtNmRjYjI3Y2ZlMzMx\",\"env\":\"b25saW5l\"}"
}
```
- **Response Content Summary:**
Contains catalog shelves of UC bundles (VietQR, ZaloPay, etc.), no user items or collection data.
