// The moving band: drifts on its own, speeds up and leans with scroll, and reverses when you scroll up.

import { still } from '../store';

export function init(band: HTMLElement) {
  if (still()) return;
  const track = band.querySelector<HTMLElement>('[data-ticker-track]')!;
  const run = track.firstElementChild as HTMLElement;
  let x = 0;
  let dir = 1;
  let lastY = scrollY;
  let vel = 0;
  let visible = false;
  let raf = 0;

  function frame() {
    const dy = scrollY - lastY;
    lastY = scrollY;
    if (dy !== 0) dir = dy > 0 ? 1 : -1;
    vel += (dy - vel) * 0.15;
    const width = run.offsetWidth || 1;
    x -= dir * 1.1 + vel * 0.5;
    x = ((x % width) - width) % width; // keep it looping inside one run
    const skew = Math.max(-12, Math.min(12, vel * -0.35));
    track.style.transform = `translate3d(${x}px, 0, 0) skewX(${skew}deg)`;
    raf = visible ? requestAnimationFrame(frame) : 0;
  }

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && !raf) {
      lastY = scrollY;
      raf = requestAnimationFrame(frame);
    }
  }).observe(band);
}
