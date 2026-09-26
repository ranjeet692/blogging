---
title: Reading a Postgres EXPLAIN plan without guessing
description: A slow query, an EXPLAIN ANALYZE output that looked like noise, and the three numbers I now read first every time.
date: 2026-06-03
tags: [Postgres, Performance]
---

A dashboard query went from 40 ms to four seconds overnight, and nobody had touched it. The fix took five minutes. Finding it took an afternoon, mostly because I didn't know how to read what Postgres was telling me.

## Start with ANALYZE, always

`EXPLAIN` shows what the planner *expects*. `EXPLAIN ANALYZE` runs the query and shows what *happened*. The gap between the two is almost always where the problem is.

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT o.id, o.total
FROM orders o
WHERE o.customer_id = 4821
  AND o.created_at > now() - interval '30 days';
```

## The three numbers I read first

1. **Estimated rows vs actual rows.** If the planner expected 12 rows and got 180,000, every decision it made after that was based on a wrong guess.
2. **Loops.** A node that takes 0.2 ms but runs 50,000 times costs ten seconds.
3. **Buffers read vs hit.** Reads come from disk, hits come from memory. A plan that's fine when warm can be terrible when cold.

In my case the first number gave it away: the planner expected a handful of rows for one customer, used a nested loop, and then met a customer with 180,000 orders.

## The fix

The table's statistics were stale after a large import. Running `ANALYZE orders` brought the estimate back in line, and the planner switched to a hash join. For the longer term, I raised the statistics target on `customer_id`, because a few very large customers skew it.

```sql
ALTER TABLE orders ALTER COLUMN customer_id SET STATISTICS 1000;
ANALYZE orders;
```

The lesson I keep relearning: when a query gets slow without changes, suspect the data before the code.
