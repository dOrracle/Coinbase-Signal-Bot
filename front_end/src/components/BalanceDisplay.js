import { Box, Heading, Text, Divider } from '@coinbase/onchainkit';
import PropTypes from 'prop-types';

export function BalanceDisplay({ balances, activeTradingPair }) {
    return (
        <Box padding={4} borderWidth="1px" borderRadius="md">
            <Heading as="h2" size="md">Current Balances</Heading>
            <Divider marginY={3} />
            <Text>USD: {balances.USD}</Text>
            <Text>USDC: {balances.USDC}</Text>
            <Text>{activeTradingPair}: {balances[activeTradingPair]}</Text>
        </Box>
    );
}

// PropTypes for validation
BalanceDisplay.propTypes = {
    balances: PropTypes.shape({
        USD: PropTypes.number.isRequired,
        USDC: PropTypes.number.isRequired,
    }).isRequired,
    activeTradingPair: PropTypes.string.isRequired,
};
