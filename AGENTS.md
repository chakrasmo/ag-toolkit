# AGENTS.md —  Animation Toolkit

> Read this entire file before doing anything. This is the single source of truth for how this repo works and what you are expected to produce.

---

## What This Repo Is

This toolkit converts **script + audio + scene images → animated HTML → rendered MP4 video**.

You are responsible for generating the HTML animation file. A separate automated system handles rendering.

---

## Repo Structure

```
toolkit/
  modules/          ← Animation modules (DO NOT EDIT)
    arrow.js        ← All arrow/connector types
    card.js         ← Rounded rect cards + CardRegistry
    effects.js      ← Icons, sparkles, counter, dotflow, images
    shapes.js       ← Circle, diamond, cylinder, speech bubble
    tech-elements.js← Browser window, code block
    text-elements.js← Title, tagline, label, badge, floating text
  scene/            ← Core engine (DO NOT EDIT)
    animate.js      ← All animation functions
    scene.js        ← Timeline manager
  styles/           ← Global styles (DO NOT EDIT)
    base.css        ← Canvas 1920x1080, font
    palette.css     ← All color variables
  reference/
    ref_inputs/     ← Example input files showing expected format
    ref_outputs/    ← Example generated HTML (chapter1.html)
  wk_inputs/        ← YOUR INPUTS GO HERE — ALL files use chapterX_ prefix:
                       chapterX_script.txt, chapterX_scenes.txt,
                       chapterX_timestamps.srt, chapterX_audio.mp3,
                       chapterX_scene1.png, chapterX_scene2.png ...
  wk_outputs/       ← Rendered MP4 lands here (auto)
  boilerplate.html  ← ALWAYS start from this template
  MODULES.md        ← Full module reference with all parameters
  PIPELINE_SOP.md   ← Full pipeline instructions (read this too)
  render.py         ← Rendering script (DO NOT EDIT)
  AGENTS.md         ← This file
```

---

## Your Job — One Task Only

**Generate `chapterX.html`** in the repo root based on the inputs provided.

You do NOT render the video. You do NOT run render.py. You only write the HTML file.

---

## Step-by-Step Process

### Step 1 — Read ALL inputs first

Before writing any code, read:
1. `wk_inputs/chapterX_script.txt` — understand what is being said
2. `wk_inputs/chapterX_scenes.txt` — understand which image shows during which script chunk
3. `wk_inputs/chapterX_timestamps.srt` — get exact timing for every line
4. Confirm all image files listed in scenes.txt exist in `wk_inputs/`

Also read `reference/ref_outputs/chapter1.html` to understand the expected output pattern.

### Step 2 — Map scenes to timestamps

For each scene in `chapterX_scenes.txt`:
1. Find the SRT subtitle where that scene's script text begins
2. Note the start timestamp → convert to milliseconds
3. Formula: `(hours × 3600 + minutes × 60 + seconds) × 1000 + milliseconds`
4. Example: `00:00:19,900` → `19900`

Build a complete scene timeline before writing any code.

### Step 3 — Copy boilerplate and write the HTML

Start from `boilerplate.html`. Rename to `chapterX.html`.

**Always include the fadeOutPrevious helper** at the top of your script block:

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

### Step 4 — Build scene by scene

For each scene, follow this exact pattern:

```js
// Fade out previous scene (~500ms before new scene)
scene.add(fadeOutPrevious(), { at: SCENE_START_MS - 500 })

// Show new scene image
scene.add(new Img({
  src: "wk_inputs/chapterX_sceneName.png",
  x: 260, y: 140, width: 1400,
  animation: "fadeIn",    // or slideInRight, scalePop — see animation guide below
  loop: "breathe"         // MANDATORY — never leave an image static
}), { at: SCENE_START_MS })
```

### Step 5 — End the file

Always call `.play()` last:

```js
scene.play()
```

---

## Critical Rules — Read Every One

### Timing
- SRT timestamps start at `00:00:00,000` — use them directly, no offsets
- `at:` values are milliseconds from zero
- Trigger entrance animations **500ms BEFORE** the voice line starts so image is visible when speech begins
- Trigger `fadeOutPrevious()` **500ms BEFORE** the next scene's entrance
- For rapid sub-scenes under 5 seconds apart, use `fadeOutPrevious(0.2)` for fast cuts

### Images
- EVERY image MUST have `loop: "breathe"` or `loop: "float"` — static screens look dead
- Image paths MUST start with `wk_inputs/`
- Check the scenes.txt carefully — if the same scene name appears twice, the same image file is reused
- Standard placement: `x: 260, y: 140, width: 1400` (centered with breathing room)
- Smaller inset: `x: 360, y: 140, width: 1200`

### Scene transitions
- NEVER let two scenes overlap without `fadeOutPrevious()` between them
- Always schedule fade-out before the next scene, not at the same time

### Canvas
- Canvas is strictly `1920x1080` — never change this
- Background is `#141414` — never change this
- Font is Caveat — already loaded in boilerplate, never change this

---

## Animation Selection Guide

| Situation | animation | loop |
|---|---|---|
| First scene of chapter | `scalePop` or `fadeIn` | `breathe` |
| New topic / scene change | `slideInRight` | `float` |
| Returning to previous scene | `slideInLeft` or `fadeIn` | `breathe` |
| Quick sub-scene | `scalePop` | `float` |
| Final scene | `fadeIn` | `breathe` |

---

## Canvas Coordinate Reference

```
(0,0) ────────────────────────────────── (1920,0)
  │                                           │
  │   Standard image:                         │
  │   x:260, y:140, width:1400               │
  │                                           │
  │   Inset image:                            │
  │   x:360, y:140, width:1200               │
  │                                           │
  │   Title: auto-centered at top (y:44)     │
  │   Tagline: auto-centered at bottom(y:960)│
  │                                           │
(0,1080) ──────────────────────────── (1920,1080)
```

---

## Available Modules (quick ref)

Read `MODULES.md` for full parameter lists. Most common:

```js
// Scene image
new Img({ src, x, y, width, animation, loop })

// Top title
new Title({ text, animation })

// Bottom message bar
new Tagline({ text, borderColor })

// Rounded card with icon
new Card({ text, icon, color, x, y, width, id, animation })

// Arrow between cards
new Arrow({ from, fromSide, to, toSide, type, color, label })

// Floating annotation
new Label({ text, x, y, fontSize, color })

// Small pill label
new Badge({ text, x, y })
```

---

## Colors Available

`blue` `purple` `green` `yellow` `amber` `red` `dark` `white` `cyan` `pink` `teal` `orange` `indigo`

---

## Output Checklist — Verify Before Submitting

- [ ] Started from `boilerplate.html`
- [ ] `fadeOutPrevious()` helper is defined at top of script
- [ ] Every scene image has `loop: "breathe"` or `loop: "float"`
- [ ] `fadeOutPrevious()` is called ~500ms before every new scene
- [ ] All `at:` values directly match SRT timestamps in ms
- [ ] All image paths start with `wk_inputs/`
- [ ] All image filenames match actual files in `wk_inputs/`
- [ ] `scene.play()` is called at the end
- [ ] File is saved as `chapterX.html` in repo root

---

## What NOT to Do

- Do NOT edit any file in `modules/`, `scene/`, or `styles/`
- Do NOT run `render.py`
- Do NOT add fake image paths — only use files confirmed to exist in `wk_inputs/`
- Do NOT add inline CSS to the canvas or body beyond what boilerplate provides
- Do NOT add the play button to the HTML — it's already in boilerplate
- Do NOT hardcode colors outside the defined color names
- Do NOT leave any scene without a loop animation

---

## Example Task Prompt You Will Receive

```
Generate chapter2.html using:
- wk_inputs/chapter2_script.txt
- wk_inputs/chapter2_scenes.txt  
- wk_inputs/chapter2_timestamps.srt
- wk_inputs/chapter2_scene1.png
- wk_inputs/chapter2_scene2.png
- wk_inputs/chapter2_scene3.png
```

That is all you need. Everything else is defined in this file and PIPELINE_SOP.md.
