"""
One-time migration: add auth-related columns to existing `users` table.
Run from backend-fastapi with venv activated:
  python run_migrate_auth_columns.py
"""
import os
import sys

# Load .env and use app config
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from app.core.config import settings
from sqlalchemy import text
from app.db.session import engine


def run():
    stmts = [
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255)",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(32) DEFAULT 'user'",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS api_key VARCHAR(64)",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(32) DEFAULT 'starter'",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(128)",
    ]
    with engine.connect() as conn:
        for sql in stmts:
            try:
                conn.execute(text(sql))
                conn.commit()
                print(f"OK: {sql[:60]}...")
            except Exception as e:
                if "already exists" in str(e).lower():
                    print(f"Skip (exists): {sql[:50]}...")
                    conn.rollback()
                else:
                    print(f"Error: {e}")
                    conn.rollback()
                    raise
        # Indexes (idempotent)
        try:
            conn.execute(text(
                "CREATE UNIQUE INDEX IF NOT EXISTS ix_users_google_id ON users (google_id) WHERE google_id IS NOT NULL"
            ))
            conn.commit()
            print("OK: index ix_users_google_id")
        except Exception as e:
            conn.rollback()
            print(f"Index (may exist): {e}")
        try:
            conn.execute(text(
                "CREATE INDEX IF NOT EXISTS ix_users_api_key ON users (api_key) WHERE api_key IS NOT NULL"
            ))
            conn.commit()
            print("OK: index ix_users_api_key")
        except Exception as e:
            conn.rollback()
            print(f"Index (may exist): {e}")
    print("Migration done.")


if __name__ == "__main__":
    run()
