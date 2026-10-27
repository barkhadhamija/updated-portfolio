// Hero headline: letters near the cursor swell, lift and spring away, then settle back.
// Grotesk letters also get thinner as they swell (Bricolage is a variable font). On touch, a tap sends a wave.

import { still } from '../store';

type L = { el: HTMLElement; serif: boolean; cx: number; cy: number; x: number; y: number; r: number; s: number; w: number };

export function init(title: HTMLElement) {
  if (still()) return;
  const letters: L[] = [];

  // split every text node outside the greeting button into words of letters
  const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => ((n.parentElement?.closest('button') || !n.textContent?.trim()) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
  });
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  for (const node of nodes) {
    const frag = document.createDocumentFragment();
    const serif = !!node.parentElement?.closest('.hl, .serif');
    for (const part of (node.textContent ?? '').split(/(\s+)/)) {
      if (!part) continue;
      if (/^\s+$/.test(part)) {
        frag.append(part);
        continue;
      }
      const word = document.createElement('span');
      word.className = 'word';
      for (const ch of part) {
        const s = document.createElement('span');
        s.className = 'letter';
        s.textContent = ch;
        word.append(s);
        letters.push({ el: s, serif, cx: 0, cy: 0, x: 0, y: 0, r: 0, s: 1, w: 800 });
      }
      frag.append(word);
    }
    node.replaceWith(frag);
  }

  // lock each letter's width so changing its weight never reflows the line
  function measure() {
    for (const l of letters) {
      l.el.style.width = '';
      l.el.style.width = `${l.el.getBoundingClientRect().width}px`;
      l.cx = l.el.offsetLeft + l.el.offsetWidth / 2;
      l.cy = l.el.offsetTop + l.el.offsetHeight / 2;
    }
  }
  document.fonts.ready.then(measure);
  new ResizeObserver(measure).observe(title);

  let px = -9999, py = -9999;
  let running = false;

  function frame() {
    const box = title.getBoundingClientRect();
    let busy = false;
    for (const l of letters) {
      const dx = box.left + l.cx - px, dy = box.top + l.cy - py;
      const d = Math.hypot(dx, dy) || 1;
      const f = Math.max(0, 1 - d / 170) ** 2;
      const tx = (dx / d) * f * 30, ty = (dy / d) * f * 30 - f * 10;
      const tr = (dx > 0 ? 1 : -1) * f * 14, ts = 1 + f * 0.22, tw = 800 - f * 520;
      l.x += (tx - l.x) * 0.2;
      l.y += (ty - l.y) * 0.2;
      l.r += (tr - l.r) * 0.2;
      l.s += (ts - l.s) * 0.2;
      l.w += (tw - l.w) * 0.2;
      l.el.style.transform = `translate(${l.x.toFixed(2)}px, ${l.y.toFixed(2)}px) rotate(${l.r.toFixed(2)}deg) scale(${l.s.toFixed(3)})`;
      if (!l.serif) l.el.style.fontVariationSettings = `'wght' ${l.w.toFixed(0)}`;
      if (Math.abs(tx - l.x) + Math.abs(ty - l.y) + Math.abs(tr - l.r) > 0.05) busy = true;
    }
    if (busy) requestAnimationFrame(frame);
    else running = false;
  }
  function wake() {
    if (running) return;
    running = true;
    requestAnimationFrame(frame);
  }

  const hero = title.closest('section') ?? title;
  hero.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    px = e.clientX;
    py = e.clientY;
    wake();
  });
  hero.addEventListener('pointerleave', () => {
    px = py = -9999;
    wake();
  });

  // a wave across the letters: on load, and on every tap for touch screens
  function wave() {
    letters.forEach((l, i) =>
      l.el.animate?.(
        [{ translate: '0 0', rotate: '0deg' }, { translate: '0 -0.18em', rotate: '-6deg' }, { translate: '0 0', rotate: '0deg' }],
        { duration: 520, delay: i * 35, easing: 'cubic-bezier(.16,1,.3,1)' },
      ),
    );
  }
  setTimeout(wave, 700);
  title.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' && !(e.target as Element).closest('button')) wave();
  });
}
