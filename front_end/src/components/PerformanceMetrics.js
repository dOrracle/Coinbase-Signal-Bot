import PropTypes from 'prop-types';
import { Box, Text } from '@coinbase/onchainkit';

export function PerformanceMetrics({ dailyLoss, dailyGain, startOfDayBalance }) {
    return (
        <Box marginTop={4}>
            <Text>Daily Loss: {dailyLoss}</Text>
            <Text>Daily Gain: {dailyGain}</Text>
            <Text>Start of Day Balance: {startOfDayBalance}</Text>
        </Box>
    );
}

// PropTypes for validation
PerformanceMetrics.propTypes = {
    dailyLoss: PropTypes.number.isRequired,
    dailyGain: PropTypes.number.isRequired,
    startOfDayBalance: PropTypes.number.isRequired,
};