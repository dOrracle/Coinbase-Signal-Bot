import React from 'react';
import { Box, Toggle } from '@coinbase/onchainkit';

export function BotToggle({ isOn, onToggle }) {
    return (
        <Box marginTop={4}>
            <Toggle checked={isOn} onChange={onToggle}>
                Bot Status: {isOn ? 'ON' : 'OFF'}
            </Toggle>
        </Box>
    );
}