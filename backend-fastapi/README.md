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

## Notes

- Tables are auto-created at startup for MVP speed.
- Seed brands are created on first startup.
- For production, add Alembic migrations and proper auth.
