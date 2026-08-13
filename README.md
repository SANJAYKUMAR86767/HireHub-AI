# HireHub — AI-Powered Job & Recruitment Platform

Full working MERN codebase: auth, jobs, applications, AI resume/job
matching (real LLM + safe rule-based fallback), resume file uploads,
real-time chat, admin dashboard, Redis caching, email notifications,
Docker, and deployment configs.

## Features
- **Auth**: JWT, bcrypt, role-based access (candidate / recruiter / admin)
- **Jobs**: post, search (text + filters), edit, delete
- **Applications**: apply, track status, recruiter shortlist/reject/hire
- **AI matching**: if `ANTHROPIC_API_KEY` is set, real Claude-powered resume↔job
  analysis; otherwise falls back automatically to a rule-based matcher — the
  app always works either way. Same for AI candidate ranking.
- **Resume upload**: Cloudinary storage if configured, otherwise local disk
  fallback (`server/uploads`) — works out of the box either way. PDF text
  extraction included.
- **Real-time chat**: Socket.IO, JWT-authenticated sockets
- **Admin dashboard**: platform stats, user management (block/unblock),
  recruiter/company verification, job moderation
- **Redis caching**: job listings cached when `REDIS_URL` is set; skipped
  safely if not
- **Email notifications**: SMTP via nodemailer — new applicant alerts to
  recruiters, status update alerts to candidates. Skipped safely if SMTP
  isn't configured (logs to console instead)
- **Docker**: full `docker-compose.yml` (mongo + redis + server + client)
- **Deployment**: `render.yaml` for the backend, `vercel.json` for the frontend
- **AI Interview Prep**: candidates practice role-specific mock interview
  questions and get instant scored feedback on their answers. Real
  Claude-generated questions/feedback when `ANTHROPIC_API_KEY` is set,
  otherwise a curated question bank + heuristic feedback engine
  (`/candidate/interview-prep`)
- **Resume Builder**: structured resume editor with 3 selectable templates
  (Modern / Classic / Minimal), live preview, and one-click print/PDF export
  (`/candidate/resume-builder`)
- **Fraud/Spam Job Detection**: every job posting is auto-scored for scam
  signals (upfront-fee requests, off-platform contact links, unrealistic pay,
  spam phrasing, low-effort descriptions). AI-scored when `ANTHROPIC_API_KEY`
  is set, otherwise a rule-based scanner. High-risk jobs are hidden from
  public search and surfaced to admins with color-coded risk badges and
  flag details (`/admin/jobs`)

## Quick start — local dev (no Docker)

### 1. Backend
```bash
cd server
cp .env.example .env
npm install
npm run dev
```
Set `JWT_SECRET` in `.env` to any random string. Everything else
(Cloudinary, AI, Redis, SMTP) is **optional** — leave blank and those
features gracefully fall back to safe defaults.

Create your first admin account:
```bash
npm run create-admin -- admin@hirehub.com yourPassword123 "Admin Name"
```

### 2. Frontend
```bash
cd client
npm install
npm run dev
```
Visit http://localhost:5173

## Quick start — Docker (everything at once)
```bash
cp .env.example .env   # fill in JWT_SECRET at minimum
docker compose up --build
```
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- MongoDB + Redis run as containers automatically

To create an admin user in Docker:
```bash
docker compose exec server npm run create-admin -- admin@hirehub.com yourPassword123 "Admin"
```

## Enabling optional services

| Service | Env vars | What happens if not set |
|---|---|---|
| Cloudinary (resume storage) | `CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET` | Resumes stored locally in `server/uploads`, served at `/uploads` |
| Real AI matching | `ANTHROPIC_API_KEY` | Falls back to rule-based skill matcher (still fully functional) |
| Redis caching | `REDIS_URL` | Job listing queries just skip the cache layer |
| Email (SMTP) | `SMTP_HOST/USER/PASS` | Emails are logged to console instead of sent |

## Deployment
- **Backend → Render**: push to GitHub, then Render → New → Blueprint,
  point at this repo (`render.yaml` is already set up). Add your env vars
  in the Render dashboard.
- **Frontend → Vercel**: import the `client/` folder as the project root,
  set `VITE_API_URL` and `VITE_SOCKET_URL` to your deployed backend URL.
- **Or self-host both with Docker** using `docker-compose.yml` on any VPS.

## Try it out
1. Sign up as a **Recruiter** → post a job with skills (e.g. React, Node.js, MongoDB)
2. Sign up as a **Candidate** → add skills + upload a resume on your dashboard
3. Open the job → "Analyze Match" for the AI score → Apply
4. As the recruiter → view Applicants → "AI Rank Candidates"
5. Log in as admin (`npm run create-admin`) → see platform stats, manage users/jobs
6. Chat: visit `/chat/<other-user-id>` from either account

## Project structure
```
hirehub/
├── docker-compose.yml
├── render.yaml
├── server/                 # Node + Express + MongoDB + Socket.IO
│   ├── config/              # db.js, cloudinary.js
│   ├── models/               # User, Job, Application, Message
│   ├── controllers/          # auth, job, application, ai, resume, admin, message
│   ├── routes/
│   ├── middleware/           # auth, upload (multer/cloudinary)
│   ├── sockets/               # chatSocket.js
│   ├── utils/                 # aiMatch.js, mailer.js, cache.js
│   ├── scripts/createAdmin.js
│   └── Dockerfile
└── client/                 # React + Vite + Tailwind
    ├── vercel.json
    ├── Dockerfile / nginx.conf
    └── src/
        ├── components/
        ├── pages/ (candidate/, recruiter/, admin/)
        ├── context/
        └── services/
```

## Still worth adding later (say the word)
- AI interview prep chatbot, resume builder templates, fraud/spam job
  detection, Google Calendar interview scheduling, push notifications
