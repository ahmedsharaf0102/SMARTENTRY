"""
Supabase Client for Python Analysis Engine
Writes signals, coins, and candles to the Supabase database.
Uses the service_role key to bypass RLS (server-side only).
"""
import os
from supabase import create_client, Client


def get_client() -> Client:
    """Create a Supabase client with service role key."""
    url = os.environ.get('SUPABASE_URL')
    key = os.environ.get('SUPABASE_SERVICE_KEY')

    if not url or not key:
        raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_KEY must be set")

    return create_client(url, key)


def upsert_coins(coins: list[dict]) -> None:
    """Insert or update coin records."""
    client = get_client()
    client.table('coins').upsert(coins, on_conflict='symbol').execute()
    print(f"  ✅ Upserted {len(coins)} coins")


def insert_signals(signals: list[dict]) -> None:
    """Insert new signals into the database."""
    if not signals:
        return
    client = get_client()
    client.table('signals').insert(signals).execute()
    print(f"  ✅ Inserted {len(signals)} signals")


def insert_candles(candles: list[dict]) -> None:
    """Insert candle data (upsert to avoid duplicates)."""
    if not candles:
        return
    client = get_client()
    # Upsert based on unique constraint (symbol, interval, open_time)
    client.table('candles').upsert(
        candles,
        on_conflict='symbol,interval,open_time'
    ).execute()
    print(f"  ✅ Upserted {len(candles)} candles")


def get_latest_signal(symbol: str) -> dict | None:
    """Get the most recent signal for a coin."""
    client = get_client()
    result = client.table('signals') \
        .select('*') \
        .eq('symbol', symbol) \
        .order('created_at', desc=True) \
        .limit(1) \
        .execute()
    return result.data[0] if result.data else None
