# Experiment #03 — Analysis Tooling

## Overview
Automated reproducible parser for Experiment #03 network captures.
Processes raw PktMon text traces (`.txt`) and process socket samples (`.json`) across:
- **Capture A:** Idle control baseline (30s)
- **Capture B:** Friend Search UI opening only (30s)
- **Capture C:** Actual Friend Search for UID `5421835339` (30s)

## Requirements
- Python 3.10+ (Executed with Python 3.14 on Windows)

## Execution Command
```powershell
& "C:\Program Files\Python314\python.exe" "d:\Project\PUBGMobile-api\research\pubg\friend-search\exp03\tools\analyze_exp03.py"
```

## Generated Outputs
Outputs are saved directly to `research/pubg/friend-search/exp03/analysis/`:
- `capture_a_connections.csv`
- `capture_b_connections.csv`
- `capture_c_connections.csv`
- `capture_a_flows.csv`
- `capture_b_flows.csv`
- `capture_c_flows.csv`
- `diff_b_minus_a.csv`
- `diff_c_minus_b.csv`
- `marker-search.md`
- `endpoint-deltas.md`
- `burst-analysis.md`
- `findings.md`
