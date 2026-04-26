/* ============================================
   ARROW.JS — All arrow/connector types
   Draws SVG paths between coordinates or cards
   ============================================ */

class Arrow {
  constructor(options = {}) {
    this.options = {

      // CONNECTION — use EITHER x1/y1/x2/y2 OR from/to card IDs
      x1: options.x1 || null,              // start x (pixels)
      y1: options.y1 || null,              // start y (pixels)
      x2: options.x2 || null,              // end x (pixels)
      y2: options.y2 || null,              // end y (pixels)

      // Card ID connection (requires CardRegistry)
      from: options.from || null,          // card ID string
      fromSide: options.fromSide || 'right', // "left" | "right" | "top" | "bottom"
      to: options.to || null,              // card ID string
      toSide: options.toSide || 'left',   // "left" | "right" | "top" | "bottom"

      // ARROW TYPE
      // "straight" | "curved" | "curvedUp" | "curvedDown" | "elbow" | "arc"
      type: options.type || 'straight',

      // For curved arrows: how much it curves (pixels)
      // positive = curves up/left, negative = curves down/right
      curvature: options.curvature || -80,

      // ARROWHEADS
      // "end" | "start" | "both" | "none"
      heads: options.heads || 'end',

      // COLOR
      // "white" | "blue" | "purple" | "green" | "yellow" | "red" | hex string
      color: options.color || 'white',

      // LINE STYLE
      // "solid" | "dashed" | "dotted" | "marching"
      style: options.style || 'solid',

      width: options.width || 2.5,         // stroke width pixels

      // LABEL on the arrow
      label: options.label || null,        // string or null
      labelOffset: options.labelOffset || -20, // y offset from midpoint

      // ENTRANCE ANIMATION
      // "draw" | "fadeIn" | "none"
      animation: options.animation || 'draw',
      duration: options.duration || 0.5,   // seconds

      // LOOP
      // "marching" | "none" — marching dashes flow along path
      loop: options.loop || 'none',
    }

    this._path = null
    this._labelEl = null
  }

  _resolvePoints() {
    const o = this.options

    if (o.from && o.to) {
      const start = CardRegistry.edge(o.from, o.fromSide)
      const end   = CardRegistry.edge(o.to,   o.toSide)
      if (!start || !end) {
        console.warn(`Arrow: card IDs "${o.from}" or "${o.to}" not found in registry`)
        return null
      }
      return { x1: start.x, y1: start.y, x2: end.x, y2: end.y }
    }

    if (o.x1 !== null) {
      return { x1: o.x1, y1: o.y1, x2: o.x2, y2: o.y2 }
    }

    console.warn('Arrow: must provide either x1/y1/x2/y2 or from/to card IDs')
    return null
  }

  _buildPath(x1, y1, x2, y2) {
    const o = this.options
    const mx = (x1 + x2) / 2
    const my = (y1 + y2) / 2

    if (o.type === 'straight') {
      return `M ${x1} ${y1} L ${x2} ${y2}`
    }

    if (o.type === 'curved' || o.type === 'curvedDown') {
      // Quadratic bezier curving downward
      return `M ${x1} ${y1} Q ${mx} ${my - o.curvature} ${x2} ${y2}`
    }

    if (o.type === 'curvedUp') {
      return `M ${x1} ${y1} Q ${mx} ${my + o.curvature} ${x2} ${y2}`
    }

    if (o.type === 'arc') {
      // Smooth S-curve
      const cp1x = x1 + (x2 - x1) * 0.4
      const cp2x = x1 + (x2 - x1) * 0.6
      return `M ${x1} ${y1} C ${cp1x} ${y1} ${cp2x} ${y2} ${x2} ${y2}`
    }

    if (o.type === 'elbow') {
      // Right-angle path
      return `M ${x1} ${y1} L ${mx} ${y1} L ${mx} ${y2} L ${x2} ${y2}`
    }

    return `M ${x1} ${y1} L ${x2} ${y2}`
  }

  _colorValue() {
    const map = {
      white:  '#ffffff',
      blue:   '#93c5fd',
      purple: '#a78bfa',
      green:  '#6ee7b7',
      yellow: '#f5e6a3',
      amber:  '#fcd34d',
      red:    '#f87171',
      cyan:   '#22d3ee',
      pink:   '#f472b6',
      teal:   '#2dd4bf',
      orange: '#fb923c',
      indigo: '#818cf8',
    }
    return map[this.options.color] || this.options.color
  }

  _markerRef() {
    // For named colors, use a matching arrowhead marker.
    // For hex/custom colors, fall back to white arrowhead.
    const named = ['white','blue','purple','green','yellow','amber','red','cyan','pink','teal','orange','indigo']
    if (named.includes(this.options.color)) {
      return this.options.color === 'white' ? 'arrowhead' : `arrowhead-${this.options.color}`
    }
    return 'arrowhead'
  }

  render() {
    const o = this.options
    const pts = this._resolvePoints()
    if (!pts) return

    const { x1, y1, x2, y2 } = pts
    const svg = document.getElementById('svg-layer')
    const color = this._colorValue()
    const marker = this._markerRef()

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.dataset.arrow = true

    path.setAttribute('d', this._buildPath(x1, y1, x2, y2))
    path.setAttribute('stroke', color)
    path.setAttribute('stroke-width', o.width)
    path.setAttribute('fill', 'none')
    path.setAttribute('stroke-linecap', 'round')

    if (o.style === 'dashed') path.setAttribute('stroke-dasharray', '12 8')
    if (o.style === 'dotted') path.setAttribute('stroke-dasharray', '4 6')

    if (o.heads === 'end' || o.heads === 'both') {
      path.setAttribute('marker-end', `url(#${marker})`)
    }
    if (o.heads === 'start' || o.heads === 'both') {
      path.setAttribute('marker-start', `url(#${marker})`)
    }

    path.style.opacity = '0'
    svg.appendChild(path)
    this._path = path

    // Label
    if (o.label) {
      const mx = (x1 + x2) / 2
      const my = (y1 + y2) / 2 + o.labelOffset

      const el = document.createElement('div')
      el.dataset.module = 'arrow-label'
      el.style.cssText = `
        position: absolute;
        left: ${mx}px;
        top: ${my}px;
        transform: translateX(-50%);
        background: #1a1a1a;
        border: 1.5px solid ${color};
        border-radius: 999px;
        padding: 4px 18px;
        font-size: 24px;
        color: ${color};
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
      `
      el.textContent = o.label
      document.getElementById('canvas').appendChild(el)
      this._labelEl = el
    }
  }

  animate() {
    const o = this.options
    const path = this._path
    if (!path) return

    if (o.animation === 'draw') {
      Animate.drawPath(path, o.duration, 0)
    } else if (o.animation === 'fadeIn') {
      gsap.to(path, { opacity: 1, duration: o.duration })
    } else {
      gsap.set(path, { opacity: 1 })
    }

    // Label fades in after arrow
    if (this._labelEl) {
      gsap.to(this._labelEl, { opacity: 1, duration: 0.4, delay: o.duration * 0.6 })
    }

    // Marching dashes loop
    if (o.loop === 'marching') {
      setTimeout(() => Animate.marchingDashes(path), o.duration * 1000 + 100)
    }
  }
}
