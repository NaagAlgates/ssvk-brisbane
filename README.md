# SSVK Brisbane — Sri Selva Vinayakar Koyil

Modern, mobile-first website for the Sri Selva Vinayakar Koyil (Ganesha Temple) in
South Maclean, Brisbane — a volunteer-run replacement for the original FrontPage site.

**Live demo**: https://ssvk-brisbane.pages.dev (pending Cloudflare Pages connection)
**Admin panel**: https://ssvk-brisbane.pages.dev/keystatic

## Tech stack — $0 forever

| Layer | Tool | Why |
|-------|------|-----|
| Framework | [Astro](https://astro.build) | Zero-JS by default, fast, content-first |
| CMS / Admin | [Keystatic](https://keystatic.com) (GitHub mode) | Open source, by Thinkmill (Sydney 🇦🇺), commits to this repo |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) | Utility-first, ~10KB shipped |
| Hosting | [Cloudflare Pages](https://pages.dev) | Free forever, unlimited bandwidth |
| Content | Markdown + YAML in this repo | Git history = backup |
| Auth (admin) | GitHub OAuth (via Keystatic GitHub App) | Free, no accounts to manage |

**Total recurring cost: $0/yr** (no domain registered yet; uses Cloudflare's `*.pages.dev` subdomain).

## Local development

```bash
npm install
npm run dev
```

- Public site: http://localhost:4321
- Admin panel: http://localhost:4321/keystatic

## Content model (12 collections / singletons)

Edit any of these via the `/keystatic` admin panel:

**Singletons** (single-instance content):
- Site Configuration — address, phone, email, social links
- About Page — history, Vinayakar info
- Donation Details — bank account info
- Opening Hours — daily temple hours
- Canteen Status — live open/close + today's hours

**Collections** (multiple items):
- Events — one-off and recurring
- Festival Calendar — yearly festivals with Tamil names
- Pooja & Services — list of services with prices in AUD
- Canteen Menu — items by category with photos
- Notices — temple announcements
- Newsletters — newsletter archive
- Committee Members — HASQ committee roster

## Deployment

Auto-deployed on push to `main` via Cloudflare Pages.
Build command: `npm run build`
Output directory: `dist`

## Project docs

See `docs/PLAN.md` for the full architectural decision record (ADR).
See `docs/OPEN_QUESTIONS.md` for outstanding decisions.

## Organisation

Built and maintained by volunteers for
**Hindu Ahlaya Sangam Queensland Inc. (HASQ)**.
