# Open Questions

## SSVK Website Redesign - 2026-05-17 (updated v3)

### Resolved in v3

- [x] Primary user persona? -- **Locked: C (pitch-deck wow factor) primary**, A (mobile-utility) via PWA, B (committee/researcher) via content depth
- [x] Design direction? -- **Sacred Modern + Mobile App Shell patterns**
- [x] Email on separate domain? -- **Yes, ssvk.org.au is independent. Web migration will not break email.**
- [x] Domain strategy? -- **Build on temp domain (ssvkbrisbane.com.au or .org.au). Domain credentials are post-pitch. sriselvavinayakar.org expires 2026-10-21, recovery is post-committee-approval.**

### Phase 0 Gates (revised — no longer blocking build)

- [ ] Domain credentials for sriselvavinayakar.org — still locked behind GoDaddy/Blue Razor reseller with transfer locks. Recovery needed post-pitch, before 2026-10-21 expiry. — Blocks cutover, not build.
- [ ] Who currently pays for domain renewal (~$15/yr for temp + existing)? — Needs a named billing owner before temp domain purchase.

### Admin / Content Model

- [ ] Validate Keystatic admin UX with actual temple volunteer — can they edit an event, toggle canteen, add a menu item? — Critical gate before full build (Task 1 in plan).
- [ ] Keystatic GitHub OAuth flow — is it simple enough for a non-technical admin, or do we need a proxy/simplified login? — Discovered during prototype phase.
- [ ] Content migration effort — how many of the 30+ PDFs contain unique structured data vs. duplicates/stale content? — Affects Task 3 estimate.

### Content & Assets

- [ ] Are the 19 Temple Worship PDFs by Sri Santhan Kurukkal copyright-cleared for digital republication as web pages? — Determines inline vs. download.
- [ ] Photography situation — existing images owned by HASQ? High-res? Photo shoot feasible? — Hero imagery critical for persona C pitch.
- [ ] Is the RealAudio (.ra) hymn file unique content not duplicated in existing MP3s? — Re-encode or delete.
- [ ] Does the client have reference photos to share? — Needed for mockup phase.

### Volunteer & Stewardship

- [ ] Is there a volunteer developer in the Tamil tech community? — Affects timeline and feasibility.
- [ ] Named content steward for post-launch updates? — Static path degrades gracefully without one, but content freshness depends on it.
