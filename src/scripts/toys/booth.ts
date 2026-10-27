// Photobooth card: the filter radios restyle the scene in CSS; Snap adds a little polaroid to the strip.
// "Use my real camera" swaps the drawn scene for your webcam (only after that click; nothing is uploaded).

import { still } from '../store';

const FILTERS: Record<string, string> = {
  natural: 'none',
  espresso: 'sepia(0.6) contrast(1.1) saturate(1.2)',
  mono: 'grayscale(1) contrast(1.3)',
  pop: 'saturate(2) hue-rotate(-14deg) contrast(1.1)',
};
const MAX = 5;

export function init(booth: HTMLElement) {
  const card = booth.closest('article')!;
  const scene = booth.querySelector<HTMLElement>('[data-booth-scene]')!;
  const drawn = scene.querySelector<HTMLElement>('.scene')!;
  const video = booth.querySelector<HTMLVideoElement>('[data-booth-video]')!;
  const live = booth.querySelector<HTMLElement>('[data-booth-live]')!;
  const count = booth.querySelector<HTMLElement>('[data-booth-count]')!;
  const flash = booth.querySelector<HTMLElement>('[data-booth-flash]')!;
  const snapBtn = booth.querySelector<HTMLButtonElement>('[data-booth-snap]')!;
  const camBtn = card.querySelector<HTMLButtonElement>('[data-booth-cam]')!;
  const strip = card.querySelector<HTMLOListElement>('[data-booth-strip]')!;
  const status = card.querySelector<HTMLElement>('[data-booth-status]')!;

  let stream: MediaStream | null = null;
  let busy = false;
  const current = () => booth.querySelector<HTMLInputElement>('input[name="booth-filter"]:checked')?.value ?? 'natural';
  const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

  async function camOn() {
    if (!navigator.mediaDevices?.getUserMedia) {
      status.textContent = 'This browser can’t open a camera.';
      return;
    }
    status.textContent = 'Asking for the camera…';
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 960 } }, audio: false });
      video.srcObject = stream;
      await video.play();
      booth.classList.add('is-live');
      live.textContent = '● Live';
      camBtn.textContent = 'Turn the camera off';
      status.textContent = 'You’re live. Nothing leaves your browser.';
    } catch (err) {
      status.textContent =
        (err as DOMException).name === 'NotAllowedError'
          ? 'Camera blocked. Allow it from the address bar and try again.'
          : 'Couldn’t find a camera.';
    }
  }

  function camOff(message = 'Camera off.') {
    stream?.getTracks().forEach((t) => t.stop());
    stream = null;
    video.srcObject = null;
    booth.classList.remove('is-live');
    live.textContent = '● [Live camera]';
    camBtn.textContent = 'Use my real camera';
    status.textContent = message;
  }

  function addSnap(content: HTMLElement) {
    const li = document.createElement('li');
    li.className = 'snap';
    li.style.setProperty('--tilt', `${(Math.random() * 12 - 6).toFixed(1)}deg`);
    li.append(content);
    strip.prepend(li);
    while (strip.children.length > MAX) {
      const old = strip.lastElementChild as HTMLElement;
      const url = old.querySelector('img')?.src;
      old.remove();
      if (url?.startsWith('blob:')) URL.revokeObjectURL(url);
    }
  }

  async function snap() {
    if (busy) return;
    busy = true;
    snapBtn.disabled = true;
    const filter = current();
    if (stream && !still()) {
      for (const n of ['3', '2', '1']) {
        count.textContent = n;
        count.classList.remove('pop');
        void count.offsetWidth;
        count.classList.add('pop');
        await wait(600);
      }
      count.textContent = '';
    }
    flash.classList.remove('go');
    void flash.offsetWidth;
    flash.classList.add('go');

    if (stream) {
      const side = Math.min(video.videoWidth, video.videoHeight);
      const c = document.createElement('canvas');
      c.width = c.height = Math.min(side, 480);
      const ctx = c.getContext('2d')!;
      ctx.filter = FILTERS[filter];
      ctx.translate(c.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, (video.videoWidth - side) / 2, (video.videoHeight - side) / 2, side, side, 0, 0, c.width, c.height);
      const blob = await new Promise<Blob | null>((r) => c.toBlob(r, 'image/jpeg', 0.85));
      if (blob) {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(blob);
        img.alt = `Your snap, ${filter} filter`;
        addSnap(img);
      }
    } else {
      // a tiny copy of the drawn scene, with the filter baked in
      const mini = drawn.cloneNode(true) as HTMLElement;
      mini.classList.add('scene-mini');
      mini.style.filter = FILTERS[filter];
      addSnap(mini);
    }
    status.textContent = `Snapped with ${filter}. ${strip.children.length} on the strip.`;
    busy = false;
    snapBtn.disabled = false;
  }

  snapBtn.addEventListener('click', snap);
  booth.addEventListener('autoplay', () => {
    flash.classList.remove('go');
    void flash.offsetWidth;
    flash.classList.add('go');
  });
  camBtn.addEventListener('click', () => (stream ? camOff() : camOn()));

  // be polite: the camera turns off once the card scrolls out of view
  new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting && stream) camOff('Camera turned off when you scrolled away.');
  }).observe(booth);
}
