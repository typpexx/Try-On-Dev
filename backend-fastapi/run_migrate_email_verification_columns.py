"""
One-time migration: add email verification columns to existing `users` table.
Run from backend-fastapi with venv activated:
  python run_migrate_email_verification_columns.py
"""
import os
import sys

from sqlalchemy import text

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from app.db.session import engine


def run():
    stmts = [
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT TRUE",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMP",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verification_token_hash VARCHAR(64)",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verification_expires_at TIMESTAMP",
        "UPDATE users SET email_verified = TRUE WHERE email_verified IS NULL",
    ]
    with engine.connect() as conn:
        for sql in stmts:
            try:
                conn.execute(text(sql))
                conn.commit()
                print(f"OK: {sql[:70]}...")
            except Exception as e:
                if "already exists" in str(e).lower():
                    print(f"Skip (exists): {sql[:60]}...")
                    conn.rollback()
                else:
                    print(f"Error: {e}")
                    conn.rollback()
                    raise

        try:
            conn.execute(
                text(
                    "CREATE INDEX IF NOT EXISTS ix_users_email_verification_token_hash "
                    "ON users (email_verification_token_hash) "
                    "WHERE email_verification_token_hash IS NOT NULL"
                )
            )
            conn.commit()
            print("OK: index ix_users_email_verification_token_hash")
        except Exception as e:
            conn.rollback()
            print(f"Index (may exist): {e}")
    print("Migration done.")


if __name__ == "__main__":
    run()
