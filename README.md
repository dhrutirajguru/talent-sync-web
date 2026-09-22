# TalentSync Frontend

React frontend for TalentSync, the Academia-Industry Collaboration Portal built for SIH26044.
The backend lives in a separate repo, `talent-sync-services` (FastAPI + PostgreSQL); see its
`docs/README.md` for the API, schema, and AWS deployment.

## What it does

Three role-specific experiences behind one login:

- **Student**: dashboard with skill profile, edit skills, view ranked recommended opportunities,
  apply, track applications.
- **Industry**: dashboard, post an opportunity with required skills, view ranked candidates for
  a posting, track applicant lists.
- **Academician**: dashboard, institution skill-gap report (skills demanded by live postings vs.
  skills present in the student body).

This is the hackathon demo build: the flows above are wired to the real backend API. Every
other screen in the app (notifications, curriculum, and the remaining role-nav items not listed
above) renders as a static placeholder against the same API client interface, so swapping a
screen from placeholder to real is a fixture-to-endpoint change, not a UI rewrite. See the
backend's `docs/design-anthropic.md` Section 6.10 for the full scope rationale.

## Tech stack

- React 18, TypeScript
- Vite (dev server and build)
- React Router v6
- TanStack Query for server-state caching against the API

## Project structure

```text
src/
  api/            typed fetch wrappers per resource (auth, skills, opportunities, ...)
  components/     shared UI, plus layout/ (AppLayout, Header, Sidebar, ProtectedRoute)
  context/        AuthContext (session/JWT), ToastContext
  routes/         one folder per role (student/, industry/, academician/), plus
                   Login/Register/Placeholder/DashboardStub
  config/nav.ts   role-based nav item definitions
  hooks/          shared hooks (e.g. useMyInstitution)
  types/          shared TypeScript types (domain, auth)
  utils/          shared helpers (e.g. skillScore)
  App.tsx         routes and role-based redirects
  main.tsx        entry point
```

## Local development

Requirements: Node.js, npm.

```bash
npm install
cp .env.example .env      # set VITE_API_BASE_URL to your backend, e.g.
                           # http://localhost:8000/api/v1
npm run dev                # http://localhost:5173
```

Other scripts:

```bash
npm run build              # tsc -b && vite build, output to dist/
npm run preview             # serve the production build locally
```

## Environment variables

Set in `.env` (see `.env.example`):

| Variable | Purpose |
|---|---|
| `VITE_API_BASE_URL` | base URL of the backend API, including the `/api/v1` prefix |

## Deployment

The production build is deployed as a static site into a shared GitHub Pages user site
(`dhrutirajguru.github.io`), which also hosts a few older, unrelated projects in their own
subfolders. It's deployed twice, to two different paths:

- **Root** (`https://dhrutirajguru.github.io/`): the primary, judge-facing copy, kept at root
  deliberately so it can be repurposed for something else after the hackathon.
- **`/talentsync/` subfolder**: a secondary, stable copy whose URL won't change even if root
  content changes later.

Since it isn't served from its own domain, each copy needs its own build, because asset URLs
are baked in at build time:

```bash
npm run build                        # root copy: default base "/"
npm run build -- --base=/talentsync/ # subfolder copy
```

`App.tsx`'s `BrowserRouter` uses `basename={import.meta.env.BASE_URL}`, which picks up whatever
base was passed at build time, so routing matches whichever copy is being served without a
hardcoded value.

Since GitHub Pages has no SPA fallback by default, a hard refresh or a direct deep link (in
either copy) would otherwise 404. `index.html` includes a small inline script (the
[spa-github-pages](https://github.com/rafgraph/spa-github-pages) pattern) that restores the
intended route from a `?/` query string; the matching redirect lives in a `404.html` at the
GitHub Pages repo root, not in this repo, since GitHub Pages only honors one 404 page for the
whole site. That `404.html` only preserves the first path segment for the known legacy
subfolders; every other path is treated as a deep link into whichever app is currently at root.

To publish an update:

```bash
npm run build
# copy the contents of dist/ into the root of the dhrutirajguru.github.io repo (index.html and
# assets/, leaving its other subfolders untouched)

npm run build -- --base=/talentsync/
# copy the contents of dist/ into the talentsync/ folder of that same repo

# then commit and push that repo
```

Set `VITE_API_BASE_URL` in `.env` to the deployed backend URL before building for production
(currently `https://dau-talentsync.duckdns.org/api/v1`), and make sure that backend's
`CORS_ORIGINS` includes `https://dhrutirajguru.github.io`.
