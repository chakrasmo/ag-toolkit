---
name: Generate Chapter HTML
about: Ask Jules to generate the animation HTML for a new chapter
title: "Generate chapter[X].html"
labels: jules
assignees: ''
---

## Chapter Info

**Chapter number:** <!-- replace with number, e.g. 2 -->  
**Chapter title:** <!-- e.g. "How AI Writes Code" -->  
**Output filename:** `chapter[X].html`

---

## Task

Generate `chapter[X].html` in the repo root.

**Step 1 — Scan `wk_inputs/`**  
List all files that start with `chapter[X]_`. These are your only inputs. Do not reference any file that doesn't exist.

**Step 2 — Read all inputs**  
Read the script, scenes mapping, and SRT timestamps in full before writing any code.

**Step 3 — Generate the HTML**  
Follow all instructions in `AGENTS.md` exactly.  
Study `reference/ref_outputs/chapter1.html` as the reference pattern.

---

## Director's Notes _(optional — delete if none)_

<!-- Add any specific preferences here, for example:
- Scene 3 should use slideInLeft instead of the default
- Sub-scenes 3.1–3.4 are fast cuts, each under 4 seconds
- Add a Title module on Scene 1 with the text "..."
- Scene 2 image is wider, use x:160 width:1600
-->

