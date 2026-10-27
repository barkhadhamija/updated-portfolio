// DistroQ card: a small, slowed-down simulation of the real queue.
// Workers pull jobs from the queue; kill one and its locked job is re-delivered (at-least-once);
// a job that fails three times lands in the dead-letter queue.

import { still } from '../store';

type Job = { id: number; tries: number };
type Worker = { el: HTMLButtonElement; bar: HTMLElement; state: HTMLElement; alive: boolean; job: Job | null; start: number; dur: number };

const FAIL_RATE = 0.08;
const MAX_TRIES = 3;
const SHOWN = 24;

export function init(root: HTMLElement) {
  const queueEl = root.querySelector<HTMLElement>('[data-dq-queue]')!;
  const doneEl = root.querySelector<HTMLElement>('[data-dq-done]')!;
  const retriedEl = root.querySelector<HTMLElement>('[data-dq-retried]')!;
  const dlqEl = root.querySelector<HTMLElement>('[data-dq-dlq]')!;
  const status = root.querySelector<HTMLElement>('[data-dq-status]')!;
  const speed = still() ? 0.5 : 1;

  const queue: Job[] = [];
  let nextId = 1, done = 0, retried = 0, dead = 0;
  let raf = 0;

  const workers: Worker[] = [...root.querySelectorAll<HTMLButtonElement>('[data-dq-worker]')].map((el) => ({
    el,
    bar: el.querySelector<HTMLElement>('[data-dq-bar]')!,
    state: el.querySelector<HTMLElement>('[data-dq-state]')!,
    alive: true, job: null, start: 0, dur: 0,
  }));

  const tag = (j: Job) => `#${String(j.id).padStart(3, '0')}`;

  function renderQueue() {
    queueEl.replaceChildren(
      ...queue.slice(0, SHOWN).map((j) => {
        const chip = document.createElement('span');
        chip.className = `dq-chip${j.tries ? ' is-retry' : ''}`;
        chip.textContent = tag(j);
        return chip;
      }),
    );
  }

  function renderCounts() {
    doneEl.textContent = String(done);
    retriedEl.textContent = String(retried);
    dlqEl.textContent = String(dead);
  }

  function enqueue(n: number) {
    for (let i = 0; i < n; i++) queue.push({ id: nextId++, tries: 0 });
    renderQueue();
    wake();
  }

  function frame(now: number) {
    let busy = queue.length > 0;
    for (const w of workers) {
      if (!w.alive) continue;
      if (!w.job && queue.length) {
        w.job = queue.shift()!;
        w.start = now;
        w.dur = (450 + Math.random() * 700) / speed;
        w.state.textContent = tag(w.job);
        w.el.classList.add('is-busy');
        renderQueue();
      }
      if (!w.job) continue;
      busy = true;
      const p = Math.min(1, (now - w.start) / w.dur);
      w.bar.style.transform = `scaleX(${p})`;
      if (p < 1) continue;
      const job = w.job;
      w.job = null;
      w.bar.style.transform = 'scaleX(0)';
      w.state.textContent = 'idle';
      w.el.classList.remove('is-busy');
      if (Math.random() < FAIL_RATE) {
        job.tries++;
        if (job.tries >= MAX_TRIES) {
          dead++;
          status.textContent = `${tag(job)} failed ${MAX_TRIES} times → dead-letter queue.`;
        } else {
          retried++;
          queue.push(job);
          status.textContent = `${tag(job)} failed, retrying (try ${job.tries + 1} of ${MAX_TRIES}).`;
          renderQueue();
        }
      } else {
        done++;
      }
      renderCounts();
    }
    renderCounts();
    raf = busy ? requestAnimationFrame(frame) : 0;
  }

  function wake() {
    if (!raf) raf = requestAnimationFrame(frame);
  }

  function toggleWorker(w: Worker) {
    w.alive = !w.alive;
    w.el.classList.toggle('is-dead', !w.alive);
    w.el.setAttribute('aria-pressed', String(!w.alive));
    const name = w.el.querySelector('.dq-name')?.textContent ?? 'Worker';
    if (!w.alive) {
      if (w.job) {
        // the lock expires and the job is handed out again: at-least-once delivery
        const job = w.job;
        w.job = null;
        retried++;
        queue.unshift(job);
        status.textContent = `${name} died holding ${tag(job)}. Lock expired, it’s back on the queue.`;
        renderQueue();
        renderCounts();
      } else {
        status.textContent = `${name} is down. The others pick up the slack.`;
      }
      w.bar.style.transform = 'scaleX(0)';
      w.state.textContent = 'dead';
    } else {
      w.state.textContent = 'idle';
      status.textContent = `${name} is back.`;
    }
    wake();
  }

  workers.forEach((w) => w.el.addEventListener('click', () => toggleWorker(w)));
  root.querySelector('[data-dq-add]')?.addEventListener('click', () => enqueue(12));

  // demo mode (toys/cards.ts): keep jobs flowing, and now and then kill or revive a worker
  let tick = 0;
  root.addEventListener('autoplay', () => {
    tick++;
    if (queue.length < 4) enqueue(8);
    if (tick % 3 === 0) toggleWorker(workers[1]);
  });

  enqueue(8);
}
