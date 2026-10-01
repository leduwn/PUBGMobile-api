# PUBG Mobile VN / LDPlayer Baseline Fingerprint

## Common long-lived connections

The following 6 connections remain permanently active throughout lobby presence:

1. **`43.129.146.99:17500` (TCP)**
   - **Role:** Primary game lobby RPC and protocol multiplexer.
   - **Owner:** Tencent Cloud (AS132203).
   - **Behavior:** Continuous bidirectional exchanges (~5–10s intervals).

2. **`43.174.218.78:20371` (TCP)**
   - **Role:** Secondary game service RPC channel.
   - **Owner:** Tencent Cloud (AS132203).
   - **Behavior:** Low-frequency heartbeat (~20–30s intervals).

3. **`43.163.56.4:15692` (TCP)**
   - **Role:** Tertiary game service RPC channel.
   - **Owner:** Tencent Cloud (AS132203).
   - **Behavior:** Maintained established socket.

4. **`43.173.163.50:443` (TCP)**
   - **Role:** Tencent backend game web/service gateway.
   - **Owner:** Tencent Cloud (AS132203).
   - **Behavior:** Persistent HTTPS/TLS channel.

5. **`129.226.1.157:443` (TCP)**
   - **Role:** Tencent Singapore telemetry / reporting endpoint.
   - **Owner:** Tencent Cloud Singapore (AS132203).
   - **Behavior:** Periodic data pushes (~15–30s).

6. **`74.125.23.188:5228` (TCP)**
   - **Role:** Google Play Services / Firebase Cloud Messaging (FCM).
   - **Owner:** Google Cloud.
   - **Behavior:** Android OS background push notification stream.

---

## Common DNS / hosts

- Plaintext DNS was **NOT OBSERVABLE** at the Windows host network adapter. The Android VM resolves domain names through its internal virtual DNS bridge (10.0.2.3) or directly utilizes pre-configured IP endpoints for game RPC.
- Upstream game infrastructure maps strictly to:
  - `AS18403`: FPT Telecom / VNG Corporation (`118.69.16.x`)
  - `AS132203`: Tencent Cloud Computing (`43.x.x.x`, `129.226.x.x`, `101.x.x.x`)
  - `AS15169`: Google LLC (`74.125.x.x`)

---

## Periodic traffic

- **Tencent RPC Heartbeat:** Every 5–10 seconds on `43.129.146.99:17500`.
- **Tencent Telemetry Report:** Every 15–30 seconds on `129.226.1.157:443`.
- **GCloud UDP QoS Latency Probes:** 22-byte probe bursts on Port 8030 UDP.

---

## Common TCP traffic

- Ports `17500`, `20371`, `15692` (non-standard high-range TCP game RPC ports).
- Port `443` (HTTPS/TLS for game service endpoints and CDN caches).
- Port `5228` (Google Play FCM push).

---

## Common UDP / QUIC traffic

- Port `8030`: Outgoing UDP latency pings to distributed Tencent edge IP addresses.
- Ports `19303` / `19327`: High-volume UDP stream (`104.29.132.x`).

---

## Settings-triggered traffic

- **Zero new connections.**
- Local UI transition only. No remote settings sync was observed.

---

## Unknown / high-interest connections

- **`43.129.146.99:17500` & `43.174.218.78:20371`**:
  These two custom-port TCP streams are the primary candidates carrying player social actions (such as Friend Search and Profile inspection). Any packet size delta during search should be correlated against these channels.

---

## Noise that should be ignored in Experiment #03

In Experiment #03 (Friend Search UID `5421835339`), the following baseline traffic must be filtered out:
1. `74.125.23.188:5228` (Google FCM).
2. All UDP traffic on port `8030` (GCloud ping probes).
3. Cloudflare UDP frames on ports `19303` / `19327`.
4. Routine periodic heartbeat beacons on `129.226.1.157:443`.
5. Background close-wait TCP sockets to static CDNs (`23.202.89.169`, `57.144.64.x`).
