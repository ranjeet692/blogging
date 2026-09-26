# Ranjeet Kumar: portfolio and writing

A static personal site built with [Astro](https://astro.build). It has no client-side JavaScript and is designed to be hosted on GitHub Pages at `https://<username>.github.io`.

## Make it yours (5 minutes)

1. Open **`src/site.config.ts`**. Replace every `your-github-username` with your GitHub username, then edit your bio, "Now" line, projects and links. Every personal detail on the site comes from this file.
2. Delete the four sample posts in `src/content/writing/` once you've written your first real one.
3. Run it locally:

   ```sh
   npm install
   npm run dev      # http://localhost:4321
   ```

## Publish to GitHub Pages

1. Create a repository named exactly **`<username>.github.io`**.
2. Push this folder to its `main` branch.
3. In the repo, go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.

Every push to `main` then rebuilds and deploys the site through `.github/workflows/deploy.yml`.

## Writing a post

Create `src/content/writing/my-post-slug.md`. The file name becomes the URL (`/writing/my-post-slug/`).

```md
---
title: A clear, specific title
description: One or two sentences for search results and link previews (120–155 characters).
date: 2026-10-01
updated: 2026-10-05   # optional
tags: [Postgres, Performance]
draft: true           # optional; drafts show in `npm run dev` only
---

Your post in Markdown. Code blocks, tables, footnotes[^1] and `.mdx` all work.

[^1]: Like this.
```

## What's built in for SEO

- Pre-rendered HTML for every page, with no JavaScript and self-hosted fonts, so pages load fast.
- A title, meta description and canonical URL on every page.
- Open Graph and Twitter card tags, plus a **1200×630 social image generated for every post** at build time (`/og/<slug>.png`).
- JSON-LD structured data: `WebSite` and `ProfilePage`/`Person` on the home page, `Blog` on /writing/, and `BlogPosting` and `BreadcrumbList` on each post.
- `sitemap-index.xml`, `robots.txt` and an RSS feed at `/rss.xml`.
- Topic pages at `/writing/topics/<topic>/`, semantic HTML, and a `noindex` 404 page.
- Color contrast meets WCAG AA in light and dark mode. The site follows the visitor's system theme.

After the site is live, add it to [Google Search Console](https://search.google.com/search-console) and submit `https://<username>.github.io/sitemap-index.xml`.

## Working with AI coding agents

The repo includes instructions for Claude Code, OpenCode, GitHub Copilot and Cursor:

- **`AGENTS.md`**: project rules, commands and the definition of done. OpenCode, Copilot and Cursor read it directly, and Claude Code reads it through `CLAUDE.md`.
- **`.claude/skills/`**: four task skills in the open Agent Skills format. All four agents load skills from this folder.
  - `write-blog-post`
  - `update-profile`
  - `site-design`
  - `seo-audit`

Ask your agent something like "write a draft post about X" or "add a Uses page" and it will pick up the matching skill. Before finishing, agents run `npm run verify`, which builds the site and checks the SEO.

## Where things are

| Path | What it is |
| --- | --- |
| `src/site.config.ts` | All personal content |
| `src/content/writing/` | Posts (Markdown or MDX) |
| `src/styles/global.css` | All styles. Colors and fonts are tokens at the top. |
| `src/layouts/Base.astro` | The `<head>`: meta tags, social tags, structured data |
| `src/components/PostList.astro` | The year-grouped writing archive |
| `src/pages/og/[slug].png.ts` | Social image generator |
| `public/` | Favicon and static files, copied as-is |
