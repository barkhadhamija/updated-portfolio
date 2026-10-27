// Say hi: copy the email, and stick stickers on the wall (they're thrown in with a little spin).

import { still } from '../store';

const MAX = 16;

export function init(wall: HTMLElement) {
  const board = wall.querySelector<HTMLElement>('[data-wall-board]')!;
  const empty = wall.querySelector<HTMLElement>('[data-wall-empty]');
  const count = wall.querySelector<HTMLElement>('[data-wall-count]');

  function update() {
    const n = board.querySelectorAll('.wall-sticker').length;
    if (empty) empty.hidden = n > 0;
    if (count) count.textContent = n === 0 ? 'No stickers yet' : `${n} sticker${n === 1 ? '' : 's'} on the wall`;
  }

  wall.querySelectorAll<HTMLButtonElement>('[data-sticker]').forEach((btn) =>
    btn.addEventListener('click', () => {
      const s = document.createElement('span');
      s.className = 'wall-sticker';
      s.textContent = btn.dataset.sticker ?? '';
      s.style.setProperty('--sbg', getComputedStyle(btn).getPropertyValue('--sbg'));
      s.style.left = `${Math.round(4 + Math.random() * 62)}%`;
      s.style.top = `${Math.round(6 + Math.random() * 72)}%`;
      const rot = Math.round(Math.random() * 30 - 15);
      s.style.transform = `rotate(${rot}deg)`;
      board.append(s);
      if (!still()) {
        s.animate?.(
          [{ transform: `translateY(-120px) rotate(${rot - 60}deg) scale(1.4)`, opacity: 0 }, { transform: `rotate(${rot}deg)`, opacity: 1 }],
          { duration: 450, easing: 'cubic-bezier(.2,1.4,.4,1)' },
        );
      }
      const all = board.querySelectorAll('.wall-sticker');
      if (all.length > MAX) all[0].remove();
      update();
    }),
  );

  wall.querySelector('[data-wall-clear]')?.addEventListener('click', () => {
    board.querySelectorAll('.wall-sticker').forEach((s) => s.remove());
    update();
  });

  // copy email lives in the same section
  const copy = document.querySelector<HTMLButtonElement>('[data-copy-email]');
  copy?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(copy.dataset.email ?? '');
      copy.textContent = 'Copied!';
    } catch {
      copy.textContent = copy.dataset.email ?? 'Copy failed';
    }
    setTimeout(() => (copy.textContent = 'Copy my email'), 1800);
  });
  update();
}
