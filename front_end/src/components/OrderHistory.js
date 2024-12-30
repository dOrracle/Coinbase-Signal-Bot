import PropTypes from 'prop-types';

export function OrderHistory({ orderHistory }) {
    return (
        <div>
            {orderHistory.map((order, index) => (
                <div key={index}>
                    {/* Render order details */}
                </div>
            ))}
        </div>
    );
}

// PropTypes for validation
OrderHistory.propTypes = {
    orderHistory: PropTypes.arrayOf(PropTypes.object).isRequired,
};