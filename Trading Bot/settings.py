import json

# Load settings from a file or database if available
try:
    with open('settings.json', 'r') as f:
        user_settings = json.load(f)
except FileNotFoundError:
    user_settings = {}

# Default trading parameters
DEFAULT_TRADING_PAIR = user_settings.get('trading_pair', "ETH-USD")
DEFAULT_TRADE_PERCENTAGE = user_settings.get('trade_percentage', 10)  # Use 10% of balance per trade
DEFAULT_MAX_DAILY_LOSS = user_settings.get('max_daily_loss', 5)  # Allow a maximum 5% loss per day

def update_settings(new_settings):
    """
    Updates the user settings and persists them to a file or database.
    """
    global TRADING_PAIR, TRADE_PERCENTAGE, MAX_DAILY_LOSS
    TRADING_PAIR = new_settings.get('trading_pair', TRADING_PAIR)
    TRADE_PERCENTAGE = new_settings.get('trade_percentage', TRADE_PERCENTAGE)
    MAX_DAILY_LOSS = new_settings.get('max_daily_loss', MAX_DAILY_LOSS)

    # Persist settings to a file or database
    # Example using a JSON file:
    with open('settings.json', 'w') as f:
        json.dump({
            'trading_pair': TRADING_PAIR,
            'trade_percentage': TRADE_PERCENTAGE,
            'max_daily_loss': MAX_DAILY_LOSS
        }, f)