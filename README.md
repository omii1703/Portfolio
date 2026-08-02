# Om Jadhav — Portfolio

A Next.js portfolio with a glassmorphic UI, a 3D "latent space" hero visualization (React Three Fiber), scroll animations (Framer Motion), and a password-protected admin panel to edit all site content without touching code.

## Design concept

The hero renders your skills as nodes in a 3D embedding space — connected by lines when they're close together, like a literal RAG/vector-search visualization. It's the one bold signature element; everything else (glass cards, hairline dividers, structured grid) stays quiet around it.

- **Palette:** deep void navy background, violet + teal accents (vector space / data-flow), amber used only for primary CTAs.
- **Type:** Space Grotesk (display), Inter (body), JetBrains Mono (labels/data) — a small code-terminal touch.

## Tech stack

- Next.js 16 (App Router, Turbopack)
- Tailwind CSS v4
- React Three Fiber + drei (3D hero)
- Framer Motion (scroll reveals, hover tilt)
- jose (JWT sessions) + bcryptjs (password hashing)
- File-based JSON content store (`data/content.json`)

## Getting started

```bash
npm install
```

### 1. Set your admin password

```bash
node scripts/hash-password.js "your-strong-password"
```

This prints a bcrypt hash. Create a `.env.local` file (copy `.env.example`) and paste it in:

```
ADMIN_PASSWORD_HASH=<the hash printed above>
JWT_SECRET=<any long random string, e.g. output of: openssl rand -base64 32>
```

**Never commit `.env.local`.** It's already in `.gitignore`.

### 2. Run it

```bash
npm run dev
```

Visit `http://localhost:3000` for the site, and `http://localhost:3000/admin/login` for the admin panel.

### 3. Edit content

Log in at `/admin/login` with the password you hashed above. The dashboard lets you edit every section (hero, about, experience, projects, skills, achievements, contact) and save changes with one click — no redeploy needed while running `npm run dev` or `npm start` on a persistent server.

## Important: content storage & deployment

Content is stored in `data/content.json` and edited via a server-side file write. This works great when self-hosted (a VPS, Docker container, Railway, Render, etc.) with `npm run build && npm start`, where the filesystem persists between requests.

**It will NOT work on serverless platforms like Vercel or Netlify in production**, because their filesystem is read-only/ephemeral at runtime — admin edits would appear to succeed but vanish on the next deploy or cold start. If you deploy there, swap `lib/content.ts` for a real datastore (Vercel KV/Postgres, Supabase, PlanetScale, etc.) — the read/write function signatures are intentionally small so this is a quick swap.

## Security notes

- Admin session is a signed, httpOnly, `SameSite=Strict` JWT cookie (12h expiry) — never exposed to client JS.
- Password is bcrypt-hashed; the plaintext is never stored.
- Login endpoint has basic in-memory rate limiting (8 attempts / 10 min per IP) — swap for a durable store (Redis) if you expect real attack traffic.
- `/admin/dashboard/*` is gated by `proxy.ts` (Next.js 16's middleware equivalent), which redirects unauthenticated requests to `/admin/login`.
- Change `JWT_SECRET` and your admin password before deploying publicly — the values in `.env.example` are placeholders only.

## Project structure

```
app/
  page.tsx              — home page, composes all sections
  admin/login/          — login screen
  admin/dashboard/      — content editor (protected)
  api/auth/             — login, logout, session check
  api/content/          — GET (public) / PUT (admin-only) content
components/             — all UI sections + 3D hero + shared primitives
data/content.json       — editable site content (the "CMS")
lib/auth.ts             — JWT + password verification
lib/content.ts          — content file read/write
proxy.ts                — protects /admin/dashboard
scripts/hash-password.js — CLI to generate your admin password hash
```

## Photo & resume

- Your photo lives at `public/om-photo.jpg` and is referenced by `about.photoUrl` in `data/content.json` (editable from the admin dashboard too).
- Your resume PDF lives at `public/Om_Jadhav_Resume.pdf` and is linked from `hero.resumeUrl`. The "Download resume" buttons in the navbar and hero point straight at it.
- To swap either file later: replace the file in `public/` (keep the same filename, or update the path in the admin dashboard / content.json).

## Customizing the 3D hero

Edit `hero.nodes` in the admin dashboard (or `data/content.json`) to change which skill labels appear in the 3D graph — no code changes needed. For deeper visual tweaks (particle count, colors, rotation speed), see `components/LatentSpace.tsx`.
