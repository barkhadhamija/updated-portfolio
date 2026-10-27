// The hidden terminal. Open with ` or the footer button.

import { projects, person, ready } from '../../data/site';
import { set } from '../store';

export function init(dialog: HTMLDialogElement) {
  const out = dialog.querySelector<HTMLElement>('[data-terminal-out]')!;
  const form = dialog.querySelector<HTMLFormElement>('[data-terminal-form]')!;
  const input = form.querySelector<HTMLInputElement>('input')!;
  const history: string[] = [];
  let cursor = 0;

  out.setAttribute('data-lenis-prevent', '');
  dialog.querySelector('[data-close-terminal]')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close(); // click on the backdrop
  });

  function print(lines: string | string[], cls = '') {
    for (const line of ([] as string[]).concat(lines)) {
      const p = document.createElement('p');
      if (cls) p.className = cls;
      p.textContent = line;
      out.append(p);
    }
    out.scrollTop = out.scrollHeight;
  }

  function go(hash: string) {
    dialog.close();
    location.hash = hash;
  }

  const commands: Record<string, (args: string[]) => void> = {
    help: () =>
      print([
        'about        who is this',
        'projects     list the work',
        ready.caseStudies ? 'open <n>     open a case study (open 1)' : 'open <n>     open a project (open 1)',
        'play         go to the toys',
        'reading      what I’m reading',
        'coffee       how many cups so far',
        'hire         say hi',
        'theme night  or theme day',
        ...(ready.secret ? ['secret       you’ll see'] : []),
        'clear, exit',
      ]),
    about: () => print('Barkha Dhamija. Developer and designer in New Delhi. B.Tech CSE at USICT, class of ’28. Go on the backend, LeetCode most days. Full-stack intern at Mswasth.'),
    projects: () => print(projects.map((p, i) => `${i + 1}  ${p.title.padEnd(22)} ${p.type}`)),
    ls: () => commands.projects([]),
    open: ([arg]) => {
      const p = projects[Number(arg) - 1] ?? projects.find((x) => x.slug === arg);
      if (!p) return print('Usage: open 1, or open elira');
      // until the case studies are written, open the live site (or jump to the card)
      const live = p.links?.find((l) => l.label === 'Live')?.href;
      print(`Opening ${p.title}…`);
      if (ready.caseStudies) location.href = `/work/${p.slug}/`;
      else if (live) window.open(live, '_blank', 'noopener');
      else go('#work');
    },
    play: () => go('#work'),
    reading: () => go('#desk'),
    hire: () => go('#hi'),
    coffee: () => {
      const hour = Number(new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hourCycle: 'h23', timeZone: 'Asia/Kolkata' }).format(new Date()));
      const cups = hour < 8 ? 0 : Math.min(5, Math.floor((hour - 8) / 3) + 1);
      print(['   ( (', '    ) )', '  ........', '  |      |]', '  \\      /', '   `----´', `${cups} cup${cups === 1 ? '' : 's'} so far today.`]);
    },
    theme: ([name]) => {
      if (name !== 'day' && name !== 'night') return print('Try: theme day, or theme night');
      document.documentElement.dataset.theme = name;
      set('theme', name);
      dispatchEvent(new Event('theme:change'));
      print(name === 'night' ? 'Lights off.' : 'Lights on.');
    },
    secret: () => {
      if (!ready.secret) return print('Still brewing. Come back soon.');
      const link = document.querySelector<HTMLAnchorElement>('[data-secret]');
      if (link) link.hidden = false;
      set('secret', '1');
      print('Unlocked. There’s a new link in the footer.');
    },
    sudo: (args) => print(args.join(' ') === 'hire barkha' ? 'Permission granted. Scroll to Say hi.' : 'Nice try.'),
    email: () => print(person.email),
    clear: () => (out.innerHTML = ''),
    exit: () => dialog.close(),
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const raw = input.value.trim();
    input.value = '';
    if (!raw) return;
    history.push(raw);
    cursor = history.length;
    print(`$ ${raw}`, 'cmd');
    const [name, ...args] = raw.toLowerCase().split(/\s+/);
    (commands[name] ?? (() => print(`command not found: ${name}. Type help.`)))(args);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && cursor > 0) input.value = history[--cursor];
    else if (e.key === 'ArrowDown') input.value = history[++cursor] ?? '';
    else return;
    e.preventDefault();
  });
}
