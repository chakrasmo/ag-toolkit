# TOOLKIT MODULES — CHEAT SHEET
Quick reference for every module. Find what you need, open that file.

---

## 📦 CONTAINERS / CARDS

| Module       | File                  | What it is                              |
|--------------|-----------------------|-----------------------------------------|
| `Card`       | modules/card.js       | Rounded rect with icon + text           |
| `Circle`     | modules/shapes.js     | Round node element                      |
| `Diamond`    | modules/shapes.js     | Decision / branch shape                 |
| `Cylinder`   | modules/shapes.js     | Database / storage shape                |
| `SpeechBubble` | modules/shapes.js   | Chat bubble with tail                   |
| `HighlightBox` | modules/effects.js  | Transparent overlay grouping elements   |
| `BrowserWindow`| modules/tech-elements.js | macOS Safari/Chrome window            |
| `CodeBlock`    | modules/tech-elements.js | Terminal/IDE window with code         |

---

## ✍️ TEXT ELEMENTS

| Module         | File                      | What it is                            |
|----------------|---------------------------|---------------------------------------|
| `Title`        | modules/text-elements.js  | Top heading of scene                  |
| `Tagline`      | modules/text-elements.js  | Bottom pill bar                       |
| `Label`        | modules/text-elements.js  | Floating text, no box                 |
| `Badge`        | modules/text-elements.js  | Small pill label (on arrows etc)      |
| `FloatingText` | modules/text-elements.js  | Large decorative standalone text      |
| `Counter`      | modules/effects.js        | Number that ticks up from 0           |

---

## ➡️ CONNECTORS

| Module    | File              | What it is                               |
|-----------|-------------------|------------------------------------------|
| `Arrow`   | modules/arrow.js  | All arrow types: straight, curved, elbow |
| `DotFlow` | modules/effects.js| Animated dot moving along a path         |

### Arrow types:
- `straight` — direct line
- `curved` / `curvedUp` / `curvedDown` — bezier curve
- `arc` — smooth S-curve (horizontal flow)
- `elbow` — right-angle connector

### Arrow styles:
- `solid` — normal line
- `dashed` — dashed line
- `dotted` — dotted line
- `marching` — animated flowing dashes (loop)

---

## 💥 EFFECTS & DECORATIVE

| Module        | File               | What it is                              |
|---------------|--------------------|-----------------------------------------|
| `Icon`        | modules/effects.js | Standalone emoji/icon                   |
| `Sparkles`    | modules/effects.js | Cluster of decorative spark marks       |
| `Divider`     | modules/effects.js | Horizontal or vertical divider line     |
| `Img`         | modules/effects.js | Image placed on canvas (supports `id` for arrows) |

---

## 🎬 ENTRANCE ANIMATIONS (all modules)

| Name           | Effect                          |
|----------------|---------------------------------|
| `fadeIn`       | Simple fade from invisible      |
| `slideInLeft`  | Slides from left                |
| `slideInRight` | Slides from right               |
| `slideInDown`  | Drops from above                |
| `slideInUp`    | Rises from below                |
| `scalePop`     | Pops in with bounce             |
| `irisWipe`     | Circle expands from center      |
| `clipReveal`   | Wipes left to right             |
| `blurIn`       | Resolves from blur to sharp     |
| `flipIn`       | Card flip from side             |
| `typewriter`   | Types character by character    |
| `wordByWord`   | Words appear one by one         |

---

## 💡 EMPHASIS ANIMATIONS (after entrance)

| Name          | Effect                          |
|---------------|---------------------------------|
| `glowPulse`   | Box shadow pulses 2-3 times     |
| `shake`       | Wobble/shake for errors         |
| `scaleBounce` | Brief scale up-down             |

---

## 🔁 LOOP ANIMATIONS (run forever)

| Name         | Effect                           |
|--------------|----------------------------------|
| `float`      | Gentle float up and down         |
| `breathe`    | Slow scale in/out                |
| `pulseGlow`  | Continuous glow pulse            |
| `rotateLoop` | Spin forever (gears, loaders)    |
| `marching`   | Dashes flow along arrow path     |

---

## 🎨 COLOR NAMES

Use these strings in the `color` parameter:
- **Base**: `blue` `purple` `green` `yellow` `amber` `red` `dark` `white`
- **Vibrant**: `cyan` `pink` `teal` `orange` `indigo`

---

## ⏱ SRT SYNC HELPERS

```js
// Convert SRT timestamp to milliseconds
Scene.srtToMs("00:01:23,456")  // → 83456

// Get ms offset from scene's first subtitle
Scene.offset("00:01:23,456", "00:01:20,000")  // → 3456
```

---

## 🚀 QUICK START

```js
const scene = new Scene()

scene
  .add(new Title("Step 4 – Refine"),          { at: 0 })
  .add(new Card({ text: "Tweak", color: "blue", x: 200, y: 400, id: "c1" }), { at: 500 })
  .add(new Arrow({ from: "c1", to: "c2" }),   { at: 1200 })
  .add(new Tagline("Better output"),           { at: 3000 })
  .play()
```
