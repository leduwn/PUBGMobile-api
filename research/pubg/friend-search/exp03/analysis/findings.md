# Experiment #03 — Findings

### 1. Opening Friend Search UI creates network traffic?
**YES**  
Opening the Friends sidebar triggers an on-demand TCP connection to Tencent Cloud Singapore IM/Social gateway: `150.109.0.77:8013` (4,564 bytes transferred).

### 2. Searching UID creates new connection?
**NO**  
Submitting the UID query does not create any new TCP or UDP sockets. It multiplexes the lookup over the existing persistent game channels.

### 3. Searching UID creates a distinct burst on existing connection?
**YES**  
Clear bursts were recorded immediately following the Search button click:
- `43.174.218.78:20371` (outbound 215-byte packet).
- `43.129.146.99:17500` (outbound 137-byte and 73-byte packets; +1,338 bytes delta over UI-only baseline).
- `129.226.1.157:443` (telemetry burst of 500 and 1,089 bytes).

### 4. Which flow has strongest correlation?
- **On-demand socket setup:** `150.109.0.77:8013` (TCP) - specific to opening social subsystem.
- **Lookup query payload:** `43.174.218.78:20371` and `43.129.146.99:17500` (TCP) - specific to the execution of the UID lookup.

### 5. UID plaintext observed?
**NOT OBSERVABLE**  
The UID `5421835339` is encapsulated within proprietary binary framing over the TCP stream and is not observable in cleartext.

### 6. Midas OpenID observed?
**NOT OBSERVABLE**  
The Tencent Midas OpenID `25877658659587368` did not appear in plaintext in any captured packet.

### 7. New identifier observed?
**NO**  
Zero new plaintext identifiers were exposed over the wire during search.

### 8. Friend Search likely REST/HTTPS or multiplexed binary RPC?
**DIRECT OBSERVATION & INFERENCE**  
Directly observed: Game traffic utilizes persistent TCP sockets on non-standard ports (`17500`, `20371`, `8013`).  
Inference: Friend Search is entirely handled by a multiplexed binary RPC protocol (likely Tencent tRPC / protobuf / proprietary framing), NOT REST or plain HTTPS.

### 9. Is Experiment #04 Profile traffic worth running?
**YES**  
Because clicking on the resolved player card to inspect the full Profile requires fetching avatar frames, popularity, rank/tier, and potentially collection privacy flags, Experiment #04 will reveal whether profile inspection occurs over these same persistent RPC channels or fetches web assets over HTTPS.
