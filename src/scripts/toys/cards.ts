// Project cards: they tilt toward the cursor, and when nobody is touching one it plays its own demo
// (SOS fills, booth filters cycle, DistroQ keeps jobs flowing and kills a worker).
// Any touch, click or keypress on a card pauses its demo for a while.

import { still } from '../store';

const IDLE_MS = 7000;
const STEP_MS = 2200;

export function init(grid: HTMLElement) {
  if (still()) return;
  const cards = [...grid.querySelectorAll<HTMLElement>('[data-card]')];
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const state = new Map(cards.map((c) => [c, { touched: 0, visible: false, tick: 0 }]));

  for (const card of cards) {
    const st = state.get(card)!;
    const touch = () => (st.touched = performance.now());
    card.addEventListener('pointerdown', touch);
    card.addEventListener('keydown', touch);
    card.addEventListener('focusin', touch);

    if (fine) {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const rx = ((e.clientY - r.top) / r.height - 0.5) * -5;
        const ry = ((e.clientX - r.left) / r.width - 0.5) * 7;
        card.style.transform = `perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-4px)`;
      });
      card.addEventListener('pointerleave', () => (card.style.transform = ''));
    }
  }

  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => (state.get(en.target as HTMLElement)!.visible = en.isIntersecting)),
    { threshold: 0.4 },
  );
  cards.forEach((c) => io.observe(c));

  const radios = (card: HTMLElement, name: string) => [...card.querySelectorAll<HTMLInputElement>(`input[name="${name}"]`)];
  const cycle = (inputs: HTMLInputElement[]) => {
    const i = inputs.findIndex((r) => r.checked);
    inputs[(i + 1) % inputs.length].checked = true;
  };

  const steps: Record<string, (card: HTMLElement, tick: number) => void> = {
    elira: (card, tick) => {
      if (tick % 3 === 0) card.querySelector('[data-sos]')?.dispatchEvent(new Event('autoplay'));
    },
    booth: (card, tick) => {
      cycle(radios(card, 'booth-filter'));
      if (tick % 2 === 1) card.querySelector('[data-booth]')?.dispatchEvent(new Event('autoplay'));
    },
    distroq: (card) => card.querySelector('[data-distroq]')?.dispatchEvent(new Event('autoplay')),
  };

  setInterval(() => {
    const now = performance.now();
    for (const card of cards) {
      const st = state.get(card)!;
      if (!st.visible || now - st.touched < IDLE_MS || document.hidden) continue;
      steps[card.dataset.card ?? '']?.(card, st.tick++);
    }
  }, STEP_MS);
}
