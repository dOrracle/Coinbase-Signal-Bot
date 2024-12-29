import React from 'react';
import { Box, Heading, Text } from '@coinbase/onchainkit';

export function PerformanceMetrics({ dailyLoss, dailyGain, startOfDayBalance }) {
    return (
        <Box marginTop={4}>
            <Heading as="h3" size="sm">Performance Metrics</Heading>
            <Text>Daily Loss: {dailyLoss}</Text>
            <Text>Daily Gain: {dailyGain}</Text>
            <Text>Start of Day Balance: {startOfDayBalance}</Text>
            {/* Add more metrics as needed */}
        </Box>
    );
}