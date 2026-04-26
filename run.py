"""
run.py — Auto-detect and render the current chapter.

Instead of typing all arguments manually, just run:
    python run.py

It will:
  1. Find the chapter HTML file in the toolkit root (excludes boilerplate.html)
  2. Find the audio file in wk_inputs/ (wav, mp3, aac, m4a — any format)
  3. Parse the SRT in wk_inputs/ to auto-calculate --duration
  4. Call render.py with all the correct arguments

Optionally override anything:
    python run.py --html chapter2.html
    python run.py --audio wk_inputs/my_audio.mp3
    python run.py --buffer 10
"""

import os
import re
import sys
import glob
import argparse
import subprocess

TOOLKIT_DIR = os.path.dirname(os.path.abspath(__file__))
INPUTS_DIR  = os.path.join(TOOLKIT_DIR, "wk_inputs")

AUDIO_EXTENSIONS = [".wav", ".mp3", ".aac", ".m4a", ".ogg", ".flac"]
EXCLUDE_HTML     = {"boilerplate.html"}


def find_html():
    """Find the chapter HTML in the toolkit root (ignores boilerplate.html).
    If multiple are found, picks the most recently modified one and warns.
    """
    candidates = [
        f for f in glob.glob(os.path.join(TOOLKIT_DIR, "*.html"))
        if os.path.basename(f).lower() not in EXCLUDE_HTML
    ]
    if not candidates:
        print("ERROR: No chapter HTML found in toolkit root. Generate it first.")
        sys.exit(1)
    if len(candidates) > 1:
        # Pick the most recently modified file and warn
        candidates.sort(key=os.path.getmtime, reverse=True)
        names = [os.path.basename(f) for f in candidates]
        print(f"WARNING: Multiple HTML files found: {names}")
        print(f"         Auto-selecting the most recent: {names[0]}")
        print(f"         Override with: python run.py --html chapterX.html")
    return candidates[0]


def find_audio():
    """Find the first audio file in wk_inputs/ (any supported format)."""
    for ext in AUDIO_EXTENSIONS:
        matches = glob.glob(os.path.join(INPUTS_DIR, f"*{ext}"))
        if matches:
            return matches[0]
    print("WARNING: No audio file found in wk_inputs/. Video will be silent.")
    return None


def find_srt():
    """Find the SRT file in wk_inputs/."""
    matches = glob.glob(os.path.join(INPUTS_DIR, "*.srt"))
    if not matches:
        return None
    return matches[0]


def srt_to_ms(timestamp):
    """Convert SRT timestamp '00:01:32,970' to milliseconds."""
    h, m, rest = timestamp.split(":")
    s, ms = rest.split(",")
    return int(h) * 3600000 + int(m) * 60000 + int(s) * 1000 + int(ms)


def calculate_duration(srt_path, buffer_seconds=5):
    """Parse SRT and return total duration (last end timestamp + buffer) in seconds."""
    with open(srt_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Find all timestamps in the file (start --> end)
    pattern = r"(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})"
    matches = re.findall(pattern, content)

    if not matches:
        print("WARNING: Could not parse SRT timestamps. Defaulting to 120 seconds.")
        return 120

    # Take the last end timestamp
    last_end_ms = max(srt_to_ms(end) for _, end in matches)
    duration_s = (last_end_ms / 1000) + buffer_seconds

    return int(duration_s)


def main():
    parser = argparse.ArgumentParser(
        description="Auto-detect inputs and render the current chapter."
    )
    parser.add_argument("--html",   default=None, help="Override: path to chapter HTML")
    parser.add_argument("--audio",  default=None, help="Override: path to audio file")
    parser.add_argument("--output", default=None, help="Override: output MP4 path")
    parser.add_argument("--buffer", type=int, default=5,
                        help="Seconds to add after last SRT timestamp (default: 5)")
    args = parser.parse_args()

    # ── Auto-detect ──────────────────────────────────────────────────
    html  = args.html  or find_html()
    audio = args.audio or find_audio()
    srt   = find_srt()

    if srt:
        duration = calculate_duration(srt, buffer_seconds=args.buffer)
    else:
        print("WARNING: No SRT found in wk_inputs/. Defaulting to 120 seconds.")
        duration = 120

    # ── Print summary ─────────────────────────────────────────────────
    print("=" * 55)
    print("  MotionForge — Auto Render")
    print("=" * 55)
    print(f"  HTML     : {os.path.basename(html)}")
    print(f"  Audio    : {os.path.basename(audio) if audio else 'None (silent)'}")
    print(f"  SRT      : {os.path.basename(srt) if srt else 'None'}")
    print(f"  Duration : {duration}s  (last SRT + {args.buffer}s buffer)")
    if args.output:
        print(f"  Output   : {args.output}")
    print("=" * 55)

    # ── Build render.py command ───────────────────────────────────────
    render_script = os.path.join(TOOLKIT_DIR, "render.py")
    cmd = [sys.executable, render_script,
           "--html", html,
           "--duration", str(duration)]

    if audio:
        cmd += ["--audio", audio]
    if args.output:
        cmd += ["--output", args.output]

    # ── Run ───────────────────────────────────────────────────────────
    result = subprocess.run(cmd)
    sys.exit(result.returncode)


if __name__ == "__main__":
    main()
