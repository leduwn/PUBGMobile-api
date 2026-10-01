# Experiment #02 — LDPlayer Passive Network Baseline

## Environment

- **Host OS:** Microsoft Windows 11 Pro (Build 10.0.26200, x64)
- **Active Adapter:** TP-Link Wireless USB Adapter (Component ID: 14, IP: 192.168.100.194, MAC: 20-E1-5D-F7-A7-A4)
- **Emulator:** LDPlayer 9.5.37.0 (ProductVersion: 9.5.37.0)
- **Guest OS:** Android 9 (Pie, 64-bit kernel)
- **Target Application:** PUBG Mobile VN (`com.vng.pubgmobile`, v3.7.0)
- **Capture Engine:** Windows Native Packet Monitor (`PktMon.exe`, Build 26200) + NDIS 6.x driver
- **Converters:** PktMon native `etl2pcap` (Wireshark PCAPNG) + native `etl2txt`
- **Process Sampler:** High-frequency socket attribution to `VBoxNetNAT.exe` (PID 15584)
- **Date / Time:** 2026-10-01 UTC+7

## Capture setup

- Captured bidirectional Ethernet/Wi-Fi frames on Component 14 (Wi-Fi).
- Packet payload truncation disabled (`--pkt-size 0`, full frame retention).
- Concurrently sampled TCP socket table states of LDPlayer NAT engine every 1 second.
- Output raw artifacts saved locally to `research/pubg/traffic/exp02/raw/`.

## Exact actions performed

1. Launched LDPlayer 9 and PUBG Mobile VN into a clean lobby state.
2. Verified all background startup traffic settled for >60 seconds.
3. **Capture A (Idle Lobby):** Started packet capture on Component 14; recorded exactly 60 seconds with zero game interaction; stopped capture; exported `exp02_idle_lobby_60s.pcapng` (124 MB) and `exp02_idle_lobby_60s.txt` (102 MB).
4. **Capture B (Settings Control):** Started packet capture; executed UI sequence: Lobby -> Opened Settings -> waited 5 seconds -> Closed Settings back to Lobby; continued capture to ~35 seconds; stopped capture; exported `exp02_settings_control_30s.pcapng` (8.5 MB) and `exp02_settings_control_30s.txt` (10.5 MB).
5. Aggregated socket tables, parsed packet streams, and calculated persistence metrics.

## Idle Lobby observations

- The emulator process `VBoxNetNAT.exe` maintains 6 persistent TCP connections throughout the idle period.
- Primary game channel is `43.129.146.99:17500` (Tencent Cloud), exchanging keepalives every 5–10s.
- High volume of UDP probing observed on Port 8030 directed to multiple Tencent edge servers.
- Total idle packets captured: 10,486 frames.

## Settings control observations

- Navigating into Settings and back to Lobby did NOT open any new persistent TCP connection.
- Settings interaction generated modest packet bursts on the existing channel `43.129.146.99:17500`.
- Total control packets captured: 812 frames.

## DNS / hosts observed

- Plaintext DNS was **DNS_NOT_OBSERVABLE** on the host adapter. LDPlayer guest resolved domains through its internal virtual gateway (10.0.2.3) or directly addressed hardcoded backend IPs.
- Resolved IP destinations belong exclusively to:
  - `118.69.16.x`: VNG Corporation / FPT Hanoi (PUBG Mobile VN entry gateway).
  - `43.x.x.x` & `129.226.x.x`: Tencent Cloud Computing (Game RPC / Telemetry).
  - `74.125.x.x`: Google Cloud (Android FCM Push).
  - `23.202.x.x`: Akamai Technologies (Static asset CDN).

## Long-lived connections

| Remote Endpoint | Transport | Autonomous System / Hostname | State | Persistence |
|---|---|---|---|---|
| `43.129.146.99:17500` | TCP | AS132203 Tencent Cloud | Established | 60s / 60s (100%) |
| `43.174.218.78:20371` | TCP | AS132203 Tencent Cloud | Established | 60s / 60s (100%) |
| `43.163.56.4:15692` | TCP | AS132203 Tencent Cloud | Established | 60s / 60s (100%) |
| `43.173.163.50:443` | TCP | AS132203 Tencent Cloud | Established | 60s / 60s (100%) |
| `129.226.1.157:443` | TCP (TLS) | AS132203 Tencent Cloud Singapore | Established | 60s / 60s (100%) |
| `74.125.23.188:5228` | TCP | AS15169 Google LLC | Established | 60s / 60s (100%) |

## Periodic traffic

- Heartbeat on `43.129.146.99:17500` (~5–10s cadence).
- Telemetry pushes on `129.226.1.157:443` (~15–30s cadence).
- 22-byte UDP ping latency measurement bursts on Port 8030 to Tencent GCloud nodes.

## Protocol observations

- **TCP:** Used for all persistent game RPC channels (`17500`, `20371`, `15692`), HTTPS services (`443`), and FCM (`5228`).
- **UDP:** Used for GCloud QoS probes (`8030`) and media/tunnel streams (`19303`, `19327`).
- **TLS:** Present on port 443.
- **Payload visibility:** `PAYLOAD_VISIBILITY = ENCRYPTED / NOT OBSERVABLE`. Proprietary binary framing and TLS encryption observed. Zero decryption was attempted.

## Idle vs Settings differential

- **Present in both:** All 6 primary persistent TCP connections and periodic UDP 8030 probes.
- **Idle only:** Initial VNG gateway socket `118.69.16.30:443` (closed after first 27 seconds).
- **Settings only:** Zero new hosts; minor packet volume burst on existing TCP 17500 channel.

## Baseline fingerprint

See detailed document: `research/pubg/traffic/exp02/analysis/baseline-fingerprint.md`.

## Directly observed

1. LDPlayer routes all guest traffic through host process `VBoxNetNAT.exe` (PID 15584).
2. PUBG Mobile VN maintains exactly 5 persistent game sockets to Tencent Cloud and 1 to Google FCM.
3. UI navigation into Settings produces no new connections or remote network queries.
4. GCloud latency measurement continually sends 22-byte UDP packets to port 8030 across Tencent IP subnets.

## Inferences

1. `43.129.146.99:17500` and `43.174.218.78:20371` are the game's primary multiplexed RPC channels.
2. Friend Search in Experiment #03 will either transit across these existing multiplexed TCP channels or trigger an on-demand socket to a localized player database node.

## Limitations

- Sysinternals TCPView was not pre-installed on the host system; process socket tables were captured via PowerShell `Get-NetTCPConnection` at 1Hz frequency instead.
- In-guest DNS queries were resolved internally before reaching the host NDIS filter.

## Status

**OBSERVED**

## Readiness for Experiment #03

**READY**
