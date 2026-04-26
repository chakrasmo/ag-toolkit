/* ============================================
   CARD.JS — Rounded rectangle card
   Most common element in diagrams
   ============================================ */

class Card {
  constructor(options = {}) {
    this.options = {

      // CONTENT
      text: options.text || 'Card',         // string — main label
      icon: options.icon || null,           // emoji or null — shown above text
      subtext: options.subtext || null,     // string or null — smaller text below

      // POSITION (pixels, top-left corner of card)
      x: options.x || 100,                 // 0 to 1920
      y: options.y || 100,                 // 0 to 1080

      // SIZE
      width: options.width || 220,         // pixels
      height: options.height || 'auto',    // pixels or 'auto'

      // COLOR SCHEME
      // "blue" | "purple" | "green" | "yellow" | "red" | "dark" | "white" | "amber"
      color: options.color || 'dark',

      // BORDER
      border: options.border !== false,     // true | false
      borderStyle: options.borderStyle || 'solid',  // "solid" | "dashed" | "none"
      borderRadius: options.borderRadius || 18,      // pixels

      // GLOW
      glow: options.glow || false,          // true | false — ambient glow behind card

      // FONT
      fontSize: options.fontSize || 32,    // pixels
      fontWeight: options.fontWeight || 600, // 400 | 600 | 700
      textAlign: options.textAlign || 'center', // "center" | "left" | "right"
      textColor: options.textColor || null, // override text color or null for auto

      // ENTRANCE ANIMATION
      // "fadeIn" | "slideInLeft" | "slideInRight" | "slideInUp" | "slideInDown" | "scalePop" | "irisWipe" | "clipReveal" | "blurIn" | "flipIn"
      animation: options.animation || 'scalePop',
      duration: options.duration || 0.5,   // seconds

      // EMPHASIS (runs after entrance)
      // "glowPulse" | "shake" | "scaleBounce" | "none"
      emphasis: options.emphasis || 'none',
      emphasisDelay: options.emphasisDelay || 0.8, // seconds after entrance

      // LOOP ANIMATION (runs forever after entrance)
      // "float" | "breathe" | "pulseGlow" | "none"
      loop: options.loop || 'none',

      // ID for arrow connections
      id: options.id || null,
    }

    this._el = null
  }

  _getColors() {
    const map = {
      blue:   { bg: '#1e3a5f', border: '#93c5fd', text: '#ffffff', glow: 'rgba(147,197,253,0.35)' },
      purple: { bg: '#3b1f6e', border: '#a78bfa', text: '#ffffff', glow: 'rgba(167,139,250,0.35)' },
      green:  { bg: '#064e3b', border: '#6ee7b7', text: '#ffffff', glow: 'rgba(110,231,183,0.35)' },
      yellow: { bg: '#78571a', border: '#f5e6a3', text: '#ffffff', glow: 'rgba(245,230,163,0.35)' },
      amber:  { bg: '#92400e', border: '#fcd34d', text: '#ffffff', glow: 'rgba(252,211,77,0.35)'  },
      red:    { bg: '#7f1d1d', border: '#f87171', text: '#ffffff', glow: 'rgba(248,113,113,0.35)' },
      cyan:   { bg: '#164e63', border: '#22d3ee', text: '#ffffff', glow: 'rgba(34,211,238,0.35)'  },
      pink:   { bg: '#831843', border: '#f472b6', text: '#ffffff', glow: 'rgba(244,114,182,0.35)' },
      teal:   { bg: '#134e4a', border: '#2dd4bf', text: '#ffffff', glow: 'rgba(45,212,191,0.35)'  },
      orange: { bg: '#7c2d12', border: '#fb923c', text: '#ffffff', glow: 'rgba(251,146,60,0.35)'  },
      indigo: { bg: '#312e81', border: '#818cf8', text: '#ffffff', glow: 'rgba(129,140,248,0.35)' },
      dark:   { bg: '#1f1f1f', border: 'rgba(255,255,255,0.4)', text: '#ffffff', glow: 'rgba(255,255,255,0.1)' },
      white:  { bg: '#ffffff', border: '#cccccc', text: '#1a1a1a', glow: 'rgba(255,255,255,0.2)' },
    }
    return map[this.options.color] || map.dark
  }

  render() {
    const o = this.options
    const c = this._getColors()
    const textColor = o.textColor || c.text

    const el = document.createElement('div')
    el.dataset.module = 'card'
    if (o.id) el.id = o.id

    el.style.cssText = `
      position: absolute;
      left: ${o.x}px;
      top: ${o.y}px;
      width: ${o.width}px;
      ${o.height !== 'auto' ? `height: ${o.height}px;` : ''}
      background: ${c.bg};
      border: ${o.border ? `2.5px ${o.borderStyle} ${c.border}` : 'none'};
      border-radius: ${o.borderRadius}px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px 16px;
      text-align: ${o.textAlign};
      opacity: 0;
      ${o.glow ? `box-shadow: 0 0 28px 6px ${c.glow};` : ''}
    `

    let inner = ''
    if (o.icon) {
      inner += `<span style="font-size:${o.fontSize * 1.3}px;line-height:1;margin-bottom:8px;display:block;">${o.icon}</span>`
    }
    inner += `<span style="font-size:${o.fontSize}px;font-weight:${o.fontWeight};color:${textColor};line-height:1.3;">${o.text}</span>`
    if (o.subtext) {
      inner += `<span style="font-size:${o.fontSize * 0.65}px;color:${textColor};opacity:0.7;margin-top:6px;">${o.subtext}</span>`
    }
    el.innerHTML = inner

    document.getElementById('canvas').appendChild(el)
    this._el = el

    // Register position for arrow connections
    CardRegistry.register(o.id, el, o.x, o.y, o.width, o.height === 'auto' ? el.offsetHeight : o.height)
  }

  animate() {
    const o = this.options
    const el = this._el
    if (!el) return

    // Entrance
    Animate.run(o.animation, el, 0, { duration: o.duration })

    // Emphasis
    if (o.emphasis !== 'none') {
      setTimeout(() => {
        if (o.emphasis === 'glowPulse') Animate.glowPulse(el)
        if (o.emphasis === 'shake') Animate.shake(el)
        if (o.emphasis === 'scaleBounce') Animate.scaleBounce(el)
      }, o.emphasisDelay * 1000)
    }

    // Loop
    if (o.loop !== 'none') {
      setTimeout(() => {
        if (o.loop === 'float') Animate.float(el)
        if (o.loop === 'breathe') Animate.breathe(el)
        if (o.loop === 'pulseGlow') Animate.pulseGlow(el)
      }, (o.duration + 0.1) * 1000)
    }
  }

  // Returns center coordinates (for arrow connections)
  center() {
    if (!this._el) return { x: 0, y: 0 }
    const r = this._el.getBoundingClientRect()
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
  }
}

/* ============================================
   CARD REGISTRY — tracks card positions
   Used by Arrow to find connection points
   ============================================ */
const CardRegistry = {
  _cards: {},

  register(id, el, x, y, w, h) {
    if (!id) return
    this._cards[id] = { el, x, y, w, h }
  },

  get(id) { return this._cards[id] || null },

  // Get edge point of a card
  // side: "left" | "right" | "top" | "bottom" | "center"
  edge(id, side = 'right') {
    const c = this._cards[id]
    if (!c) return null
    const cx = c.x + c.w / 2
    const cy = c.y + c.h / 2
    const map = {
      left:   { x: c.x,           y: cy },
      right:  { x: c.x + c.w,     y: cy },
      top:    { x: cx,             y: c.y },
      bottom: { x: cx,             y: c.y + c.h },
      center: { x: cx,             y: cy },
    }
    return map[side] || map.right
  }
}
