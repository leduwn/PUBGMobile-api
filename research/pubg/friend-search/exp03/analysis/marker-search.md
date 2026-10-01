# Marker Search Results in Capture C

- **Target UID (`5421835339`):** NOT OBSERVABLE in network packets. (Only appeared in PktMon log metadata header recording the file path string `capture_c_search_uid_5421835339.etl`).
- **Midas OpenID (`25877658659587368`):** NOT OBSERVABLE in network packets.
- **Player Nickname (`Duwn黎杨` / `Duwn`):** NOT OBSERVABLE in network packets.

## Directly Observed Facts
1. All client-server transmissions carrying player lookup queries and responses are encapsulated in binary RPC frames over persistent TCP connections (`43.129.146.99:17500` / `43.174.218.78:20371`) or encrypted under TLS.
2. Zero plaintext player identifiers or nicknames leak in unencrypted cleartext across the network adapter.
3. Payload visibility: `PAYLOAD_VISIBILITY = ENCRYPTED / NOT OBSERVABLE`.

