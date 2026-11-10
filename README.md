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

## Deploy on a VPS (odkryjizrael.pl)

1. DNS: point `odkryjizrael.pl` and `www.odkryjizrael.pl` (A record, and AAAA if the VPS has IPv6) to the VPS.
2. On the VPS:

```bash
git clone https://github.com/eliassk/israel-trip.git && cd israel-trip
```

3. If nothing else on the VPS uses ports 80/443, run the app with the bundled Caddy. It gets HTTPS certificates by itself:

```bash
docker compose -f docker-compose.yml -f docker-compose.caddy.yml up -d --build
```

   If another Caddy in Docker already owns 80/443 (for example Stream Manager's), join its network instead and add this site to that Caddyfile:

```bash
PROXY_NETWORK=stream-manager_default docker compose -f docker-compose.yml -f docker-compose.shared-proxy.yml up -d --build
```

```
odkryjizrael.pl, www.odkryjizrael.pl {
	encode gzip
	reverse_proxy izrael:8787
}
```

   If the VPS has a reverse proxy installed directly on the host, run only the app (`docker compose up -d --build`, listens on `127.0.0.1:8787`) and point the proxy there.

Update: `git pull`, then the same `up -d --build` command. Scores live in the `scores` Docker volume and survive rebuilds.

## Telegram Mini App

1. In @BotFather: `/newbot`, then `/newapp` (or the bot's Menu Button) with the URL `https://odkryjizrael.pl`.
2. On the VPS, put the bot token in `.env` next to `docker-compose.yml` (never commit it):

```
TELEGRAM_BOT_TOKEN=123456:ABC...
```

3. Rebuild with the same `up -d --build` command.

Inside Telegram the app uses Telegram's back button and haptics, and rankings use the player's `@username` (or first name). The server verifies Telegram's signature with the bot token, so the name cannot be faked. Outside Telegram, players still type a name.
