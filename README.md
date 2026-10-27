# Portfolio

Astro + GSAP + Lenis, plus a handful of small hand-written toys. Static, no framework JS.

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to dist/
```

**Before going live:** see `LAUNCH-TODO.md` for the domain to set and everything hidden for v1.

## Where things live

- **All content** (projects, desk items, "Right now" tabs, photos, timeline, Substack posts, tracks, stickers, email): `src/data/site.ts`
- **Home page**: `src/pages/index.astro`. Case studies: `src/pages/work/[slug].astro`. Secret page: `src/pages/_secret.astro` (hidden for now)
- **Colours and fonts**: top of `src/styles/global.css` (Day = sticker-bright, Night = lime and lilac)

## The toys

Pure CSS (work even before JS loads): photobooth filters, the Desktop / Tablet / Phone switch, "Right now" tabs,
"Join the society", the timeline and Play / Pause on the record player.

Small scripts in `src/scripts/toys/`, each loaded only when its section is near the screen:

- `desk.ts` drag and flick things on the desk, tap the cup to sip (refills bump the coffee count)
- `sos.ts` ELIRA hold-to-SOS
- `booth.ts` snap polaroids, and "Use my real camera" (only after a click; nothing is uploaded)
- `photos.ts` shuffle the About photos
- `reads.ts` flip through the Substack cards
- `record.ts` next track
- `wall.ts` sticker wall and copy-email
- `terminal.ts` press ` or use the footer button

## Easter eggs

- Click "Hi" in the headline.
- Press ` for the terminal. Try `help`, `coffee`, `theme night`, `sudo hire barkha`.
- Click "Brewed in New Delhi" in the footer three times for the secret page (hidden for v1, see LAUNCH-TODO.md).
