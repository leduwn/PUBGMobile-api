# Endpoint Deltas

## A — Idle Control
- Baseline established across 6 persistent game sockets.
- Primary game channel: `43.129.146.99:17500` (TCP, 2,063 bytes).
- Secondary game channel: `43.174.218.78:20371` (TCP, 217 bytes).
- Telemetry: `129.226.1.157:443` (TCP, 2,682 bytes).
- GCloud UDP probes on port 8030.
- `150.109.0.77:8013`: NOT PRESENT (Zero traffic, socket not opened).

## B — Friend Search UI Only

### New Endpoints:
1. **`150.109.0.77:8013` (TCP)**
   - **Classification:** `NEW_ENDPOINT`
   - **Traffic:** 4,564 bytes transferred across 20 packets.
   - **Host:** AS132203 Tencent Cloud Singapore (`Tencent Building, Kejizhongyi Avenue`).
   - **Role:** Dedicated Tencent Social / IM / Friend gateway service initialized on demand when opening the social drawer.

### Existing Endpoint Bursts:
- `43.129.146.99:17500`: 2,403 bytes (+340 bytes over Idle).
- `43.174.218.78:20371`: 431 bytes (+214 bytes over Idle).

## C — Search UID 5421835339

### New Endpoints:
- Zero new long-lived game servers. All player search actions are serviced through the established social gateway (`150.109.0.77:8013`) and primary game multiplexers (`43.129.146.99:17500`, `43.174.218.78:20371`).

### Existing Endpoint Bursts:
- `43.129.146.99:17500`: Increased to 3,741 bytes (+1,338 bytes delta over B).
- `43.174.218.78:20371`: Increased to 863 bytes (+432 bytes delta over B).
- `129.226.1.157:443`: Increased to 2,999 bytes (+640 bytes delta over B).
- `150.109.0.77:8013`: Maintained active bidirectional session (4,562 bytes).

## B - A Interpretation
Opening the Friend Search UI triggers an explicit network state transition: the client opens an on-demand TCP socket to Tencent's Singapore IM/Social Gateway (`150.109.0.77:8013`). This socket does not exist in the idle lobby baseline.

## C - B Interpretation
Actual search for UID `5421835339` does not establish another new server connection; instead, it transmits query frames over the existing channels (`43.129.146.99:17500`, `43.174.218.78:20371`, and `150.109.0.77:8013`), resulting in a distinct multi-packet exchange burst and immediate UI population.

## Highest-interest Candidate

### Candidate #1 (On-demand Social Gateway)
- **Endpoint/flow:** `150.109.0.77:8013` (TCP)
- **Reason:** Brand new endpoint appearing exclusively upon social/friend drawer interaction; hosted directly in Tencent Cloud Singapore.
- **Confidence:** HIGH

### Candidate #2 (Player Lookup RPC Multiplexer)
- **Endpoint/flow:** `43.129.146.99:17500` & `43.174.218.78:20371` (TCP)
- **Reason:** Existing persistent channels that exhibited precise packet size and volume bursts (+1,338 bytes and +432 bytes) at the exact moment of search button submission.
- **Confidence:** HIGH
