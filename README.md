# SentinelAI -- Presentation Deck

SentinelAI is a MedDRA Coding Assistance Tool that automates the classification
of adverse event reports from free text into standardized MedDRA Preferred Terms.
This repository contains the 14-slide presentation deck built with Vite + React.

## Quickstart

```bash
git clone https://github.com/carpetcrawler78/sentinelai-capstone-v5.git
cd sentinelai-capstone-v5
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

## Live-demo slides (optional)

Slides 12 and 13 show a Grafana operations dashboard and an interactive reviewer
demo. Without a tunnel, both fall back to static content automatically -- no
blank screens, no errors.

For live data (requires access to the Hetzner server):

```bash
ssh -N -L 8000:127.0.0.1:8000 -L 3000:127.0.0.1:3000 cap@<server>
```

Then reload the browser. Slide 12 will switch to the live Grafana dashboard
once the health check on `localhost:8000` succeeds. A toggle button lets you
switch between live and screenshot views manually.
