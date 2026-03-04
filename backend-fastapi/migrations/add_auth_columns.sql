-- Run this if you already have a `users` table from before auth was added.
-- Safe to run multiple times (uses IF NOT EXISTS where supported).

ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(32) DEFAULT 'user';
ALTER TABLE users ADD COLUMN IF NOT EXISTS api_key VARCHAR(64);
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(32) DEFAULT 'starter';
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(128);

CREATE UNIQUE INDEX IF NOT EXISTS ix_users_google_id ON users (google_id) WHERE google_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS ix_users_api_key ON users (api_key) WHERE api_key IS NOT NULL;
