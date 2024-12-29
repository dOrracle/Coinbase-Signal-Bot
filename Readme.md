# Trading Bot with Coinbase Integration

This project is a trading bot that integrates with the Coinbase Advanced Trade API to execute trades based on signals received from TradingView via webhooks. It features a React-based dashboard built with OnchainKit for monitoring and configuration.

## Project Structure

```
trading_bot/
    app.py                # Main Flask application
    order_executor.py     # Order execution logic
    dashboard.py          # Dashboard data and logic
    settings.py           # Settings management
    utils.py              # Utility functions (logging, validation)
    database.py           # Database interactions (if using SQLite)
    static/
        styles.css        # Placeholder for CSS
        bundle.js         # Placeholder for your compiled React/OnchainKit code
    templates/
        index.html        # Main HTML template for the dashboard
    frontend/             # React Frontend Code
        public/
            index.html
        src/
            App.js
            index.js
            components/
                BalanceDisplay.js
                LastSignal.js
                OrderHistory.js
                Settings.js
                BotToggle.js
                PanicButton.js
                PerformanceMetrics.js
                Visualizations.js
    .env                  # Environment variables (API keys, secrets, etc.)
    requirements.txt      # Python dependencies
    package.json          # Node dependencies
    README.md             # Project Readme (detailed instructions)
```

## Prerequisites

- Python 3.10 or higher
- Node.js 18+
- npm 9.7.2+
- pip
- A Coinbase Developer Platform account with a secret API key.
- A TradingView account (for sending signals).
- A Discord account (for setting up a webhook to receive notifications).

## Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Backend Setup (Python)

#### Create a Virtual Environment (Recommended)

```bash
python3 -m venv venv
source venv/bin/activate  # On Linux/macOS
venv\Scripts\activate     # On Windows
```

#### Install Python Dependencies

```bash
pip install -r requirements.txt
```

#### Configure Environment Variables

Create a `.env` file in the root directory and add your Coinbase API key, API secret, and TradingView webhook URL:

```
CDP_API_KEY_NAME="organizations/{org_id}/apiKeys/{key_id}"
CDP_API_KEY_PRIVATE_KEY="-----BEGIN EC PRIVATE KEY-----\nYOUR PRIVATE KEY\n-----END EC PRIVATE KEY-----\n"
TRADINGVIEW_WEBHOOK_URL="YOUR_TRADINGVIEW_WEBHOOK_URL"
DISCORD_WEBHOOK_URL="YOUR_DISCORD_WEBHOOK_URL" # Add this if you have not created a Discord Webhook yet
```

Replace the placeholders with your actual keys and URLs.

### 3. Frontend Setup (React with OnchainKit)

Navigate to the frontend directory:

```bash
cd frontend
```

Install the dependencies:

```bash
npm install
```

### 4. Configure TradingView

Create an alert for your trading strategy in TradingView. In the alert settings, select **Webhook URL** and enter the URL of your server that will receive the webhook (e.g., `https://your-app.com/webhook`).

In the **Message** field, create the JSON payload using the format specified in the `app.py` (see `parse_tradingview_signal` function). Example Message (JSON):

```json
{
    "signalId": "{{strategy.order.id}}",
    "action": "{{strategy.order.action}}",
    "product": "{{ticker}}",
    "timestamp": "{{timenow}}",
    "limit_price": "{{strategy.order.limit_price}}",
    "strategy_name": "My Strategy",
    "strategy_version": "1.0"
}
```

Save the alert.

### 5. Configure Discord Webhook (Optional)

If you want to receive Discord notifications:

- Follow the instructions in the original documentation to set up a Discord webhook.
- Copy the Discord webhook URL and paste it into your `.env` file as `DISCORD_WEBHOOK_URL`.

## Running the Application

### Start the Backend Server:

```bash
python app.py
```

This will start the Flask development server on port 3000.

### Start the Frontend (React Development Server):

```bash
cd frontend
npm start
```

This will start the React development server and open the dashboard in your default web browser (usually at `http://localhost:3001`).

### Expose the Backend with ngrok or Pinggy (for testing):

If you're testing with TradingView, you'll need to expose your backend server to the internet. You can use ngrok or Pinggy for this:

With ngrok:

```bash
ngrok http 3000
```

With Pinggy:

```bash
ssh -p 443 -R0:localhost:3000 a.pinggy.io
```

This will generate a public URL that forwards traffic to your local server. Use this URL as your TradingView webhook URL and in your `settings.json` file.

## Usage

### Configure Settings:

- Open the dashboard in your browser.
- Go to the **Settings** section.
- Enter your Coinbase API key and secret.
- Enter your TradingView webhook URL.
- Adjust the trading parameters (percentage of balance, active trading pair, max daily loss).
- Choose between "paper trading" and "real trading" mode.
- Save the settings.

### Enable the Bot:

- Toggle the "Bot Status" switch to ON.

### Monitor the Dashboard:

The dashboard will display the current balances, order history, error logs, and performance metrics. It will also show the last received signal from TradingView.

### Panic Button:

Click the "Panic Stop" button to immediately stop the bot and optionally cancel any open orders.

## Testing

- **Unit Tests:** Write unit tests for individual modules (order_executor.py, dashboard.py, utils.py) to test specific functions in isolation.
- **Integration Tests:** Test the interaction between different modules (e.g., app.py and order_executor.py).
- **End-to-End Tests:** Simulate TradingView signals and test the entire flow from webhook reception to order execution and dashboard updates.
- **Paper Trading:** Use the "paper trading" mode to test the bot's logic without using real funds.

## Troubleshooting

- **Check the logs:** The app.log file will contain logs of events and errors.
- **Use the debugger:** Use a Python debugger (e.g., pdb, ipdb) to step through the code and inspect variables.
- **Verify API keys:** Ensure that your API keys are correct and have the necessary permissions.
- **Check network connectivity:** Make sure that your server can connect to the Coinbase API and the TradingView webhook URL.
- **Inspect the database:** If you're using a database, inspect the tables to ensure that data is being stored correctly.

## Security Considerations

- Never store API keys or secrets in your code. Use environment variables instead.
- Validate all inputs from TradingView signals to prevent injection attacks.
- Implement proper error handling to prevent crashes and provide informative error messages.
- Use HTTPS for all communication between your server and external services.
- Regularly update your dependencies to patch security vulnerabilities.
- Consider using a firewall to restrict access to your server.

## Deployment

- **Choose a hosting provider:** You can deploy this application to a cloud server (e.g., AWS, Google Cloud, Heroku) or your own server.
- **Use a production-ready WSGI server:** Replace the Flask development server with a production-ready WSGI server like Gunicorn or uWSGI.
- **Set up a process manager:** Use a process manager like systemd or supervisor to keep your application running in the background and restart it if it crashes.
- **Configure HTTPS:** Use a reverse proxy server like Nginx or Apache to handle HTTPS encryption.
- **Monitor your application:** Use monitoring tools to track performance, errors, and resource usage.

This README provides a comprehensive guide to setting up and running your trading bot application. Remember to replace placeholders with your actual values and adapt the code to your specific needs. If you have any further questions, feel free to ask!
