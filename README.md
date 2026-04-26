# MotionForge — Automated Animation Pipeline

Convert a **script + audio + scene images → animated HTML → rendered MP4 video**, automatically.

---

## How It Works

```
You provide inputs in wk_inputs/
        ↓
Jules (AI agent) reads AGENTS.md and generates chapterX.html
        ↓
Push/merge to main triggers GitHub Actions
        ↓
render.py runs: Playwright captures animation → MoviePy stitches audio
        ↓
Download chapterX_final.mp4 from GitHub Actions artifacts
```

Or skip the cloud and run locally: `python run.py`

---

## Repo Structure

```
toolkit/
│
├── wk_inputs/                  ← DROP YOUR INPUTS HERE
│   ├── chapterX_script.txt
│   ├── chapterX_scenes.txt
│   ├── chapterX_timestamps.srt
│   ├── chapterX_audio.mp3
│   ├── chapterX_scene1.png
│   ├── chapterX_scene2.png
│   └── ...
│
├── wk_outputs/                 ← RENDERED VIDEO APPEARS HERE
│   └── chapterX_final.mp4
│
├── reference/                  ← EXAMPLE FILES (read-only reference)
│   ├── ref_inputs/             ← Example input files (script, SRT, images)
│   └── ref_outputs/            ← Example output (HTML + MP4)
│
├── modules/                    ← Animation modules (DO NOT EDIT)
│   ├── arrow.js
│   ├── card.js
│   ├── effects.js
│   ├── shapes.js
│   ├── tech-elements.js
│   └── text-elements.js
│
├── scene/                      ← Core engine (DO NOT EDIT)
│   ├── animate.js
│   └── scene.js
│
├── styles/                     ← Global styles (DO NOT EDIT)
│   ├── base.css
│   └── palette.css
│
├── .github/workflows/
│   └── render-on-merge.yml     ← Auto-renders on push to main
│
├── boilerplate.html            ← Template for new chapters
├── chapterX.html               ← Generated animation (created by Jules/AI)
├── AGENTS.md                   ← Instructions for Jules AI agent
├── MODULES.md                  ← Full module reference
├── PIPELINE_SOP.md             ← Detailed pipeline instructions
├── render.py                   ← Core render script
└── run.py                      ← One-command local runner
```

---

## Required Inputs

Place all files in `wk_inputs/` using the `chapterX_` naming convention.

| File | Example Name | Description |
|---|---|---|
| Script | `chapter1_script.txt` | Full plain-text voiceover script |
| Scene mapping | `chapter1_scenes.txt` | Maps script chunks to image names |
| Timestamps | `chapter1_timestamps.srt` | SRT file — **must start at `00:00:00,000`** |
| Audio | `chapter1_audio.mp3` | Voiceover audio (`.wav`, `.mp3`, `.aac`, `.m4a`) |
| Scene images | `chapter1_scene1.png` | One image per scene — `1920×1080` recommended |

### Scene Mapping Format (`chapterX_scenes.txt`)

```
chapter1_scene1

Script text that plays during this scene...

=================================================================

chapter1_scene2

More script text for this scene...

=================================================================
```
- Section name = image filename without `.png`
- Same name used twice = same image reused

### Timestamp Format (`chapterX_timestamps.srt`)

```
1
00:00:01,029 --> 00:00:03,500
First line of dialogue.

2
00:00:03,500 --> 00:00:06,200
Second line of dialogue.
```
> ⚠️ Timestamps MUST start at `00:00:00,000`. Do not use a global SRT with offsets.

---

## Running the Pipeline

### Option A — Local (Recommended for testing)

```bash
# Just run this — everything is auto-detected
python run.py
```

`run.py` will automatically:
- Find the chapter HTML in the repo root
- Find the audio file in `wk_inputs/`
- Calculate duration from the last SRT timestamp + 5s buffer
- Output the MP4 to `wk_outputs/`

**Override any value:**
```bash
python run.py --html chapterX.html
python run.py --audio wk_inputs/chapterX_audio.mp3
python run.py --buffer 10
python run.py --output wk_outputs/my_output.mp4
```

### Option B — GitHub Actions (Automatic on push)

1. Push `chapterX.html` to `main`
2. The `render-on-merge.yml` workflow triggers automatically
3. It auto-detects the audio and calculates duration from the SRT
4. Download the rendered `.mp4` from the **Actions → Artifacts** tab

**Manual trigger:** Go to `Actions → Render Animation to MP4 → Run workflow` and fill in the fields.

### Option C — Direct (Advanced)

```bash
python render.py --html chapterX.html --audio wk_inputs/chapterX_audio.mp3 --duration 96
```

---

## Using Jules (Google AI Agent) to Generate HTML

1. Ensure all inputs are in `wk_inputs/` with correct naming
2. Assign Jules a GitHub Issue with this prompt:

```
Generate chapter2.html using:
- wk_inputs/chapter2_script.txt
- wk_inputs/chapter2_scenes.txt
- wk_inputs/chapter2_timestamps.srt
- wk_inputs/chapter2_scene1.png
- wk_inputs/chapter2_scene2.png
```

Jules reads `AGENTS.md` automatically and knows exactly what to produce.

3. Jules opens a PR with the generated `chapter2.html`
4. You review and merge → GitHub Actions renders the MP4 automatically

---

## Output

| Location | File | Description |
|---|---|---|
| `wk_outputs/` | `chapterX_final.mp4` | Final rendered video (local) |
| GitHub Actions → Artifacts | `rendered-video-N` | Downloadable from Actions tab (cloud) |

---

## Prerequisites

```bash
pip install playwright moviepy
playwright install chromium
playwright install-deps chromium
```

Python 3.9+ required.

---

## Quick Reference

| File | Purpose |
|---|---|
| `AGENTS.md` | Instructions for Jules AI agent |
| `MODULES.md` | All animation modules, parameters, colors |
| `PIPELINE_SOP.md` | Full detailed pipeline instructions |
| `reference/ref_inputs/` | Example of correctly formatted inputs |
| `reference/ref_outputs/` | Example generated HTML (`chapter1.html`) |
