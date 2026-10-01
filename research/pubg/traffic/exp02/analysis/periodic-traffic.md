# Experiment #02 — Periodic Traffic Analysis

## 1. Observed Periodic Patterns

### A. Tencent Game RPC Keepalive (`43.129.146.99:17500` - TCP)
- **Transport:** Persistent TCP
- **Observed Cadence:** ~5–10 second intervals
- **Payload Visibility:** ENCRYPTED / NOT OBSERVABLE (Binary proprietary game protocol)
- **Packets Observed:** 218 packets across 60 seconds
- **Interpretation:** Possible heartbeat / presence / lobby state synchronization traffic — HYPOTHESIS

### B. Tencent Singapore Telemetry Cadence (`129.226.1.157:443` - TCP TLS)
- **Transport:** Persistent TLS over TCP 443
- **Observed Cadence:** Periodic transmission every ~15–30 seconds
- **Payload Visibility:** ENCRYPTED (TLS v1.2/1.3)
- **Bytes Exchanged:** ~7.7 KB
- **Interpretation:** Periodic client metrics / crash reporting / session beacon — HYPOTHESIS

### C. Tencent GCloud Edge Latency Probing (Port 8030 - UDP)
- **Transport:** UDP Port 8030
- **Target Nodes:** Distributed across 13+ Tencent Cloud & edge IP ranges (`43.129.x.x`, `101.32.x.x`, `101.33.x.x`, `162.62.x.x`, `20.199.x.x`, `23.251.x.x`, `170.106.x.x`)
- **Packet Size:** Exactly 22 bytes per probe payload (44 bytes with IP/UDP header)
- **Observed Cadence:** Batch burst every 30–60 seconds
- **Interpretation:** GCloud / TDM (Tencent Data Master) network QoS latency measurement & ping telemetry — HYPOTHESIS

### D. Cloudflare Tunnel / Media Keepalive (Ports 19303, 19327 - UDP)
- **Transport:** UDP (`104.29.132.50`, `104.29.132.91`)
- **Observed Cadence:** High-frequency keepalive packets (~100ms–1s cadence)
- **Packets Observed:** >9,000 UDP frames
- **Interpretation:** Background media/streaming relay or tunnel keepalive — HYPOTHESIS

## 2. Summary
Lobby network presence is governed by:
1. One high-frequency TCP stream (`43.129.146.99:17500`).
2. Two low-frequency TCP keepalives (`43.174.218.78:20371`, `43.173.163.50:443`).
3. Periodic UDP 8030 latency measurement batches.
