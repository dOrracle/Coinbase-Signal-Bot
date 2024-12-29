import React from 'react';
import { Box, Text } from '@coinbase/onchainkit';

export function LastSignal({ signal }) {
    return (
        <Box marginTop={4}>
            <Text>Last Signal: {JSON.stringify(signal)}</Text>
        </Box>
    );
}