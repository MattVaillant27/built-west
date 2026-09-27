# Built West — Site Plan

Goal: launch builtwest.ca as a **coming-soon** site that collects subscribers and guest pitches, with the full episode structure already built so episodes can be published without a redesign.

## Sitemap

| Page | Path | At launch |
|---|---|---|
| Home | `/` | Coming-soon hero, what the show is, who it's for, email signup |
| Episodes | `/episodes` | Built, shows "First episodes coming soon" empty state |
| Episode | `/episodes/[slug]` | Template ready: player, guest, show notes, transcript |
| About | `/about` | The show, the host, why BC tech |
| Pitch a guest / Contact | `/contact` | Netlify form: suggest a guest, or general contact |
| 404 | `/404` | On-brand |

Global: header (horizontal logo, nav: Episodes · About · Contact, "Get notified" button), footer (monogram, listen-on links once live, social, © Built West).

## Home (coming soon)

1. **Hero** (cream) — stacked logo, headline "Long-form conversations with the people building BC tech.", one line of supporting copy, email signup, "Coming soon" eyebrow.
2. **What it is / Who it's for / How it sounds** — the three-column editorial block from the brand guide, reworded for listeners.
3. **Format strip** (navy) — "One guest. One unhurried conversation. Recorded in person."
4. **Pitch a guest** (forest) — short prompt + link to `/contact`.
5. Footer.

Once episodes launch: hero switches to latest episode, plus a "Recent episodes" grid.

## Episode template

- Eyebrow `EPISODE 01` → Tiempos title → orange rule → `Guest · Role, Company`
- Riverside embed player + "Listen on" links (Apple, Spotify, YouTube)
- Guest photo and bio, show notes with timestamps, links mentioned, full transcript (collapsible)
- Structured data: `PodcastEpisode` schema; per-episode OG image (1200×630, the thumbnail layout from the guide)

Episode frontmatter: `number, title, slug, date, guest {name, role, company, photo, links}, summary, riversideEmbed, listenLinks, duration, transcript`.

## Build phases

### Phase 1 — Foundation ✅ (2026-09-27)
- Scaffold Astro project, `netlify.toml`, folder structure
- Copy logo assets into `public/` / `src/assets/`; generate favicon set (`.ico`, 32px, 180px apple-touch, 512px) from app icons and a 1200×630 OG image from the social banner
- Design tokens (colours, type scale, spacing), fonts (Montserrat self-hosted; serif fallback behind `--font-display`)
- Base layout, header, footer, SEO component (title, description, OG, canonical to builtwest.ca)

### Phase 2 — Coming-soon launch ✅ built (2026-09-27); copy still has placeholders
- Home, About, Contact, 404
- Netlify Forms: `notify` (email) and `pitch` (name, email, guest suggestion, why)
- Episodes index with empty state; episode template built against one sample entry (draft, not published)
- Copy pass in the brand voice

### Phase 3 — Deploy
- Connect repo to Netlify, point builtwest.ca DNS, HTTPS
- Form notifications to Matt's email; spam honeypot
- Analytics (Netlify Analytics or Plausible — privacy-friendly, no cookie banner needed)
- Lighthouse pass: 95+ across the board

### Phase 4 — Episodes live
- Riverside: confirm RSS feed / embed method; either auto-import episodes at build time from RSS or add them by hand
- Home switches from coming-soon to latest-episode layout
- Podcast directory links, RSS link in footer
- Move the email list to a proper newsletter tool if needed (Buttondown, Beehiiv, or ConvertKit)

## Open items

- [x] Colour logo variants (cream / navy / green / landscape) — added
- [x] Display font: Source Serif 4 as a Tiempos stand-in (swap later if licensed)
- [ ] Host name, bio and photo for About
- [ ] Social handles (for footer + OG)
- [ ] Email list destination (Netlify Forms export for now vs. newsletter tool now)
- [ ] Riverside hosting details: RSS feed URL, embed code format
- [ ] Guest photography approach (in-person shoots vs. supplied headshots)
