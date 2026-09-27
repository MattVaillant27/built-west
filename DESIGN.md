# Built West — Layout and UX/UI

Direction: **a magazine, not a startup landing page.** Type does the heavy lifting, large serif headlines, generous whitespace, hairline rules, and colour used in full-bleed bands (cream → navy → forest) rather than in cards or gradients. People are the visual. No stock scenery, no scroll-jacking, no gimmicks.

## 1. Principles

1. **Editorial hierarchy.** Every section opens the same way: eyebrow label → serif headline → body. Readers learn the rhythm once.
2. **Listening first.** Once episodes exist, the play button is never more than one tap away.
3. **One ask per screen.** At launch that ask is "Get notified." Pitch-a-guest is the secondary ask.
4. **Quiet motion.** Hover underlines and subtle fades only. Honour `prefers-reduced-motion`.
5. **Orange is punctuation.** The logo arrow, the short rule under titles, focus rings and hover states. Never large fills.

## 2. Grid and spacing

- Max content width **1200px**, centred. Reading measure for long text (show notes, transcripts, About): **~68ch**.
- 12-column grid, 24px gutters on desktop; single column on mobile with **20px** side padding.
- Spacing scale (8px base): 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.
- Section padding: `clamp(64px, 10vw, 128px)` top and bottom.
- Breakpoints: 640 (large phone), 960 (tablet/small laptop), 1200 (desktop).

## 3. Type scale

Fluid sizes with `clamp()` so it scales smoothly from phone to desktop.

| Role | Font | Size (mobile → desktop) | Weight | Line height | Notes |
|---|---|---|---|---|---|
| Display | Source Serif 4 | 44 → 88px | 700 | 1.02 | Hero only. Tracking −0.02em |
| H1 | Source Serif 4 | 36 → 64px | 700 | 1.05 | Page titles, episode titles |
| H2 | Source Serif 4 | 28 → 44px | 600 | 1.1 | Section headlines |
| H3 | Source Serif 4 | 22 → 26px | 600 | 1.2 | Card titles |
| Pull quote | Source Serif 4 | 28 → 40px | 600 italic | 1.2 | Guest quotes |
| Lede | Montserrat | 18 → 21px | 400 | 1.55 | Intro paragraphs |
| Body | Montserrat | 16 → 17px | 400 | 1.65 | |
| Small / meta | Montserrat | 14px | 500 | 1.5 | Dates, durations (Coastal Blue) |
| Eyebrow | Montserrat | 12 → 13px | 600 | 1 | UPPERCASE, tracking 0.2em |

## 4. Colour by surface

| Surface | Background | Text | Secondary text | Rules/borders |
|---|---|---|---|---|
| Light (default) | Cream | Navy | Coastal Blue | Navy 12% / Sage |
| Dark | Navy | White | White 70% | White 15% |
| Depth | Forest | White | White 70% | White 15% |
| Raised card on cream | `#FBF9F4` (cream lifted) | Navy | Coastal Blue | Navy 8% hairline |

No automatic dark mode: the brand already alternates light and dark bands on purpose.

## 5. Components

**Header**
- Cream, 72px tall (64px on mobile). Horizontal logo left; nav right: Episodes · About · Contact, then **Get notified** button.
- On scroll: stays pinned, shrinks to 60px, gains a hairline bottom border. Swap to the wordmark on screens under 640px.
- Mobile: menu button opens a full-screen cream sheet with large serif nav links, the signup form, and socials.

**Buttons**
- Primary: navy fill, cream text, 2px radius, 48px tall, Montserrat 600 14px uppercase with 0.12em tracking. Hover: forest fill.
- On dark bands the primary inverts: cream fill, navy text.
- Secondary: text link with a 1px underline offset 4px; underline turns orange on hover.
- The brand arrow (↖ northwest, as in the logo) can appear as a small glyph on primary CTAs as a signature detail.

**Email signup**
- Inline: email input + button on one line (stacks on mobile). Input: transparent, 1px navy bottom border only, 48px tall.
- Microcopy under it: "Sign up for updates." (never promise a single email)
- States: loading (button text "Sending…"), success (replaces the form: "You're on the list."), error (inline, under the field).
- Netlify Forms with a honeypot field; no captcha.

**Episode card** (index + "more episodes")
- Guest portrait 4:5, eyebrow `EPISODE 07 · 58 MIN`, serif title (H3), `Guest · Role, Company` in meta style.
- Whole card is one link; hover darkens the photo slightly and underlines the title.

**Episode list row** (Episodes index, editorial "table of contents")
- Large serif episode number | title + guest line | date and duration | play icon. Hairline between rows.

**Episode header block** (the signature pattern)
- Eyebrow → H1 title → 48px orange rule → `Guest · Role, Company` → date · duration.

**Player**
- Riverside embed inside a navy panel so it looks consistent whatever the embed's own styling. "Listen on" row beneath: Apple Podcasts, Spotify, YouTube, RSS.

**Pull quote**
- Serif italic, orange opening mark, attribution in eyebrow style.

**Footer**
- Navy. Left: stacked navy logo + tagline "The people building BC tech." (don't repeat the hero headline). Middle: nav links. Right: compact signup. Bottom row: © Built West (plus socials once added).

**Focus and accessibility**
- 2px orange focus ring with 2px offset on every interactive element. Skip-to-content link. 44px minimum touch targets. All forms labelled (visually hidden labels where the design hides them).

## 6. Page layouts

Clickable wireframes of every page: `design/wireframes.html` (rebuild with `python3 design/build_wireframes.py`; home sections and base CSS come from `design/wireframe-home.html`).

### Home — coming soon (launch)

**Current section order:** hero → What it is / Who it’s for / What to expect → host strip → episode preview card (“Episode 01 · Recording now”; becomes the latest episode once `launched` is true) → pitch band → footer. The navy format band was removed. (The diagram below predates this swap.)

```
┌──────────────────────────────────────────────────────────────┐
│ [Built West — A BC Tech Podcast]     Episodes About Contact [Get notified] │  cream header
├──────────────────────────────────────────────────────────────┤
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│  full-bleed coast photo
│ COMING SOON · A BC TECH PODCAST         (scene shows through) │  navy overlay: ~88% on the
│ Long-form conversations                                       │  left behind text → 0% on
│ with the people                                               │  the right. Cream text.
│ building BC tech.                                             │  ~88vh tall, max 820px
│ Lede: one guest, one unhurried conversation…                  │
│ [ your@email.com__________ ] [GET NOTIFIED ↖]  (cream button) │
│ Sign up for updates.                                          │
├──────────────────────────────────────────────────────────────┤
│ THE FORMAT                                  ◌◌ topo contours  │  navy band with
│ One guest. One unhurried conversation.                        │  topographic contour
│ On video, wherever they are in BC.       (full width)         │  lines + fine grain
│ ──────────────────────────────────────────────────────────── │
│ 1 guest            About an hour       Watch or listen        │  three format facts: titles only,
│                                                              │  Montserrat bold (wording TBC)
├──────────────────────────────────────────────────────────────┤
│ ── WHAT IT IS      ── WHO IT'S FOR      ── WHAT TO EXPECT     │  cream, 3 columns
├──────────────────────────────────────────────────────────────┤
│ YOUR HOST [photo] Matt Vaillant · short bio · More about →    │  cream host strip (latest-episode
│                                                              │  card appears above it once live)
├──────────────────────────────────────────────────────────────┤
│ KNOW SOMEONE?                                                 │  forest band
│ Who in BC tech is worth an hour?   (full-width headline)      │
│ [Pitch a guest]                                               │
├──────────────────────────────────────────────────────────────┤
│ footer (navy, stacked navy logo)                              │
└──────────────────────────────────────────────────────────────┘
```

**Hero image:** cropped from the right side of `social banner image.png` (sunset peaks, islands, water; the banner's baked-in logo is cropped out, and its white contour lines were removed by retouching — faint traces may remain at 100% zoom). Working file: `design/assets/hero-coast.jpg`. Replace with a clean original (no logo, no lines) if one exists. About 1235×765 and sharp. A larger original of this scene would still be better for very wide screens. Served as AVIF/WebP with a JPEG fallback, `fetchpriority="high"`.

**Texture:** topographic contour lines (cream at ~9% opacity, echoing the contour lines in the social banner) plus a fine grain layer (~7%). Used on navy bands and panels only. The forest "Know someone?" pitch band stays flat green on every page; never on cream.

Mobile: hero overlay becomes a top-to-bottom gradient (lighter at the top so the peaks show), format facts and three columns stack, forest band button goes full width.

### Home — after launch
Hero becomes **Latest episode**: left, episode header block + play button + "Listen on"; right, guest portrait 4:5. Below: "Recent episodes" (3-up cards) → pull quote band (navy) → "Who it's for" → pitch band → footer.

### Episodes index `/episodes`
- Page title "Episodes" + one-line description + subscribe links.
- Latest episode featured large (card, horizontal), then the editorial list rows.
- Empty state at launch: "The first conversations are being recorded now." + signup.
- Later (20+ episodes): filter by topic/sector, simple search.

### Episode page `/episodes/[slug]`

```
┌──────────────────────────────────────────────────────────────┐
│ navy band                                                     │
│ EPISODE 07 · 12 NOV 2026 · 58 MIN          ┌─────────────┐   │
│ Episode title in serif,                    │   guest     │   │
│ up to two lines                            │   portrait  │   │
│ ───                                        │   4:5       │   │
│ Guest Name · Role, Company                 └─────────────┘   │
│ [▶ Play episode]                                              │
├──────────────────────────────────────────────────────────────┤
│ Riverside player panel (navy) + Listen on: Apple Spotify YouTube RSS │
├──────────────────────────────────────────────────────────────┤
│ cream, two columns                                            │
│ ┌ main 8 cols ────────────────┐  ┌ sidebar 4 cols (sticky) ┐ │
│ │ Lede summary                │  │ ABOUT THE GUEST          │ │
│ │ IN THIS EPISODE             │  │ name, bio, links         │ │
│ │ 00:00 Timestamped chapters  │  │ SHARE                    │ │
│ │ Pull quote                  │  │ copy link, LinkedIn, X   │ │
│ │ LINKS MENTIONED             │  └──────────────────────────┘ │
│ │ TRANSCRIPT [expand ▾]       │                                │
│ └─────────────────────────────┘                                │
├──────────────────────────────────────────────────────────────┤
│ ← Previous episode            Next episode →                   │
│ More episodes (3 cards)                                        │
│ Signup band · footer                                           │
└──────────────────────────────────────────────────────────────┘
```

Mobile order: header block → portrait → player → summary → chapters → guest bio → transcript → next/prev.

### About `/about`
Cream hero with H1 "Why Built West" and lede → the show (format details: length, cadence, remote/in person) → host section (photo 4:5 + bio, split layout) → navy statement band → pitch/contact prompt.

### Contact `/contact`
H1 "Get in touch". Two-option switch at top: **Pitch a guest** (default) / **Something else**.
- Pitch: your name, email, guest name, their role and company, why they're worth an hour (textarea), optional link.
- General: name, email, message.
- Success replaces the form with a short thank-you in the brand voice.
- Side column: direct email address and social links.

### 404
Navy page, large serif "Wrong turn." with the brand arrow, link home and to episodes.

## 7. Imagery

- **Guest portraits** carry the site: consistent 4:5 crop, natural light, consistent treatment. Optional duotone treatment (navy/cream) for the list view so mixed-quality headshots look like a set.
- **West coast scene:** used once, as the home hero background (with navy overlay), plus the social share image. Not repeated elsewhere, so it stays special.
- **Until guests exist:** typographic layouts, the coast hero and the contour texture carry the page.
- Episode social/OG image: the 1280×720 thumbnail layout from the brand guide (navy left with title, portrait right), generated per episode at build time.

## 8. Microcopy (voice samples)

- Signup button: "Get notified"
- Signup success: "You're on the list. We'll keep you posted."
- Pitch success: "Thanks. We read every one."
- Empty episodes: "The first conversations are being recorded now."
- 404: "Wrong turn. Head west instead." → Home
- Footer tagline: "Long-form conversations with the people building BC tech."
