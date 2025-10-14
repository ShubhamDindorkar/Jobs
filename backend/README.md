# Auth-only Backend (Supabase + Express)

Minimal backend for Supabase Auth. Jobs are fetched from an external API, so no extra domain routes are included.

## What you get
- 🔐 Supabase Authentication (sign up, sign in, sign out, get user)
- 🚀 Express.js REST API
- 🌐 CORS for your frontend
- 📊 Health check

## Step-by-step: Supabase setup
1) Create project: go to `https://supabase.com`, create a project.
2) Get API values: Settings → API → copy:
   - Project URL → `SUPABASE_URL`
   - anon public key → `SUPABASE_ANON_KEY`
3) Enable email auth: Authentication → Providers → Email (on). Optionally configure SMTP/templates.
4) Allowed redirects (optional): Authentication → URL Configuration → add your local and production URLs.

## Environment (.env)
Copy `env.example` to `.env` and fill in:

```env
# Supabase (required)
SUPABASE_URL=...        # Supabase project URL
SUPABASE_ANON_KEY=...   # Public anon key for auth

# Server
PORT=3001               # API port
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:3000

# Scrapingdog (optional)
SCRAPINGDOG_API_KEY=... # API key for LinkedIn job scraping
```

Why these variables?
- `SUPABASE_URL`/`SUPABASE_ANON_KEY`: used by the backend to call Supabase Auth endpoints.
- `PORT`: which port Express listens on.
- `FRONTEND_URL`: restricts cross-origin requests to your app.
- `SCRAPINGDOG_API_KEY`: used by the backend to call Scrapingdog when you add job scraping routes.

## Install & run
   ```bash
cd backend
npm install
npm run dev
# or
   npm start
   ```

Server runs at `http://localhost:3001`.

## API routes
- `GET /health` → simple status
- `POST /auth/signup` → body: `{ email, password, userData? }`
- `POST /auth/signin` → body: `{ email, password }`
- `POST /auth/signout`
- `GET /auth/user` → header: `Authorization: Bearer <access_token>`

### (Optional) Jobs scraping routes
When you’re ready, add:
- `GET /jobs` → proxy to Scrapingdog search
- `GET /jobs/:id` (optional) → fetch detail via Scrapingdog

Create `config/scrapingdogClient.js`:
```js
import 'dotenv/config';
import fetch from 'node-fetch';

const API_KEY = process.env.SCRAPINGDOG_API_KEY;
const BASE = 'https://api.scrapingdog.com/';

export async function scrapingdog(path, params = {}) {
  const url = new URL(path, BASE);
  url.searchParams.set('api_key', API_KEY);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Scrapingdog error ${res.status}`);
  return res.json();
}
```

Create `api/jobs.js`:
```js
import { Router } from 'express';
import { scrapingdog } from '../config/scrapingdogClient.js';

const router = Router();

// Example: query LinkedIn jobs by keyword/location
router.get('/', async (req, res) => {
  try {
    const { q = 'software engineer', location = 'remote' } = req.query;
    // Check Scrapingdog docs for the exact endpoint/params you need
    const data = await scrapingdog('linkedin/jobs', { q, location });
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
```

Wire it in `index.js` later:
```js
import jobsRouter from './api/jobs.js';
app.use('/jobs', jobsRouter);
```

### Example requests
```bash
curl -X POST http://localhost:3001/auth/signup \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com","password":"StrongPass123"}'

curl -X POST http://localhost:3001/auth/signin \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com","password":"StrongPass123"}'

curl -H "Authorization: Bearer $TOKEN" http://localhost:3001/auth/user
```

## Notes
- We do not include `users.js`, `habits.js`, or `collaboration.js` because jobs come from an external API and you only need auth now. You can add feature routers later if needed.
- Keep your anon key non-sensitive but do not commit real `.env` to git.
