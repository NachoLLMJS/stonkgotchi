# BITXO local editable

Upstream: https://github.com/gavilanbe/bitxo
Audited commit: `4f80cb54af5f78935daf7a4df127c4cd109bcf9e`
License: MIT (`LICENSE`)

## Provenance

This is the original BITXO frontend and gameplay source, not a recreation. Local changes are deliberately limited to presentation and offline-safe preview behavior:

- The playable 160×272 canvas scales continuously to the largest undistorted size available.
- A mirrored, dimmed live copy of that same canvas fills the rest of wide/tall screens.
- Remote update polling and service-worker registration are removed from the local copy.
- The unused test harness, publishing workflow, service worker and build/publishing tools are excluded.
- The local static server adds no-cache and defensive HTTP headers.

## Run

```text
python scripts/serve_local.py
```

Open: http://127.0.0.1:4176/

Edit HTML/CSS/JS directly and reload the browser. The server sends `Cache-Control: no-store` so visual edits are immediately visible.
