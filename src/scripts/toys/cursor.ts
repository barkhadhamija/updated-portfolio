// A cursor companion: a dot that trails the pointer and grows a label ("drag", "sip", "hold"…)
// over anything with data-cursor. The normal cursor stays visible. Mouse and trackpad only.

export function init() {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const el = document.querySelector<HTMLElement>('.cursor');
  const label = document.querySelector<HTMLElement>('[data-cursor-label]');
  if (!el || !label) return;
  document.documentElement.classList.add('has-cursor');

  let x = -100, y = -100, cx = -100, cy = -100;
  let raf = 0;

  function frame() {
    cx += (x - cx) * 0.3;
    cy += (y - cy) * 0.3;
    el!.style.transform = `translate(${cx}px, ${cy}px)`;
    raf = Math.abs(x - cx) + Math.abs(y - cy) > 0.3 ? requestAnimationFrame(frame) : 0;
  }

  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    x = e.clientX;
    y = e.clientY;
    el.classList.add('is-on');
    if (!raf) raf = requestAnimationFrame(frame);
  });
  document.addEventListener('pointerleave', () => el.classList.remove('is-on'));
  addEventListener('pointerdown', () => el.classList.add('is-down'));
  addEventListener('pointerup', () => el.classList.remove('is-down'));

  document.addEventListener('pointerover', (e) => {
    const target = (e.target as Element).closest<HTMLElement>('[data-cursor]');
    if (target) {
      label.textContent = target.dataset.cursor ?? '';
      el.classList.add('has-label');
    } else {
      el.classList.remove('has-label');
    }
  });
}
