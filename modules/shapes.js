/* ============================================
   SHAPES.JS
   Circle, Diamond, Cylinder, SpeechBubble
   ============================================ */

/* ------------------------------------------
   CIRCLE NODE — Round node element
------------------------------------------ */
class Circle {
  constructor(options = {}) {
    this.options = {
      text: options.text || '',
      icon: options.icon || null,

      // CENTER position
      cx: options.cx || 200,              // center x
      cy: options.cy || 200,              // center y

      radius: options.radius || 70,       // pixels

      // COLOR SCHEME
      // "blue" | "purple" | "green" | "yellow" | "red" | "dark" | "white"
      color: options.color || 'dark',

      border: options.border !== false,
      glow: options.glow || false,

      fontSize: options.fontSize || 28,
      fontWeight: options.fontWeight || 600,

      // ENTRANCE ANIMATION
      // "scalePop" | "fadeIn" | "irisWipe"
      animation: options.animation || 'scalePop',
      duration: options.duration || 0.5,

      // LOOP
      // "float" | "breathe" | "rotateLoop" | "pulseGlow" | "none"
      loop: options.loop || 'none',

      id: options.id || null,
    }
    this._el = null
  }

  _getColors() {
    const map = {
      blue:   { bg: '#1e3a5f', border: '#93c5fd', text: '#ffffff', glow: 'rgba(147,197,253,0.4)' },
      purple: { bg: '#3b1f6e', border: '#a78bfa', text: '#ffffff', glow: 'rgba(167,139,250,0.4)' },
      green:  { bg: '#064e3b', border: '#6ee7b7', text: '#ffffff', glow: 'rgba(110,231,183,0.4)' },
      yellow: { bg: '#78571a', border: '#f5e6a3', text: '#ffffff', glow: 'rgba(245,230,163,0.4)' },
      amber:  { bg: '#92400e', border: '#fcd34d', text: '#ffffff', glow: 'rgba(252,211,77,0.4)'  },
      red:    { bg: '#7f1d1d', border: '#f87171', text: '#ffffff', glow: 'rgba(248,113,113,0.4)' },
      cyan:   { bg: '#164e63', border: '#22d3ee', text: '#ffffff', glow: 'rgba(34,211,238,0.4)'  },
      pink:   { bg: '#831843', border: '#f472b6', text: '#ffffff', glow: 'rgba(244,114,182,0.4)' },
      teal:   { bg: '#134e4a', border: '#2dd4bf', text: '#ffffff', glow: 'rgba(45,212,191,0.4)'  },
      orange: { bg: '#7c2d12', border: '#fb923c', text: '#ffffff', glow: 'rgba(251,146,60,0.4)'  },
      indigo: { bg: '#312e81', border: '#818cf8', text: '#ffffff', glow: 'rgba(129,140,248,0.4)' },
      dark:   { bg: '#1f1f1f', border: 'rgba(255,255,255,0.4)', text: '#ffffff', glow: 'rgba(255,255,255,0.15)' },
      white:  { bg: '#ffffff', border: '#cccccc', text: '#1a1a1a', glow: 'rgba(255,255,255,0.2)' },
    }
    return map[this.options.color] || map.dark
  }

  render() {
    const o = this.options
    const c = this._getColors()
    const size = o.radius * 2

    const el = document.createElement('div')
    el.dataset.module = 'circle'
    if (o.id) el.id = o.id

    el.style.cssText = `
      position: absolute;
      left: ${o.cx - o.radius}px;
      top: ${o.cy - o.radius}px;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${c.bg};
      border: ${o.border ? `2.5px solid ${c.border}` : 'none'};
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: ${o.fontSize}px;
      font-weight: ${o.fontWeight};
      color: ${c.text};
      text-align: center;
      opacity: 0;
      ${o.glow ? `box-shadow: 0 0 28px 8px ${c.glow};` : ''}
    `

    let inner = ''
    if (o.icon) inner += `<span style="font-size:${o.fontSize * 1.2}px;display:block;">${o.icon}</span>`
    if (o.text) inner += `<span>${o.text}</span>`
    el.innerHTML = inner

    document.getElementById('canvas').appendChild(el)
    this._el = el

    CardRegistry.register(o.id, el, o.cx - o.radius, o.cy - o.radius, size, size)
  }

  animate() {
    const o = this.options
    Animate.run(o.animation, this._el, 0, { duration: o.duration })

    if (o.loop !== 'none') {
      setTimeout(() => {
        if (o.loop === 'float') Animate.float(this._el)
        if (o.loop === 'breathe') Animate.breathe(this._el)
        if (o.loop === 'rotateLoop') Animate.rotateLoop(this._el)
        if (o.loop === 'pulseGlow') Animate.pulseGlow(this._el)
      }, o.duration * 1000 + 100)
    }
  }
}

/* ------------------------------------------
   DIAMOND — Decision / branch shape
------------------------------------------ */
class Diamond {
  constructor(options = {}) {
    this.options = {
      text: options.text || '',
      icon: options.icon || null,

      // CENTER position
      cx: options.cx || 300,
      cy: options.cy || 300,

      width: options.width || 180,        // total width
      height: options.height || 120,      // total height

      color: options.color || 'dark',
      border: options.border !== false,

      fontSize: options.fontSize || 26,
      fontWeight: options.fontWeight || 600,

      // ENTRANCE ANIMATION
      // "scalePop" | "fadeIn" | "flipIn"
      animation: options.animation || 'scalePop',
      duration: options.duration || 0.5,

      id: options.id || null,
    }
    this._el = null
  }

  _getColors() {
    const map = {
      blue:   { bg: '#1e3a5f', border: '#93c5fd', text: '#ffffff' },
      purple: { bg: '#3b1f6e', border: '#a78bfa', text: '#ffffff' },
      green:  { bg: '#064e3b', border: '#6ee7b7', text: '#ffffff' },
      yellow: { bg: '#78571a', border: '#f5e6a3', text: '#ffffff' },
      amber:  { bg: '#92400e', border: '#fcd34d', text: '#ffffff' },
      red:    { bg: '#7f1d1d', border: '#f87171', text: '#ffffff' },
      cyan:   { bg: '#164e63', border: '#22d3ee', text: '#ffffff' },
      pink:   { bg: '#831843', border: '#f472b6', text: '#ffffff' },
      teal:   { bg: '#134e4a', border: '#2dd4bf', text: '#ffffff' },
      orange: { bg: '#7c2d12', border: '#fb923c', text: '#ffffff' },
      indigo: { bg: '#312e81', border: '#818cf8', text: '#ffffff' },
      dark:   { bg: '#1f1f1f', border: 'rgba(255,255,255,0.4)', text: '#ffffff' },
    }
    return map[this.options.color] || map.dark
  }

  render() {
    const o = this.options
    const c = this._getColors()

    const el = document.createElement('div')
    el.dataset.module = 'diamond'
    if (o.id) el.id = o.id

    // Diamond uses CSS clip-path
    el.style.cssText = `
      position: absolute;
      left: ${o.cx - o.width / 2}px;
      top: ${o.cy - o.height / 2}px;
      width: ${o.width}px;
      height: ${o.height}px;
      background: ${c.bg};
      clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: ${o.fontSize}px;
      font-weight: ${o.fontWeight};
      color: ${c.text};
      text-align: center;
      opacity: 0;
    `

    // Border via SVG overlay
    if (o.border) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      svg.style.cssText = `position:absolute;top:0;left:0;width:100%;height:100%;overflow:visible;pointer-events:none;`
      const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
      const hw = o.width / 2, hh = o.height / 2
      poly.setAttribute('points', `${hw},0 ${o.width},${hh} ${hw},${o.height} 0,${hh}`)
      poly.setAttribute('fill', 'none')
      poly.setAttribute('stroke', c.border)
      poly.setAttribute('stroke-width', '2.5')
      svg.appendChild(poly)
      el.appendChild(svg)
    }

    let inner = ''
    if (o.icon) inner += `<span style="font-size:${o.fontSize * 1.2}px;">${o.icon}</span>`
    if (o.text) inner += `<span>${o.text}</span>`
    el.innerHTML += inner

    document.getElementById('canvas').appendChild(el)
    this._el = el

    CardRegistry.register(o.id, el, o.cx - o.width / 2, o.cy - o.height / 2, o.width, o.height)
  }

  animate() {
    Animate.run(this.options.animation, this._el, 0, { duration: this.options.duration })
  }
}

/* ------------------------------------------
   CYLINDER — Database / storage shape
------------------------------------------ */
class Cylinder {
  constructor(options = {}) {
    this.options = {
      text: options.text || '',
      icon: options.icon || null,

      x: options.x || 100,
      y: options.y || 100,
      width: options.width || 140,
      height: options.height || 180,

      color: options.color || 'dark',
      fontSize: options.fontSize || 26,
      fontWeight: options.fontWeight || 600,

      animation: options.animation || 'slideInUp',
      duration: options.duration || 0.5,

      id: options.id || null,
    }
    this._el = null
  }

  render() {
    const o = this.options
    const colors = {
      blue:   { fill: '#1e3a5f', stroke: '#93c5fd', text: '#fff' },
      purple: { fill: '#3b1f6e', stroke: '#a78bfa', text: '#fff' },
      green:  { fill: '#064e3b', stroke: '#6ee7b7', text: '#fff' },
      yellow: { fill: '#78571a', stroke: '#f5e6a3', text: '#fff' },
      amber:  { fill: '#92400e', stroke: '#fcd34d', text: '#fff' },
      red:    { fill: '#7f1d1d', stroke: '#f87171', text: '#fff' },
      cyan:   { fill: '#164e63', stroke: '#22d3ee', text: '#fff' },
      pink:   { fill: '#831843', stroke: '#f472b6', text: '#fff' },
      teal:   { fill: '#134e4a', stroke: '#2dd4bf', text: '#fff' },
      orange: { fill: '#7c2d12', stroke: '#fb923c', text: '#fff' },
      indigo: { fill: '#312e81', stroke: '#818cf8', text: '#fff' },
      dark:   { fill: '#1f1f1f', stroke: 'rgba(255,255,255,0.4)', text: '#fff' },
    }
    const c = colors[o.color] || colors.dark
    const ry = 20 // ellipse y radius for top/bottom

    const el = document.createElement('div')
    el.dataset.module = 'cylinder'
    if (o.id) el.id = o.id

    el.style.cssText = `
      position: absolute;
      left: ${o.x}px;
      top: ${o.y}px;
      width: ${o.width}px;
      height: ${o.height}px;
      opacity: 0;
    `

    el.innerHTML = `
      <svg width="${o.width}" height="${o.height}" viewBox="0 0 ${o.width} ${o.height}" style="position:absolute;top:0;left:0;">
        <ellipse cx="${o.width/2}" cy="${ry}" rx="${o.width/2 - 2}" ry="${ry - 2}" fill="${c.fill}" stroke="${c.stroke}" stroke-width="2"/>
        <rect x="2" y="${ry}" width="${o.width - 4}" height="${o.height - ry * 2}" fill="${c.fill}" stroke="${c.stroke}" stroke-width="2"/>
        <ellipse cx="${o.width/2}" cy="${o.height - ry}" rx="${o.width/2 - 2}" ry="${ry - 2}" fill="${c.fill}" stroke="${c.stroke}" stroke-width="2"/>
      </svg>
      <div style="position:absolute;top:0;left:0;width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:${o.fontSize}px;font-weight:${o.fontWeight};color:${c.text};text-align:center;padding:${ry}px 8px;">
        ${o.icon ? `<span style="font-size:${o.fontSize*1.3}px;">${o.icon}</span>` : ''}
        ${o.text}
      </div>
    `

    document.getElementById('canvas').appendChild(el)
    this._el = el
    CardRegistry.register(o.id, el, o.x, o.y, o.width, o.height)
  }

  animate() {
    Animate.run(this.options.animation, this._el, 0, { duration: this.options.duration })
  }
}

/* ------------------------------------------
   SPEECH BUBBLE — Thought / speech callout
------------------------------------------ */
class SpeechBubble {
  constructor(options = {}) {
    this.options = {
      text: options.text || '',

      x: options.x || 100,
      y: options.y || 100,
      width: options.width || 240,

      // TAIL DIRECTION
      // "left" | "right" | "bottom-left" | "bottom-right"
      tail: options.tail || 'bottom-left',

      color: options.color || 'dark',
      fontSize: options.fontSize || 28,
      fontWeight: options.fontWeight || 600,

      animation: options.animation || 'scalePop',
      duration: options.duration || 0.5,
    }
    this._el = null
  }

  render() {
    const o = this.options
    const colors = {
      blue:   { bg: '#1e3a5f', border: '#93c5fd', text: '#fff' },
      purple: { bg: '#3b1f6e', border: '#a78bfa', text: '#fff' },
      green:  { bg: '#064e3b', border: '#6ee7b7', text: '#fff' },
      yellow: { bg: '#78571a', border: '#f5e6a3', text: '#fff' },
      amber:  { bg: '#92400e', border: '#fcd34d', text: '#fff' },
      red:    { bg: '#7f1d1d', border: '#f87171', text: '#fff' },
      cyan:   { bg: '#164e63', border: '#22d3ee', text: '#fff' },
      pink:   { bg: '#831843', border: '#f472b6', text: '#fff' },
      teal:   { bg: '#134e4a', border: '#2dd4bf', text: '#fff' },
      orange: { bg: '#7c2d12', border: '#fb923c', text: '#fff' },
      indigo: { bg: '#312e81', border: '#818cf8', text: '#fff' },
      dark:   { bg: '#1f1f1f', border: 'rgba(255,255,255,0.4)', text: '#fff' },
    }
    const c = colors[o.color] || colors.dark

    const el = document.createElement('div')
    el.dataset.module = 'speech-bubble'
    el.style.cssText = `
      position: absolute;
      left: ${o.x}px;
      top: ${o.y}px;
      width: ${o.width}px;
      background: ${c.bg};
      border: 2px solid ${c.border};
      border-radius: 16px;
      padding: 16px 20px;
      font-size: ${o.fontSize}px;
      font-weight: ${o.fontWeight};
      color: ${c.text};
      text-align: center;
      opacity: 0;
    `
    el.textContent = o.text

    // Build the tail as real DOM elements (pseudo-elements can't be set via JS)
    const tailOuter = document.createElement('div')
    tailOuter.style.cssText = `position:absolute; bottom:-24px; left:${o.tail === 'bottom-right' ? 'auto' : '18px'}; ${o.tail === 'bottom-right' ? 'right:18px;' : ''} width:0; height:0; border:14px solid transparent; border-top-color:${c.border};`
    el.appendChild(tailOuter)

    const tailInner = document.createElement('div')
    tailInner.style.cssText = `position:absolute; bottom:-20px; left:${o.tail === 'bottom-right' ? 'auto' : '20px'}; ${o.tail === 'bottom-right' ? 'right:20px;' : ''} width:0; height:0; border:12px solid transparent; border-top-color:${c.bg};`
    el.appendChild(tailInner)

    document.getElementById('canvas').appendChild(el)
    this._el = el
  }

  animate() {
    Animate.run(this.options.animation, this._el, 0, { duration: this.options.duration })
  }
}
