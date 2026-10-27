# Launch to-do

Everything that was hidden to ship v1. Nothing here is broken on the live site; each item is just switched off
until it's written.

## Before you deploy

- [ ] **Your real domain** in `astro.config.mjs` (`site: 'https://your-domain.com'`). Link previews on LinkedIn,
      WhatsApp and X use it to find the preview image, and the canonical URL comes from it.

## Hidden pages

- [ ] **"How I built it" pages** (`/work/<slug>/`, all 6 projects). Not built and not linked while
      `ready.caseStudies` is `false` in `src/data/site.ts`. To bring them back: write the template in
      `src/pages/work/[slug].astro` (role, cover screenshot, the problem, what you built, what you learned),
      then set `caseStudies: true`. The card links, the "then read how I built each one" line under
      *Things I've made* and the terminal's `open` command all switch back on by themselves.
- [ ] **Secret page** (footer easter egg). Hidden while `ready.secret` is `false`, and the page file is renamed
      to `src/pages/_secret.astro` (the underscore stops Astro building it). To bring it back: fill in its
      placeholders (welcome line, 5 songs, "tabs or spaces" line), rename it to `secret.astro`, and set
      `secret: true`. That restores the "Brewed in New Delhi" button and the terminal's `secret` command.

## Hidden placeholder text (`src/data/site.ts` unless noted)

- [ ] **Half CA and Novus stacks**: `stack: []`. The stack line on those cards is hidden while it's empty.
- [ ] **Timeline, "Now" entry**: has no `detail`, so the row doesn't expand. Add
      `detail: 'What you want to work on next.'` to make it expandable again.
- [ ] **Timeline, ACM-W entry**: the "[What it has done so far.]" sentence was cut. Add it back to the end of `detail`.
- [ ] **Timeline, Eclipse 6.0**: set to 2025 and placed between "Started B.Tech" and "TechSpace". Move it if the
      month says otherwise.
- [ ] **About, second paragraph** (`src/pages/index.astro`, after the first About paragraph): removed. It was
      "[A line about what got you into this: a first project, a person, a moment.] Outside of code I
      [your hobbies], and I'm usually holding a coffee."
- [ ] **Desk Polaroids** ("me, probably mid-sip" and "3 a.m., still shipping"): no photo yet, so they show a plain
      coloured square. Add `image: '/photos/….jpeg'` to the `me` and `hack` items in `desk`.

## Nice to have

- [ ] More Substack posts in `reading` (Back / Next buttons and the counter appear once there's more than one).
- [ ] Convert `public/photos/*.jpeg` to webp (about a third of the size).
