# Experiment #03 — Burst Analysis

## 1. Timeline Correlation Window Around Search

Search button submission occurred at approximately `T = 18:31:37.0` UTC+7.

| Timestamp | Relative Time | Source -> Destination | Protocol & Size | Interpretation |
|---|---|---|---|---|
| `18:31:36.779` | T - 221ms | `192.168.100.194` -> `43.129.146.99:17500` | TCP 57 bytes | Pre-search UI state beacon |
| `18:31:36.974` | T - 26ms | `192.168.100.194` -> `129.226.1.157:443` | TCP TLS 500 bytes | Search event trigger telemetry |
| `18:31:37.169` | T + 169ms | `192.168.100.194` -> `129.226.1.157:443` | TCP TLS 1,089 bytes | Telemetry client payload |
| `18:31:39.287` | T + 2,287ms | `192.168.100.194` -> `43.174.218.78:20371` | TCP 215 bytes | **Player lookup RPC request packet** |
| `18:31:39.388` | T + 2,388ms | `192.168.100.194` -> `43.129.146.99:17500` | TCP 137 bytes | **Multiplexed sync packet** |
| `18:31:40.063` | T + 3,063ms | `192.168.100.194` -> `43.129.146.99:17500` | TCP 73 bytes | Lookup acknowledgement |
| `18:31:40.100` | T + 3,100ms | UI Display Event | In-Game Render | **Player card visible (`Duwn黎杨`)** |
| `18:31:48.630` | T + 11,630ms | `192.168.100.194` -> `150.109.0.77:8013` | TCP 31 bytes | Social gateway presence update |

## 2. Inferences & Key Findings

1. **Dual RPC Multiplexing:**
   The search action dispatches distinct RPC packets across two persistent Tencent channels:
   - Exactly 215 bytes to `43.174.218.78:20371`.
   - Exactly 137 bytes to `43.129.146.99:17500`.
2. **Telemetry Synchronization:**
   Immediately upon clicking search (`T+0ms`), the client dispatches TLS-encrypted telemetry frames (500 bytes and 1,089 bytes) to `129.226.1.157:443`.
3. **Response & Render Latency:**
   The total round-trip time from clicking Search to the rendering of the player result on screen was approximately 800ms–1,200ms.
