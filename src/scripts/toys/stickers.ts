// Stickers scattered down the page: they wobble on springs when you scroll, and you can drag them anywhere.
// A click without dragging gives one a spin.

import { still } from '../store';

type S = { el: HTMLElement; base: number; a: number; va: number; dx: number; dy: number };

export function init() {
  const els = [...document.querySelectorAll<HTMLElement>('[data-page-sticker]')];
  if (!els.length) return;
  const isStill = still();
  const list: S[] = els.map((el) => ({
    el,
    base: parseFloat(getComputedStyle(el).getPropertyValue('--rot')) || 0,
    a: 0, va: 0, dx: 0, dy: 0,
  }));
  let z = 30;
  let lastY = scrollY;
  let running = false;

  const paint = (s: S) => (s.el.style.transform = `translate(${s.dx}px, ${s.dy}px) rotate(${(s.base + s.a).toFixed(2)}deg)`);

  function frame() {
    const v = scrollY - lastY;
    lastY = scrollY;
    let busy = Math.abs(v) > 0.1;
    for (const s of list) {
      // a spring pulled toward a lean that follows the scroll speed
      const target = Math.max(-28, Math.min(28, v * 0.9));
      s.va += (target - s.a) * 0.08;
      s.va *= 0.82;
      s.a += s.va;
      paint(s);
      if (Math.abs(s.va) > 0.02 || Math.abs(s.a - target) > 0.05) busy = true;
    }
    if (busy) requestAnimationFrame(frame);
    else running = false;
  }
  function wake() {
    if (running || isStill) return;
    running = true; // lastY is left alone so the first frame sees the scroll that woke us
    requestAnimationFrame(frame);
  }
  addEventListener('scroll', wake, { passive: true });

  for (const s of list) {
    let drag: { id: number; sx: number; sy: number; ox: number; oy: number; moved: boolean } | null = null;
    s.el.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      s.el.setPointerCapture(e.pointerId);
      drag = { id: e.pointerId, sx: e.clientX, sy: e.clientY, ox: s.dx, oy: s.dy, moved: false };
      s.el.style.zIndex = String(++z);
      s.el.classList.add('is-lifted');
    });
    s.el.addEventListener('pointermove', (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const ddx = e.clientX - drag.sx, ddy = e.clientY - drag.sy;
      if (Math.abs(ddx) + Math.abs(ddy) > 4) drag.moved = true;
      s.dx = drag.ox + ddx;
      s.dy = drag.oy + ddy;
      s.va += (e.movementX || 0) * 0.15; // it swings as you drag it
      paint(s);
      wake();
    });
    const up = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      const spin = !drag.moved;
      drag = null;
      s.el.classList.remove('is-lifted');
      if (spin && !isStill) {
        s.va += 30;
        wake();
      }
    };
    s.el.addEventListener('keydown', (e) => {
      const step = e.shiftKey ? 40 : 12;
      const moves: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
      if (!moves[e.key]) return;
      e.preventDefault();
      s.dx += moves[e.key][0];
      s.dy += moves[e.key][1];
      s.va += moves[e.key][0] * 0.3;
      paint(s);
      wake();
    });
    s.el.addEventListener('click', (e) => {
      if ((e as PointerEvent).detail === 0 && !isStill) { // Enter / Space spins it
        s.va += 30;
        wake();
      }
    });
    s.el.addEventListener('pointerup', up);
    s.el.addEventListener('pointercancel', up);
  }
}
