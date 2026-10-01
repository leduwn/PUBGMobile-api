# Experiment #03 — PUBG Mobile VN Friend Search

## Objective

Identify network behavior specifically associated with searching UID `5421835339`.

## Environment

- **Host OS:** Windows 11 Pro (Build 10.0.26200, x64)
- **Active Adapter:** TP-Link Wireless USB Adapter (Component ID: 14, IP: 192.168.100.194)
- **Emulator:** LDPlayer 9.5.37.0 (Android 9 Pie 64-bit)
- **Processes:** `dnplayer.exe` (PID 3508), `Ld9BoxHeadless.exe` (PID 35772), `VBoxNetNAT.exe` (PID 15584)
- **Game:** PUBG Mobile VN (`com.vng.pubgmobile`, v3.7.0)
- **Capture Engine:** Windows Native Packet Monitor (`PktMon.exe`, Build 26200)

## Known identifiers

- **PUBG UID:** `5421835339`
- **Known nickname:** `Duwn黎杨`
- **Midas/VNG OpenID candidate:** `25877658659587368`

## Capture design

- **Capture A:** Idle control baseline (30s) at main lobby.
- **Capture B:** Friend Search UI opening only (35s) without entering UID or searching.
- **Capture C:** Actual Friend Search for UID `5421835339` (35s).

## Exact actions and timestamps

- **Capture A:** `18:25:57 - 18:26:36 UTC+7` (30s motionless lobby).
- **Capture B:** `18:28:30 - 18:29:14 UTC+7` (Opened Friends at T+2.5s, opened Add Friend at T+5.0s, blank search UI rendered at T+7.2s, stopped action).
- **Capture C:** `18:31:31 - 18:32:15 UTC+7` (Typed UID `5421835339` at T+3.8s, clicked Search once at T+5.1s, player result rendered at T+6.0s, stopped action).

## UI search result

- **Player found:** YES
- **Nickname:** `Duwn黎杨`
- **Other visible fields:** Avatar icon, player level badge, recent tier, character model display.

## Capture A summary

- Baseline established: 6 persistent TCP connections (`43.129.146.99:17500`, `43.174.218.78:20371`, `43.163.56.4:15692`, `43.173.163.50:443`, `129.226.1.157:443`, `74.125.23.188:5228`).
- Total size: 16.3 MB PCAPNG / 14.1 MB TXT.

## Capture B summary

- Triggered on-demand connection to `150.109.0.77:8013` (Tencent Cloud Singapore IM/Social gateway).
- Transferred 4,564 bytes across 20 packets.
- Total size: 7.29 MB PCAPNG / 8.50 MB TXT.

## Capture C summary

- Executed actual query for UID `5421835339`.
- Exchanged packets across existing channels: `43.129.146.99:17500`, `43.174.218.78:20371`, `129.226.1.157:443`, and `150.109.0.77:8013`.
- Total size: 6.14 MB PCAPNG / 8.01 MB TXT.

## Diff B - A

- **New endpoint:** `150.109.0.77:8013` (TCP) opened on-demand upon accessing social UI.
- Minor traffic increases on persistent channels `43.129.146.99:17500` (+340B) and `43.174.218.78:20371` (+214B).

## Diff C - B

- **New endpoints:** Zero new game servers.
- **Traffic deltas:**
  - `43.129.146.99:17500`: +1,338 bytes delta over Capture B.
  - `43.174.218.78:20371`: +432 bytes delta over Capture B.
  - `129.226.1.157:443`: +640 bytes delta over Capture B.

## Search-correlated packet bursts

At Search click (`T = 18:31:37.0`):
- `T+0ms`: 500-byte telemetry packet to `129.226.1.157:443`.
- `T+169ms`: 1,089-byte telemetry beacon to `129.226.1.157:443`.
- `T+2,287ms`: 215-byte outbound RPC request to `43.174.218.78:20371`.
- `T+2,388ms`: 137-byte RPC frame to `43.129.146.99:17500`.
- `T+3,100ms`: UI player card rendered with nickname `Duwn黎杨`.

## Known marker search

- **UID `5421835339`:** NOT OBSERVABLE (binary payload)
- **Midas OpenID `25877658659587368`:** NOT OBSERVABLE (binary payload)
- **Nickname `Duwn黎杨`:** NOT OBSERVABLE (binary payload)

## Candidate Friend Search flow

- **Endpoint:** `43.174.218.78:20371` & `43.129.146.99:17500`
- **Transport:** TCP
- **New or existing:** EXISTING persistent channels
- **Timing:** Burst at T+2.2s after search trigger
- **Traffic delta:** +1,770 bytes combined delta over UI baseline
- **Confidence:** HIGH

- **Auxiliary Social Gateway:** `150.109.0.77:8013` (TCP)
- **New or existing:** NEW on-demand socket established upon opening social drawer
- **Confidence:** HIGH

## Directly observed

1. Opening Friend Search UI initiates an on-demand TCP socket to `150.109.0.77:8013` (Tencent Cloud Singapore).
2. Submitting UID `5421835339` does not open a new connection; it routes binary RPC packets over existing sockets (`43.174.218.78:20371` and `43.129.146.99:17500`).
3. Outbound request packet size for player lookup is 215 bytes.
4. Player resolution completed successfully in-game, displaying nickname `Duwn黎杨`.
5. Zero cleartext strings leaked across the network.

## Inferences

1. PUBG Mobile VN uses a multiplexed binary RPC protocol (tRPC / proprietary framing) over long-lived TCP connections for social search.
2. Search query is routed via persistent channels to Tencent Cloud backends in Singapore/East Asia.

## What was NOT observed

- No Profile opened.
- No Collection opened.
- No friend request sent.
- No captured request replayed.
- No TLS/pinning bypass.
- No payload decrypted.
- No endpoint manually queried.

## Limitations

- Payload frames are binary/encrypted; message schema fields cannot be parsed without MITM or binary reversing.

## Reproducibility

- **Script:** `research/pubg/friend-search/exp03/tools/analyze_exp03.py`
- **Execution:** `& "C:\Program Files\Python314\python.exe" "d:\Project\PUBGMobile-api\research\pubg\friend-search\exp03\tools\analyze_exp03.py"`
- **Raw artifacts:** Retained locally in `research/pubg/friend-search/exp03/raw/`.

## Research state update

- **UID -> Friend Search network mechanism:** OBSERVED (Multiplexed binary RPC over persistent TCP sockets `43.174.218.78:20371` / `43.129.146.99:17500` + on-demand social gateway `150.109.0.77:8013`)
- **UID -> game internal identifier:** UNKNOWN
- **UID -> Profile:** UNKNOWN
- **UID -> Collection:** UNKNOWN

## Status

**OBSERVED / PARTIALLY OBSERVABLE**

## Recommended next experiment

Experiment #04 — Open Player Profile from Friend Search result.  
**DO NOT execute Experiment #04.**
