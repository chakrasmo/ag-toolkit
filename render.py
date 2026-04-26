import asyncio
from playwright.async_api import async_playwright
import os
import sys
import argparse

# Try importing moviepy to handle the video/audio stitching
try:
    from moviepy import VideoFileClip, AudioFileClip
except ImportError:
    print("moviepy is not installed! Run: pip install moviepy")
    sys.exit(1)

# ==========================================
# CONFIGURATION — defaults, overridden by CLI
# ==========================================
TOOLKIT_DIR = os.path.dirname(os.path.abspath(__file__))
VIDEO_DIR = os.path.join(TOOLKIT_DIR, "videos")

def parse_args():
    parser = argparse.ArgumentParser(description="Render an HTML animation to MP4 with synced audio.")
    parser.add_argument("--html", required=True, help="Path to the HTML file (e.g., chapter1.html)")
    parser.add_argument("--audio", default=None, help="Path to the audio file (e.g., wk_inputs/chapter1_audio.wav)")
    parser.add_argument("--output", default=None, help="Output MP4 path (e.g., wk_outputs/chapter1_final.mp4)")
    parser.add_argument("--duration", type=int, help="Recording duration in seconds (overridden if audio file is provided)")
    return parser.parse_args()

async def render(html_path, duration, audio_path=None):
    # Convert relative path to file:// URL
    abs_html = os.path.abspath(html_path)
    html_url = "file:///" + abs_html.replace("\\", "/")

    async with async_playwright() as p:
        # Launch headless chromium
        browser = await p.chromium.launch(headless=True)
        
        # Create a new context sized to 1080p with video recording enabled
        context = await browser.new_context(
            viewport={"width": 1920, "height": 1080},
            record_video_dir=VIDEO_DIR,
            record_video_size={"width": 1920, "height": 1080}
        )
        page = await context.new_page()
        
        print(f"Loading {html_url}")
        print(f"Recording for {duration} seconds. Please wait...")
        
        # Load the HTML file
        await page.goto(html_url)
        
        if audio_path and os.path.exists(audio_path):
            abs_audio = os.path.abspath(audio_path)
            audio_url = "file:///" + abs_audio.replace("\\", "/")
            await page.evaluate(f"""() => {{
                const audio = document.createElement('audio');
                audio.src = '{audio_url}';
                document.body.appendChild(audio);
                const playBtn = document.getElementById('play');
                if (playBtn) {{
                    playBtn.addEventListener('click', () => audio.play().catch(e => console.error('Audio play failed', e)));
                }} else {{
                    audio.play().catch(e => console.error('Audio play failed', e));
                }}
            }}""")

        # Click the play button immediately after the page loads
        await page.click("#play")

        if audio_path and os.path.exists(audio_path):
            # Wait for the audio element to actually start playing
            await page.wait_for_function("document.querySelector('audio') && !document.querySelector('audio').paused")

        # Hide the play button so it doesn't appear in the rendered video if it still exists
        await page.evaluate("document.getElementById('play')?.remove()")
        
        # Wait for the full animation duration
        await page.wait_for_timeout(duration * 1000)

        # Closing the context flushes the video file to disk
        video_path = await page.video.path()
        await context.close()
        await browser.close()
        
        return video_path

def stitch(video_path, audio_path, output_path):
    print(f"Raw video saved at {video_path}. Converting to MP4...")
    
    # Load the webm video captured by Playwright
    video_clip = VideoFileClip(video_path)
    
    if audio_path and os.path.exists(audio_path):
        print(f"Found audio: {audio_path}. Stitching directly at t=0 (no padding)...")
        audio_clip = AudioFileClip(audio_path)
        video_clip = video_clip.with_audio(audio_clip)
    else:
        if audio_path:
            print(f"WARNING: Audio file {audio_path} not found! Video will be silent.")
        else:
            print("No audio file specified. Video will be silent.")
        
    # Export the final high-res MP4
    print(f"Exporting to {output_path} (this may take a minute)...")
    video_clip.write_videofile(output_path, fps=60, codec="libx264", audio_codec="aac")
    
    video_clip.close()
    if 'audio_clip' in locals():
        audio_clip.close()

    print("=========================================")
    print(f"DONE! Final video ready: {output_path}")
    print("=========================================")

if __name__ == "__main__":
    args = parse_args()
    
    # Ensure the temp video directory exists
    if not os.path.exists(VIDEO_DIR):
        os.makedirs(VIDEO_DIR)

    # Derive output path if not specified
    output = args.output
    if not output:
        base = os.path.splitext(os.path.basename(args.html))[0]
        output = os.path.join(TOOLKIT_DIR, "wk_outputs", f"{base}_final.mp4")
    
    # Ensure output directory exists
    os.makedirs(os.path.dirname(output), exist_ok=True)
        
    render_duration = args.duration

    # If audio is provided, force duration to match the audio exactly
    if args.audio and os.path.exists(args.audio):
        from moviepy import AudioFileClip
        try:
            with AudioFileClip(args.audio) as audio_clip:
                render_duration = audio_clip.duration
            print(f"Audio file found. Forcing render duration to {render_duration:.2f} seconds to match audio.")
        except Exception as e:
            print(f"Warning: Could not read audio duration. Using default duration. Error: {e}")

    if not render_duration:
        print("Error: No duration provided and could not determine duration from audio.")
        sys.exit(1)

    raw_video = asyncio.run(render(args.html, render_duration, args.audio))
    stitch(raw_video, args.audio, output)
