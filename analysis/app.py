"""
SmartEntry Analysis Engine — Flask API
Provides endpoints for running technical analysis on crypto market data.
"""
import os
import json
from flask import Flask, request, jsonify
from engine.indicators import calculate_indicators
from engine.signals import generate_signals
from utils.binance_client import fetch_klines, fetch_top_pairs
import sqlite3

app = Flask(__name__)

DB_PATH = os.environ.get('DB_PATH', os.path.join(os.path.dirname(__file__), '..', 'data', 'smartentry.db'))


def get_db():
    """Get SQLite database connection."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint."""
    return jsonify({'status': 'ok', 'service': 'smartentry-analysis'})


@app.route('/analyze', methods=['POST'])
def analyze():
    """
    Run full analysis pipeline:
    1. Fetch top USDT pairs from Binance
    2. Fetch kline data for each pair
    3. Calculate technical indicators
    4. Generate trading signals
    5. Store results in SQLite
    """
    try:
        data = request.get_json() or {}
        limit = data.get('limit', 50)
        intervals = data.get('intervals', ['1h', '4h', '1d'])

        # Step 1: Get top pairs
        pairs = fetch_top_pairs(limit=limit)
        if not pairs:
            return jsonify({'error': 'Failed to fetch pairs from Binance'}), 500

        db = get_db()
        all_signals = []

        for symbol in pairs:
            try:
                # Ensure coin exists in DB
                db.execute(
                    'INSERT OR IGNORE INTO coins (symbol, base_asset, quote_asset) VALUES (?, ?, ?)',
                    (symbol, symbol.replace('USDT', ''), 'USDT')
                )

                for interval in intervals:
                    # Step 2: Fetch klines
                    klines = fetch_klines(symbol, interval, limit=200)
                    if not klines:
                        continue

                    # Store candles
                    for k in klines:
                        db.execute('''
                            INSERT OR REPLACE INTO candles 
                            (symbol, interval, open_time, open, high, low, close, volume, close_time)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                        ''', (
                            symbol, interval,
                            k['open_time'], k['open'], k['high'], k['low'],
                            k['close'], k['volume'], k['close_time']
                        ))

                    # Step 3: Calculate indicators
                    indicators = calculate_indicators(klines)
                    if not indicators:
                        continue

                    # Step 4: Generate signals (only on primary interval)
                    if interval == '1h':
                        signals = generate_signals(symbol, indicators, klines[-1]['close'])
                        for signal in signals:
                            db.execute('''
                                INSERT INTO signals 
                                (symbol, signal_type, action, strength, price_at_signal, details)
                                VALUES (?, ?, ?, ?, ?, ?)
                            ''', (
                                signal['symbol'],
                                signal['signal_type'],
                                signal['action'],
                                signal['strength'],
                                signal['price_at_signal'],
                                json.dumps(signal['details'])
                            ))
                            all_signals.append(signal)

            except Exception as e:
                app.logger.warning(f'Error analyzing {symbol}: {e}')
                continue

        db.commit()
        db.close()

        return jsonify({
            'status': 'ok',
            'pairs_analyzed': len(pairs),
            'signals_generated': len(all_signals),
            'signals': all_signals
        })

    except Exception as e:
        app.logger.error(f'Analysis failed: {e}')
        return jsonify({'error': str(e)}), 500


@app.route('/indicators/<symbol>', methods=['GET'])
def get_indicators(symbol):
    """Get calculated indicators for a specific symbol."""
    try:
        interval = request.args.get('interval', '1h')
        klines = fetch_klines(symbol.upper(), interval, limit=200)

        if not klines:
            return jsonify({'error': f'No data for {symbol}'}), 404

        indicators = calculate_indicators(klines)
        return jsonify({
            'symbol': symbol.upper(),
            'interval': interval,
            'indicators': indicators
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
