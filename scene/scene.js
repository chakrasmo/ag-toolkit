/* ============================================
   SCENE.JS — The grand structure
   Sets up canvas, SVG layer, play button
   Manages the timeline of all modules
   ============================================ */

class Scene {
  constructor(options = {}) {
    this._queue = []   // { module, at (ms) }
    this._running = false
    this._timers = []

    // Create SVG layer if not present
    if (!document.getElementById('svg-layer')) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      svg.id = 'svg-layer'
      svg.setAttribute('width', '1920')
      svg.setAttribute('height', '1080')

      // Arrow marker definition
      svg.innerHTML = `
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7"
            refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="white"/>
          </marker>
          <marker id="arrowhead-blue" markerWidth="10" markerHeight="7"
            refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#93c5fd"/>
          </marker>
          <marker id="arrowhead-purple" markerWidth="10" markerHeight="7"
            refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#a78bfa"/>
          </marker>
          <marker id="arrowhead-green" markerWidth="10" markerHeight="7"
            refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#6ee7b7"/>
          </marker>
          <marker id="arrowhead-yellow" markerWidth="10" markerHeight="7"
            refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#f5e6a3"/>
          </marker>
          <marker id="arrowhead-amber" markerWidth="10" markerHeight="7"
            refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#fcd34d"/>
          </marker>
          <marker id="arrowhead-red" markerWidth="10" markerHeight="7"
            refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#f87171"/>
          </marker>
          <marker id="arrowhead-cyan" markerWidth="10" markerHeight="7"
            refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#22d3ee"/>
          </marker>
          <marker id="arrowhead-pink" markerWidth="10" markerHeight="7"
            refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#f472b6"/>
          </marker>
          <marker id="arrowhead-teal" markerWidth="10" markerHeight="7"
            refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#2dd4bf"/>
          </marker>
          <marker id="arrowhead-orange" markerWidth="10" markerHeight="7"
            refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#fb923c"/>
          </marker>
          <marker id="arrowhead-indigo" markerWidth="10" markerHeight="7"
            refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#818cf8"/>
          </marker>
        </defs>
      `
      document.getElementById('canvas').appendChild(svg)
    }

    // Play button
    const btn = document.getElementById('play')
    if (btn) {
      btn.addEventListener('click', () => {
        if (this._running) {
          this.reset()
        } else {
          this.play()
        }
      })
    }
  }

  // Add a module to the timeline
  // at: milliseconds from scene start
  add(module, options = {}) {
    this._queue.push({ module, at: options.at ?? 0 })
    return this  // allows chaining
  }

  // Start playing all modules in sequence
  play() {
    this._running = true
    const btn = document.getElementById('play')
    if (btn) btn.textContent = '↺'

    this._queue.forEach(({ module, at }) => {
      const timer = setTimeout(() => {
        module.render()
        module.animate()
      }, at)
      this._timers.push(timer)
    })
  }

  // Reset everything — clear timers, remove all injected elements
  reset() {
    this._running = false
    this._timers.forEach(t => clearTimeout(t))
    this._timers = []

    // Remove all module-injected elements
    document.querySelectorAll('[data-module]').forEach(el => el.remove())

    // Clear SVG paths (arrows)
    const svg = document.getElementById('svg-layer')
    if (svg) {
      const paths = svg.querySelectorAll('[data-arrow]')
      paths.forEach(p => p.remove())
    }

    // Clear CardRegistry so stale IDs don't linger
    if (typeof CardRegistry !== 'undefined') CardRegistry._cards = {}

    const btn = document.getElementById('play')
    if (btn) btn.textContent = '▶'
  }

  // Utility: convert SRT timestamp to ms
  // Usage: Scene.srtToMs("00:01:23,456") → 83456
  static srtToMs(srt) {
    const [h, m, rest] = srt.split(':')
    const [s, ms] = rest.split(',')
    return (+h * 3600 + +m * 60 + +s) * 1000 + +ms
  }

  // Utility: get ms offset from scene's first timestamp
  // Usage: Scene.offset("00:01:23,456", "00:01:20,000") → 3456
  static offset(timestamp, sceneStart) {
    return Scene.srtToMs(timestamp) - Scene.srtToMs(sceneStart)
  }
}
