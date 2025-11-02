export function initCanvas(canvasId, fpsEl = null) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  window.addEventListener('resize', resize);
  resize();

  // simple animated background (moving stars)
  const stars = Array.from({length:120}).map(()=>({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.2,
    vy: (Math.random() - 0.5) * 0.2,
    r: Math.random() * 1.6 + 0.2
  }));

  let last = performance.now(), frames = 0, acc = 0;
  function loop(now) {
    const dt = Math.min(40, now - last);
    last = now;
    // clear
    ctx.clearRect(0,0,canvas.width,canvas.height);
    // draw subtle gradient overlay
    const g = ctx.createLinearGradient(0,0,canvas.width,canvas.height);
    g.addColorStop(0, 'rgba(0,8,10,0.12)');
    g.addColorStop(1, 'rgba(0,0,0,0.25)');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // update & draw stars
    ctx.beginPath();
    for (let s of stars) {
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      if (s.x < 0) s.x = canvas.width;
      if (s.x > canvas.width) s.x = 0;
      if (s.y < 0) s.y = canvas.height;
      if (s.y > canvas.height) s.y = 0;
      ctx.moveTo(s.x, s.y);
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    }
    ctx.fillStyle = 'rgba(180,255,240,0.65)';
    ctx.fill();

    // fps
    frames++;
    acc += dt;
    if (acc >= 1000) {
      const fps = Math.round((frames / acc) * 1000);
      frames = 0; acc = 0;
      if (fpsEl) fpsEl.textContent = fps;
    }

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}
