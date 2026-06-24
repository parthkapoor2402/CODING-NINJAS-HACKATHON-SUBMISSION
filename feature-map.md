# Feature Map — Prototype vs. Brief

Maps each **original brief capability** to prototype surfaces, seed data, and tests.

| Brief capability | User-facing surface | Admin / system | Seed / demo anchor | Tests |
|------------------|---------------------|----------------|-------------------|-------|
| **Identify** issues | Home pulse, Nearby map/feed, MapPreviewCard | Hotspot pins, analytics categories | Ward 12 issues | E04, I08 |
| **Report** quickly | Report wizard (Evidence→Review), Home CTA | Admin queue intake | New submit flow | E02, I02–I04 |
| **Validate** (community) | Verify tab, IssueCard confirm, corroboration | Moderation quality flags | `report-003` pending | E05, I10 |
| **Track** status | Track tab, IssueTimeline, Success→Track CTA | Issue detail, field worker updates | `report-002` in_progress | I11, C58–C62 |
| **Resolve** with proof | ResolutionProofPlaceholder, resolved cards | Admin assignment, proof panel | `report-004` Russell Market | C62, admin demo |
| **Collaborate** | Support existing, duplicate nudges, verify | Duplicate merge tool | `report-001` / `report-005` | I07, I07b, I08 |
| **AI** (intelligent assist) | DetailsStep suggestions, Review trust checks | AI priority hints (mock) | mockAI / Grok optional | I02, I16b |
| **Transparency** | Status badges, timelines, activity log | Dashboard KPIs, analytics | issueUpdates seed | I11, I16 |
| **Accountability** | SLA cues, crew messages, assignment | Admin queue, worker timeline | `report-002` assigned | E08–E09, I14–I16 |
| **Community participation** | Verify, support, trust cards | Corroboration counts | 4+ confirmations on pothole | E05, I10 |
| **Gamification** (responsible) | Rewards at-a-glance, badges, streaks | Abuse queue, reward flags | Points ≠ volume copy | E06, I12, I13 |
| **Image/video reporting** | EvidenceStep, action sheet, preview | Media in queue cards | demo-photo.jpg, seed media | I03–I04, E02 |
| **Geolocation** | LocationStep, map pin adjust | Ward IDs in queue | BASE coords + addresses | I06, E03 |

---

## Four judge-ready scenarios (seed)

| Scenario | Report ID | Address | Status | Story |
|----------|-----------|---------|--------|-------|
| Pothole near school | `report-001` | St. Mary's School crossing | Verified | Safety + parent concern |
| Garbage near market | `report-004` | Russell Market entrance | Resolved | Cleanup proof |
| Broken streetlight in lane | `report-003` | Park Lane | Pending verification | Community confirm demo |
| Water leak near apartments | `report-002` | Lakeview Apartments Block B | In progress | Crew assigned, SLA |

---

## Explicit non-goals (MVP)

- Live municipal ERP integration
- Real-time websocket dashboard
- Payment partner redemption (UI only)
- 50-report density (6 curated reports for clarity)

See `known-limitations.md` for engineering boundaries.
