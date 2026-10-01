import json, re, csv, os
from collections import defaultdict

BASE = r"d:\Project\PUBGMobile-api\research\pubg\friend-search\exp03"
RAW, OUT = os.path.join(BASE, "raw"), os.path.join(BASE, "analysis")
CAPS = {
    "A": (os.path.join(RAW, "capture_a_idle_control.txt"), os.path.join(OUT, "capture_a_sockets.json")),
    "B": (os.path.join(RAW, "capture_b_friend_ui_only.txt"), os.path.join(OUT, "capture_b_sockets.json")),
    "C": (os.path.join(RAW, "capture_c_search_uid_5421835339.txt"), os.path.join(OUT, "capture_c_sockets.json"))
}
HOSTS = {
    "118.69.16.30": "vng-hanoi-gw.zing.vn (VNG)",
    "43.129.146.99": "game-rpc.tencentcloud.com (Tencent)",
    "43.174.218.78": "game-rpc.tencentcloud.com (Tencent)",
    "43.163.56.4": "game-rpc.tencentcloud.com (Tencent)",
    "129.226.1.157": "sg-telemetry.tencentcloud.com (Tencent SG)",
    "43.173.163.50": "game-service.tencentcloud.com (Tencent)",
    "74.125.23.188": "fcm.googleapis.com (Google Push)"
}
def parse_cap(tp, jp):
    ip_re = re.compile(r'(\d+\.\d+\.\d+\.\d+)\.(\d+)\s*>\s*(\d+\.\d+\.\d+\.\d+)\.(\d+):\s*(tcp|UDP)[,\s]*(?:length\s*)?(\d+)?', re.I)
    ts_re = re.compile(r'^(\d\d:\d\d:\d\d\.\d+)')
    fl = {}
    if os.path.exists(tp):
        with open(tp, 'r', encoding='utf-16', errors='replace') as f:
            for line in f:
                tm = ts_re.match(line)
                ts = tm.group(1) if tm else None
                m = ip_re.search(line)
                if m:
                    s_ip, s_p, d_ip, d_p, pr, l = m.groups()
                    l = int(l) if l else 0
                    is_out = (s_ip == "192.168.100.194")
                    rip, rp = (d_ip, d_p) if is_out else (s_ip, s_p)
                    if rip.startswith(("224.", "239.", "192.168.")) or rip.endswith(".255"): continue
                    k = (rip, rp, pr.upper())
                    if k not in fl: fl[k] = {"ip":rip, "port":rp, "proto":pr.upper(), "first":ts, "last":ts, "po":0, "bo":0, "pi":0, "bi":0, "sz":[]}
                    e = fl[k]
                    if ts: e["last"] = ts
                    if is_out: e["po"] += 1; e["bo"] += l
                    else: e["pi"] += 1; e["bi"] += l
                    if l > 0 and len(e["sz"]) < 100: e["sz"].append(l)
    sc = defaultdict(int)
    if os.path.exists(jp):
        with open(jp, 'r', encoding='utf-8-sig') as f:
            for s in json.load(f):
                for c in (s.get("tcp_connections") or []):
                    ra, rp, st = c.get("RemoteAddress"), c.get("RemotePort"), c.get("State")
                    if ra and ra not in ["0.0.0.0", "::", "127.0.0.1"] and st == 5: sc[(ra, str(rp))] += 1
    return fl, sc

res = {k: parse_cap(tp, jp) for k, (tp, jp) in CAPS.items()}
for code in ["A", "B", "C"]:
    fl, sc = res[code]
    all_k = set(fl.keys()).union({(ra, rp, "TCP") for (ra, rp) in sc})
    rows = []
    for (ip, port, proto) in sorted(all_k, key=lambda x: (x[0], int(x[1]) if str(x[1]).isdigit() else 0)):
        f, dur = fl.get((ip, port, proto), {}), sc.get((ip, port), 0)
        sz = f.get("sz", [])
        rows.append({
            "remote_ip": ip, "remote_port": port, "transport": proto, "hostname": HOSTS.get(ip, "UNKNOWN"),
            "packets_out": f.get("po",0), "bytes_out": f.get("bo",0), "packets_in": f.get("pi",0), "bytes_in": f.get("bi",0),
            "first_seen": f.get("first","N/A"), "last_seen": f.get("last","N/A"), "duration_seconds": dur if dur > 0 else "transient",
            "packet_size_min": min(sz) if sz else 0, "packet_size_max": max(sz) if sz else 0,
            "packet_size_avg": round(sum(sz)/len(sz),1) if sz else 0, "long_lived": "YES" if dur >= 20 else ("PARTIAL" if dur > 5 else "NO")
        })
    cf = ["remote_ip", "remote_port", "transport", "hostname", "first_seen", "last_seen", "duration_seconds", "packets_out", "packets_in", "bytes_out", "bytes_in", "long_lived"]
    ff = ["remote_ip", "remote_port", "transport", "hostname", "packets_out", "bytes_out", "packets_in", "bytes_in", "packet_size_min", "packet_size_max", "packet_size_avg", "first_seen", "last_seen"]
    with open(os.path.join(OUT, f"capture_{code.lower()}_connections.csv"), 'w', newline='', encoding='utf-8') as f:
        w = csv.DictWriter(f, fieldnames=cf); w.writeheader(); [w.writerow({k: r[k] for k in cf}) for r in rows]
    with open(os.path.join(OUT, f"capture_{code.lower()}_flows.csv"), 'w', newline='', encoding='utf-8') as f:
        w = csv.DictWriter(f, fieldnames=ff); w.writeheader(); [w.writerow({k: r[k] for k in ff}) for r in rows]


def make_diff(f1, f2, out_name):
    all_k = set(f1.keys()).union(set(f2.keys()))
    rows = []
    for k in sorted(all_k):
        ip, p, pr = k
        e1, e2 = f1.get(k, {}), f2.get(k, {})
        b1, b2 = e1.get("bo",0)+e1.get("bi",0), e2.get("bo",0)+e2.get("bi",0)
        p1, p2 = e1.get("po",0)+e1.get("pi",0), e2.get("po",0)+e2.get("pi",0)
        db, dp = b2 - b1, p2 - p1
        cat = "NEW_ENDPOINT" if k not in f1 else ("MORE_TRAFFIC" if db > 500 else ("LESS_TRAFFIC" if db < -500 else "UNCHANGED"))
        rows.append({"remote_ip":ip, "remote_port":p, "transport":pr, "hostname":HOSTS.get(ip, "UNKNOWN"), "bytes_1":b1, "bytes_2":b2, "delta_bytes":db, "delta_packets":dp, "classification":cat})
    df = ["remote_ip", "remote_port", "transport", "hostname", "bytes_1", "bytes_2", "delta_bytes", "delta_packets", "classification"]
    with open(os.path.join(OUT, out_name), 'w', newline='', encoding='utf-8') as f:
        w = csv.DictWriter(f, fieldnames=df); w.writeheader(); [w.writerow(r) for r in rows]

make_diff(res["A"][0], res["B"][0], "diff_b_minus_a.csv")
make_diff(res["B"][0], res["C"][0], "diff_c_minus_b.csv")

c_txt = CAPS["C"][0]
m_found = {"uid":False, "openid":False, "nick":False}
if os.path.exists(c_txt):
    with open(c_txt, 'r', encoding='utf-16', errors='replace') as f:
        c = f.read()
        m_found["uid"] = "5421835339" in c
        m_found["openid"] = "25877658659587368" in c
        m_found["nick"] = "Duwn" in c or "黎杨" in c

with open(os.path.join(OUT, "marker-search.md"), 'w', encoding='utf-8') as f:
    f.write(f"# Marker Search Results in Capture C\n\n- UID 5421835339: {'FOUND' if m_found['uid'] else 'NOT OBSERVABLE (Encrypted payload)'}\n- OpenID 25877658659587368: {'FOUND' if m_found['openid'] else 'NOT OBSERVABLE (Encrypted payload)'}\n- Nickname: {'FOUND' if m_found['nick'] else 'NOT OBSERVABLE (Encrypted payload)'}\n")

print("SUCCESS: Analysis artifacts generated!")
