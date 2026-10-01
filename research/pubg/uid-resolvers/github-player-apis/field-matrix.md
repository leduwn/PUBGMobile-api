# PUBG Mobile Player API Field Matrix

## Comparison of Player Information Fields

Values:
- `DOCUMENTED`: Explicitly present in public schemas, documentation, or response examples.
- `NOT DOCUMENTED`: Absent from all documentation, schemas, and repository files.
- `UNKNOWN`: Insufficient evidence to determine existence.

| Field | NightsSoftware (`/getPlayer`) | exfador (`/info`) | Reference: VNG Web (`getCharac`) |
|---|---|---|---|
| **UID / player ID** | DOCUMENTED (`player_id`) | DOCUMENTED (`player_id`) | DOCUMENTED (`role_id` / input) |
| **nickname** | DOCUMENTED (`player_name`) | DOCUMENTED (`nickname`) | DOCUMENTED (`charac_name`) |
| **zone / partition** | NOT DOCUMENTED | DOCUMENTED (`zone_id`) | DOCUMENTED (`zoneid`) |
| **ban status** | NOT DOCUMENTED | DOCUMENTED (`is_ban`) | DOCUMENTED (`is_ban`) |
| **level** | NOT DOCUMENTED | NOT DOCUMENTED | NOT DOCUMENTED |
| **rank / tier** | NOT DOCUMENTED | NOT DOCUMENTED | NOT DOCUMENTED |
| **avatar / frame** | NOT DOCUMENTED | NOT DOCUMENTED | NOT DOCUMENTED |
| **region / country** | NOT DOCUMENTED | NOT DOCUMENTED | DOCUMENTED (`active_country`, `register_country` empty strings) |
| **internal OpenID** | NOT DOCUMENTED | NOT DOCUMENTED | DOCUMENTED (`openid: 25877658659587368`) |
| **account age** | NOT DOCUMENTED | NOT DOCUMENTED | NOT DOCUMENTED |
| **popularity** | NOT DOCUMENTED | NOT DOCUMENTED | NOT DOCUMENTED |
| **profile metadata** | NOT DOCUMENTED | NOT DOCUMENTED | NOT DOCUMENTED |
| **inventory** | NOT DOCUMENTED | NOT DOCUMENTED | NOT DOCUMENTED |
| **collection** | NOT DOCUMENTED | NOT DOCUMENTED | NOT DOCUMENTED |
| **owned skins** | NOT DOCUMENTED | NOT DOCUMENTED | NOT DOCUMENTED |
| **equipped items** | NOT DOCUMENTED | NOT DOCUMENTED | NOT DOCUMENTED |

---

## Detailed Field Semantics

### 1. Identity
- **NightsSoftware:** Returns `data.player_id` (integer) and `data.player_name` (string). Does not return OpenID or internal identifiers.
- **exfador:** Returns `player_id` (string) and `nickname` (string). Does not return OpenID.
- **VNG Web (`getCharac`):** Returns decoded `charac_name` and internal 17-digit Tencent `openid` (`25877658659587368`).

### 2. Account Status
- **NightsSoftware:** Only returns application status strings: `data.status: "success"` and `data.message: "Player found"`.
- **exfador:** Returns `zone_id: "1"` and `is_ban: false`.
- **VNG Web (`getCharac`):** Returns `zoneid: "1"`, `is_ban: false`, `active_country: ""`, `register_country: ""`.

### 3. In-Game Data (Profile, Inventory, Collection)
- Zero fields related to level, rank, avatar, stats, inventory, or collection exist in either provider.
- Both APIs are strict wrappers around Midasbuy top-up identity verification. They do not access game cluster servers or profile services.
