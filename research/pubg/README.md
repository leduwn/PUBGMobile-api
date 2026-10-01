# PUBG Mobile Technical Research

## 1. Project Goal
Reverse engineer / observe data flow:
`UID -> Verify player -> Profile -> Collection visibility -> Public collection items`.

Target UID: `5421835339` (Confirmed valid PUBG Mobile VN account).

## 2. Research State Machine
- GoPay API exists: **VERIFIED**
- GoPay requires no PUBG auth: **VERIFIED**
- GoPay UID -> nickname: **VERIFIED** (limited coverage)
- GoPay covers all PUBG accounts: **REJECTED**
- UID 5421835339 valid PUBG VN: **VERIFIED** (in-game)
- VNG resolver getCharac / role_id: **VERIFIED**
- UID -> Tencent openid (25877658659587368): **VERIFIED**
- Web top-up -> Collection API: **REJECTED** (Dead end; web flow terminates at UC purchase shelves)
- Third-party Midasbuy APIs (NightsSoftware, exfador): **VERIFIED WRAPPERS** (Midasbuy web session automation)
- Third-party Midasbuy APIs -> Collection/Profile: **REJECTED** (Dead end; only return nickname/zone/ban status)
- GoPay Games API (`php-valid-game`): **VERIFIED NICKNAME ONLY** (Upstream returns strictly `username` + empty `countryOrigin`)
- GoPay Games -> Collection/Profile: **REJECTED** (Dead end)
- Emulator Lobby Baseline Fingerprint: **VERIFIED** (6 persistent TCP connections identified)
- Primary Game Multiplexed Channels: **VERIFIED** (`43.129.146.99:17500`, `43.174.218.78:20371`, `43.163.56.4:15692`)
- GCloud UDP 8030 Edge Latency Probing: **VERIFIED** (Lightweight 22-byte probes across Tencent subnets)
- Local UI Isolation (Settings): **VERIFIED** (Opening/closing Settings generates zero new server connections)

- UID -> In-game Profile API: **UNKNOWN**
- UID -> Collection: **UNKNOWN**
- Collection service: **UNKNOWN**
- Collection privacy mechanism: **UNKNOWN**
- Collection item format: **UNKNOWN**
- Item catalog: **UNKNOWN**

### Experiment Status
- **Experiment #01B — VNGGames PUBG Mobile VN Request Chain**
  - **Status:** COMPLETED
  - **Report:** `research/pubg/uid-resolvers/vng/exp01b/report.md`
- **Experiment #01C — GitHub PUBG Mobile Player API Research**
  - **Status:** COMPLETED
  - **Report:** `research/pubg/uid-resolvers/github-player-apis/report.md`
- **Experiment #01D — triyatna/php-valid-game & GoPay Upstream Research**
  - **Status:** COMPLETED
  - **Report:** `research/pubg/uid-resolvers/php-valid-game/report.md`
- **Experiment #02 — Emulator Network Baseline**
  - **Status:** COMPLETED
  - **Report:** `research/pubg/traffic/exp02/report.md`

## 3. Directory Layout
`research/pubg/`
- `README.md`
- `experiments/`
- `uid-resolvers/`
  - `vng/exp01b/`
  - `github-player-apis/`
  - `php-valid-game/`
- `friend-search/`
- `profile/`
- `collection/`
- `traffic/`
- `apk-static/`
- `protocol/`
- `reports/`



## 4. Next Session
Next research task:

Experiment #02 — PUBG Mobile VN Emulator Network Baseline

Primary target:
Prepare an Android emulator capable of running PUBG Mobile VN and observe normal network metadata before performing Friend Search.

Do not begin with Collection investigation.

Required order:
1. Confirm emulator environment.
2. Confirm PUBG Mobile VN launches normally.
3. Confirm controlled account can reach lobby.
4. Select appropriate network capture method.
5. Capture idle-lobby baseline.
6. Capture harmless Settings control.
7. Generate baseline report.
8. Stop.
9. Review results before Experiment #03.

Experiment #03 after review:
Friend Search UID 5421835339.

