from cdp_sdk.client import CdpClient
from cdp_sdk.exceptions import CdpError
import settings
import utils
import uuid
from decimal import Decimal, InvalidOperation

class OrderExecutor:
    def __init__(self, cdp_client):
        self.client = cdp_client
        self.cached_balances = {}

    def get_balances(self):
        """
        Fetches and updates the cached balances (USD, USDC, and active trading pair).
        """
        try:
            accounts = self.client.list_accounts().data
            for account in accounts:
                if account.available_balance.currency == 'USD':
                    self.cached_balances['USD'] = Decimal(account.available_balance.value)
                elif account.currency == 'USDC':
                    self.cached_balances['USDC'] = Decimal(account.available_balance.value)
                # Add other trading pairs as needed
            return self.cached_balances
        except CdpError as e:
            utils.log_event("balance_update_error", f"CDP API Error: {e}")
            return {'error': f'CDP API Error: {e}'}
        except Exception as e:
            utils.log_event("balance_update_error", f"An unexpected error occurred while fetching balances: {e}")
            return {'error': str(e)}

    def max_daily_loss_reached(self, max_daily_loss):
        """
        Checks if the maximum daily loss limit has been reached.
        """
        # Implement logic to track and check daily losses
        return False

    def execute_order(self, signal, trade_percentage, max_daily_loss):
        """
        Executes an order based on the signal.

        Args:
            signal (dict): The parsed signal from TradingView.
            trade_percentage (float): Percentage of balance to use for the trade.
            max_daily_loss (float): Maximum daily loss percentage allowed.

        Returns:
            dict: Order result with success status and details or error.
        """
        try:
            # Check if max daily loss has been reached
            if self.max_daily_loss_reached(max_daily_loss):
                return {'success': False, 'error': 'Max daily loss reached'}

            action = signal['action']
            product_id = signal['product']
            limit_price = signal.get('limit_price')

            # Convert trade_percentage to Decimal if it's not already
            trade_percentage = Decimal(str(trade_percentage))

            # Determine the order size based on the signal and user settings
            order_size = self.calculate_order_size(product_id, trade_percentage)

            if action == 'buy':
                # Logic to place a buy order
                order_response = self.place_market_buy_order(product_id, str(order_size))

            elif action == 'sell':
                # Logic to place a sell order
                order_response = self.place_market_sell_order(product_id, str(order_size))

            elif action == 'limit_buy':
                # Logic to place a limit buy order
                order_response = self.place_limit_buy_order(product_id, str(order_size), limit_price)

            elif action == 'limit_sell':
                # Logic to place a limit sell order
                order_response = self.place_limit_sell_order(product_id, str(order_size), limit_price)
            else:
                return {'success': False, 'error': 'Invalid action'}

            # On success, update cached balances
            self.get_balances()  # Refresh balances after trade execution

            return {
                'success': True,
                'order_id': order_response['order_id'],
                'message': 'Order placed successfully',
                'order_details': order_response
            }
        except Exception as e:
            # Log the error and update cached balances
            self.get_balances()
            return {'success': False, 'error': str(e)}

    def place_market_buy_order(self, product_id, order_size):
        """
        Places a market buy order using the Advanced Trade API.
        """
        try:
            response = self.client.place_market_order(
                product_id=product_id,
                side='BUY',
                funds=order_size
            )
            return response
        except CdpError as e:
            utils.log_event("order_placement_error", f"Error placing market buy order: {e}")
            raise

    def place_market_sell_order(self, product_id, order_size):
        """
        Places a market sell order using the Advanced Trade API.
        """
        try:
            response = self.client.place_market_order(
                product_id=product_id,
                side='SELL',
                size=order_size
            )
            return response
        except Exception as e:
            utils.log_event("order_placement_error", f"Error placing market sell order: {e}")
            raise

    def place_limit_buy_order(self, product_id, order_size, limit_price):
        """
        Places a limit buy order using the Advanced Trade API.
        """
        try:
            response = self.client.place_limit_order(
                product_id=product_id,
                side='BUY',
                base_size=order_size,
                limit_price=limit_price,
                post_only=True,
            )
            return response
        except Exception as e:
            utils.log_event("order_placement_error", f"Error placing limit buy order: {e}")
            raise

    def place_limit_sell_order(self, product_id, order_size, limit_price):
        """
        Places a limit sell order using the Advanced Trade API.
        """
        try:
            response = self.client.place_limit_order(
                product_id=product_id,
                side='SELL',
                base_size=order_size,
                limit_price=limit_price,
                post_only=True
            )
            return response
        except Exception as e:
            utils.log_event("order_placement_error", f"Error placing limit sell order: {e}")
            raise

    def calculate_order_size(self, product, percentage):
        """
        Calculates the order size based on the available balance and user-defined percentage.
        """
        base_currency, quote_currency = product.split('-')

        # Check if the base currency is in cached balances
        if base_currency not in self.cached_balances:
            raise ValueError(f"Balance for {base_currency} not available")

        balance = self.cached_balances[base_currency]

        # Convert percentage to Decimal if it's not already
        percentage_decimal = Decimal(str(percentage))

        # Calculate the amount based on the percentage of the balance
        amount_to_use = balance * (percentage_decimal / 100)

        return amount_to_use

    def max_daily_loss_reached(self, max_daily_loss):
        """
        Checks if the maximum daily loss limit has been reached.
        """
        # Implement logic to track and check daily losses
        return False

    def cancel_all_orders(self):
        """
        Cancels all open orders for the active trading pair.
        """
        try:
            # Get the active trading pair from the dashboard
            trading_pair = dashboard.get_active_trading_pair()
            if not trading_pair:
                return {'success': False, 'error': 'No active trading pair set.'}

            # Use the CDP SDK to cancel all orders for the active trading pair
            cancel_response = self.client.batch_cancel_orders(product_ids=[trading_pair])

            # Check if the cancellation was successful
            if cancel_response.success:
                # Log the successful cancellation
                utils.log_event("cancel_orders_success", f"All open orders for {trading_pair} cancelled successfully.")
                return {'success': True, 'message': f'All open orders for {trading_pair} cancelled successfully.'}
            else:
                # Log the failure with details
                utils.log_event("cancel_orders_failed", f"Failed to cancel orders for {trading_pair}: {cancel_response.results.error_message}")
                return {'success': False, 'error': f"Failed to cancel orders: {cancel_response.results.error_message}"}

        except Exception as e:
            utils.log_event("cancel_orders_error", f"An unexpected error occurred while cancelling orders: {e}")
            return {'success': False, 'error': str(e)}