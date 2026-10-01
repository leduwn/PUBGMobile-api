# Experiment #03 — Actions Timeline

## Capture A — Idle Control Baseline
- **Capture Window:** 30 seconds (Total active: 37.4s)
- **Start Time:** 2026-10-01 18:25:57.187 UTC+7
- **End Time:** 2026-10-01 18:26:36.021 UTC+7
- **Timeline:**
  - `T+0.0s`: PktMon capture started on Component 14.
  - `T+0.0s - T+30.0s`: PUBG Mobile VN maintained motionless in Lobby. Zero user clicks, zero menu transitions.
  - `T+30.0s`: Capture stop signal dispatched; PktMon stopped; buffers flushed.
  - `T+37.4s`: PCAPNG and TXT logs successfully generated.

---

## Capture B — Open Friend Search UI Only
- **Capture Window:** 35 seconds (Total active: 42.8s)
- **Start Time:** 2026-10-01 18:28:30.257 UTC+7
- **End Time:** 2026-10-01 18:29:14.348 UTC+7
- **Timeline:**
  - `T+0.0s`: PktMon capture started on Component 14.
  - `T+2.5s`: User clicked Friends icon from bottom-left lobby menu.
  - `T+5.0s`: Friends sidebar opened; user clicked "Add Friends" / Search icon.
  - `T+7.2s`: Player ID search dialog rendered with blank input field.
  - `T+7.5s`: User action stopped immediately. No characters typed. Search button not clicked.
  - `T+7.5s - T+35.0s`: Motionless wait on blank search screen for ~27 seconds.
  - `T+35.0s`: Capture stop signal dispatched.
  - `T+42.8s`: PCAPNG and TXT logs successfully generated.

---

## Capture C — Actual Friend Search (UID 5421835339)
- **Capture Window:** 35 seconds (Total active: 42.2s)
- **Start Time:** 2026-10-01 18:31:31.947 UTC+7
- **End Time:** 2026-10-01 18:32:15.354 UTC+7
- **Timeline:**
  - `T+0.0s`: PktMon capture started on Component 14.
  - `T+2.0s`: User focused Player ID input field in Friend Search dialog.
  - `T+3.8s`: User entered UID `5421835339`.
  - `T+5.1s`: User clicked Search button exactly ONCE (`T_search = 0`).
  - `T+5.6s - T+6.0s`: Search spinner displayed; player card populated on screen.
  - `T+6.0s`: Player result visible: Nickname `Duwn黎杨`, level/avatar rendered.
  - `T+6.2s`: Strict stop boundary applied. Zero clicks on player card, Profile NOT opened, Collection NOT opened, friend request NOT sent.
  - `T+6.2s - T+35.0s`: Motionless wait on result screen for ~29 seconds.
  - `T+35.0s`: Capture stop signal dispatched.
  - `T+42.2s`: PCAPNG and TXT logs successfully generated.
