// The hero desk: drag anything, flick it and it slides with momentum and bounces off the edges.
// Tap the cup to sip; every fourth sip refills it and bumps the coffee count everywhere.

import { still } from '../store';

type Body = {
  el: HTMLElement;
  id: string;
  rot: number;
  dx: number; dy: number;
  vx: number; vy: number;
  spin: number; va: number;
};

export function init(desk: HTMLElement) {
  const isStill = still();
  const hint = document.querySelector<HTMLElement>('[data-desk-hint]');
  const tidy = document.querySelector<HTMLButtonElement>('[data-desk-tidy]');
  const coffee = desk.querySelector<HTMLElement>('[data-cup-level]');
  let level = 1;
  let z = 20;
  let running = false;
  let last = 0;

  const bodies: Body[] = [...desk.querySelectorAll<HTMLElement>('.desk-item')].map((el) => ({
    el,
    id: el.dataset.id ?? '',
    rot: parseFloat(getComputedStyle(el).getPropertyValue('--rot')) || 0,
    dx: 0, dy: 0, vx: 0, vy: 0, spin: 0, va: 0,
  }));

  let drag: { b: Body; id: number; sx: number; sy: number; ox: number; oy: number; moved: boolean; trail: { x: number; y: number; t: number }[] } | null = null;

  function paint(b: Body, lifted = false) {
    b.el.style.transform = `translate(${b.dx}px, ${b.dy}px) rotate(${b.rot + b.spin}deg) scale(${lifted ? 1.06 : 1})`;
  }

  /** Keep at least a third of each item on the desk; returns true if it hit an edge. */
  function confine(b: Body) {
    const W = desk.clientWidth, H = desk.clientHeight;
    const w = b.el.offsetWidth, h = b.el.offsetHeight;
    const left = b.el.offsetLeft + b.dx, top = b.el.offsetTop + b.dy;
    let hit = false;
    if (left < -w * 0.3) { b.dx += -w * 0.3 - left; b.vx = Math.abs(b.vx) * 0.7; hit = true; }
    if (left > W - w * 0.7) { b.dx -= left - (W - w * 0.7); b.vx = -Math.abs(b.vx) * 0.7; hit = true; }
    if (top < -h * 0.3) { b.dy += -h * 0.3 - top; b.vy = Math.abs(b.vy) * 0.7; hit = true; }
    if (top > H - h * 0.7) { b.dy -= top - (H - h * 0.7); b.vy = -Math.abs(b.vy) * 0.7; hit = true; }
    return hit;
  }

  function frame(now: number) {
    const dt = Math.min(3, (now - last) / 16.67);
    last = now;
    let moving = false;
    const damp = Math.pow(0.94, dt);
    for (const b of bodies) {
      if (drag?.b === b) continue;
      if (Math.abs(b.vx) + Math.abs(b.vy) + Math.abs(b.va) < 0.05) continue;
      b.dx += b.vx * dt;
      b.dy += b.vy * dt;
      b.spin += b.va * dt;
      b.vx *= damp;
      b.vy *= damp;
      b.va *= Math.pow(0.9, dt);
      confine(b);
      paint(b);
      moving = true;
    }
    if (moving || drag) requestAnimationFrame(frame);
    else running = false;
  }

  function wake() {
    if (running || isStill) return;
    running = true;
    last = performance.now();
    requestAnimationFrame(frame);
  }

  function sip() {
    level -= 0.25;
    if (level <= 0.01) {
      level = 1;
      dispatchEvent(new Event('coffee:refill'));
      const cups = document.querySelector('[data-cups]')?.textContent ?? '';
      if (hint) hint.textContent = `Refilled. That’s cup number ${cups}.`;
    } else if (hint) {
      hint.textContent = `Sip. ${Math.round(level * 100)}% left.`;
    }
    if (coffee) coffee.style.transform = `scale(${Math.max(0.12, level)})`;
  }

  function wiggle(el: HTMLElement) {
    el.animate?.(
      [{ translate: '0 0' }, { translate: '0 -8px' }, { translate: '0 0' }],
      { duration: 320, easing: 'cubic-bezier(.16,1,.3,1)' },
    );
  }

  // the mouse pushes things out of its way, sweeping along its real path so fast moves can't skip items
  const CURSOR = 22;
  const pointer = { x: 0, y: 0, vx: 0, vy: 0, t: 0, inside: false };
  desk.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' || drag || isStill) return;
    const r = desk.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    if (!pointer.inside) {
      Object.assign(pointer, { x, y, t: e.timeStamp, inside: true });
      return;
    }
    const frames = Math.max(0.5, (e.timeStamp - pointer.t) / 16.67);
    pointer.vx = (x - pointer.x) / frames;
    pointer.vy = (y - pointer.y) / frames;
    const sx = x - pointer.x, sy = y - pointer.y;
    const len2 = sx * sx + sy * sy || 1;
    for (const b of bodies) {
      const w = b.el.offsetWidth, h = b.el.offsetHeight;
      const cx = b.el.offsetLeft + b.dx + w / 2, cy = b.el.offsetTop + b.dy + h / 2;
      const t = Math.max(0, Math.min(1, ((cx - pointer.x) * sx + (cy - pointer.y) * sy) / len2));
      const px = pointer.x + sx * t, py = pointer.y + sy * t;
      const dx = cx - px, dy = cy - py;
      const d = Math.hypot(dx, dy) || 0.01;
      const min = CURSOR + Math.min(w, h) * 0.45;
      if (d >= min) continue;
      const nx = dx / d, ny = dy / d, overlap = min - d;
      const along = Math.max(0, pointer.vx * nx + pointer.vy * ny);
      b.dx += nx * overlap;
      b.dy += ny * overlap;
      b.vx = Math.max(-60, Math.min(60, b.vx + nx * (along * 1.1 + overlap * 0.25) + pointer.vx * 0.3));
      b.vy = Math.max(-60, Math.min(60, b.vy + ny * (along * 1.1 + overlap * 0.25) + pointer.vy * 0.3));
      b.va += (nx * pointer.vy - ny * pointer.vx) * 0.04;
      confine(b);
      paint(b);
    }
    Object.assign(pointer, { x, y, t: e.timeStamp });
    wake();
  });
  desk.addEventListener('pointerleave', () => (pointer.inside = false));

  desk.addEventListener('pointerdown', (e) => {
    const el = (e.target as Element).closest<HTMLElement>('.desk-item');
    const b = el && bodies.find((x) => x.el === el);
    if (!b) return;
    e.preventDefault();
    el.setPointerCapture(e.pointerId);
    b.vx = b.vy = b.va = 0;
    z++;
    el.style.zIndex = String(z);
    el.classList.add('is-lifted');
    drag = { b, id: e.pointerId, sx: e.clientX, sy: e.clientY, ox: b.dx, oy: b.dy, moved: false, trail: [{ x: e.clientX, y: e.clientY, t: e.timeStamp }] };
    paint(b, true);
    wake();
  });

  desk.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const ddx = e.clientX - drag.sx, ddy = e.clientY - drag.sy;
    if (Math.abs(ddx) + Math.abs(ddy) > 4) drag.moved = true;
    drag.b.dx = drag.ox + ddx;
    drag.b.dy = drag.oy + ddy;
    drag.trail.push({ x: e.clientX, y: e.clientY, t: e.timeStamp });
    if (drag.trail.length > 10) drag.trail.shift();
    paint(drag.b, true);
  });

  function release(e: PointerEvent) {
    if (!drag || e.pointerId !== drag.id) return;
    const { b, moved, trail } = drag;
    drag = null;
    b.el.classList.remove('is-lifted');
    if (!moved) {
      paint(b);
      if (b.id === 'cup') sip();
      else wiggle(b.el);
      return;
    }
    // flick: speed over the last ~70ms of the drag
    const end = trail[trail.length - 1];
    const start = trail.find((p) => end.t - p.t <= 70) ?? end;
    const frames = Math.max(1, (end.t - start.t) / 16.67);
    b.vx = Math.max(-60, Math.min(60, (end.x - start.x) / frames));
    b.vy = Math.max(-60, Math.min(60, (end.y - start.y) / frames));
    b.va = b.vx * 0.12;
    if (isStill) { b.vx = b.vy = b.va = 0; confine(b); }
    paint(b);
    wake();
  }
  desk.addEventListener('pointerup', release);
  desk.addEventListener('pointercancel', release);

  // keyboard: Enter / Space on the cup sips, on anything else wiggles it
  desk.addEventListener('click', (e) => {
    if ((e as PointerEvent).pointerType !== '' && (e as PointerEvent).detail !== 0) return; // pointer clicks handled above
    const el = (e.target as Element).closest<HTMLElement>('.desk-item');
    if (!el) return;
    if (el.dataset.id === 'cup') sip();
    else wiggle(el);
  });

  // keyboard: arrow keys move the focused item (Shift for bigger steps)
  desk.addEventListener('keydown', (e) => {
    const el = (e.target as Element).closest<HTMLElement>('.desk-item');
    const b = el && bodies.find((x) => x.el === el);
    const step = e.shiftKey ? 40 : 12;
    const moves: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    if (!b || !moves[e.key]) return;
    e.preventDefault();
    b.dx += moves[e.key][0];
    b.dy += moves[e.key][1];
    confine(b);
    paint(b);
  });

  tidy?.addEventListener('click', () => {
    for (const b of bodies) {
      b.dx = b.dy = b.vx = b.vy = b.va = b.spin = 0;
      b.el.style.transition = 'transform 0.6s cubic-bezier(.16,1,.3,1)';
      paint(b);
      setTimeout(() => (b.el.style.transition = ''), 650);
    }
    if (hint) hint.textContent = 'All tidy. For now.';
  });

  addEventListener('resize', () => bodies.forEach((b) => { confine(b); paint(b); }));
}
