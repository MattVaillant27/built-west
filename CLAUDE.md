# Built West — builtwest.ca

Website for **Built West, a BC tech podcast**: long-form video interviews with the people building BC tech, recorded remotely (in person when possible). Don't describe the show as "recorded in person". The site launches as **coming soon**; episodes follow later.

## Source of truth

- **Logos:** use the supplied files in `logos/Logos and Icons/` as-is. They are canonical. Where they differ from the PDF (e.g. the orange i-dot, letter spacing), **the files win**. More logo variants (cream/reversed) will be added by Matt.
- **Brand guidelines PDF** (`Built West Brand Guidelines 09-26-2026.pdf`): use it for **voice, tone, audience, palette and type direction**. Do not enforce its specific rules (orange quotas, logo-usage rules, etc.); the PDF will be revised to match the logo files.

## Voice

- Editorial and confident: closer to a publication than a startup.
- Premium, never corporate. No hype, no buzzwords, no exclamation marks.
- Proudly West Coast without leaning on postcard mountains. People are the visual, not scenery.
- Short, declarative sentences. Example headline register: "Long-form conversations with the people building BC tech."
- Audience: seasoned founders and execs who want the person behind the title; investors who want to hear from operators; first-time founders who want to be in the room with both.

## Design tokens

| Token | Hex | Use |
|---|---|---|
| `--navy` | `#0B1F2D` | Primary ink, dark grounds |
| `--cream` | `#F6F2E9` | Primary light ground |
| `--forest` | `#1F3D32` | Secondary dark ground |
| `--coastal` | `#4F6D7F` | Captions, meta text (OK for body on cream) |
| `--sage` | `#7A9488` | Dividers, tints — decorative only, not text |
| `--orange` | `#C3541B` | Accent, used sparingly; large text/UI only on cream or navy |
| `--white` | `#FFFFFF` | **All text on navy and forest** (matches the logo files' white lettering); `--white-70` for secondary text. Cream is a background colour only |

Layouts are mostly cream and navy, forest for depth, orange as a single highlight.

**Type**
- Display: **Tiempos Headline** (Semibold/Bold) for headlines, episode titles, pull quotes. Needs a Klim *web* licence. Until then use **Source Serif 4** (display optical size, weights 600/700) — the closest free match to Tiempos Headline. Set it through a single `--font-display` CSS variable so Tiempos can be swapped in one place later.
- Body/UI: **Montserrat** (400–700) for body, nav, labels, guest names. Small labels and eyebrows: uppercase, wide letter-spacing (~0.2em).
- Signature pattern: eyebrow label ("EPISODE 01") → serif title → short orange rule → "Guest name · Role, Company".

## Logo usage on the site

- Header: `built-west-horizontal.svg` (wordmark + descriptor) or `built-west-wordmark.svg` on small screens.
- Hero / coming-soon: `built-west-stacked.svg`.
- Favicon / touch icons / social avatars: monogram and app icons (`svgs/built-west-app-*.svg`, PNGs at 2048px).
- Open Graph / social share: `social banner image.png` (2055×765) — crop/export a 1200×630 version.
- Colour variants live in `logos/Logos and Icons/built-west-all-colour-logos/` — `{stacked,horizontal,wordmark}-{cream,navy,green,landscape}` in SVG + PNG. Each includes a **full-bleed background rectangle** in its colour, so use the variant that matches the section it sits on: `-cream` on cream, `-navy` on navy, `-green` on forest. `-landscape` (photo background) is for social/OG use only. Dark variants use white `#FFFFFF` lettering (as supplied).
- The transparent, navy-ink files in `built-west-logo-variations/` are for anywhere a background rectangle would show (e.g. over a tinted card).

## Stack

- **Astro** static site, deployed on **Netlify** (connected later). Domain: **builtwest.ca**.
- Episodes: recorded/hosted on **Riverside**. Episodes are an Astro content collection so pages work with zero episodes; later, populate from the Riverside RSS feed if one is available, otherwise add entries by hand.
- Forms: **Netlify Forms** (email signup, pitch-a-guest, contact).
- No client-side framework unless needed. Plain CSS with custom properties. Mobile first.

## Project structure and commands

- `npm run dev` (http://localhost:4321) · `npm run build` → `dist/` · `npx astro check` for types. Astro v7.
- `src/site.ts` — site settings: email, host, nav, social and listen links (empty = hidden), and the `launched` flag (flip to `true` after episode one; the home hero and teaser switch to the latest episode).
- `src/styles/global.css` — design tokens and shared classes (`.eyebrow`, `.statement`, `.btn`, `.tex`, `.card`, `.field`…). Page-specific styles live in each `.astro` file.
- `src/layouts/Base.astro` — head/SEO, header, footer, and the Netlify Forms AJAX handler for any `form[data-ajax]`.
- `src/components/` — Header, Footer, SignupForm, PitchBand, Portrait, EpisodeRow, EpisodeCard.
- `src/content/episodes/*.md` — one file per episode; schema in `src/content.config.ts`. Copy `_sample-episode.md` (files starting `_` are ignored). `draft: true` hides an episode.
- Forms (Netlify): `notify` (email), `pitch`, `contact`. They only submit on Netlify; locally they show the error state.
- `design/` — wireframes and source assets (not deployed). `public/` — favicons, OG image, `topo.svg` texture.

## Conventions

- Accessibility: WCAG AA contrast, semantic HTML, visible focus states, alt text on every guest photo.
- Performance: static HTML, optimized images via `astro:assets`, self-hosted fonts with `font-display: swap`.
- Copy lives in content files, not hard-coded in components, where practical.
