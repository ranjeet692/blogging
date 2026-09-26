# Personal site: design and build decisions

**Stack:** Astro 7, fully static, no client JavaScript. Hosted on GitHub Pages at `<username>.github.io` and deployed by a GitHub Actions workflow on every push to `main`.

**Content:** All personal content (bio, "Now" line, projects, links) lives in `src/site.config.ts`. Posts are Markdown or MDX files in `src/content/writing/`.

**Visual system**
- Paper `#edefea` (cool sage-grey), ink `#1e2b2f` (slate), muted `#56625f`, accent `#2340c4` (fountain-pen blue). Dark mode: `#172024`, `#dce3de`, `#9aa8a3`, `#9fb3ff`. The site follows the visitor's system theme. All text meets WCAG AA contrast.
- Type: Schibsted Grotesk for headings and navigation, Literata for reading text. Both fonts are self-hosted.
- Layout: a wide left margin holds section names, post dates and years, and the text column is about 38rem wide.
- Signature element: the writing archive is grouped by year, with the year numerals set very large in the margin and pinned while scrolling through that year. Titles connect to their dates with dotted leaders, like a table of contents.
- Deliberately avoided: cards, fade-in animations, all-caps eyebrow labels, arrow links, and cream or terracotta palettes.

**SEO:** Every page has a title, description and canonical URL. The site includes Open Graph and Twitter tags, a social image generated for each post at build time, and JSON-LD structured data (WebSite, ProfilePage/Person, Blog, BlogPosting, BreadcrumbList). It also has a sitemap, robots.txt, an RSS feed, topic pages and a noindex 404 page.

**Open items:** Add the GitHub username and real bio, projects and links. Replace the sample posts. Submit the sitemap to Google Search Console after launch.
