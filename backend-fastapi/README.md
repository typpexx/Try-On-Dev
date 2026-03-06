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

**Windows (PowerShell):**
```powershell
cd backend-fastapi
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**macOS/Linux:**
```bash
cd backend-fastapi
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Always **activate the venv** before running uvicorn so dependencies (e.g. `psycopg`) are found. Use port **8000** (not 80001).

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

- `POST /api/v1/auth/register` — body: `{ "email", "password", "full_name" }` (creates account + sends verification email)
- `GET /api/v1/auth/verify-email?token=...` — verifies email from the unique link
- `POST /api/v1/auth/verify-email/resend` — body: `{ "email" }` (resends verification link)
- `POST /api/v1/auth/login` — body: `{ "email", "password" }`
- `POST /api/v1/auth/google` — body: `{ "id_token" }` (Google Sign-In)
- `GET /api/v1/auth/me` — header: `Authorization: Bearer <token>`

### Payments (Stripe)

- `POST /api/v1/payments/create-checkout-session` — authenticated, creates hosted Stripe Checkout session.
- `POST /api/v1/payments/create-billing-portal-session` — authenticated, opens Stripe Billing Portal for subscription management.
- `POST /api/v1/payments/webhook` — Stripe webhook endpoint (signature verified).

## User model (auth)

Users have: `email`, `full_name`, `role`, `api_key`, `subscription_status` (starter/pro/enterprise), `status` (active/inactive/suspended), `created_at`, plus optional `password_hash`, `google_id` for auth.

## Environment

- `SECRET_KEY` — used for JWT signing (set in production).
- `GOOGLE_CLIENT_ID` — Google OAuth 2.0 Client ID (Web) for Google Sign-In. Create at [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
- `BACKEND_PUBLIC_URL` — public backend URL used in verification links.
- `FRONTEND_PUBLIC_URL` — frontend base URL used for redirects after verification (e.g. to `/sign-in`).
- `EMAIL_VERIFICATION_EXPIRE_MINUTES` — verification token lifetime in minutes.
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL` — Resend.com email delivery (recommended). If set, backend sends verification emails via Resend.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`, `SMTP_FROM_EMAIL`, `SMTP_USE_TLS` — SMTP config for sending verification emails.
- `STRIPE_SECRET_KEY` — Stripe secret key (`sk_test_...` / `sk_live_...`).
- `STRIPE_WEBHOOK_SECRET` — webhook signing secret (`whsec_...`).
- `STRIPE_PRICE_ID_PRO` / `STRIPE_PRICE_ID_PRO_YEARLY` — Stripe recurring price IDs.

## Stripe setup (secure)

1. Create Product + recurring Prices in Stripe Dashboard and copy `price_...` IDs.
2. Set Stripe env variables in `.env`.
3. Start Stripe CLI forwarding:
   ```bash
   stripe listen --forward-to localhost:8000/api/v1/payments/webhook
   ```
   Copy the printed `whsec_...` into `STRIPE_WEBHOOK_SECRET`.
4. Test checkout and webhook:
   ```bash
   stripe trigger checkout.session.completed
   ```
5. Never expose `STRIPE_SECRET_KEY` to frontend; only send users to Stripe-hosted Checkout URLs returned by backend.

## Existing database

If you already have a `users` table from before auth, add the new columns by running (with venv activated):

```powershell
python run_migrate_auth_columns.py
```

Or run the SQL in `migrations/add_auth_columns.sql` manually against your database.

If you already had a `users` table before Stripe fields were added, run:

```powershell
python run_migrate_stripe_columns.py
```

If your `users` table already exists before email verification fields were added, run:

```powershell
python run_migrate_email_verification_columns.py
```

## Notes

- Tables are auto-created at startup for MVP speed.
- Seed brands are created on first startup.
