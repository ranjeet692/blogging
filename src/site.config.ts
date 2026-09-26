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
  title: 'Ranjeet Kumar, Full Stack Engineer',
  // Used as the meta description for the home page. Keep it under ~155 characters.
  description:
    'Ranjeet Kumar is a full-stack engineer who builds reliable systems, APIs, and AI harnesses while learning by shipping real products.',
  jobTitle: 'Full Stack Engineer',
  locale: 'en_IN',
  lang: 'en',

  // The large opening line on the home page.
  intro: "I'm Ranjeet. I build full-stack products and AI harnesses that people rely on, and I write down what I learn while shipping them.",

  // A few sentences under the opening line. Plain text; blank line = new paragraph.
  bio: `I work across the stack: backend systems, cloud infrastructure, data pipelines, APIs, and the unglamorous plumbing that keeps software fast, reliable, and maintainable. I also like building AI harnesses that make intelligent systems easier to design, test, and operate. Before that, I spent time on the frontend, which is why I still care deeply about how products feel to use.

This site is where I keep notes worth keeping. Some are practical tutorials, some are postmortems from my own mistakes, and some are experiments in building better systems.`,

  // What you're doing right now. Update it every few months.
  now: 'Learning how databases really work by building a small key–value store in Rust, and exploring how to design better AI harnesses around real production workflows.',
  nowUpdated: '2026-09-01',

  // Where people can find you. Remove any line you don't use.
  links: [
    { label: 'GitHub', href: 'https://github.com/ranjeet692' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ranjeet-kumar-456a7a61' },
    { label: 'Email', href: 'mailto:ranjeet692@gmail.com' },
  ],

  // Projects. `featured: true` shows it on the home page; all show on /projects/.
  projects: [
    {
      name: 'Harness Hub',
      year: '2026',
      description: 'A full-stack learning project that explores how AI harnesses work in practice, with examples and a dedicated space for the core concepts behind them.',
      href: 'https://github.com/ranjeet692/harness-hub',
      featured: true,
    },
    {
      name: 'Claude Skills',
      year: '2026',
      description: 'An npm package for surfacing practical skills across the software lifecycle, helping teams build more structured and repeatable AI-assisted workflows.',
      href: 'https://github.com/ranjeet692/claude-skills-pkg',
      featured: true,
    },
  ],
} as const;

export type Project = (typeof site.projects)[number];
