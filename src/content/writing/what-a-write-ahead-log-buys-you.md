---
title: What a write-ahead log actually buys you
description: I added a write-ahead log to my toy key–value store and finally understood why every serious database has one. Here's the idea, the code, and the fsync gotcha.
date: 2026-09-12
tags: [Databases, Rust]
---

For the first month, my key–value store kept everything in a `HashMap` and wrote a snapshot to disk every thirty seconds. It was fast. It was also one power cut away from losing thirty seconds of writes, and I only understood how bad that is once I tried to explain it to someone.

The fix every database reaches for is a **write-ahead log**: before you change anything in memory, you append a record of the change to a file. If the process dies, you replay the file on startup and end up exactly where you were.

## The whole idea in one rule

> Never acknowledge a write until the log entry describing it is durable on disk.

Everything else is detail. The in-memory structure can be as clever or as naive as you like, because it can always be rebuilt from the log.

## A minimal version

Each record is a length, a checksum, and the payload. The checksum matters more than it looks: a crash halfway through a write leaves a torn record at the end of the file, and you need to tell a torn record from a real one.

```rust
fn append(&mut self, key: &[u8], value: &[u8]) -> io::Result<()> {
    let payload = encode(key, value);
    let crc = crc32fast::hash(&payload);

    self.file.write_all(&(payload.len() as u32).to_le_bytes())?;
    self.file.write_all(&crc.to_le_bytes())?;
    self.file.write_all(&payload)?;
    self.file.sync_data()?; // the line that makes it a log and not a wish
    Ok(())
}
```

On startup, read records until one fails its checksum, then truncate the file at that point. Anything after a bad record was never acknowledged, so it's safe to drop.

## The fsync gotcha

Without `sync_data()` the code above still passes every test I wrote, because the operating system happily keeps the bytes in its page cache and reads them back. The data only reaches the disk when the kernel decides it should.[^1]

With it, my write throughput dropped from roughly 400,000 writes a second to about 900. That's the real cost of durability, and it's why databases batch: collect every write that arrives in the next few milliseconds, append them together, and pay for one sync instead of hundreds.

## What I'd tell myself a month ago

- Write the recovery code first. If you can't replay the log, you don't have one.
- Test crashes for real. I kill the process with `SIGKILL` in a loop and compare the recovered state to what was acknowledged.
- Measure with the sync on. Numbers without it are fiction.

Next up is compaction, because a log that only grows is its own kind of outage.

[^1]: On Linux, dirty pages are typically written back within about 30 seconds, which is exactly the window I was trying to close.
