/* ============================================
   TEXT-ELEMENTS.JS
   Title, Label, Tagline, Badge, FloatingText
   ============================================ */

/* ------------------------------------------
   TITLE — Top heading of a scene
------------------------------------------ */
class Title {
  constructor(options = {}) {
    // shorthand: new Title("My Title") or new Title({ text: "My Title" })
    if (typeof options === 'string') options = { text: options }

    this.options = {
      text: options.text || 'Title',

      // POSITION
      // "top-center" | "top-left" | "top-right" | custom x/y
      position: options.position || 'top-center',
      x: options.x || null,
      y: options.y || 44,

      // STYLE
      fontSize: options.fontSize || 64,    // pixels
      fontWeight: options.fontWeight || 700,
      color: options.color || '#ffffff',

      // BORDER BOX around title
      // true | false
      bordered: options.bordered !== undefined ? options.bordered : false,
      borderColor: options.borderColor || 'rgba(255,255,255,0.5)',
      borderRadius: options.borderRadius || 14,

      // ENTRANCE ANIMATION
      // "slideInDown" | "fadeIn" | "scalePop" | "typewriter"
      animation: options.animation || 'slideInDown',
      duration: options.duration || 0.5,
    }
    this._el = null
  }

  render() {
    const o = this.options
    const el = document.createElement('div')
    el.dataset.module = 'title'

    let leftStyle = ''
    let transformStyle = ''
    if (o.position === 'top-center' || !o.x) {
      leftStyle = 'left: 50%;'
      transformStyle = 'translateX(-50%)'
    } else {
      leftStyle = `left: ${o.x}px;`
    }

    el.style.cssText = `
      position: absolute;
      top: ${o.y}px;
      ${leftStyle}
      transform: ${transformStyle};
      font-size: ${o.fontSize}px;
      font-weight: ${o.fontWeight};
      color: ${o.color};
      white-space: nowrap;
      opacity: 0;
      ${o.bordered ? `
        border: 2.5px solid ${o.borderColor};
        border-radius: ${o.borderRadius}px;
        padding: 14px 48px;
      ` : ''}
    `
    el.textContent = o.text
    document.getElementById('canvas').appendChild(el)
    this._el = el
  }

  animate() {
    const o = this.options
    if (o.animation === 'typewriter') Animate.typewriter(this._el, o.duration)
    else Animate.run(o.animation, this._el, 0, { duration: o.duration })
  }
}

/* ------------------------------------------
   TAGLINE — Bottom pill bar
   e.g. "Refinement = better output"
------------------------------------------ */
class Tagline {
  constructor(options = {}) {
    if (typeof options === 'string') options = { text: options }

    this.options = {
      text: options.text || '',

      // POSITION
      y: options.y || 960,                 // pixels from top, default near bottom
      x: options.x || null,               // null = centered

      // STYLE
      fontSize: options.fontSize || 38,
      color: options.color || '#ffffff',
      borderColor: options.borderColor || '#f5e6a3',  // yellow default
      background: options.background || 'transparent',
      borderRadius: options.borderRadius || 18,
      padding: options.padding || '16px 52px',

      // ENTRANCE ANIMATION
      // "slideInUp" | "fadeIn" | "scalePop"
      animation: options.animation || 'slideInUp',
      duration: options.duration || 0.5,
    }
    this._el = null
  }

  render() {
    const o = this.options
    const el = document.createElement('div')
    el.dataset.module = 'tagline'

    el.style.cssText = `
      position: absolute;
      top: ${o.y}px;
      ${o.x ? `left: ${o.x}px;` : 'left: 50%; transform: translateX(-50%);'}
      font-size: ${o.fontSize}px;
      color: ${o.color};
      background: ${o.background};
      border: 2.5px solid ${o.borderColor};
      border-radius: ${o.borderRadius}px;
      padding: ${o.padding};
      white-space: nowrap;
      opacity: 0;
    `
    el.textContent = o.text
    document.getElementById('canvas').appendChild(el)
    this._el = el
  }

  animate() {
    const o = this.options
    Animate.run(o.animation, this._el, 0, { duration: o.duration })
  }
}

/* ------------------------------------------
   LABEL — Floating text, no box
   Used for annotations, subscripts, notes
------------------------------------------ */
class Label {
  constructor(options = {}) {
    if (typeof options === 'string') options = { text: options }

    this.options = {
      text: options.text || '',

      x: options.x || 100,
      y: options.y || 100,

      fontSize: options.fontSize || 26,
      fontWeight: options.fontWeight || 400,
      color: options.color || 'rgba(255,255,255,0.7)',

      // TEXT ALIGN
      // "left" | "center" | "right"
      align: options.align || 'left',

      // ENTRANCE ANIMATION
      // "fadeIn" | "slideInUp" | "slideInLeft" | "scalePop"
      animation: options.animation || 'fadeIn',
      duration: options.duration || 0.4,
    }
    this._el = null
  }

  render() {
    const o = this.options
    const el = document.createElement('div')
    el.dataset.module = 'label'

    el.style.cssText = `
      position: absolute;
      left: ${o.x}px;
      top: ${o.y}px;
      font-size: ${o.fontSize}px;
      font-weight: ${o.fontWeight};
      color: ${o.color};
      text-align: ${o.align};
      opacity: 0;
      pointer-events: none;
    `
    el.textContent = o.text
    document.getElementById('canvas').appendChild(el)
    this._el = el
  }

  animate() {
    Animate.run(this.options.animation, this._el, 0, { duration: this.options.duration })
  }
}

/* ------------------------------------------
   BADGE — Pill-shaped small label
   Often floats on arrows or cards
   e.g. "+ details 🔍"
------------------------------------------ */
class Badge {
  constructor(options = {}) {
    if (typeof options === 'string') options = { text: options }

    this.options = {
      text: options.text || '',

      x: options.x || 100,
      y: options.y || 100,

      fontSize: options.fontSize || 26,
      color: options.color || '#ffffff',
      background: options.background || '#1f1f1f',
      borderColor: options.borderColor || 'rgba(255,255,255,0.5)',
      borderRadius: options.borderRadius || 999,
      padding: options.padding || '6px 22px',

      // ENTRANCE ANIMATION
      // "fadeIn" | "scalePop" | "slideInDown" | "slideInUp"
      animation: options.animation || 'scalePop',
      duration: options.duration || 0.4,
    }
    this._el = null
  }

  render() {
    const o = this.options
    const el = document.createElement('div')
    el.dataset.module = 'badge'

    el.style.cssText = `
      position: absolute;
      left: ${o.x}px;
      top: ${o.y}px;
      font-size: ${o.fontSize}px;
      color: ${o.color};
      background: ${o.background};
      border: 1.5px solid ${o.borderColor};
      border-radius: ${o.borderRadius}px;
      padding: ${o.padding};
      white-space: nowrap;
      opacity: 0;
    `
    el.textContent = o.text
    document.getElementById('canvas').appendChild(el)
    this._el = el
  }

  animate() {
    Animate.run(this.options.animation, this._el, 0, { duration: this.options.duration })
  }
}

/* ------------------------------------------
   FLOATING TEXT — Large decorative text
   No border, used for big statements
------------------------------------------ */
class FloatingText {
  constructor(options = {}) {
    if (typeof options === 'string') options = { text: options }

    this.options = {
      text: options.text || '',

      x: options.x || 960,
      y: options.y || 540,
      centered: options.centered !== false, // true = x/y is center point

      fontSize: options.fontSize || 80,
      fontWeight: options.fontWeight || 700,
      color: options.color || '#ffffff',
      lineHeight: options.lineHeight || 1.3,

      // ENTRANCE ANIMATION
      // "fadeIn" | "slideInUp" | "slideInDown" | "scalePop" | "typewriter" | "wordByWord" | "blurIn"
      animation: options.animation || 'fadeIn',
      duration: options.duration || 0.6,

      // LOOP
      // "float" | "breathe" | "none"
      loop: options.loop || 'none',
    }
    this._el = null
  }

  render() {
    const o = this.options
    const el = document.createElement('div')
    el.dataset.module = 'floating-text'

    el.style.cssText = `
      position: absolute;
      left: ${o.x}px;
      top: ${o.y}px;
      ${o.centered ? 'transform: translate(-50%, -50%);' : ''}
      font-size: ${o.fontSize}px;
      font-weight: ${o.fontWeight};
      color: ${o.color};
      line-height: ${o.lineHeight};
      text-align: center;
      opacity: 0;
      pointer-events: none;
    `
    el.textContent = o.text
    document.getElementById('canvas').appendChild(el)
    this._el = el
  }

  animate() {
    const o = this.options
    if (o.animation === 'typewriter') Animate.typewriter(this._el, o.duration)
    else if (o.animation === 'wordByWord') Animate.wordByWord(this._el, 0.08)
    else Animate.run(o.animation, this._el, 0, { duration: o.duration })

    if (o.loop === 'float') setTimeout(() => Animate.float(this._el), o.duration * 1000 + 100)
    if (o.loop === 'breathe') setTimeout(() => Animate.breathe(this._el), o.duration * 1000 + 100)
  }
}
