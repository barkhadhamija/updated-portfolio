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
  const played: Track[] = [];

  // the next song is from the other language, and not one you just heard
  function pick(): Track {
    const last = played[played.length - 1];
    const pool = tracks.filter((t) => !last || t.lang !== last.lang);
    const fresh = pool.filter((t) => !played.slice(-3).includes(t));
    const from = fresh.length ? fresh : pool.length ? pool : tracks;
    return from[Math.floor(Math.random() * from.length)];
  }

  let current = pick();
  played.push(current);

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
    current = pick();
    played.push(current);
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
