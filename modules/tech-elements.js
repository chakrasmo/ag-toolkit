/* ============================================
   TECH-ELEMENTS.JS
   BrowserWindow, CodeBlock
   ============================================ */

/* ------------------------------------------
   BROWSER WINDOW — macOS style Safari/Chrome
------------------------------------------ */
class BrowserWindow {
  constructor(options = {}) {
    this.options = {
      x: options.x || 100,
      y: options.y || 100,
      width: options.width || 800,
      height: options.height || 500,
      url: options.url || "https://example.com",
      contentHtml: options.contentHtml || "",
      animation: options.animation || 'scalePop',
      duration: options.duration || 0.5,
      loop: options.loop || 'none'
    }
    this._el = null
  }
  
  render() {
    const o = this.options
    const el = document.createElement('div')
    el.dataset.module = 'browser-window'
    el.style.cssText = `
      position: absolute; left: ${o.x}px; top: ${o.y}px;
      width: ${o.width}px; height: ${o.height}px;
      background: #1e1e1e; border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.2);
      box-shadow: 0 10px 40px rgba(0,0,0,0.6);
      display: flex; flex-direction: column; overflow: hidden;
      opacity: 0;
    `
    // Top bar
    const bar = document.createElement('div')
    bar.style.cssText = `
      height: 40px; background: #2d2d2d; border-bottom: 1px solid #111;
      display: flex; align-items: center; padding: 0 15px; gap: 8px;
    `
    bar.innerHTML = `
      <div style="width: 12px; height: 12px; border-radius: 50%; background: #ff5f56;"></div>
      <div style="width: 12px; height: 12px; border-radius: 50%; background: #ffbd2e;"></div>
      <div style="width: 12px; height: 12px; border-radius: 50%; background: #27c93f;"></div>
      <div style="flex: 1; display: flex; justify-content: center;">
        <div style="background: #111; padding: 4px 12px; border-radius: 6px; color: #aaa; font-size: 14px; font-family: monospace;">${o.url}</div>
      </div>
      <div style="width: 44px;"></div>
    `
    el.appendChild(bar)

    // Content area
    const content = document.createElement('div')
    content.style.cssText = `flex: 1; padding: 20px; color: white; position: relative; overflow: hidden;`
    content.innerHTML = o.contentHtml
    el.appendChild(content)

    document.getElementById('canvas').appendChild(el)
    this._el = el
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

/* ------------------------------------------
   CODE BLOCK — Terminal/IDE styled box
------------------------------------------ */
class CodeBlock {
  constructor(options = {}) {
    this.options = {
      x: options.x || 100, y: options.y || 100,
      width: options.width || 600, height: options.height || 'auto',
      code: options.code || "// Write code here",
      animation: options.animation || 'slideInUp',
      duration: options.duration || 0.5,
      loop: options.loop || 'none'
    }
    this._el = null
  }

  render() {
    const o = this.options
    const el = document.createElement('div')
    el.dataset.module = 'code-block'
    el.style.cssText = `
      position: absolute; left: ${o.x}px; top: ${o.y}px;
      width: ${o.width}px;
      ${o.height !== 'auto' ? `height: ${o.height}px;` : ''}
      background: #0d1117; border-radius: 8px;
      border: 1px solid #30363d;
      box-shadow: 0 4px 30px rgba(0,0,0,0.5);
      padding: 24px; font-family: 'Courier New', Courier, monospace;
      font-size: 20px; line-height: 1.6; color: #c9d1d9;
      opacity: 0; white-space: pre-wrap; text-align: left;
    `
    
    // Syntax highlighting — order matters to prevent tag corruption.
    // 1) Escape HTML so content is safe
    let formatted = o.code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
    // 2) Comments (must go first — they consume the rest of the line)
    formatted = formatted.replace(/(\/\/.*|#.*)/g, '<span style="color: #8b949e;">$1</span>')
    // 3) Strings (before keywords, so keywords inside strings aren't highlighted)
    formatted = formatted.replace(/('.*?'|".*?"|`.*?`)/g, '<span style="color: #a5d6ff;">$1</span>')
    // 4) Keywords
    formatted = formatted.replace(/\b(const|let|var|function|class|return|if|else|import|from|def|async|await|for|while|new|this|export|default)\b/g, '<span style="color: #ff7b72;">$1</span>')
    // 5) Function calls (word followed by parenthesis)
    formatted = formatted.replace(/\b(\w+)(?=\()/g, '<span style="color: #d2a8ff;">$1</span>')

    el.innerHTML = formatted

    document.getElementById('canvas').appendChild(el)
    this._el = el
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
