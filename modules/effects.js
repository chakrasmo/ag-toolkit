/* ============================================
   EFFECTS.JS
   GlowOverlay, HighlightBox, Divider,
   Sparkles, Icon, Counter, DotFlow
   ============================================ */

/* ------------------------------------------
   ICON — Standalone emoji or icon
------------------------------------------ */
class Icon {
  constructor(options = {}) {
    if (typeof options === 'string') options = { icon: options }

    this.options = {
      icon: options.icon || '✦',          // emoji, text, or HTML entity

      x: options.x || 100,
      y: options.y || 100,

      size: options.size || 60,           // font-size pixels
      color: options.color || '#ffffff',
      opacity: options.opacity || 1,

      // ENTRANCE ANIMATION
      // "fadeIn" | "scalePop" | "slideInDown" | "float"
      animation: options.animation || 'scalePop',
      duration: options.duration || 0.4,

      // LOOP
      // "float" | "breathe" | "rotateLoop" | "none"
      loop: options.loop || 'none',
    }
    this._el = null
  }

  render() {
    const o = this.options
    const el = document.createElement('div')
    el.dataset.module = 'icon'

    el.style.cssText = `
      position: absolute;
      left: ${o.x}px;
      top: ${o.y}px;
      font-size: ${o.size}px;
      color: ${o.color};
      opacity: 0;
      line-height: 1;
      pointer-events: none;
    `
    el.textContent = o.icon
    document.getElementById('canvas').appendChild(el)
    this._el = el
  }

  animate() {
    const o = this.options
    Animate.run(o.animation, this._el, 0, { duration: o.duration })
    if (o.loop === 'float') setTimeout(() => Animate.float(this._el), o.duration * 1000 + 100)
    if (o.loop === 'breathe') setTimeout(() => Animate.breathe(this._el), o.duration * 1000 + 100)
    if (o.loop === 'rotateLoop') setTimeout(() => Animate.rotateLoop(this._el), o.duration * 1000 + 100)
  }
}

/* ------------------------------------------
   SPARKLES — Decorative spark cluster
------------------------------------------ */
class Sparkles {
  constructor(options = {}) {
    this.options = {
      // CENTER position
      cx: options.cx || 500,
      cy: options.cy || 300,

      count: options.count || 4,          // number of sparks
      spread: options.spread || 60,       // pixel radius spread

      // SPARK CHARACTERS
      // array of chars to use randomly
      chars: options.chars || ['✦', '+', '·', '✧'],
      color: options.color || '#ffffff',

      // SIZE range
      minSize: options.minSize || 16,
      maxSize: options.maxSize || 36,

      animation: options.animation || 'scalePop',
      duration: options.duration || 0.4,
      stagger: options.stagger || 0.08,   // seconds between each spark
    }
    this._els = []
  }

  render() {
    const o = this.options
    for (let i = 0; i < o.count; i++) {
      const el = document.createElement('div')
      el.dataset.module = 'sparkle'

      const angle = (i / o.count) * Math.PI * 2
      const dist = o.spread * (0.5 + Math.random() * 0.5)
      const x = o.cx + Math.cos(angle) * dist
      const y = o.cy + Math.sin(angle) * dist
      const char = o.chars[i % o.chars.length]
      const size = o.minSize + Math.random() * (o.maxSize - o.minSize)

      el.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        font-size: ${size}px;
        color: ${o.color};
        opacity: 0;
        pointer-events: none;
      `
      el.textContent = char
      document.getElementById('canvas').appendChild(el)
      this._els.push(el)
    }
  }

  animate() {
    const o = this.options
    this._els.forEach((el, i) => {
      setTimeout(() => Animate.run(o.animation, el, 0, { duration: o.duration }),
        i * o.stagger * 1000)
    })
  }
}

/* ------------------------------------------
   DIVIDER — Horizontal or vertical line
------------------------------------------ */
class Divider {
  constructor(options = {}) {
    this.options = {
      x: options.x || 760,
      y: options.y || 540,

      // "horizontal" | "vertical"
      direction: options.direction || 'horizontal',

      length: options.length || 400,      // pixels
      thickness: options.thickness || 3,  // pixels

      color: options.color || '#a78bfa',  // purple default
      borderRadius: options.borderRadius || 3,

      // ENTRANCE ANIMATION
      // "clipReveal" | "fadeIn"
      animation: options.animation || 'clipReveal',
      duration: options.duration || 0.6,
    }
    this._el = null
  }

  render() {
    const o = this.options
    const el = document.createElement('div')
    el.dataset.module = 'divider'

    const isH = o.direction === 'horizontal'

    el.style.cssText = `
      position: absolute;
      left: ${o.x}px;
      top: ${o.y}px;
      width: ${isH ? o.length : o.thickness}px;
      height: ${isH ? o.thickness : o.length}px;
      background: ${o.color};
      border-radius: ${o.borderRadius}px;
      opacity: 0;
    `
    document.getElementById('canvas').appendChild(el)
    this._el = el
  }

  animate() {
    Animate.run(this.options.animation, this._el, 0, { duration: this.options.duration })
  }
}

/* ------------------------------------------
   HIGHLIGHT BOX — Transparent overlay on group
   Use to frame/group existing elements
------------------------------------------ */
class HighlightBox {
  constructor(options = {}) {
    this.options = {
      x: options.x || 100,
      y: options.y || 100,
      width: options.width || 400,
      height: options.height || 300,

      // COLOR
      // fills with transparent tint
      color: options.color || 'rgba(147,197,253,0.08)',
      borderColor: options.borderColor || 'rgba(147,197,253,0.4)',
      borderRadius: options.borderRadius || 20,
      borderStyle: options.borderStyle || 'solid', // "solid" | "dashed"

      // LABEL for the box
      label: options.label || null,
      labelPosition: options.labelPosition || 'top-left', // "top-left" | "top-right" | "top-center"

      animation: options.animation || 'fadeIn',
      duration: options.duration || 0.5,
    }
    this._el = null
  }

  render() {
    const o = this.options
    const el = document.createElement('div')
    el.dataset.module = 'highlight-box'

    el.style.cssText = `
      position: absolute;
      left: ${o.x}px;
      top: ${o.y}px;
      width: ${o.width}px;
      height: ${o.height}px;
      background: ${o.color};
      border: 2px ${o.borderStyle} ${o.borderColor};
      border-radius: ${o.borderRadius}px;
      opacity: 0;
      pointer-events: none;
    `

    if (o.label) {
      const lbl = document.createElement('div')
      lbl.style.cssText = `
        position: absolute;
        top: -16px;
        left: 16px;
        font-size: 22px;
        color: ${o.borderColor};
        background: #141414;
        padding: 0 8px;
      `
      lbl.textContent = o.label
      el.appendChild(lbl)
    }

    document.getElementById('canvas').appendChild(el)
    this._el = el
  }

  animate() {
    Animate.run(this.options.animation, this._el, 0, { duration: this.options.duration })
  }
}

/* ------------------------------------------
   COUNTER — Animated number tick-up
------------------------------------------ */
class Counter {
  constructor(options = {}) {
    this.options = {
      target: options.target || 100,      // final number
      suffix: options.suffix || '',       // "%" | "x" | "ms" | ""
      prefix: options.prefix || '',       // "$" | "" etc

      x: options.x || 100,
      y: options.y || 100,

      fontSize: options.fontSize || 120,
      fontWeight: options.fontWeight || 700,
      color: options.color || '#ffffff',

      duration: options.duration || 1.5,  // seconds for count animation
    }
    this._el = null
  }

  render() {
    const o = this.options
    const el = document.createElement('div')
    el.dataset.module = 'counter'

    el.style.cssText = `
      position: absolute;
      left: ${o.x}px;
      top: ${o.y}px;
      font-size: ${o.fontSize}px;
      font-weight: ${o.fontWeight};
      color: ${o.color};
      opacity: 0;
      pointer-events: none;
    `
    el.textContent = o.prefix + '0' + o.suffix
    document.getElementById('canvas').appendChild(el)
    this._el = el
  }

  animate() {
    const o = this.options
    gsap.set(this._el, { opacity: 1 })
    Animate.counterTickUp(this._el, o.target, o.prefix, o.suffix, o.duration, 0)
  }
}

/* ------------------------------------------
   DOT FLOW — Animated dot moving along a path
   Used to show data/signal moving through system
------------------------------------------ */
class DotFlow {
  constructor(options = {}) {
    this.options = {
      // PATH COORDINATES — same format as Arrow
      x1: options.x1 || 100,
      y1: options.y1 || 300,
      x2: options.x2 || 800,
      y2: options.y2 || 300,

      // "straight" | "curved"
      pathType: options.pathType || 'straight',
      curvature: options.curvature || -60,

      color: options.color || '#93c5fd',
      size: options.size || 16,           // dot size pixels

      // How long to travel the full path
      duration: options.duration || 1.2,

      // Repeat: -1 = forever, 0 = once, N = N times
      repeat: options.repeat !== undefined ? options.repeat : -1,

      delay: options.delay || 0,
    }
    this._el = null
  }

  render() {
    const o = this.options
    const el = document.createElement('div')
    el.dataset.module = 'dot-flow'

    el.style.cssText = `
      position: absolute;
      width: ${o.size}px;
      height: ${o.size}px;
      border-radius: 50%;
      background: ${o.color};
      box-shadow: 0 0 10px 3px ${o.color}88;
      left: ${o.x1}px;
      top: ${o.y1 - o.size / 2}px;
      opacity: 0;
    `
    document.getElementById('canvas').appendChild(el)
    this._el = el
  }

  animate() {
    const o = this.options
    const el = this._el

    gsap.set(el, { opacity: 1 })

    const tl = gsap.timeline({ repeat: o.repeat, delay: o.delay })

    if (o.pathType === 'straight') {
      tl.to(el, {
        x: o.x2 - o.x1,
        y: o.y2 - o.y1,
        duration: o.duration,
        ease: 'none'
      })
    } else {
      // Real quadratic bezier curve via onUpdate interpolation
      const mx = (o.x1 + o.x2) / 2
      const my = (o.y1 + o.y2) / 2 + o.curvature
      const progress = { t: 0 }
      tl.to(progress, {
        t: 1,
        duration: o.duration,
        ease: 'none',
        onUpdate: () => {
          const t = progress.t
          const inv = 1 - t
          // B(t) = (1-t)²·P0 + 2(1-t)t·P1 + t²·P2
          const bx = inv * inv * o.x1 + 2 * inv * t * mx + t * t * o.x2
          const by = inv * inv * o.y1 + 2 * inv * t * my + t * t * o.y2
          el.style.left = bx + 'px'
          el.style.top = (by - o.size / 2) + 'px'
        }
      })
    }
  }
}

/* ------------------------------------------
   IMAGE — Place an image on the canvas
------------------------------------------ */
class Img {
  constructor(options = {}) {
    this.options = {
      src: options.src || '',             // URL or path to image
      x: options.x || 100,
      y: options.y || 100,
      width: options.width || 200,
      height: options.height || 'auto',
      borderRadius: options.borderRadius || 0,
      border: options.border || null,     // e.g. "2px solid #93c5fd" or null
      opacity: options.opacity || 1,

      // ENTRANCE ANIMATION
      // "fadeIn" | "scalePop" | "slideInLeft" | "slideInRight" | "irisWipe"
      animation: options.animation || 'fadeIn',
      duration: options.duration || 0.5,

      // LOOP ANIMATION
      // "float" | "breathe" | "none"
      loop: options.loop || 'none',

      // ID for arrow connections (optional)
      id: options.id || null,
    }
    this._el = null
  }

  render() {
    const o = this.options
    const el = document.createElement('img')
    el.dataset.module = 'image'
    if (o.id) el.id = o.id
    el.src = o.src

    el.style.cssText = `
      position: absolute;
      left: ${o.x}px;
      top: ${o.y}px;
      width: ${o.width}px;
      ${o.height !== 'auto' ? `height: ${o.height}px;` : ''}
      border-radius: ${o.borderRadius}px;
      ${o.border ? `border: ${o.border};` : ''}
      opacity: 0;
      object-fit: cover;
    `
    document.getElementById('canvas').appendChild(el)
    this._el = el

    // Register for arrow connections once the image has loaded
    if (o.id) {
      const h = o.height !== 'auto' ? o.height : el.offsetHeight || 200
      CardRegistry.register(o.id, el, o.x, o.y, o.width, h)
    }
  }

  animate() {
    const o = this.options
    Animate.run(o.animation, this._el, 0, { duration: o.duration })

    if (o.loop !== 'none') {
      setTimeout(() => {
        if (o.loop === 'float') Animate.float(this._el)
        if (o.loop === 'breathe') Animate.breathe(this._el)
      }, (o.duration + 0.1) * 1000)
    }
  }
}
