# Experiment #02 — PUBG Mobile VN Emulator Network Baseline

## Status
- **Status:** COMPLETED
- **Execution:** COMPLETED (Report: `research/pubg/traffic/exp02/report.md`)

## Objective
Establish clean network baseline for PUBG Mobile VN:
- Game logged in
- Idle at lobby screen
- NO Friend Search
- NO Profile opening
- NO Collection opening

Determine normal background traffic to filter noise in subsequent experiments.
NOT aimed at finding Collection API.

---

## Pre-flight Checklist
- [ ] Windows host ready
- [ ] Android emulator selected
- [ ] Emulator version recorded
- [ ] Android version recorded
- [ ] PUBG Mobile VN installed
- [ ] PUBG Mobile VN version recorded
- [ ] PUBG Mobile VN package name recorded
- [ ] Test account can login normally
- [ ] Test account reaches lobby
- [ ] Stable internet connection
- [ ] ADB available if needed
- [ ] Network capture tool available
- [ ] Capture output folder prepared
- [ ] No sensitive credentials will be logged
- [ ] No SSL pinning bypass will be attempted
- [ ] No APK patching will be performed
- [ ] No anti-cheat bypass will be attempted

---

## Environment Requirements
Record:
- Windows version
- Emulator
- Emulator version
- Android version
- PUBG Mobile VN package name
- PUBG Mobile VN version
- Network connection type
- Capture tool
- Date/time

No emulator rooting specifically for this experiment. If already rooted, do not use root to bypass protection.

---

## Potential Tools (Evaluation Only - Do Not Install Today)
- Wireshark
- pktmon
- TCPView
- Resource Monitor
- ADB diagnostics
- Emulator built-in networking diagnostics

Tool selection deferred to actual emulator setup session.

---

## Clean State Preparation
1. Start emulator.
2. Verify PUBG Mobile VN runs normally.
3. Login normally.
4. Wait until lobby is fully loaded.
5. Wait 30–60 seconds for startup traffic to settle.
6. Do NOT open:
   - Friends
   - Player Profile
   - Collection
   - Shop
   - Events
   - Clan
   - Mail
   - Ranking
7. Start capture only after lobby is stable.

---

## Capture A — Idle Lobby Baseline
1. Clear capture/log.
2. Start capture.
3. No game interaction for 60 seconds.
4. Stop capture at 60s.
5. Save to `research/pubg/traffic/exp02-idle-lobby/`.

Collect:
- domain / hostname
- IP address
- destination port
- protocol (TCP/UDP/TLS/QUIC)
- connection count
- bytes sent / received
- first seen / last seen timing

---

## Capture B — Harmless UI Control (Settings)
1. Clear capture/log.
2. Lobby -> Open game Settings -> Close Settings.
3. Do NOT open Friends, Profile, or Collection.
4. Capture window: ~30 seconds.
5. Save to `research/pubg/traffic/exp02-control-settings/`.

Purpose:
Determine if local UI interaction generates background network traffic.

---

## Differential Analysis (A vs B)
Compare Idle Lobby vs Open/Close Settings:
- New hosts?
- New connections?
- Traffic bursts?
- No changes?

Builds differential methodology for Friend Search experiment.

---

## Analysis Targets
- **DNS observation:** Record resolved domains (CDN, analytics, login/auth, game service, config, unknown). Clearly tag inference vs fact.
- **Protocol observation:** TCP, UDP, TLS, QUIC, HTTP/2, WebSocket, persistent TCP.
  - If payload not readable: mark `Payload visibility: ENCRYPTED / NOT OBSERVABLE`.
- **Long-lived connections:** Identify connections open throughout the 60s window (candidates for game RPC channels).
- **Periodic traffic:** Heartbeats, telemetry, sync bursts (e.g., ~5s, ~10s, ~30s intervals).
- **Process attribution:** Attribute traffic to emulator process / package where tool allows.

---

## Security Restrictions
- DO NOT bypass certificate pinning.
- DO NOT install hooking frameworks (Frida, Xposed).
- DO NOT patch APK or native libraries.
- DO NOT attempt to decrypt protected game traffic.
- DO NOT extract or store session tokens, auth cookies, or credentials.
- Redact any sensitive tokens/secrets before storing reports.

---

## Expected Output Files
Folder: `research/pubg/traffic/exp02/`
- `report.md`
- `idle-connections.csv` (schema: `host,ip,port,transport,protocol,first_seen,last_seen,connections,bytes_sent,bytes_received,notes`)
- `domains.txt`
- `notes.txt`
- Raw PCAP retained locally if generated (`idle-lobby.pcapng`, `control-settings.pcapng`).

---

## Report Template
```markdown
# Experiment #02 — PUBG Mobile VN Emulator Network Baseline

## Objective
Establish baseline network behavior while PUBG Mobile VN is idle in lobby.

## Environment
Emulator:
Android:
PUBG version:
Package:
Capture tool:
Date/time:

## Exact actions performed
1.
2.
3.

## Direct observations
### Idle lobby
...
### Settings control
...

## Observed domains
| Host | IP | Port | Protocol | Seen during idle | Seen during control |
|---|---|---:|---|---|---|

## Long-lived connections
...

## Periodic traffic
...

## Protocol observations
TCP:
UDP:
TLS:
QUIC:
HTTP:
WebSocket:

Payload visibility:

## Differential result
Idle-only:
Control-only:
Present in both:

## What was NOT observed
- No Friend Search performed.
- No Profile opened.
- No Collection opened.
- No attempt to decrypt TLS.
- No API endpoint attributed to Collection.

## Inferences
...

## Limitations
...

## Status
OBSERVED / REPRODUCED

## Baseline fingerprint
List background hosts/connections to ignore in future tests.

## Most useful next experiment
Experiment #03 — Friend Search UID 5421835339.
DO NOT perform Experiment #03 yet.
```

---

## Stop Condition & Next Step
- Mandatory stop immediately after baseline report generation.
- DO NOT enter UID `5421835339` during Experiment #02.
- Wait for review of baseline before proceeding to:
  `Experiment #03 — Friend Search UID 5421835339`.
