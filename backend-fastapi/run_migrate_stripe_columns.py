"""
One-time migration: add Stripe-related columns to existing `users` table.
Run from backend-fastapi with venv activated:
  python run_migrate_stripe_columns.py
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from sqlalchemy import text
from app.db.session import engine


def run():
    stmts = [
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(128)",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_subscription_id VARCHAR(128)",
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
                    raise
    print("Stripe columns migration done.")


if __name__ == "__main__":
    run()
