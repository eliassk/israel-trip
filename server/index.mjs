// Serves the built app from dist/ and a small shared leaderboard API.
// No dependencies: scores are kept in one JSON file under DATA_DIR.
import { createServer } from 'node:http'
import { readFile, writeFile, rename, mkdir, stat } from 'node:fs/promises'
import { join, extname, normalize } from 'node:path'
import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto'

const PORT = Number(process.env.PORT ?? 8787)
const DATA_DIR = process.env.DATA_DIR ?? new URL('../data', import.meta.url).pathname
const DIST = new URL('../dist', import.meta.url).pathname
const FILE = join(DATA_DIR, 'scores.json')

const GAMES = new Set(['fishing', 'matkot', 'excavation', 'wallbuilder', 'haggle', 'olivepress', 'guess', 'range'])
// Upper bounds a human can reach. Anything above is rejected as tampering.
// Combos multiply points by up to 4, so the limits leave room for that.
const MAX_SCORE = { fishing: 3000, matkot: 500, excavation: 4000, wallbuilder: 300, haggle: 220, olivepress: 2000, guess: 500, range: 20000 }
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? ''
/** Signed Telegram data older than this MUST be rejected, so a captured request cannot be replayed forever. */
const TELEGRAM_MAX_AGE_S = 24 * 60 * 60
const TOP = 10
const KEEP = 200

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.json': 'application/json', '.webmanifest': 'application/manifest+json' }

let scores = {}
try { scores = JSON.parse(await readFile(FILE, 'utf8')) } catch { /* first run */ }
await mkdir(DATA_DIR, { recursive: true })

let writing = Promise.resolve()
const persist = () => {
  // Writes MUST be serialized and atomic so a crash never leaves a half-written file.
  writing = writing.then(async () => {
    const tmp = FILE + '.tmp'
    await writeFile(tmp, JSON.stringify(scores))
    await rename(tmp, FILE)
  }).catch(err => console.error('save failed', err))
}

const top = game => (scores[game] ?? []).slice().sort((a, b) => b.score - a.score || a.at - b.at).slice(0, TOP)

const hits = new Map()
const limited = ip => {
  const now = Date.now()
  const list = (hits.get(ip) ?? []).filter(t => now - t < 60_000)
  list.push(now)
  hits.set(ip, list)
  return list.length > 20
}

const json = (res, code, body) => {
  res.writeHead(code, { 'content-type': 'application/json', 'cache-control': 'no-store' })
  res.end(JSON.stringify(body))
}

// Checks the initData Telegram passes to a Mini App: https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
function telegramUser(initData, botToken = BOT_TOKEN, now = Date.now()) {
  if (!initData || !botToken) return null
  const params = new URLSearchParams(initData)
  const hash = params.get('hash')
  if (!hash) return null
  params.delete('hash')
  const check = [...params.entries()].map(([k, v]) => `${k}=${v}`).sort().join('\n')
  const secret = createHmac('sha256', 'WebAppData').update(botToken).digest()
  const expected = createHmac('sha256', secret).update(check).digest()
  const given = Buffer.from(hash, 'hex')
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null
  if (now / 1000 - Number(params.get('auth_date')) > TELEGRAM_MAX_AGE_S) return null
  try {
    const user = JSON.parse(params.get('user') ?? '')
    return user?.id ? user : null
  } catch {
    return null
  }
}

async function readBody(req) {
  let raw = ''
  for await (const chunk of req) {
    raw += chunk
    if (raw.length > 2000) throw new Error('too large')
  }
  return JSON.parse(raw)
}

async function api(req, res, game) {
  if (!GAMES.has(game)) return json(res, 404, { error: 'Nieznana gra' })
  if (req.method === 'GET') return json(res, 200, { scores: top(game) })
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' })

  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() ?? req.socket.remoteAddress
  if (limited(ip)) return json(res, 429, { error: 'Za dużo wyników naraz. Spróbuj za minutę.' })

  let body
  try { body = await readBody(req) } catch { return json(res, 400, { error: 'Zły format' }) }
  // A valid Telegram signature wins over whatever name the body claims.
  const tg = telegramUser(req.headers['x-telegram-init-data'])
  const typed = String(body?.name ?? '').replace(/\s+/g, ' ').trim().slice(0, 16)
  const name = tg ? (tg.username ? `@${tg.username}` : String(tg.first_name ?? '').slice(0, 32)) : typed
  const score = Number(body?.score)
  if (!name) return json(res, 400, { error: 'Podaj imię' })
  if (!Number.isInteger(score) || score < 0 || score > MAX_SCORE[game]) return json(res, 400, { error: 'Nieprawidłowy wynik' })

  const entry = { id: randomUUID(), name, score, at: Date.now(), ...(tg ? { tg: tg.id } : {}) }
  scores[game] = [...(scores[game] ?? []), entry].sort((a, b) => b.score - a.score).slice(0, KEEP)
  persist()
  return json(res, 201, { id: entry.id, scores: top(game) })
}

async function serveStatic(res, path) {
  const safe = normalize(decodeURIComponent(path)).replace(/^(\.\.[/\\])+/, '')
  let file = join(DIST, safe)
  try {
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html')
  } catch {
    file = join(DIST, 'index.html')
  }
  try {
    const data = await readFile(file)
    const hashed = file.includes('/assets/')
    res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream', 'cache-control': hashed ? 'public, max-age=31536000, immutable' : 'no-cache' })
    res.end(data)
  } catch {
    res.writeHead(404).end('Not found')
  }
}

createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x')
  const m = url.pathname.match(/^\/api\/scores\/([a-z]+)$/)
  if (m) return api(req, res, m[1])
  if (url.pathname.startsWith('/api/')) return json(res, 404, { error: 'Not found' })
  return serveStatic(res, url.pathname)
}).listen(PORT, () => console.log(`Izrael: http://localhost:${PORT}`))
