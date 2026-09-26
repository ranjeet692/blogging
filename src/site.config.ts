// ─────────────────────────────────────────────────────────────
// Everything personal lives in this one file.
// Edit the values below; the whole site updates from them.
// ─────────────────────────────────────────────────────────────

export const site = {
  // Your GitHub Pages root URL. Must be https://<your-github-username>.github.io
  url: 'https://ranjeet692.github.io',

  name: 'Ranjeet Kumar',
  shortName: 'Ranjeet',
  // Used in <title> on the home page and in search results. Keep it under ~60 characters.
  title: 'Ranjeet Kumar, software engineer',
  // Used as the meta description for the home page. Keep it under ~155 characters.
  description:
    'Ranjeet Kumar is a software engineer who builds backend systems and writes about what he learns doing it.',
  jobTitle: 'Software Engineer',
  locale: 'en_IN',
  lang: 'en',

  // The large opening line on the home page.
  intro: "I'm Ranjeet. I build software that other people depend on, and I write down what I learn along the way.",

  // A few sentences under the opening line. Plain text; blank line = new paragraph.
  bio: `I work mostly on backend systems: APIs, data pipelines, and the unglamorous plumbing that keeps them fast and reliable. Before that I spent a few years on the frontend, which is why I still care how things feel to use.

This site is where I keep notes worth keeping. Some are tutorials, some are postmortems of my own mistakes.`,

  // What you're doing right now. Update it every few months.
  now: 'Learning how databases really work by building a small key–value store in Rust, and writing about each part as I finish it.',
  nowUpdated: '2026-09-01',

  // Where people can find you. Remove any line you don't use.
  links: [
    { label: 'GitHub', href: 'https://github.com/ranjeet692' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ranjeet692' },
    { label: 'Email', href: 'mailto:you@example.com' },
  ],

  // Projects. `featured: true` shows it on the home page; all show on /projects/.
  projects: [
    {
      name: 'Harness Hub',
      year: '2026',
      description: 'A small webapp to showcase how AI harnesss works with some examples and a dedicated page to read about important concepts.',
      href: 'https://github.com/ranjeet692/harness-hub',
      featured: true,
    },
    {
      name: 'Claude Skills',
      year: '2026',
      description: 'An npm package which list skills that helps entire software development lifecycle and can be used to build a skill based app for claude.',
      href: 'https://github.com/ranjeet692/claude-skills-pkg',
      featured: true,
    },
  ],
} as const;

export type Project = (typeof site.projects)[number];
