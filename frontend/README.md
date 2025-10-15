# Jobs Search – Frontend Overview & Setup

This is the Next.js 15 (App Router) frontend for Jobs Search. It ships with a landing page, a protected dashboard with job search, a profile editor with resume upload to Supabase Storage, and a serverless API route that proxies to ScrapingDog.

## Structure

```
frontend/
├─ app/
│  ├─ api/jobs/route.ts          # ScrapingDog proxy + normalizer (used by search UI)
│  ├─ auth/callback/page.tsx     # Supabase OAuth callback → redirects to /dashboard
│  ├─ auth/update-password/...   # Magic-link password update
│  ├─ dashboard/page.tsx         # Auth-protected dashboard (Jobs)
│  ├─ dashboard/profile/page.tsx # Profile editor + resume upload to Supabase Storage
│  └─ page.tsx                   # Landing page (hero → mission → reviews → FAQ)
├─ components/                   # UI building blocks (navbar, hero, faq, testimonials, etc.)
├─ lib/supabase.ts               # Browser Supabase client (PKCE, session persistence)
├─ next.config.ts                # Next.js config
├─ eslint.config.mjs             # Flat ESLint config
└─ package.json
```

## Environment variables

Create `frontend/.env.local` (dev) and set the same keys in your hosting provider for prod:

```ini
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# ScrapingDog (for live jobs)
SCRAPINGDOG_API_KEY=your_scrapingdog_key

# Optional
NEXT_TELEMETRY_DISABLED=1
```

Do NOT set `NEXT_PUBLIC_BACKEND_URL` unless you deploy and want to use the Node backend. By default, `/api/jobs` calls ScrapingDog directly from the Next route.

## Supabase configuration

- Auth → URL Configuration
  - Site URL: your production domain (e.g., `https://jobssearchmain.vercel.app`)
  - Additional Redirect URLs:
    - `https://jobssearchmain.vercel.app/auth/callback`
    - `https://jobssearchmain.vercel.app/auth/update-password`
    - `http://localhost:3000/auth/callback` (dev)
    - `http://localhost:3000/auth/update-password` (dev)

- Storage → Create bucket `resumes` (private). Policies for per-user access:

```sql
create policy "resumes select own" on storage.objects
for select to authenticated
using (bucket_id = 'resumes' and name like auth.uid()::text || '/%');

create policy "resumes insert own" on storage.objects
for insert to authenticated
with check (bucket_id = 'resumes' and name like auth.uid()::text || '/%');

create policy "resumes update own" on storage.objects
for update to authenticated
using (bucket_id = 'resumes' and name like auth.uid()::text || '/%');

create policy "resumes delete own" on storage.objects
for delete to authenticated
using (bucket_id = 'resumes' and name like auth.uid()::text || '/%');
```

## Run locally

```bash
cd frontend
npm install
npm run dev
# open http://localhost:3000
```

## Deploy

Netlify:
- Base directory: `frontend`
- Build command: `npm run build`
- Publish directory: `.next`
- Functions directory: `.netlify/functions`
- Environment: `NODE_VERSION=20` + the envs above
- Add `netlify.toml` if Next runtime isn’t detected (see root README or provider docs)

Vercel:
- Root directory: `frontend`
- Build command/output: auto (Next.js)
- Environment: same keys as above

## Example usage

Search from the dashboard:

```ts
const r = await fetch('/api/jobs?field=react developer&location=Remote&sort_by=dd&page=1&exp_level=2,3');
const { jobs } = await r.json();
```

Upload a resume to Supabase Storage:

```ts
const objectPath = `${userId}/resume-${Date.now()}.pdf`;
await supabase.storage.from('resumes').upload(objectPath, file, { contentType: file.type });
const { data: signed } = await supabase.storage.from('resumes').createSignedUrl(objectPath, 3600);
```

## Troubleshooting

- 404 on Netlify: publish must be `.next` (not `frontend/.next`), and Next runtime/plugin enabled.
- Redirects to localhost after auth: set Supabase Site URL + prod redirect URLs; retry in incognito.
- No jobs: set `SCRAPINGDOG_API_KEY` in env.
