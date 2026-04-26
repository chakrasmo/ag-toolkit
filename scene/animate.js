/* ============================================
   ANIMATE.JS — Core animation engine
   All animation functions used by every module
   Requires GSAP loaded via CDN
   ============================================ */

const Animate = {

  /* ------------------------------------------
     ENTRANCE ANIMATIONS
     How elements appear for the first time
  ------------------------------------------ */

  // Fade in from invisible
  // el: DOM element | duration: seconds | delay: seconds
  fadeIn(el, duration = 0.4, delay = 0) {
    gsap.fromTo(el,
      { opacity: 0 },
      { opacity: 1, duration, delay, ease: 'power2.out' }
    )
  },

  // Slide in from left
  slideInLeft(el, duration = 0.5, delay = 0) {
    gsap.fromTo(el,
      { x: -80, opacity: 0 },
      { x: 0, opacity: 1, duration, delay, ease: 'power3.out' }
    )
  },

  // Slide in from right
  slideInRight(el, duration = 0.5, delay = 0) {
    gsap.fromTo(el,
      { x: 80, opacity: 0 },
      { x: 0, opacity: 1, duration, delay, ease: 'power3.out' }
    )
  },

  // Slide in from above (drop down)
  slideInDown(el, duration = 0.5, delay = 0) {
    gsap.fromTo(el,
      { y: -60, opacity: 0 },
      { y: 0, opacity: 1, duration, delay, ease: 'power3.out' }
    )
  },

  // Slide in from below (rise up)
  slideInUp(el, duration = 0.5, delay = 0) {
    gsap.fromTo(el,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration, delay, ease: 'power3.out' }
    )
  },

  // Scale pop with overshoot bounce
  scalePop(el, duration = 0.5, delay = 0) {
    gsap.fromTo(el,
      { scale: 0.3, opacity: 0 },
      { scale: 1, opacity: 1, duration, delay, ease: 'back.out(1.7)' }
    )
  },

  // Iris wipe — circle expanding from center
  irisWipe(el, duration = 0.6, delay = 0) {
    gsap.set(el, { opacity: 1 })
    gsap.fromTo(el,
      { clipPath: 'circle(0% at 50% 50%)', opacity: 1 },
      { clipPath: 'circle(150% at 50% 50%)', duration, delay, ease: 'power2.inOut' }
    )
  },

  // Clip reveal — wipe left to right
  clipReveal(el, duration = 0.6, delay = 0) {
    gsap.fromTo(el,
      { clipPath: 'inset(0 100% 0 0)', opacity: 1 },
      { clipPath: 'inset(0 0% 0 0)', duration, delay, ease: 'power2.inOut' }
    )
  },

  // Blur in — resolves from blurry to sharp
  blurIn(el, duration = 0.6, delay = 0) {
    gsap.fromTo(el,
      { filter: 'blur(14px)', opacity: 0 },
      { filter: 'blur(0px)', opacity: 1, duration, delay, ease: 'power2.out' }
    )
  },

  // Flip in — card flips from side
  flipIn(el, duration = 0.6, delay = 0) {
    gsap.set(el, { perspective: 800 })
    gsap.fromTo(el,
      { rotationY: 90, opacity: 0 },
      { rotationY: 0, opacity: 1, duration, delay, ease: 'power2.out' }
    )
  },

  // Typewriter — types text character by character
  // el must be a DOM element with text content
  typewriter(el, duration = 1.5, delay = 0) {
    const text = el.textContent
    el.textContent = ''
    gsap.set(el, { opacity: 1 })
    const chars = text.split('')
    const charDur = duration / chars.length
    chars.forEach((char, i) => {
      setTimeout(() => {
        el.textContent += char
      }, (delay * 1000) + i * charDur * 1000)
    })
  },

  // Word by word reveal — each word appears one by one
  wordByWord(el, duration = 0.06, delay = 0) {
    const words = el.textContent.trim().split(' ')
    el.innerHTML = words.map(w => `<span style="opacity:0;display:inline-block;margin-right:8px">${w}</span>`).join('')
    gsap.set(el, { opacity: 1 })
    el.querySelectorAll('span').forEach((span, i) => {
      gsap.to(span, { opacity: 1, y: 0, duration: 0.3, delay: delay + i * duration })
    })
  },

  // Counter tick-up — animates a number from 0 to target
  // el: element, target: final number, prefix: "$" etc, suffix: "%" or "x" etc
  counterTickUp(el, target, prefix = '', suffix = '', duration = 1.5, delay = 0) {
    gsap.set(el, { opacity: 1 })
    setTimeout(() => {
      const obj = { val: 0 }
      gsap.to(obj, {
        val: target,
        duration,
        ease: 'power1.out',
        onUpdate: () => { el.textContent = prefix + Math.round(obj.val) + suffix }
      })
    }, delay * 1000)
  },

  /* ------------------------------------------
     EMPHASIS ANIMATIONS
     Applied to elements already on screen
  ------------------------------------------ */

  // Glow pulse — pulses box shadow 2-3 times
  // color: CSS color string
  glowPulse(el, color = 'rgba(147,197,253,0.6)', loops = 3) {
    gsap.to(el, {
      boxShadow: `0 0 40px 12px ${color}`,
      duration: 0.5,
      repeat: loops * 2 - 1,
      yoyo: true,
      ease: 'power2.inOut'
    })
  },

  // Shake / wobble — for errors or warnings
  shake(el) {
    gsap.fromTo(el,
      { x: 0 },
      { x: 10, duration: 0.08, repeat: 6, yoyo: true, ease: 'power1.inOut',
        onComplete: () => gsap.set(el, { x: 0 }) }
    )
  },

  // Scale bounce — draws attention to visible element
  scaleBounce(el) {
    gsap.to(el, { scale: 1.12, duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.inOut' })
  },

  // Dim others — fades all siblings, keeps el bright
  dimOthers(el, siblingSelector, dimOpacity = 0.2) {
    document.querySelectorAll(siblingSelector).forEach(s => {
      if (s !== el) gsap.to(s, { opacity: dimOpacity, duration: 0.4 })
    })
    gsap.to(el, { opacity: 1, duration: 0.4 })
  },

  // Restore all — undoes dimOthers
  restoreAll(selector) {
    document.querySelectorAll(selector).forEach(s => {
      gsap.to(s, { opacity: 1, duration: 0.4 })
    })
  },

  /* ------------------------------------------
     LOOP / AMBIENT ANIMATIONS
     Run continuously after entrance
  ------------------------------------------ */

  // Float up and down forever
  float(el, range = 10, duration = 3) {
    gsap.to(el, {
      y: `-=${range}`,
      duration,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
  },

  // Breathing scale — gentle pulse
  breathe(el, scale = 1.04, duration = 4) {
    gsap.to(el, {
      scale,
      duration,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
  },

  // Pulse glow — continuous glow loop
  pulseGlow(el, color = 'rgba(147,197,253,0.5)', duration = 2) {
    gsap.to(el, {
      boxShadow: `0 0 30px 8px ${color}`,
      duration,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
  },

  // Rotate forever (for gears, spinners)
  rotateLoop(el, duration = 4) {
    gsap.to(el, {
      rotation: 360,
      duration,
      repeat: -1,
      ease: 'none'
    })
  },

  /* ------------------------------------------
     SCENE-LEVEL ANIMATIONS
     Applied to whole canvas or large sections
  ------------------------------------------ */

  // Ken Burns — slow zoom + slight drift
  kenBurns(el, duration = 8) {
    gsap.fromTo(el,
      { scale: 1, x: 0, y: 0 },
      { scale: 1.06, x: -20, y: -10, duration, ease: 'none' }
    )
  },

  // Push in drift — slow upward drift
  pushInDrift(el, duration = 10) {
    gsap.to(el, { y: -18, duration, ease: 'none' })
  },

  // Scene fade out
  fadeOut(el, duration = 0.6, delay = 0) {
    gsap.to(el, { opacity: 0, duration, delay, ease: 'power2.inOut' })
  },

  /* ------------------------------------------
     ARROW DRAWING
     SVG path self-drawing animation
  ------------------------------------------ */

  // Draw SVG path from start to end
  drawPath(pathEl, duration = 0.6, delay = 0) {
    const length = pathEl.getTotalLength()
    gsap.set(pathEl, { strokeDasharray: length, strokeDashoffset: length, opacity: 1 })
    gsap.to(pathEl, {
      strokeDashoffset: 0,
      duration,
      delay,
      ease: 'power2.inOut'
    })
  },

  // Marching dashes — animated flowing dashes
  marchingDashes(pathEl, duration = 1) {
    const length = pathEl.getTotalLength()
    gsap.set(pathEl, { strokeDasharray: '12 8', strokeDashoffset: 0, opacity: 1 })
    gsap.to(pathEl, {
      strokeDashoffset: -length,
      duration,
      repeat: -1,
      ease: 'none'
    })
  },

  /* ------------------------------------------
     UTILITY
  ------------------------------------------ */

  // Run entrance animation by name
  // animation: string name | el: DOM element | delay: seconds
  run(animation, el, delay = 0, options = {}) {
    const map = {
      // "animationName": method
      fadeIn:       () => this.fadeIn(el, options.duration || 0.4, delay),
      slideInLeft:  () => this.slideInLeft(el, options.duration || 0.5, delay),
      slideInRight: () => this.slideInRight(el, options.duration || 0.5, delay),
      slideInDown:  () => this.slideInDown(el, options.duration || 0.5, delay),
      slideInUp:    () => this.slideInUp(el, options.duration || 0.5, delay),
      scalePop:     () => this.scalePop(el, options.duration || 0.5, delay),
      irisWipe:     () => this.irisWipe(el, options.duration || 0.6, delay),
      clipReveal:   () => this.clipReveal(el, options.duration || 0.6, delay),
      blurIn:       () => this.blurIn(el, options.duration || 0.6, delay),
      flipIn:       () => this.flipIn(el, options.duration || 0.6, delay),
      typewriter:   () => this.typewriter(el, options.duration || 1.5, delay),
      wordByWord:   () => this.wordByWord(el, options.charDelay || 0.06, delay),
    }
    if (map[animation]) map[animation]()
    else console.warn(`Animate.run: unknown animation "${animation}"`)
  }
}
