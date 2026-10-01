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
- UID -> Friend Search network mechanism: **OBSERVED** (Multiplexed binary RPC over `43.174.218.78:20371` / `43.129.146.99:17500` + on-demand social gateway `150.109.0.77:8013`)
- Friend Search plaintext markers: **REJECTED** (Zero plaintext leaked on wire; binary RPC framing / TLS)


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
- **Experiment #03 — Friend Search UID 5421835339**
  - **Status:** COMPLETED
  - **Report:** `research/pubg/friend-search/exp03/report.md`

## 3. Directory Layout
`research/pubg/`
- `README.md`
- `experiments/`
- `uid-resolvers/`
  - `vng/exp01b/`
  - `github-player-apis/`
  - `php-valid-game/`
- `friend-search/`
  - `exp03/`
- `profile/`
- `collection/`
- `traffic/`
  - `exp02/`
- `apk-static/`
- `protocol/`
- `reports/`

## 4. Next Session
Next research task:

Experiment #04 — Player Profile Inspection from Friend Search Result

Primary target:
Inspect the resolved player card for UID `5421835339` (`Duwn黎杨`) in PUBG Mobile VN and observe network traffic deltas to identify whether player profile details (avatar, frame, popularity, tier, collection visibility) are retrieved over existing persistent RPC channels or on-demand web gateways.

Required order:
1. Review Experiment #03 baseline findings.
2. Confirm game remains in stable state with search result displayed.
3. Capture A: Stable search result baseline.
4. Capture B: Click player card -> Inspect Profile screen.
5. Capture C: Harmless UI control on Profile screen.
6. Differential traffic extraction and analysis.
7. Stop. DO NOT proceed to Collection tab.

