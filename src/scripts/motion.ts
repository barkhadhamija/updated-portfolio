// Smooth scroll, headline line reveals, fade-ups and counters. Only loaded when motion is on.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

const root = document.documentElement;

export function init() {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  const lenis = new Lenis({ anchors: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  splitHeadlines();
  reveals();
  counters();

  root.classList.add('motion-ready');
  document.fonts.ready.then(() => ScrollTrigger.refresh());
}

function splitHeadlines() {
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      autoSplit: true,
      onSplit(self) {
        gsap.set(el, { opacity: 1 });
        return gsap.from(self.lines, {
          yPercent: 110,
          duration: 1.1,
          stagger: 0.08,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      },
    });
  });
}

function reveals() {
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 92%',
    once: true,
    onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 1, stagger: 0.08, ease: 'expo.out' }),
  });
}

function counters() {
  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    const end = Number(el.dataset.count);
    const n = { v: 0 };
    el.textContent = '0';
    gsap.to(n, {
      v: end,
      duration: 1.6,
      ease: 'power3.out',
      onUpdate: () => (el.textContent = String(Math.round(n.v))),
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });
}
