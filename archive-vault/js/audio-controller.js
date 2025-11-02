export class AudioController {
  constructor(ids = {}) {
    this.bg = document.getElementById(ids.backgroundId || 'backgroundMusic');
    this.click = document.getElementById(ids.startClickId || 'startClickSound');
    this.hover = document.getElementById(ids.hoverId || 'hoverSound');
    this.preloader = document.getElementById(ids.preloaderId || 'preloaderSound');
    this.enabled = false;
  }

  async enable() {
    if (this.enabled) return;
    // make a quick play gesture to unlock audio in browsers
    try {
      if (this.bg) { await this.bg.play(); this.bg.pause(); }
      if (this.preloader) { await this.preloader.play().then(()=>this.preloader.pause()); }
    } catch (e) { /* ignore */ }
    this.enabled = true;
  }

  playBackground() {
    if (!this.enabled || !this.bg) return;
    this.bg.volume = 0.65;
    this.bg.loop = true;
    this.bg.play().catch(()=>{});
  }

  playClick() { if (this.enabled && this.click) this.click.play().catch(()=>{}); }
  playHover() { if (this.enabled && this.hover) this.hover.play().catch(()=>{}); }
}
