# SSVK Brisbane Temple Website Redesign — Plan v3.1

**Date:** 2026-05-17
**Status:** DRAFT v3.1 — content-model patch + risk-mitigation update
**Scope:** Greenfield website for Sri Selva Vinayakar Koyil, Brisbane (Hindu Ahlaya Sangam Queensland Inc.)
**Primary persona:** C (pitch-deck wow factor), with A (mobile-utility) via PWA and B (committee/researcher) via content depth

---

## 0. Backend / Admin Requirements

The user's non-negotiable requirement: *"When I update in the admin panel, I should see all in the website."* Every piece of dynamic content — event timings, canteen status, menus, pooja prices, festival calendar, notices — must be editable by a non-technical admin through a browser-based panel, with changes live within ~60 seconds.

This eliminates PDFs as a content format. The current site hosts 30+ PDFs. All admin-updatable content becomes structured data with typed fields. Static reference PDFs may remain as downloads.

**The admin panel is the product as much as the public site.** If the admin experience is bad, content goes stale — the exact failure mode we are designing against.

---

## 1. Competitive Analysis

*(Unchanged from v2 — see v2 archive for full table.)*

**Convergent patterns across AU/UK temples:** Online pooja booking, donation flow, festival calendar, livestream, mobile-first photography-forward design. Most use WordPress with paid staff — a dependency SSVK lacks.

---

## 2. Information Architecture (5 MVP pages, content-bound)

### MVP Sitemap (each page binds to structured content collections)

```
Home        -- Hero + next 3 events + canteen status + today's hours + latest notice
About       -- Static prose (history, Vinayakar, committee) -- admin-editable rich text
Services    -- Pooja/archana prices (collection) + festival calendar (collection)
Visit       -- Opening hours (collection) + location + canteen status + today's menu (collection)
Donate      -- Bank details (admin-editable) + future Stripe Payment Link
```

### Phase 1.5 (post-MVP, pre-Phase 2)

- Full menu archive (past menus browsable)
- Newsletter archive (rich text posts)
- Photo gallery (admin-uploadable)
- News / announcements list page

### Phase 2

- Pooja booking (Cal.com embed or Stripe Payment Link)
- Tamil/English toggle (bilingual content from structured fields)
- Livestream embed (YouTube)

### Content to Kill (from v2, unchanged)

Snowfall JS, RealAudio .ra, Virtual Poojaa .exe/.zip, extreme-dm counter, FrontPage markup, windows-1252 charset, stale COVID notices, table-based layout — all deleted.

---

## 3. Feature Scope — Phased

### MVP

- Responsive 5-page site binding to structured content (see Section 4.5)
- Admin panel with login, dashboard, structured forms for all content types
- WCAG 2.1 AA, HTTPS, Lighthouse mobile >= 90
- Tamil + English content with proper `lang` attributes (bilingual fields for names; full bilingual toggle deferred to Phase 2)
- Offline-cached Visit page via service worker
- All current PDFs replaced with structured pages (pooja prices, festival calendar, canteen menu)
- Change propagation: admin saves -> site updated within ~60 seconds

### Phase 2 (post-committee approval)

- Online pooja/archana booking with payment (Stripe)
- Online donation processing (recurring, DGR receipt)
- Newsletter signup (Buttondown free tier)
- Livestream embed (YouTube)
- Full multilingual toggle (Tamil/English)

### Phase 3 (sustained stewardship proven)

- iCal feed subscription
- Member portal (login, booking history)
- Push notifications for festivals
- Volunteer management

---

## 4. Stack & Hosting — Architecture Evaluation

### Options Evaluated (v3, settled)

| Option | Verdict | Key reason |
|--------|---------|------------|
| A: Pure Keystatic + Cloudflare Pages | Viable but strained | Keystatic with typed schemas addresses the "admin panel" gap (see A' below) |
| B: Static + Cloudflare KV hybrid | **Invalidated** | Split admin UI contradicts "one panel" requirement |
| C: PocketBase headless CMS | **Viable, rejected** | Reintroduces server dependency — the failure mode we are designing against |
| D: Supabase | **Invalidated** | DB admin tool, not a content editor; non-technical volunteer fails |

*(Full option analysis in v3 archive. Architecture decision is closed.)*

---

### PRIMARY RECOMMENDATION: Option A' — Astro + Keystatic (GitHub mode) + Cloudflare Pages

Keystatic with typed field schemas (boolean toggles, date pickers, image uploads, select dropdowns, number inputs) generates forms that ARE the admin panel. 30-60s propagation is acceptable for a temple canteen. PocketBase reintroduces the server-dependency failure mode. Cloudflare Pages + git-backed content preserves the 20-year survival pattern with a modern admin UI.

| Criterion | Assessment |
|-----------|-----------|
| Build cost | 57-85hrs developer time (one-time, up from 50-70 due to content migration realism) |
| Ongoing cost | $0/mo (Cloudflare Pages free tier) + ~$15/yr domain |
| Admin experience | Keystatic browser GUI with typed forms per collection |
| Performance | Lighthouse 95-100 (static HTML, edge-served) |
| Change propagation | ~30-60s (admin save -> GitHub commit -> Cloudflare rebuild) |
| Extensibility | Astro islands for Stripe embeds, i18n routing for Tamil |
| Migration risk | Content in JSON/markdown — portable. Keystatic schema is declarative |
| Resilience | No DB, no server process, no renewal to forget. Git = backup |

### ADR (Architectural Decision Record)

- **Decision:** Astro + Keystatic (GitHub mode) + Cloudflare Pages. Keystatic collections model all structured content types. Admin edits via Keystatic's browser UI.
- **Drivers:** (1) Non-technical admin must have a polished editing experience with typed forms. (2) Zero-server resilience — no process to keep alive. (3) Zero ongoing cost. (4) Content as structured data, not PDF blobs.
- **Alternatives considered:** Pure static with markdown (insufficient structure); Static + KV hybrid (split admin UX, invalidated); PocketBase headless CMS (introduces server dependency); Supabase (admin UX inadequate for non-technical users).
- **Why chosen:** Keystatic with well-designed schemas delivers the "admin panel" experience without introducing a server. The 30-60s propagation delay is acceptable for all identified content types. The survival pattern matches the proven 20-year static model.
- **Consequences:** Requires careful upfront schema design (Section 4.5). Layout changes need developer involvement. If true real-time (<5s) is ever required, add a Cloudflare Worker + KV island — does not require rearchitecting.
- **Follow-ups:** Build Keystatic schema prototype early (task 1). Validate admin UX with user before full build. Domain acquisition for temp pitch site.

---

## 4.5 Content Model Specification

All collections are Keystatic collections with typed fields. Display surfaces reference the MVP pages.

**Bilingual field policy:** Tamil name fields (`name_tamil`, `title_tamil`) are **required** on collections where Tamil is the canonical/liturgical name — i.e., Pooja & Services, Festival Calendar. They are **optional** on collections where English is the canonical name — i.e., Events, Notices, Newsletter Posts, Committee Members. Full bilingual body text (rich-text translation of descriptions, prose, articles) is **deferred to Phase 2** for all content types. This keeps the MVP shippable while preserving the schema slot for later translation work without a breaking migration.

### Events

| Field | Type | Required | Validation | Notes |
|-------|------|----------|------------|-------|
| title | text | yes | max 120 chars | |
| title_tamil | text | no | | Phase 2 bilingual |
| date | date | yes | | |
| start_time | text | yes | HH:MM format | |
| end_time | text | no | HH:MM, must be > start | |
| recurring | boolean | no | default false | |
| recurrence_rule | text | no | only if recurring=true | e.g. "Every Saturday" |
| description | rich text | no | | |
| location_within_temple | select | no | [Main Hall, Prayer Hall, Kitchen, Grounds, Online] | |
| photo | image | no | max 2MB, jpg/png/webp | |

**Display:** Home (next 3), Services page (full calendar view).

### Canteen Status

Singleton (one record, not a collection).

| Field | Type | Required | Validation | Notes |
|-------|------|----------|------------|-------|
| is_open | boolean | yes | | Toggle |
| today_hours_open | text | no | HH:MM | |
| today_hours_close | text | no | HH:MM | |
| special_notice | text | no | max 200 chars | e.g. "Closed for Pongal prep" |

**Display:** Home (status badge), Visit page (prominent card).

### Canteen Menu

| Field | Type | Required | Validation | Notes |
|-------|------|----------|------------|-------|
| name | text | yes | max 80 chars | |
| name_tamil | text | no | | MVP bilingual for food names |
| price_aud | number | yes | min 0, 2 decimal | |
| category | select | yes | [Breakfast, Lunch, Snacks, Drinks, Prasadam] | |
| dietary | multiselect | no | [Veg, Vegan, Jain] | |
| description | text | no | max 200 chars | |
| photo | image | no | max 2MB | |
| available | boolean | yes | default true | Hide without deleting |

**Display:** Visit page (grouped by category, dietary badges).

### Pooja / Services

| Field | Type | Required | Validation | Notes |
|-------|------|----------|------------|-------|
| name | text | yes | | |
| name_tamil | text | yes | | Bilingual from MVP |
| duration_minutes | number | no | min 1 | |
| price_aud | number | yes | min 0, 2 decimal | |
| description | rich text | no | | |
| prerequisites | text | no | | e.g. "Bring flowers and fruits" |
| sort_order | number | no | | Manual ordering |

**Display:** Services page (table with Tamil/English names, price, duration).

### Festival Calendar

| Field | Type | Required | Validation | Notes |
|-------|------|----------|------------|-------|
| name | text | yes | | |
| name_tamil | text | yes | | Bilingual from MVP |
| date | date | yes | | |
| time | text | no | HH:MM | |
| type | select | yes | [Major, Minor] | |
| description | rich text | no | | |
| photo | image | no | max 2MB | |

**Display:** Services page (calendar/list view, major festivals highlighted), Home (upcoming).

### Notices

| Field | Type | Required | Validation | Notes |
|-------|------|----------|------------|-------|
| title | text | yes | max 120 chars | |
| date_posted | date | yes | auto-set to today | |
| body | rich text | yes | | |
| expires_on | date | no | must be >= date_posted | Auto-hide after expiry |
| priority | select | no | [Normal, Urgent] | Urgent = banner on Home |

**Display:** Home (latest notice; urgent = top banner), Phase 1.5 news list page.

### Newsletter Posts (Phase 1.5)

| Field | Type | Required | Validation | Notes |
|-------|------|----------|------------|-------|
| title | text | yes | | |
| date | date | yes | | |
| body | rich text | yes | | |
| attachments | file array | no | max 5MB each | |

**Display:** Phase 1.5 newsletter archive page.

### Opening Hours

Singleton with structured weekly schedule.

| Field | Type | Required | Validation | Notes |
|-------|------|----------|------------|-------|
| weekday_open | text | yes | HH:MM | |
| weekday_close | text | yes | HH:MM | |
| weekend_open | text | yes | HH:MM | |
| weekend_close | text | yes | HH:MM | |
| special_hours_note | text | no | | e.g. "Extended hours during Navaratri" |

**Display:** Home (today's hours derived from day-of-week), Visit page (full weekly schedule).

### About Page Content (singleton)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| history_intro | rich text | yes | Opening paragraph for the History section |
| history_body | rich text | yes | Full history narrative |
| vinayakar_intro | rich text | yes | About Lord Vinayakar |
| vinayakar_body | rich text | no | Extended Vinayakar content |
| general_about | rich text | no | Any other About-page prose |

**Display:** About page. **Bilingual:** Full Tamil body text deferred to Phase 2 per policy.

### Donation Details (singleton)

| Field | Type | Required | Validation | Notes |
|-------|------|----------|------------|-------|
| bank_name | text | yes | | e.g. "Commonwealth Bank of Australia" |
| account_name | text | yes | | e.g. "Hindu Ahlaya Sangam Queensland Inc." |
| bsb | text | yes | NNN-NNN format | |
| account_number | text | yes | | |
| payid | text | no | | |
| reference_instructions | rich text | yes | | What reference to use when transferring |
| dgr_status_note | rich text | no | | Tax-deductibility statement if/when DGR endorsed |
| treasurer_email | email | yes | valid email | For receipt requests |

**Display:** Donate page. **Bilingual:** No (financial fields).

### Committee Members (collection)

| Field | Type | Required | Validation | Notes |
|-------|------|----------|------------|-------|
| name | text | yes | | |
| name_tamil | text | no | | Optional per bilingual policy |
| role | text | yes | | e.g. "President", "Secretary" |
| role_tamil | text | no | | |
| photo | image | no | max 2MB, jpg/png/webp | |
| contact_email | email | no | valid email | |
| sort_order | number | yes | default 0 | Manual ordering |
| term_start_year | number | no | | For historical display |
| is_current | boolean | yes | default true | Archive past committees |

**Display:** About page (filter `is_current=true`, sort by `sort_order`).

### Site Configuration (singleton)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| temple_address_line1 | text | yes | |
| temple_address_line2 | text | yes | |
| suburb | text | yes | |
| postcode | text | yes | |
| state | text | yes | |
| country | text | yes | |
| postal_address | text | no | If different from temple address |
| phone_primary | text | yes | e.g. "+61 7 5547 8064" |
| email_general | email | yes | e.g. info@ssvk.org.au |
| google_maps_url | url | yes | For Visit page link |
| google_maps_embed_url | url | no | Full iframe src if using embed |
| social_links | object array | no | Each: platform (text) + url (url) |

**Display:** Visit page (map + address), footer site-wide.

### FAQ (deferred to Phase 1.5)

Not MVP. If needed, add as a collection (question/answer/category/sort_order) post-launch.

---

## 5. Domain Strategy

- **Pitch phase:** Build on a temporary domain (`ssvkbrisbane.com.au` or `.org.au`, ~$15/yr). Domain credentials are POST-PITCH, not pre-build.
- **Existing domain:** `sriselvavinayakar.org` expires **2026-10-21** (5-month window). GoDaddy / Blue Razor reseller. All transfer locks set. Recovery is a Phase 1 task after committee approval.
- **Email:** On separate domain `ssvk.org.au` — web migration will NOT break email. No MX record changes needed.

---

## 6. Design Direction

**Primary: "Sacred Modern"** (persona C pitch-deck wow factor) + **Mobile App Shell** patterns (persona A utility).

- **Palette:** Deep maroon (#6B1D2A) + saffron gold (#E8A317) + warm cream (#FFF8EE) + charcoal (#2D2D2D)
- **Typography:** Catamaran (Tamil + Latin) headings; Inter body; Noto Sans Tamil fallback
- **Layout:** Full-width hero, card-based grid, generous whitespace. Bottom-nav PWA shell with persistent Today / Pray / Visit / Donate tabs on mobile
- **Tap targets:** Minimum 56x56px, single-thumb operable
- **Offline:** Service worker caches Visit page (hours + address + static map)
- **Admin content surfaces:** Each structured collection renders as cards/tables/badges — not markdown blobs. Menu items show dietary badges. Events show date chips. Canteen status shows a live open/closed indicator.

---

## 7. Accessibility / Performance Criteria

| Criterion | Target | Verification |
|-----------|--------|-------------|
| WCAG 2.1 AA | Full compliance | axe-core audit, zero critical/serious |
| Lighthouse Performance (mobile) | >= 90 | Static-first guarantees this |
| Lighthouse Accessibility | >= 95 | Automated + manual screen reader |
| 3G usability | < 3s load on slow 3G | WebPageTest "Emerging Markets" profile |
| 5-year-old Android | Functional on Chrome 90+ | BrowserStack: Samsung Galaxy A10 |
| Tamil rendering | Zero tofu, correct conjuncts | Test paragraph with ksha, shri, nri forms |
| Tap targets | Min 44x44px (56x56px primary nav) | Lighthouse audit |
| Colour contrast | >= 4.5:1 normal, >= 3:1 large | axe-core |
| Offline Visit page | Loads with no signal | Service worker test on airplane mode |

---

## 8. Risks & Mitigations

| # | Risk | Impact | Mitigation |
|---|------|--------|-----------|
| 1 | Keystatic schema complexity exceeds expectations | MEDIUM | Build schema prototype first (Task 1); validate admin UX with user before full build |
| 2 | 30-60s propagation too slow for canteen toggle | LOW | Acceptable for MVP; add Cloudflare Worker + KV as progressive enhancement if needed |
| 3 | Domain credentials for sriselvavinayakar.org unrecoverable | MEDIUM | Build on temp domain; recovery is post-pitch |
| 4 | No content steward emerges post-pitch | HIGH | Static-with-Keystatic degrades gracefully to "stale but functional" — same as current site but better |
| 5 | Photography insufficient for pitch | MEDIUM | Schedule volunteer photo day; use stock as interim |
| 6 | Keystatic/GitHub auth too complex for temple volunteer | MEDIUM | Test GitHub OAuth with actual non-technical volunteer in prototype phase (end of Task 1). If volunteer cannot complete account creation + OAuth grant in <10 minutes with written instructions, invoke fallback. **Fallback A (preferred):** Cloudflare Access on Keystatic admin route using email OTP — admin enters email, receives code, no GitHub account needed; Keystatic commits via service account. **Fallback B:** Degraded mode — developer or GitHub-fluent volunteer acts as proxy editor; acceptable as Phase 0 stopgap only. **Decision gate:** End of Task 1 prototype review; document outcome in project log. |

---

## 9. Compliance & Operations

- **Privacy Act 1988 (AU):** Privacy policy if contact form or newsletter collects PII. Explicit consent for newsletter.
- **Cookies:** Static map image for MVP (zero cookies, zero consent banner). Google Maps embed deferred.
- **Analytics:** Cloudflare Web Analytics (free, cookieless, no consent banner).
- **Backup:** Git repository IS the backup. All content is in the repo.
- **Hosting payment:** $0/mo Cloudflare Pages. Only domain (~$15/yr) requires renewal.

---

## RALPLAN-DR Summary (v3)

### Principles (5)

1. **Content model first, layout second** — Define typed schemas before designing pages. The admin editing experience drives the content structure; the public site renders it.
2. **Zero-maintenance resilience** — The stack must survive years of neglect without breaking. No server process, no DB, no renewal to forget.
3. **Mobile-first for the constraining user** — Elderly devotee on a 5-year-old Android in the temple carpark.
4. **Structured data over document dumps** — No PDFs as primary content. Every admin-editable content type has typed fields.
5. **Progressive enhancement** — Ship structured MVP, layer interactivity (booking, payments, bilingual toggle) only when proven.

### Decision Drivers (Top 3)

1. **Admin experience quality** — A non-technical temple volunteer must be able to update events, canteen status, menus, and notices through a browser UI with typed forms. This is the make-or-break requirement.
2. **Zero-server resilience** — No process to keep alive, no hosting to renew, no DB to back up. The 20-year survival pattern.
3. **Pitch-deck impact** — Persona C: the committee sees a modern, photography-forward site with structured content and thinks "this is what our temple deserves."

### Viable Options

| Option | Verdict | Rationale |
|--------|---------|-----------|
| A': Astro + Keystatic + Cloudflare Pages | **PRIMARY** | Keystatic with typed schemas IS the admin panel. Zero server. Zero cost. 30-60s propagation acceptable. |
| C: PocketBase headless CMS | **Viable but rejected** | Polished admin, but reintroduces server dependency — the exact failure mode we are designing against. |
| B: Static + KV hybrid | **Invalidated** | Split admin UI contradicts user requirement for one panel. |
| D: Supabase | **Invalidated** | Supabase Studio is a DB tool, not a content admin. Non-technical volunteer would struggle. |

---

## Task Flow (Implementation)

1. **Schema prototype** (8-10hrs) — Define all Keystatic collections with typed fields. Build a working admin locally. Validate with user: "Can you edit an event? Toggle canteen? Add a menu item?"
2. **Design + build public pages** (20-25hrs) — Sacred Modern design system. 5 pages binding to Keystatic collections. Responsive, PWA, offline Visit page.
3. **Content migration** (15-25hrs) — Developer extracts structured data from 30+ legacy PDFs and HTML pages into Keystatic collections (~12-18hrs). Named HASQ liaison validates Tamil text correctness and content accuracy across 2-3 review sessions (~3-5hrs user time). Buffer for re-keying complex PDFs (festival calendar with 50+ entries, full pooja price list): ~2-3hrs. **Blocker:** If no HASQ liaison is available for Tamil validation, defer all Tamil fields and ship English-only MVP.
4. **Deploy to temp domain + pitch prep** (4-6hrs) — Cloudflare Pages deploy. Temp domain DNS. Final Lighthouse/accessibility audit. Committee presentation materials.
5. **Post-approval cutover** (4-6hrs) — Recover sriselvavinayakar.org credentials. DNS cutover. Verify email on ssvk.org.au unaffected. Redirect old URLs.

**Total estimate:** 57-85hrs one-time build (revised upward from 50-70hrs to account for content migration complexity).

---

## Changelog

### v3 -> v3.1 (content-model + risk-mitigation patch)

**Content model (Section 4.5):** Added 4 missing schemas — About Page Content (singleton), Donation Details (singleton), Committee Members (collection), Site Configuration (singleton). Marked FAQ as deferred to Phase 1.5. Added bilingual field policy statement codifying when Tamil fields are required vs optional. Audited all existing schemas for consistency (no changes needed).

**Risk #6 — GitHub OAuth:** Replaced vague "test with volunteer" mitigation with a concrete decision gate (end of Task 1, 10-minute test) and two named fallbacks: Fallback A (Cloudflare Access email OTP, preferred) and Fallback B (proxy editor, Phase 0 stopgap only).

**Task 3 — Content migration:** Revised from 8-10hrs to 15-25hrs. Broke into developer extraction (~12-18hrs), HASQ liaison Tamil validation (~3-5hrs), and complex PDF buffer (~2-3hrs). Added blocker: no liaison = English-only MVP. Project total revised from 50-70hrs to 57-85hrs.

### v2 -> v3

Evaluated 4 architecture options; selected Option A' (Keystatic + Astro + Cloudflare Pages). Added Section 4.5 with 8 content type schemas. 5 MVP pages bind to structured collections. PDFs replaced. Persona C primary. Estimate 40-60hrs -> 50-70hrs.
