# Izrael

Mobile-first web app that introduces the places of the trip to Israel. Vite, React, TypeScript, Framer Motion, plus a tiny Node server for the shared leaderboard.

## Develop

```bash
npm install
npm start        # API on :8787 (needs a build in dist/ only for serving the app)
npm run dev      # app on :5173, /api is proxied to :8787
```

- `src/data/places.ts`: content for each place. Sub-places (Jerusalem) set `parent`.
- `src/data/games.ts`: games listed on the Gry tab.
- `src/toys/`: mini-games.
- `scripts/build-map.mjs`: regenerates map borders (`npm run map`).
- `server/index.mjs`: serves `dist/` and `/api/scores/:game`. Scores are stored in `$DATA_DIR/scores.json`.

## Deploy on a VPS

```bash
docker compose up -d --build
```

The container listens on `127.0.0.1:8787`. Put a reverse proxy with HTTPS in front, for example Caddy:

```
izrael.example.pl {
  reverse_proxy 127.0.0.1:8787
}
```

Scores live in the `scores` Docker volume and survive rebuilds.
