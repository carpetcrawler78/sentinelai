# SentinelAI -- Presentation Deck

> Status: Completed capstone / portfolio project. This is the presentation and
> static demo frontend for SentinelAI. The original backend deployment is no
> longer running (deliberately paused, not a bug) -- this deck runs standalone
> with static fallbacks and needs no live backend to present.

SentinelAI is a MedDRA Coding Assistance Tool that automates the classification
of adverse event reports from free text into standardized MedDRA Preferred Terms.
This repository contains the 14-slide presentation deck built with Vite + React
+ TypeScript.

Backend repository: https://github.com/carpetcrawler78/sentinelai-backend.
Documentation: https://carpetcrawler78.github.io/sentinelai-docs/

## Quickstart

```bash
git clone https://github.com/carpetcrawler78/sentinelai.git
cd sentinelai
npm install
npm run dev
```

Open `http://localhost:8080` in your browser (the dev server prints the exact
URL on startup).

## Navigation

| Key | Action |
|---|---|
| Arrow Right / Page Down | Next slide |
| Arrow Left / Page Up | Previous slide |
| 1 - 9 | Jump to slide N |
| Home / End | First / last slide |
| Pager buttons | Click prev/next |

## Demo slides

Slides 12 and 13 show static screenshots of the Grafana operations dashboard
and the reviewer workflow (the original live backend is no longer running).
Both slides render standalone, with no backend connection required -- no
blank screens, no errors.

## Roadmap

- Deploy the live presentation to Cloudflare Workers (wrangler.jsonc is
  already configured) and link it from the documentation site's Frontend page.
