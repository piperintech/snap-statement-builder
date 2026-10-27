# SNAP Statement Builder

**A guided form that turns a recorded statement into a clean, consistent claim note, ready to paste into Modotech with one click.**

[Live demo](https://piperintech.github.io/snap-statement-builder/) · Built for SNAP Insurance Service LLC

---

## The problem

Every adjuster wrote statement notes their own way. Key details (police report, vehicle damage, who was driving) were sometimes missing, and notes were hard to scan when a claim changed hands.

## What it does

- Sections that follow the order of a real statement: **Caller & loss basics → Scene & police → Insured vehicle → Other vehicle(s)/property → Narrative & extras**
- Add as many vehicles as needed
- Generates a formatted **Modotech note** live as you type
- **Copy** button → paste straight into the claims system

## Stack

Single-file HTML/CSS/JavaScript · no backend, nothing stored · GitHub Pages

## Embed in GitBook

Use `/embed` in GitBook and paste the live URL, or use an HTML block:

```html
<iframe src="https://piperintech.github.io/snap-statement-builder/"
        width="100%" height="960" style="border:0;border-radius:12px"></iframe>
```

---

Built by **Manuela Gonzalez Piper** · Product & AI · [GitHub](https://github.com/piperintech)

---

## AI Statement Builder (`/ai/`)

Paste or load a RingCentral call transcript (Spanish, English or mixed), pick the template and who is giving the statement, and Claude fills the SNAP statement template in English. Every field comes back **answered**, **unclear** (with the raw transcript text quoted) or **not asked**, plus coverage flags, missed questions, and a paste-ready Modotech note.

- `ai/index.html`: the page
- `ai/snap-knowledge-base.json`: SNAP vocabulary and patterns, loaded automatically into every fill
- `netlify/edge-functions/statement-fill.js`: streams Claude's answer (fills take 20-60 s, so it streams to avoid function timeouts)

**Runs on Netlify only** (GitHub Pages can't hold the API key). Connect this repo in Netlify, set `ANTHROPIC_API_KEY` under Site configuration > Environment variables, and open `https://<your-site>.netlify.app/ai/`.

Use test calls or redacted transcripts until compliance approves real claim data.
