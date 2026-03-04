# FastAPI Backend (PostgreSQL)

Backend for the virtual fashion try-on platform using FastAPI + PostgreSQL.

## Included

- FastAPI app with CORS and health endpoint
- PostgreSQL integration via SQLAlchemy
- Models for:
  - users/profile
  - brands
  - try-on records
  - affiliate click tracking
  - system settings
- API routes for frontend/admin flows
- Docker + docker-compose for local run

## Quick Start (Docker)

```bash
cd backend-fastapi
docker compose up --build
```

API base URL: `http://localhost:8000`
Docs: `http://localhost:8000/docs`

## Local Start (without Docker)

```bash
cd backend-fastapi
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

Make sure `DATABASE_URL` in `.env` points to a running PostgreSQL instance.

## API Prefix

All endpoints are under: `/api/v1`

### Main Endpoints

- `GET /api/v1/health`
- `GET/POST/PATCH/DELETE /api/v1/brands`
- `GET/POST/PATCH/DELETE /api/v1/users`
- `GET/POST /api/v1/try-ons`
- `GET/POST /api/v1/affiliate-clicks`
- `GET /api/v1/affiliate-clicks/summary`
- `GET/PUT /api/v1/settings/{key}`

### Auth Endpoints

- `POST /api/v1/auth/register` — body: `{ "email", "password", "full_name" }`
- `POST /api/v1/auth/login` — body: `{ "email", "password" }`
- `POST /api/v1/auth/google` — body: `{ "id_token" }` (Google Sign-In)
- `GET /api/v1/auth/me` — header: `Authorization: Bearer <token>`

## User model (auth)

Users have: `email`, `full_name`, `role`, `api_key`, `subscription_status` (starter/pro/enterprise), `status` (active/inactive/suspended), `created_at`, plus optional `password_hash`, `google_id` for auth.

## Environment

- `SECRET_KEY` — used for JWT signing (set in production).
- `GOOGLE_CLIENT_ID` — Google OAuth 2.0 Client ID (Web) for Google Sign-In. Create at [Google Cloud Console](https://console.cloud.google.com/apis/credentials).

## Existing database

If you already have a `users` table from before auth, run the SQL in `migrations/add_auth_columns.sql` against your database to add the new columns.

## Notes

- Tables are auto-created at startup for MVP speed.
- Seed brands are created on first startup.
