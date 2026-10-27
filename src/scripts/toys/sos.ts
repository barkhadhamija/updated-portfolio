// ELIRA demo: press and hold SOS, the ring fills, the screen turns orange.

const HOLD_MS = 1500;
const CIRC = 2 * Math.PI * 44;

export function init(stage: HTMLElement) {
  const btn = stage.querySelector<HTMLButtonElement>('[data-sos-btn]')!;
  const ring = stage.querySelector<SVGCircleElement>('[data-sos-progress]')!;
  const help = stage.querySelector<HTMLElement>('[data-sos-help]')!;
  const status = stage.querySelector<HTMLElement>('[data-sos-status]')!;
  const screen = stage.querySelector<HTMLElement>('[data-sos-screen]')!;
  const reset = stage.querySelector<HTMLButtonElement>('[data-sos-reset]')!;

  ring.style.strokeDasharray = String(CIRC);
  let progress = 0;
  let holding = false;
  let sent = false;
  let start = 0;
  let raf = 0;

  const paint = () => (ring.style.strokeDashoffset = String(CIRC * (1 - progress)));
  paint();

  function loop(now: number) {
    if (holding) {
      progress = Math.min(1, (now - start) / HOLD_MS);
      if (progress >= 1) return send();
    } else {
      progress = Math.max(0, progress - 0.07); // drains back if you let go early
    }
    paint();
    if (holding || progress > 0) raf = requestAnimationFrame(loop);
  }

  function begin() {
    if (sent || holding) return;
    holding = true;
    start = performance.now() - progress * HOLD_MS;
    btn.classList.add('is-holding');
    help.textContent = 'Keep holding…';
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(loop);
  }

  function end() {
    if (!holding || sent) return;
    holding = false;
    btn.classList.remove('is-holding');
    help.textContent = progress > 0.15 ? 'Almost. Hold a little longer.' : 'Press and hold for 1.5 seconds';
  }

  function send() {
    holding = false;
    sent = true;
    progress = 1;
    paint();
    btn.classList.remove('is-holding');
    screen.classList.add('is-sent');
    status.textContent = '● SOS sent';
    help.textContent = 'Help is on the way. (A demo: nobody was told.)';
    reset.hidden = false;
    navigator.vibrate?.(160);
  }

  function doReset(focus: boolean) {
    sent = false;
    progress = 0;
    paint();
    screen.classList.remove('is-sent');
    status.textContent = '● Safe';
    help.textContent = 'Press and hold for 1.5 seconds';
    reset.hidden = true;
    if (focus) btn.focus();
  }
  reset.addEventListener('click', () => doReset(true));

  // the card plays its own demo when nobody is touching it (toys/cards.ts)
  stage.addEventListener('autoplay', () => {
    if (holding) return;
    if (sent) doReset(false);
    else begin();
  });

  btn.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    btn.focus();
    try { btn.setPointerCapture(e.pointerId); } catch { /* fine */ }
    begin();
  });
  btn.addEventListener('pointerup', end);
  btn.addEventListener('pointercancel', end);
  btn.addEventListener('lostpointercapture', end);
  btn.addEventListener('contextmenu', (e) => e.preventDefault());
  btn.addEventListener('keydown', (e) => {
    if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
      e.preventDefault();
      begin();
    }
  });
  btn.addEventListener('keyup', (e) => {
    if (e.key === ' ' || e.key === 'Enter') end();
  });
  btn.addEventListener('blur', end);
}
