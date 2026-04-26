# Animation Pipeline — Standard Operating Procedure (SOP)

> **Read this entire document before writing any code.** This is the single source of truth for producing chapter-based animation videos.

---

## 0. Architecture Overview

This toolkit converts **script + audio + images → animated MP4 video**.

```
wk_inputs/                     ← You provide these
  chapterX_script.txt          ← Raw script text
  chapterX_scenes.txt          ← Scene-to-media mapping
  chapterX_timestamps.srt      ← SRT with per-chapter timing (starts at 00:00:00)
  chapterX_audio.wav           ← Voiceover audio
  chapterX_scene1.png          ← Scene images
  chapterX_scene2.png
  ...

  ↓ AI generates ↓

chapterX.html                  ← GSAP animation file (in toolkit root)

  ↓ render.py converts ↓

wk_outputs/
  chapterX_final.mp4           ← Final synced video
```

**Reference examples** are in `reference/ref_inputs/` (inputs) and `reference/ref_outputs/` (outputs). These files demonstrate a perfectly synced chapter build using 0-indexed timestamps.

---

## 1. Required Inputs

All input files go in `wk_inputs/`. The naming convention is `chapterX_` prefix.

### 1.1 Chapter Script (`chapterX_script.txt`)
Plain text of the chapter's voiceover. Used to understand *what is being said* at each moment.

### 1.2 Scene Mapping (`chapterX_scenes.txt`)
Maps script chunks to specific images. **Format:**

```
scene_name

Script text that plays during this scene...

=================================================================

next_scene_name

More script text...

=================================================================
```

- `scene_name` matches the image filename: `chapterX_scene_name.png`
- If the same scene name appears twice, the same image is reused
- Director's notes (overlays, emphasis) can be added as comments

### 1.3 Timestamps (`chapterX_timestamps.srt`)
Standard SRT format. **CRITICAL: timestamps for each chapter always start at `00:00:00,000`.**

```
1
00:00:00,000 --> 00:00:02,500
First line of dialogue.

2
00:00:02,500 --> 00:00:05,100
Second line of dialogue.
```

### 1.4 Audio (`chapterX_audio.wav`)
The voiceover audio file. Accepts any format MoviePy supports: `.wav`, `.mp3`, `.aac`, `.m4a`. Its timeline starts at `t=0` and matches the SRT.

### 1.5 Media Files (`chapterX_*.png`)
Images named to match the scene mapping. Recommended resolution: 1920×1080 or larger.

---

## 2. How to Generate the HTML

### 2.1 Start from the boilerplate
Copy `boilerplate.html` and rename to `chapterX.html`. Read `MODULES.md` for all available modules, animations, and colors.

### 2.2 The fadeOutPrevious() helper
**Every chapter needs this function.** Without it, scenes pile on top of each other. Paste it at the top of your `<script>`:

```js
function fadeOutPrevious(duration = 0.5) {
  return {
    render: () => {},
    animate: () => {
      document.querySelectorAll('#canvas > *:not(#play):not(#svg-layer)').forEach(el => {
        gsap.to(el, { opacity: 0, duration });
      });
    }
  };
}
```

### 2.3 Scene pattern
For each scene in the mapping file, follow this pattern:

```js
// Fade out whatever was on screen before
scene.add(fadeOutPrevious(), { at: FADE_TIME })

// Show the new scene image
scene.add(new Img({
  src: "wk_inputs/chapterX_scene1.png",
  x: 260, y: 140, width: 1400,
  animation: "fadeIn",      // entrance animation
  loop: "breathe"           // keeps image alive
}), { at: SCENE_START_TIME })
```

### 2.4 Timing rules

**Mapping SRT → timeline `at:` values:**

1. Find the SRT subtitle where the scene's script text begins
2. Use that timestamp (converted to ms) as the `at:` value
3. Convert using: `Scene.srtToMs("00:01:23,456")` → `83456`
4. **Or just calculate manually**: `(minutes × 60 + seconds) × 1000 + milliseconds`

**Fade-out timing:**
- Schedule `fadeOutPrevious()` **~500ms before** the next scene starts
- For rapid scene changes (sub-scenes), use `fadeOutPrevious(0.2)` for fast cuts

### 2.5 Canvas coordinate system

```
(0,0) ─────────────────────────── (1920,0)
  │                                    │
  │     Recommended image placement:   │
  │     x: 260, y: 140, width: 1400   │
  │     (centered with margin)         │
  │                                    │
  │     For smaller inset images:      │
  │     x: 360, y: 140, width: 1200   │
  │                                    │
(0,1080) ──────────────────────── (1920,1080)
```

- **Full-width scene image**: `x: 260, y: 140, width: 1400` — centered with breathing room
- **Inset/smaller image**: `x: 360, y: 140, width: 1200`
- **Title text**: auto-centered at top by default
- **Tagline text**: auto-centered at `y: 960` (near bottom)

### 2.6 Animation selection guide

| Situation | Recommended Animation | Loop |
|---|---|---|
| First scene appearing | `scalePop` or `fadeIn` | `breathe` |
| New topic / scene change | `slideInRight` or `slideInLeft` | `float` |
| Returning to a previous scene | `slideInLeft` or `fadeIn` | `breathe` |
| Quick sub-scene (< 5 seconds) | `scalePop` | `float` |
| Final scene | `fadeIn` | `breathe` |

**Every image MUST have a `loop` animation** (`breathe` or `float`). Static screens look dead.

### 2.7 End the scene
Always call `.play()` at the end:

```js
scene.play()
```

---

## 3. Synchronization Rules

1. **No offsets, no padding.** The SRT and audio both start at `t=0`. Use SRT timestamps directly.
2. If the SRT says dialogue starts at `00:00:19,900`, then `at: 19900`.
3. **Entrance animations take ~0.5s.** To have an image *fully visible* when the voice starts, trigger it **500ms earlier** than the SRT timestamp.
4. **Fade-outs take ~0.5s.** Trigger `fadeOutPrevious()` at least **500ms before** the next scene's `at:` time.

---

## 4. Rendering

### 4.1 Automatic (recommended)
With your HTML in the toolkit root and your audio + SRT in `wk_inputs/`, just run:
```bash
python run.py
```
`run.py` will:
- Auto-find the chapter HTML (ignores `boilerplate.html`)
- Auto-find the audio file in `wk_inputs/` (any format — `.wav`, `.mp3`, `.aac`, `.m4a`)
- Auto-calculate `--duration` from the last SRT timestamp + 5 seconds buffer

### 4.2 Manual overrides
Override any auto-detected value with flags:
```bash
python run.py --html chapterX.html              # specify which chapter HTML to use
python run.py --audio wk_inputs/chapterX.mp3   # specify audio file explicitly
python run.py --buffer 10                       # use 10s buffer instead of 5s
python run.py --output wk_outputs/final.mp4    # specify output path
```

### 4.3 Direct render (advanced)
If you need full control, call `render.py` directly:
```bash
python render.py --html chapterX.html --audio wk_inputs/chapterX_audio.mp3 --duration 96
```

### 4.4 Output
The final MP4 lands in `wk_outputs/chapterX_final.mp4`.

---

## 5. Complete Example

Given these inputs:
- Script says Scene 1 starts at `00:00:00,000` and Scene 2 at `00:00:20,000`
- Scene mapping has `chapter2_scene1` and `chapter2_scene2`

The generated HTML would be:

```js
const scene = new Scene()

function fadeOutPrevious(duration = 0.5) {
  return {
    render: () => {},
    animate: () => {
      document.querySelectorAll('#canvas > *:not(#play):not(#svg-layer)').forEach(el => {
        gsap.to(el, { opacity: 0, duration });
      });
    }
  };
}

// SCENE 1 — starts at 0ms
scene.add(new Img({
  src: "wk_inputs/chapter2_scene1.png",
  x: 260, y: 140, width: 1400,
  animation: "scalePop",
  loop: "breathe"
}), { at: 0 })

// Fade out Scene 1 before Scene 2
scene.add(fadeOutPrevious(), { at: 19500 })

// SCENE 2 — starts at 20,000ms
scene.add(new Img({
  src: "wk_inputs/chapter2_scene2.png",
  x: 260, y: 140, width: 1400,
  animation: "slideInRight",
  loop: "float"
}), { at: 20000 })

// Final fade
scene.add(fadeOutPrevious(1.0), { at: 45000 })

scene.play()
```

Render: `python render.py --html chapter2.html --audio wk_inputs/chapter2_audio.wav --duration 48`

---

## 6. Checklist Before Rendering

- [ ] Every scene image has `loop: "breathe"` or `loop: "float"`
- [ ] `fadeOutPrevious()` is called before each new scene
- [ ] `at:` values directly match the SRT timestamps (in ms)
- [ ] Fade-out is scheduled ~500ms before the next scene entrance
- [ ] `scene.play()` is called at the end
- [ ] `--duration` covers the full audio length + 3s buffer
- [ ] Image paths start with `wk_inputs/`

---

## 7. File Reference

| File | Purpose |
|---|---|
| `PIPELINE_SOP.md` | This file — the master instructions |
| `MODULES.md` | All available modules, animations, colors |
| `boilerplate.html` | Starting template for new chapters |
| `run.py` | **One-command renderer** — auto-detects HTML, audio, and duration |
| `render.py` | Low-level renderer called by `run.py` (advanced use only) |
| `reference/ref_inputs/` | Example input files |
| `reference/ref_outputs/` | Example output files (perfectly synced) |
