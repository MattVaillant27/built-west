# Automated episodes: Riverside feed → reviewed pull request → live page

_Saved for later (not yet built). Agreed with Matt on 2026-09-28: Riverside hosting, review each episode before it goes live._

## Context
Matt records and hosts Built West on Riverside and doesn't want to add episodes or transcripts by hand. Riverside hosting publishes an (audio-only) RSS feed and generates transcripts; it's unconfirmed whether the feed includes the standard `<podcast:transcript>` tag. Goal: when an episode is published on Riverside, the site automatically drafts a complete episode page (summary, guest, chapters, pull quote, transcript) and opens a GitHub **pull request for Matt to review**; one click on **Merge** publishes it. The first merged episode flips the home page to "Latest episode" automatically.

## How it works (per new episode)
1. **Hourly GitHub Action** reads the Riverside RSS feed and finds items whose `guid` isn't already on the site or in an open episode branch.
2. **Transcript:** if the item has `<podcast:transcript>` (VTT/SRT/JSON), download it; otherwise send the audio (`<enclosure>` URL) to **AssemblyAI** with speaker labels.
3. **Claude drafts the page** from the show notes + timestamped transcript, returning structured JSON: summary, guest {name, role, company, bio, links}, chapters (timestamps from the transcript), pull quote, links mentioned, and which speaker is Matt vs the guest. The quote is **checked to be verbatim** in the transcript; if not, it's dropped.
4. **Writes** `src/content/episodes/NN-slug.md` (frontmatter + speaker-labelled transcript) and downloads the episode artwork as the guest photo when it differs from the show cover.
5. **Opens a PR** on branch `episode/<guid-slug>` with a review checklist. Netlify automatically builds a **Deploy Preview** link for the PR, so Matt sees the real page before merging. GitHub emails him.
6. **Merge** → Netlify publishes. Episodes already on the site are never touched again.

## Changes

### Site (small)
- `src/content.config.ts` — add `guid: z.string().optional()` and `audioUrl: z.url().optional()`.
- `src/pages/episodes/[slug].astro` — player: Riverside iframe if `riversideEmbed`, else a styled native `<audio controls preload="none">` from `audioUrl` inside the existing navy `.player` panel; keep "Player coming soon" fallback.
- `src/pages/index.astro` — `live` becomes "at least one published episode" (drop the manual flag); remove `launched` from `src/site.ts` and update the CLAUDE.md note.
- Reuse: `getEpisodes()`, `pad()`, `formatDate()` in `src/lib/episodes.ts`; `_sample-episode.md` shows the frontmatter shape the script must emit.

### Sync script — `scripts/sync-episodes.mjs` (Node 24, run in CI)
- Deps (devDependencies): `fast-xml-parser` (RSS), `yaml` (frontmatter), `@anthropic-ai/sdk`. AssemblyAI via plain `fetch` (submit + poll).
- Model: current Claude model via the SDK with a JSON-schema tool/structured output (load the `claude-api` skill when implementing for exact model ID and API shape).
- Mapping: number = `itunes:episode` (fallback: count + 1); date = `pubDate`; duration from `itunes:duration` → "58 min"; title = feed title; `audioUrl` = enclosure; skip `itunes:episodeType` = trailer/bonus unless numbered.
- Idempotency: skip if `guid` exists in any episode file, or remote branch `episode/<slug>` exists (`git ls-remote`).
- Flags: `--dry-run` (write files, no git/PR), `--feed <path-or-url>` (override feed), `--limit 1`.
- Transcript format in the Markdown body: paragraphs prefixed `**Matt Vaillant:**` / `**Guest Name:**`, with `[mm:ss]` markers every few paragraphs.

### Workflow — `.github/workflows/sync-episodes.yml`
- Triggers: `schedule: '0 * * * *'` + `workflow_dispatch` (a "Run now" button).
- Permissions: `contents: write`, `pull-requests: write`. Steps: checkout → `npm ci` → `node scripts/sync-episodes.mjs` → for each new episode: branch, commit, push, `gh pr create` (gh is preinstalled on runners).
- PR body: guest line, summary, pull quote, chapters, and a checklist: *guest name/role spelled right · quote sounds right · photo OK · open the Deploy Preview*.
- Failures email Matt via GitHub's standard workflow-failure notification.

## One-time setup (Matt, ~15 min; Claude guides each)
1. **Riverside:** Hosting → ⋯ → **Copy RSS URL** → send it to Claude (stored as repo variable `RIVERSIDE_RSS_URL`).
2. **Anthropic API key** (console.anthropic.com) → GitHub repo → Settings → Secrets and variables → Actions → secret `ANTHROPIC_API_KEY`. ~a few cents per episode.
3. **AssemblyAI key** (only if Riverside's feed has no transcript tag; check the feed first) → secret `ASSEMBLYAI_API_KEY`. ~US$0.15–0.40 per hour of audio.
4. GitHub → Settings → Actions → General → Workflow permissions: **Read and write** + **Allow GitHub Actions to create and approve pull requests**.
5. Netlify Deploy Previews are on by default for PRs — confirm nothing needed.

## Matt's routine after setup
Publish on Riverside → within the hour, GitHub email "New episode: …" → open the Deploy Preview → edit anything in the PR if needed (or ask Claude) → **Merge**.

## Verification
- `npx astro check` + `npm run build` pass with the schema/player/home changes (no episodes → still "Coming soon").
- **Dry run against a real public feed** that has transcripts (and one without, to exercise AssemblyAI) with `--dry-run --limit 1`: generated `.md` validates against the schema, builds, and the episode page renders — checked in the browser; files then discarded. Costs < $1.
- Once Matt's Riverside feed exists: run the workflow via **Run now**, confirm a PR opens with a Deploy Preview, review together, merge, and confirm the page is live and the home page switched to "Latest episode".
- Re-run the workflow: confirms no duplicate PR is created.
