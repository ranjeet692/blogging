---
title: The retry that took down our queue
description: A postmortem of my own mistake. One innocent retry loop, a slow downstream API, and how 2,000 jobs became 60,000 in forty minutes.
date: 2025-11-20
tags: [Reliability, Postmortem]
---

This is a write-up of an outage I caused. Nobody lost data, but for forty minutes every background job in the system was stuck behind a wall of retries, and the wall was my code.

## What happened

A worker called a partner's API to sync invoices. I'd wrapped the call in a retry: three attempts, one second apart. When the partner's API slowed to twenty-second responses, each job held its worker for over a minute, failed, and was put back on the queue by the queue's *own* retry policy, which also retried three times.

Three retries inside three retries is nine calls per job. Across 2,000 queued jobs, that's 18,000 slow calls, and new jobs kept arriving behind them.

## Why it wasn't obvious

- Each retry layer looked reasonable on its own.
- The partner API didn't fail fast. It timed out slowly, which is worse.
- Our alert fired on failed jobs, and jobs weren't failing yet. They were waiting.

## What we changed

1. **One retry layer, not two.** The queue owns retries; the code inside a job does not.
2. **Exponential backoff with jitter,** so retries spread out instead of arriving in waves.
3. **A timeout shorter than the patience of the caller.** Five seconds, not the default sixty.
4. **An alert on queue age**, not just failure count. The oldest job's age is the number that tells you something is stuck.

## What I took from it

Retries are a load multiplier. Before adding one, I now ask what happens to the thing I'm calling when it's already struggling, because that's exactly when the retry will run.
