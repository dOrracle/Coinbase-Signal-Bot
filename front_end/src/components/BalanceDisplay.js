import React from 'react';
import { Box, Heading, Text, Divider } from '@coinbase/onchainkit';

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
``````javascript
import React from 'react';
import { Box, Text } from '@coinbase/onchainkit';

export function LastSignal({ signal }) {
    return (
        <Box marginTop={4}>
            <Text>Last Signal: {JSON.stringify(signal)}</Text>
        </Box>