# AGENTS.md

Instructions for AI coding agents (Claude Code, OpenCode, GitHub Copilot, Cursor and others) working on this repository. Humans should start with `README.md`.

## What this is

Ranjeet Kumar's personal site: a portfolio home page plus a technical blog. It's a fully static [Astro](https://astro.build) 7 site deployed to GitHub Pages at the root URL `https://<username>.github.io`. The site ships **no client-side JavaScript**, and that is deliberate.

## Commands

```sh
npm install        # Node 22.12+ required
npm run dev        # local server at http://localhost:4321 (drafts are visible here)
npm run build      # static build into dist/
npm run check      # SEO and link check against dist/ (run after build)
npm run verify     # build + check. Run this before you say a task is done.
```

`npm run verify` must finish with **0 errors**. Warnings are advisory, but read them.

## Project map

| Path | Purpose |
| --- | --- |
| `src/site.config.ts` | **All personal content**: name, bio, "Now" line, projects, links, site URL. |
| `src/content/writing/*.md(x)` | Blog posts. The file name is the URL slug. |
| `src/content.config.ts` | Post frontmatter schema (zod). |
| `src/lib/posts.ts` | Post helpers: sorting, drafts, dates, reading time, tags. |
| `src/layouts/Base.astro` | The only layout. Owns `<head>`, meta tags, Open Graph and JSON-LD. |
| `src/components/` | `Header`, `Footer`, `PostList` (the year-grouped archive). |
| `src/pages/` | Routes: `/`, `/writing/`, `/writing/<slug>/`, `/writing/topics/<tag>/`, `/projects/`, `/404`, `/rss.xml`, `/robots.txt`, `/og/<slug>.png`. |
| `src/styles/global.css` | All styling. Design tokens are at the top. |
| `scripts/check-seo.mjs` | The checker behind `npm run check`. |
| `.github/workflows/deploy.yml` | Builds and deploys to GitHub Pages on push to `main`. |

## Rules

1. **Keep personal content in `src/site.config.ts`.** Don't hard-code the author's name, bio, links or projects in pages or components.
2. **No client-side JavaScript** unless the owner explicitly asks. No UI frameworks (React, Vue, etc.), no analytics scripts, no fade-in animations.
3. **Every page goes through `Base.astro`** and passes a unique `title` and a `description` of 120–155 characters. Never add a second `<head>` or a page-level `<title>`.
4. **Every page has exactly one `<h1>`.**
5. **Internal links use a trailing slash** (`/writing/`, not `/writing`). The site uses `trailingSlash: 'always'`.
6. **Styling uses the tokens** in `global.css` (`--ink`, `--muted`, `--accent`, `--sans`, `--serif`, etc.). Don't introduce new colors, fonts, shadows or border radii. Read the `site-design` skill before any visual change.
7. **Dependencies:** don't add one when a few lines of code will do. Fonts are self-hosted through `@fontsource`. Never load them from Google Fonts or another CDN.
8. **Don't edit `dist/`, `.astro/` or `node_modules/`.** They are generated.
9. **Never publish the owner's email address or other private details** unless the owner supplies them for that purpose.

## Skills

Task-specific instructions live in `.claude/skills/`. All four supported agents read skills from that folder.

| Skill | Use it when |
| --- | --- |
| `write-blog-post` | Creating, editing or reviewing a post in `src/content/writing/` |
| `update-profile` | Changing the bio, "Now" line, projects, links, site URL or title |
| `site-design` | Any visual change: CSS, a new page or component, layout, typography |
| `seo-audit` | Adding a route, changing `<head>`, metadata or structured data, or before a release |

## Definition of done

- `npm run verify` reports 0 errors.
- For visual changes: checked at 390px and 1280px wide, in both light and dark mode.
- Commit messages are short and imperative, for example `Add post on WAL compaction`.
