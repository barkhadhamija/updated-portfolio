// All the editable content lives here. Swap the [bracketed] placeholders for the real thing.

export const person = {
  name: 'Barkha Dhamija',
  email: 'barkhadhamija2176@gmail.com',
  /** Drop your CV into public/resume.pdf and this link works. */
  resume: '/resume.pdf',
  socials: [
    { label: 'GitHub', href: 'https://github.com/barkhadhamija' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/barkha-dhamija-87631632b/' },
    { label: 'LeetCode', href: 'https://leetcode.com/barkhadhamija' },
  ],
};

/**
 * Pages that exist but aren't written yet. They stay hidden (not built, no links to them) until you flip these
 * to true. See LAUNCH-TODO.md for what each one still needs.
 */
export const ready = {
  /** The "How I built it" pages at /work/<slug>/. */
  caseStudies: false,
  /** The secret page (footer easter egg + `secret` in the terminal). Also rename src/pages/_secret.astro back to secret.astro. */
  secret: false,
};

export type Project = {
  slug: string;
  title: string;
  year: string;
  type: string;
  summary: string;
  stack: string[];
  /** Placeholder colour for the cover until real screenshots exist. */
  tone: string;
  links?: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    slug: 'elira',
    title: 'ELIRA',
    year: '2025',
    type: 'Mobile app',
    summary: 'A safety app: log in with your face, and one long press sends your location to the people you trust. Top 30 at Eclipse 6.0, Thapar.',
    stack: ['Flutter', 'Dart', 'Go', 'Firebase', 'Riverpod'],
    tone: '#2E5BFF',
  },
  {
    slug: 'photobooth',
    title: 'Real-time Photobooth',
    year: '2026',
    type: 'Web app',
    summary: 'A photobooth in a browser tab: live camera, WebGL effects and real-time sharing with friends.',
    stack: ['Next.js', 'WebRTC', 'Fabric.js', 'OGL', 'GSAP'],
    tone: '#FF4FA3',
  },
  {
    slug: 'pixel',
    title: 'Pixel',
    year: '2026',
    type: 'Photo culling tool',
    summary: 'Cull hundreds of event photos right in the browser: keyboard-first pick, reject and maybe, near-duplicate grouping for burst shots, live non-destructive edits and a one-click zip of your picks. Nothing is ever uploaded.',
    stack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Zustand'],
    tone: '#111111',
    links: [
      { label: 'Live', href: 'https://photo-culler-sigma.vercel.app' },
      { label: 'GitHub', href: 'https://github.com/barkhadhamija/photo-culler' },
    ],
  },
  {
    slug: 'distroq',
    title: 'DistroQ',
    year: '2026',
    type: 'Distributed task queue',
    summary: 'A distributed task queue in Go: a goroutine worker pool with channel-based sync, at-least-once delivery through Redis job locks, and a PostgreSQL dead-letter queue. Processes 10,000+ jobs a minute; deduplication cut reprocessing by 60%.',
    stack: ['Go', 'Redis', 'PostgreSQL', 'gRPC', 'Docker'],
    tone: '#B69CFF',
    links: [{ label: 'GitHub', href: 'https://github.com/barkhadhamija/DistroQ' }],
  },
  {
    slug: 'half-ca',
    title: 'Half CA',
    year: '2026',
    type: 'AI GST reconciliation · 2nd place, Fintechstico v7.0',
    summary: 'An AI GST reconciliation assistant, built in 24 hours at NSUT. It matches every invoice against e-way bills, the bank and the IMS feed, and tells you which tax credit is safe to claim.',
    stack: [], // TODO: add the stack (the line stays hidden while empty)
    tone: '#FF7A1A',
    links: [{ label: 'Live', href: 'https://halfca.akshatchowdhary.online' }],
  },
  {
    slug: 'novus',
    title: 'Novus',
    year: '2026',
    type: 'Finance learning game · 1st place, USAR hackathon',
    summary: 'A game that teaches how money and markets work. Lend to businesses, spot dodgy accounts, react to the news, and get scored on your thinking, not your luck.',
    stack: [], // TODO: add the stack (the line stays hidden while empty)
    tone: '#C6FF3D',
    links: [{ label: 'Live', href: 'https://game.akshatchowdhary.online' }],
  },
];

/** The 30-second version for recruiters, shown under the hero buttons. */
export const quickFacts = [
  ['Looking for', 'Anything & Everything'],
  ['Primary Stack', 'Flutter · Golang · Swift · React · Next.js · Figma · PostgreSQL · Redis'],
  ['DSA', 'A LeetCode problem most days'],
  ['Based in', 'New Delhi, open to remote'],
];

/** Things on the desk in the hero. x and y are percentages of the desk. */
export type DeskItem = {
  id: string;
  kind: 'polaroid' | 'cup' | 'note' | 'ticket' | 'sticker' | 'badge';
  x: number;
  y: number;
  rot: number;
  label: string;
  text?: string;
  caption?: string;
  tone?: string;
  bg?: string;
  fg?: string;
  /** Polaroids only: a photo in public/photos/, e.g. '/photos/me.webp'. Without one it shows the coloured placeholder. */
  image?: string;
};

export const desk: DeskItem[] = [
  { id: 'me', kind: 'polaroid', x: 5, y: 6, rot: -6, tone: '#2E5BFF', image: '/photos/placeholder-lukes.svg', caption: '[your photo]', text: 'me, probably mid-sip', label: 'Polaroid of me' },
  { id: 'hack', kind: 'polaroid', x: 44, y: 3, rot: 5, tone: '#B69CFF', image: '/photos/placeholder-3am.svg', caption: '[hackathon photo]', text: '3 a.m., still shipping', label: 'Polaroid from a hackathon' },
  { id: 'cup', kind: 'cup', x: 62, y: 46, rot: 0, label: 'Coffee cup. Tap to take a sip' },
  { id: 'todo', kind: 'note', x: 5, y: 56, rot: -4, tone: 'var(--yellow)', text: 'todo:\nfinish portfolio\n(stop adding toys)', label: 'Sticky note: to do' },
  { id: 'ticket', kind: 'ticket', x: 30, y: 80, rot: 3, text: 'TOP 30 · ECLIPSE 6.0', label: 'Eclipse 6.0 ticket' },
  { id: 'flutter', kind: 'sticker', x: 40, y: 52, rot: -10, text: 'Flutter', bg: '#111111', fg: '#FAFAF7', label: 'Flutter sticker' },
  { id: 'figma', kind: 'sticker', x: 30, y: 37, rot: 8, text: 'Figma', bg: '#FF4FA3', fg: '#111111', label: 'Figma sticker' },
  { id: 'go', kind: 'sticker', x: 50, y: 40, rot: 6, text: 'Go', bg: '#00ADD8', fg: '#111111', label: 'Go sticker' },
  { id: 'react', kind: 'sticker', x: 72, y: 30, rot: -4, text: 'React', bg: '#FFFFFF', fg: '#111111', label: 'React sticker' },
  { id: 'acmw', kind: 'badge', x: 72, y: 5, rot: 12, text: 'ACM-W\nfounder', label: 'ACM-W founder badge' },
  { id: 'coffee-note', kind: 'note', x: 66, y: 74, rot: 6, tone: '#C6FF3D', text: 'coffee > sleep', label: 'Sticky note: coffee over sleep' },
];

export const greetings = ['Hi', 'Namaste', 'Hola', 'Hello', 'Oye'];

/** "Right now I'm…" — the Drinking tab fills in the live coffee count. */
export const currently = [
  ['Building', 'full-stack features at mswasth (and this portfolio)'],
  ['Learning', 'Golang & DSA (💔)'],
  ['Reading', 'Behind Closed Doors by B.A Paris'],
  ['Listening to', 'Tumse O Haseena'],
  ['Drinking', 'coffee, cup number (i lost count)'],
];

/** The About photo stack. Add `image: '/photos/….webp'` to show a real photo instead of the coloured placeholder. */
export const photos: { tone: string; caption: string; note: string; image?: string }[] = [
  { tone: '#2E5BFF', image: '/photos/me.jpeg', caption: '[you, at your desk]', note: 'that’s me' },
  { tone: '#111111', image: '/photos/usar.jpeg', caption: '[hackathon, 3 a.m.]', note: 'USAR, 1st place' },
  { tone: '#111111', image: '/photos/nsut.jpeg', caption: '[hackathon, 3 a.m.]', note: 'NSUT, 2nd place' },
  { tone: '#FF4FA3', image: '/photos/afterhours.jpeg', caption: '[the aftermath]', note: 'when not working' },
];

/** The About section shows this as a `git log`, newest first. `type` is the commit prefix. */
export const timeline: { type: string; year: string; title: string; detail?: string }[] = [
  { type: 'init', year: '2024', title: 'Started B.Tech CSE at USICT, GGSIPU', detail: 'Class of 2028. Coursework so far: DSA, OOP, operating systems, networks, distributed systems and web development.' },
  { type: 'release', year: '2025', title: 'Top 30 at Eclipse 6.0 with ELIRA', detail: 'A safety app built at Thapar’s hackathon: Flutter client, Go backend, real-time Firestore sync across 10+ screens.' },
  { type: 'feat', year: 'Nov 2025', title: 'Web Development Lead, TechSpace', detail: 'Led end-to-end React development of the official website for a 500+ member tech society.' },
  { type: 'feat', year: 'Jan 2026', title: 'Founded the ACM-W chapter at USICT', detail: 'Setting up the university’s first ACM-W chapter, for 200+ women in tech.' },
  { type: 'release', year: '2026', title: '1st place at the USAR hackathon with Novus, won ₹20,000', detail: 'We built Novus, a game that teaches how money and markets work: make the call, live with it, and get scored on your thinking, not your luck.' },
  { type: 'release', year: '2026', title: '2nd place at Fintechstico v7.0 with Half CA', detail: 'A 24-hour offline FinTech hackathon at NSUT (prize pool ₹1.5L). We built an AI-powered GST reconciliation assistant.' },
  { type: 'perf', year: '2026', title: 'Top 100 mentee, Codess Café', detail: 'Selected from 2,500+ applicants for a programme on CS fundamentals and interview prep.' },
  { type: 'docs', year: 'Jun 2026', title: 'Technical Content Writer Intern, BrightRays', detail: 'Wrote 20+ articles on cloud and emerging tech on a twice-weekly schedule; readership grew 40%+ in two months.' },
  { type: 'feat', year: 'Jul 2026', title: 'Full Stack Developer Intern, Mswasth', detail: 'Shipping full-stack features with the Ops team. Three so far, one of which cut a manual review process by 30%.' },
  { type: 'wip', year: 'Now', title: 'Open to internships and freelance' },
];

export type Read = { publication: string; title: string; quote: string; url: string };

/** One card per post. With more than one, Back / Next buttons appear to flip through them. */
export const reading: Read[] = [
  {
    publication: 'Love Letters to Literature',
    title: `You don't see things as they are, you see them as you are`,
    quote: 'What we notice, what we interpret, is always coloured by who we are at the moment',
    url: 'https://substack.com/@sentimentalbeing/note/c-269001000?r=55na89&utm_medium=ios&utm_source=notes-share-action',
  },
];

/**
 * The record player. Each song plays Apple Music's free 30-second preview, so there are no audio files to host.
 * `appleId` is the song on Apple Music: look a song up at https://itunes.apple.com/lookup?id=<appleId>&country=us
 * and copy its `previewUrl` into `src` if a clip ever stops loading.
 * A `src` starting with /music/ plays your own file from public/music/ instead (Tumse O Haseena does, since
 * Apple's preview of it is all intro).
 * It alternates one Hindi, one English, picking at random within each.
 */
export type Track = { song: string; artist: string; lang: 'hindi' | 'english'; appleId: number; src: string; color: string };

export const tracks: Track[] = [
  { song: 'Are We a Thing', artist: 'Leidi', lang: 'english', appleId: 1507364066, src: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/8c/6a/20/8c6a2035-e395-600d-dc04-0de2b1fdde66/mzaf_6870839373552400065.plus.aac.p.m4a', color: 'var(--yellow)' },
  { song: 'Alfaaz', artist: 'Hamza Malik & Zain Zohaib', lang: 'hindi', appleId: 6780842658, src: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/d6/8a/9e/d68a9e6e-4e52-2bf9-80ac-20706fbee133/mzaf_10574201485335904443.plus.aac.p.m4a', color: '#C6FF3D' },
  { song: 'The Sound', artist: 'The 1975', lang: 'english', appleId: 1442647623, src: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/10/bf/d5/10bfd5a7-e92b-7fef-66d2-3670538047ec/mzaf_12288052698843936669.plus.aac.p.m4a', color: '#FF4FA3' },
  { song: 'Tumse O Haseena', artist: 'Mohammed Rafi', lang: 'hindi', appleId: 1338700569, src: '/music/tumse-o-haseena.mp3', color: '#B69CFF' },
  { song: 'Orbiter', artist: 'Noah Kahan', lang: 'english', appleId: 6762758927, src: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/1d/23/d5/1d23d552-beba-ce9f-7e78-4b5591f954df/mzaf_4163116222424653659.plus.aac.p.m4a', color: '#2BD49B' },
];

export const stickers = [
  { text: 'hi!', bg: '#A6F0CF' },
  { text: 'cool work', bg: '#C6FF3D' },
  { text: 'more coffee', bg: '#FF4FA3' },
  { text: 'let’s build', bg: '#B69CFF' },
  { text: 'hire her', bg: '#FFFFFF' },
];

/** The moving band between sections. */
export const tickerWords = ['building', 'sipping', 'shipping', 'designing in Figma', 'Go', 'goroutines', 'LeetCode daily', 'Flutter', 'React', 'coffee > sleep', 'open to work'];

/** Stickers scattered down the page. Drag them anywhere; they wobble when you scroll. */
export const pageStickers = [
  { id: 'ship', text: 'ship it', bg: 'var(--yellow)', fg: '#111111', section: 'work', top: '4%', left: '88%', rot: 8, shape: 'pill' },
  { id: 'star', text: '', bg: '#FF4FA3', fg: '#111111', section: 'work', top: '46%', left: '-2%', rot: -12, shape: 'star' },
  { id: 'delhi', text: 'made in\nDelhi', bg: '#2E5BFF', fg: '#FFFFFF', section: 'about', top: '6%', left: '90%', rot: 14, shape: 'circle' },
  { id: 'smile', text: '', bg: '#C6FF3D', fg: '#111111', section: 'about', top: '78%', left: '2%', rot: -8, shape: 'smile' },
  { id: 'hello', text: 'hello world', bg: '#2BD49B', fg: '#111111', section: 'desk', top: '6%', left: '80%', rot: -6, shape: 'pill' },
  { id: 'lost1', text: 'lost?', bg: '#FF4FA3', fg: '#111111', section: 'lost', top: '18%', left: '12%', rot: -10, shape: 'pill' },
  { id: 'lost2', text: '', bg: '#B69CFF', fg: '#111111', section: 'lost', top: '62%', left: '80%', rot: 12, shape: 'star' },
  { id: 'hand', text: '100%\nhandmade', bg: '#FFFFFF', fg: '#111111', section: 'hi', top: '8%', left: '84%', rot: 10, shape: 'circle' },
];
