export async function initPreloader({ counterSelector = '#counter', preloaderEl, assets = [] } = {}) {
  const counter = document.querySelector(counterSelector);
  let loaded = 0;
  const total = Math.max(assets.length, 1);
  // try to prefetch assets (best-effort; network errors ignored)
  await Promise.all(assets.map(src => fetch(src).then(()=> {
    loaded++;
    counter.textContent = `[${String(Math.round((loaded / total) * 100)).padStart(3, '0')}]`;
  }).catch(()=> {
    // still count even if fail (local dev)
    loaded++;
    counter.textContent = `[${String(Math.round((loaded / total) * 100)).padStart(3, '0')}]`;
  })));

  // smooth finish
  let current = parseInt(counter.textContent.replace(/\D/g,''), 10) || 0;
  while (current < 100) {
    current += Math.min(6, 100 - current);
    counter.textContent = `[${String(current).padStart(3,'0')}]`;
    await new Promise(r => setTimeout(r, 40));
  }

  // play a finishing tone if available
  const preloaderSound = document.getElementById('preloaderSound');
  if (preloaderSound) preloaderSound.play().catch(()=>{});

  // hide preloader
  if (preloaderEl) preloaderEl.style.display = 'none';
  return true;
}
