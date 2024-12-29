# Example using SQLite (replace with your preferred database)
import sqlite3

DATABASE_NAME = 'trading_bot.db'

def create_tables():
    conn = sqlite3.connect(DATABASE_NAME)
    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS orders (
            id TEXT PRIMARY KEY,
            signal_id TEXT,
            order_id TEXT,
            status TEXT,
            details TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_type TEXT,
            message TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS processed_signals (
            signal_id TEXT PRIMARY KEY
        )
    ''')

    conn.commit()
    conn.close()

def load_settings():
    """Loads settings from the database."""
    try:
        conn = sqlite3.connect(DATABASE_NAME)
        cursor = conn.cursor()
        cursor.execute("SELECT key, value FROM settings")
        settings = {row[0]: row[1] for row in cursor.fetchall()}
        conn.close()
        return settings
    except Exception as e:
        print(f"Error loading settings: {e}")
        return {}

def save_settings(settings):
    """Saves settings to the database."""
    try:
        conn = sqlite3.connect(DATABASE_NAME)
        cursor = conn.cursor()
        for key, value in settings.items():
            cursor.execute("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", (key, value))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Error saving settings: {e}")

def add_order_to_history(order_details):
    """Adds an order to the history in the database."""
    try:
        conn = sqlite3.connect(DATABASE_NAME)
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO orders (id, signal_id, order_id, status, details) VALUES (?, ?, ?, ?, ?)",
            (order_details.get('id'), order_details.get('signal_id'), order_details.get('order_id'), order_details.get('status'), json.dumps(order_details))
        )
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Error adding order to history: {e}")

def add_error_log(message):
    """Adds an error log to the database."""
    try:
        conn = sqlite3.connect(DATABASE_NAME)
        cursor = conn.cursor()
        cursor.execute("INSERT INTO logs (event_type, message) VALUES (?, ?)", ('error', message))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Error adding error log: {e}")

def get_processed_signal_ids():
    """Retrieves a list of processed signal IDs from the database."""
    try:
        conn = sqlite3.connect(DATABASE_NAME)
        cursor = conn.cursor()
        cursor.execute("SELECT signal_id FROM processed_signals")
        signal_ids = [row[0] for row in cursor.fetchall()]
        conn.close()
        return signal_ids
    except Exception as e:
        print(f"Error getting processed signal IDs: {e}")
        return []

def add_processed_signal_id(signal_id):
    """Adds a signal ID to the list of processed signals in the database."""
    try:
        conn = sqlite3.connect(DATABASE_NAME)
        cursor = conn.cursor()
        cursor.execute("INSERT INTO processed_signals (signal_id) VALUES (?)", (signal_id,))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Error adding processed signal ID: {e}")

# Create tables on startup
create_tables()