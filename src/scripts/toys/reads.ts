// On my desk: flip through the Substack cards. The two cards peeking out behind take the next colours.

const COLORS = ['#FFFFFF', 'var(--yellow)', 'var(--lime)', 'var(--lilac)'];

export function init(panel: HTMLElement) {
  const cards = [...panel.querySelectorAll<HTMLElement>('[data-read]')];
  const counter = panel.querySelector<HTMLElement>('[data-reads-count]');
  const back1 = panel.querySelector<HTMLElement>('.read-back-1');
  const back2 = panel.querySelector<HTMLElement>('.read-back-2');
  const pad = (n: number) => String(n).padStart(2, '0');
  let i = 0;

  function show(next: number, dir: number) {
    i = (next + cards.length) % cards.length;
    cards.forEach((c, k) => (c.hidden = k !== i));
    cards[i].animate?.(
      [{ transform: `translateX(${dir * 40}px) rotate(${dir * 3}deg)`, opacity: 0 }, { transform: 'none', opacity: 1 }],
      { duration: 380, easing: 'cubic-bezier(.16,1,.3,1)' },
    );
    if (counter) counter.textContent = `${pad(i + 1)} / ${pad(cards.length)}`;
    back1?.style.setProperty('background', COLORS[(i + 1) % COLORS.length]);
    back2?.style.setProperty('background', COLORS[(i + 2) % COLORS.length]);
  }

  panel.querySelector('[data-reads-next]')?.addEventListener('click', () => show(i + 1, 1));
  panel.querySelector('[data-reads-prev]')?.addEventListener('click', () => show(i - 1, -1));
  show(0, 0);
}
