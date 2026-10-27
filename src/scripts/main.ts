// Always-on behaviour: clock, the shared coffee count, greeting, motion toggle, easter egg, terminal.
// Each toy is its own module, downloaded only when its section gets close to the screen.

import { get, set } from './store';

const root = document.documentElement;
root.classList.add('js');

// Day / Night: the new theme grows out of the switch as a circle (where the browser supports it)
const themeBtn = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
const themeName = document.querySelector('[data-theme-name]');
const themeMeta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
function syncTheme() {
  const night = root.dataset.theme === 'night';
  if (themeName) themeName.textContent = night ? 'Night' : 'Day';
  themeBtn?.setAttribute('aria-pressed', String(night));
  themeMeta?.setAttribute('content', night ? '#0F0F12' : '#FAFAF7');
}
syncTheme();
addEventListener('theme:change', syncTheme);
themeBtn?.addEventListener('click', () => {
  const next = root.dataset.theme === 'night' ? 'day' : 'night';
  const apply = () => {
    root.dataset.theme = next;
    set('theme', next);
    syncTheme();
  };
  const doc = document as Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } };
  if (!doc.startViewTransition || root.classList.contains('still')) return apply();
  const r = themeBtn.getBoundingClientRect();
  root.style.setProperty('--vt-x', `${r.left + r.width / 2}px`);
  root.style.setProperty('--vt-y', `${r.top + r.height / 2}px`);
  root.classList.add('theme-vt');
  doc.startViewTransition(apply).finished.finally(() => root.classList.remove('theme-vt'));
});

// Menu links close the overlay
const menu = document.getElementById('menu');
menu?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => menu.hidePopover()));

// New Delhi clock
const timeFmt = new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' });
const tick = () => document.querySelectorAll('[data-clock]').forEach((el) => (el.textContent = timeFmt.format(new Date())));
tick();
setInterval(tick, 15_000);

// Coffee: starts from the time of day in Delhi, and the desk cup adds to it on every refill
const hour = Number(new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hourCycle: 'h23', timeZone: 'Asia/Kolkata' }).format(new Date()));
let cups = hour < 8 ? 1 : Math.min(5, Math.floor((hour - 8) / 3) + 1);
const showCups = () => document.querySelectorAll('[data-cups]').forEach((el) => (el.textContent = String(cups)));
showCups();
addEventListener('coffee:refill', () => {
  cups++;
  showCups();
});

// Greeting: click "Hi" to cycle
const greet = document.querySelector<HTMLButtonElement>('[data-greet]');
if (greet) {
  const words: string[] = JSON.parse(greet.dataset.greetings ?? '["Hi"]');
  let i = 0;
  greet.addEventListener('click', () => {
    i = (i + 1) % words.length;
    greet.textContent = words[i];
    document.querySelectorAll('[data-greet-echo]').forEach((el) => (el.textContent = words[i]));
    greet.animate?.([{ transform: 'translateY(-0.12em) rotate(-4deg)' }, { transform: 'none' }], { duration: 350, easing: 'cubic-bezier(.16,1,.3,1)' });
  });
}

// Motion toggle (a reload is the simplest way to start or tear down the animation layer)
const motionBtn = document.querySelector<HTMLButtonElement>('[data-motion-toggle]');
if (motionBtn) {
  const on = root.classList.contains('motion');
  motionBtn.textContent = `Motion: ${on ? 'on' : 'off'}`;
  motionBtn.addEventListener('click', () => {
    set('motion', on ? 'off' : 'on');
    location.reload();
  });
}

// Easter egg: click "Brewed in New Delhi" three times
const brew = document.querySelector<HTMLButtonElement>('[data-brew]');
const secret = document.querySelector<HTMLAnchorElement>('[data-secret]');
const brewStatus = document.querySelector('[data-brew-status]');
if (brew && secret) {
  if (get('secret') === '1') secret.hidden = false;
  const lines = ['Brewed in New Delhi', 'Still brewing…', 'Almost…'];
  let clicks = 0;
  brew.addEventListener('click', () => {
    clicks++;
    if (clicks < 3) {
      brew.textContent = lines[clicks];
      return;
    }
    brew.textContent = 'Fresh pot.';
    secret.hidden = false;
    set('secret', '1');
    if (brewStatus) brewStatus.textContent = 'Secret page unlocked.';
    secret.focus();
  });
}

// Terminal: the ` key or the footer button
const terminal = document.getElementById('terminal') as HTMLDialogElement | null;
let terminalReady: Promise<unknown> | null = null;
function openTerminal() {
  if (!terminal) return;
  terminalReady ??= import('./toys/terminal').then((m) => m.init(terminal));
  terminalReady.then(() => {
    terminal.showModal();
    terminal.querySelector('input')?.focus();
  });
}
document.querySelectorAll('[data-open-terminal]').forEach((b) => b.addEventListener('click', openTerminal));
addEventListener('keydown', (e) => {
  const typing = (e.target as Element).closest('input:not([type=radio]):not([type=checkbox]), textarea, select, [contenteditable]');
  if (e.key === '`' && !typing && !terminal?.open) {
    e.preventDefault();
    openTerminal();
  }
});

// Toys: load each one when its section comes within a screen of view
const toys: [string, () => Promise<{ init: (el: HTMLElement) => void }>][] = [
  ['[data-letters]', () => import('./toys/letters')],
  ['[data-ticker]', () => import('./toys/ticker')],
  ['.work-grid', () => import('./toys/cards')],
  ['[data-desk]', () => import('./toys/desk')],
  ['[data-sos]', () => import('./toys/sos')],
  ['[data-booth]', () => import('./toys/booth')],
  ['[data-distroq]', () => import('./toys/distroq')],
  ['[data-photos]', () => import('./toys/photos')],
  ['[data-reads]', () => import('./toys/reads')],
  ['[data-record]', () => import('./toys/record')],
  ['[data-wall]', () => import('./toys/wall')],
];
const io = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      io.unobserve(entry.target);
      const load = toys.find(([sel]) => entry.target.matches(sel))?.[1];
      load?.().then((m) => m.init(entry.target as HTMLElement));
    }
  },
  { rootMargin: '100% 0px' },
);
toys.forEach(([sel]) => document.querySelectorAll(sel).forEach((el) => io.observe(el)));

// Page-wide pieces: the cursor companion and the scattered stickers
import('./toys/cursor').then((m) => m.init());
if (document.querySelector('[data-page-sticker]')) import('./toys/stickers').then((m) => m.init());

if (root.classList.contains('motion')) {
  import('./motion').then((m) => m.init());
}
