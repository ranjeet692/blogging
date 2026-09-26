---
title: Small tools I use every day
description: Six command-line tools that each save me a few minutes a day, and the one habit that saves more than all of them together.
date: 2025-03-15
tags: [Tooling]
---

None of these will change how you work. Each one removes a small, repeated annoyance, and those add up.

| Tool | What it replaces | Why I keep it |
| --- | --- | --- |
| `rg` | `grep -r` | Fast, and respects `.gitignore` by default |
| `fd` | `find` | Sensible defaults; I can remember the flags |
| `jq` | Squinting at JSON | Filters API responses in one line |
| `fzf` | Scrolling history | Fuzzy search over anything you pipe into it |
| `just` | Makefiles for tasks | Task runner without Make's surprises |
| `hyperfine` | `time` in a loop | Benchmarks with warm-up and statistics |

## The habit

Every time I type the same long command a third time, I turn it into a `just` recipe in the project. A year later, the `justfile` is the most honest documentation the project has: it's exactly what people actually run.

```make
# justfile
dev:
    docker compose up -d db
    cargo watch -x run

reset-db:
    docker compose down -v db && docker compose up -d db
```
