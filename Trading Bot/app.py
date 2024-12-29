from flask import Flask, request, jsonify, render_template, send_from_directory
from order_executor import OrderExecutor
from dashboard import Dashboard
import settings
import utils
import logging
import json
import uuid
from cdp_sdk.client import CdpClient

app = Flask(__name__, static_folder='static', template_folder='templates')

# Initialize Order Executor and Dashboard (load settings)
# Pass CDP client to OrderExecutor
cdp_client = CdpClient() # Initialize the CDP Client here
order_executor = OrderExecutor(cdp_client)
dashboard = Dashboard()

# Load initial balances on startup
dashboard.update_balances(order_executor.get_balances())

# --- Serve Static Files for OnchainKit (e.g., CSS, JS) ---

@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

# --- Webhook Endpoint ---
@app.route('/webhook', methods=['POST'])
def webhook():
    """
    Handles incoming webhook signals from TradingView.
    """
    data = request.get_json()

    # Log the raw webhook data for debugging
    utils.log_event("webhook_received", data)

    # 2. Parse the JSON payload
    try:
        signal = parse_tradingview_signal(data)
        utils.log_event("webhook_parsed", signal) # Log the parsed signal
    except Exception as e:
        utils.log_event("webhook_error", f"Error parsing webhook: {e}")
        return jsonify({'error': 'Invalid payload'}), 400

    # 3. Check for duplicate signalId
    if dashboard.is_duplicate_signal(signal['signalId']):
        utils.log_event("webhook_duplicate", signal['signalId'])
        return jsonify({'message': 'Duplicate signalId'}), 200

    # 4. Handle ping signals
    if signal['action'] == 'ping':
        dashboard.update_active_trading_pair(signal['product'])
        dashboard.update_balances(order_executor.get_balances())
        utils.log_event("webhook_ping_processed", signal)
        return jsonify({'message': 'Ping processed'}), 200

    # 5. Check if the bot is ON and trading the correct pair
    if not dashboard.is_bot_on() or signal['product'] != dashboard.get_active_trading_pair():
        utils.log_event("webhook_ignored", signal)
        return jsonify({'message': 'Signal ignored'}), 200

    # 6. Process order signal
    order_result = order_executor.execute_order(signal, dashboard.get_trade_percentage(), dashboard.get_max_daily_loss())

    # 7. Update dashboard and logs
    if order_result['success']:
        dashboard.update_balances(order_executor.get_balances())
        dashboard.add_order_to_history(order_result)
        utils.log_event("order_executed", order_result)
        return jsonify({'message': 'Order executed successfully'}), 200
    else:
        dashboard.add_error_log(order_result['error'])
        utils.log_event("order_failed", order_result)
        return jsonify({'error': order_result['error']}), 500

# --- Helper Functions ---

def parse_tradingview_signal(data):
    """
    Parses the incoming TradingView signal and adds a UUID as signalId if not present.
    """
    if 'signalId' not in data:
        data['signalId'] = str(uuid.uuid4())  # Generate a UUID if signalId is missing
    return data

# --- Dashboard Routes (examples) ---

@app.route('/')
def index():
    # Render the dashboard template (HTML/JS)
    return render_template('index.html')

@app.route('/api/data')
def get_dashboard_data():
    # Return data for the dashboard (balances, order history, etc.)
    return jsonify(dashboard.get_data())

@app.route('/api/settings', methods=['POST'])
def update_settings():
    # Update user settings
    settings.update_settings(request.get_json())
    return jsonify({'message': 'Settings updated'})

@app.route('/api/toggle', methods=['POST'])
def toggle_bot():
    # Toggle the bot ON/OFF
    dashboard.toggle_bot()
    return jsonify({'status': 'Bot is now ' + ('ON' if dashboard.is_bot_on() else 'OFF')})

@app.route('/api/panic', methods=['POST'])
def panic_stop():
    # Stop the bot and optionally cancel open orders
    dashboard.toggle_bot(False)  # Ensure bot is turned off
    try:
        # Cancel all open orders
        cancel_response = order_executor.cancel_all_orders()
        if cancel_response.get('success', False):
            utils.log_event("panic_stop_success", "All open orders cancelled successfully.")
            return jsonify({'message': 'Panic stop initiated, all open orders cancelled.'})
        else:
            utils.log_event("panic_stop_failed", f"Failed to cancel orders: {cancel_response.get('error', 'Unknown error')}")
            return jsonify({'error': f"Failed to cancel orders: {cancel_response.get('error', 'Unknown error')}"}), 500
    except Exception as e:
        utils.log_event("panic_stop_error", f"An unexpected error occurred: {e}")
        return jsonify({'error': f'An unexpected error occurred: {e}'}), 500
    

if __name__ == '__main__':
    app.run(debug=True, port=3000) # App runs on port 3000