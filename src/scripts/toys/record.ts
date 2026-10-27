// On my desk: the record player. Play/Pause is a checkbox (it spins in CSS); this plays each song's
// 30-second Apple Music preview, and shuffles one Hindi, one English, one Hindi…

import type { Track } from '../../data/site';

export function init(panel: HTMLElement) {
  const tracks: Track[] = JSON.parse(panel.dataset.tracks ?? '[]');
  const song = panel.querySelector<HTMLElement>('[data-track-song]');
  const artist = panel.querySelector<HTMLElement>('[data-track-artist]');
  const label = panel.querySelector<HTMLElement>('[data-track-color]');
  const play = panel.querySelector<HTMLInputElement>('[data-play]');
  const link = panel.querySelector<HTMLAnchorElement>('[data-track-link]');
  const audio = new Audio();
  audio.preload = 'none';
  // one shuffled "bag" per language: every song in it plays once before any song repeats
  const bags = new Map<Track['lang'], Track[]>();
  const lastOf = new Map<Track['lang'], Track>();

  function shuffled(list: Track[]) {
    const out = [...list];
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }

  function draw(lang: Track['lang']): Track {
    let bag = bags.get(lang) ?? [];
    if (!bag.length) {
      bag = shuffled(tracks.filter((t) => t.lang === lang));
      // a fresh bag never starts with the song that ended the last one
      if (bag.length > 1 && bag[0] === lastOf.get(lang)) bag.push(bag.shift()!);
      bags.set(lang, bag);
    }
    const t = bag.shift()!;
    lastOf.set(lang, t);
    return t;
  }

  // alternate languages: the next song is always from the other one
  function pick(prev?: Track): Track {
    const langs = [...new Set(tracks.map((t) => t.lang))];
    const others = langs.filter((l) => l !== prev?.lang);
    const pool = others.length ? others : langs;
    return draw(pool[Math.floor(Math.random() * pool.length)]);
  }

  let current = pick();

  function show() {
    if (song) song.textContent = current.song;
    if (artist) artist.textContent = current.artist;
    label?.style.setProperty('background', current.color);
    if (link) {
      link.href = `https://music.apple.com/us/song/${current.appleId}`;
      // the Apple credit only for Apple's previews; kept in the layout so the panel doesn't jump
      link.style.visibility = current.src.startsWith('https://') ? '' : 'hidden';
    }
  }

  function start() {
    if (!audio.src.endsWith(current.src)) audio.src = current.src;
    audio.play().catch(() => {
      // the clip didn't load (or the browser said no): stop the record instead of spinning in silence
      if (play) play.checked = false;
    });
  }

  function next() {
    current = pick(current);
    show();
    if (play) play.checked = true; // skipping a track starts it playing
    start();
  }

  play?.addEventListener('change', () => (play.checked ? start() : audio.pause()));
  panel.querySelector('[data-track-next]')?.addEventListener('click', next);
  audio.addEventListener('ended', next);
  audio.addEventListener('error', () => {
    if (play) play.checked = false;
    if (artist) artist.textContent = `${current.artist} · preview unavailable`;
  });
  show();
}
